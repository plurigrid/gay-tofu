# lazybjj Specification

**Brazilian Jiu-jitsu for Version Control**: A fork of lazyjj integrating Gay.jl's deterministic coloring and GF(3) trit system.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         lazybjj TUI                              │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│   LogTab     │  FilesTab    │ BookmarksTab │  TritsTab (NEW)   │
│   + colors   │  + diff trit │ + balance    │  GF(3) dashboard  │
├──────────────┴──────────────┴──────────────┴───────────────────┤
│                        Commander                                 │
│              (wraps jj commands, adds bjj semantics)            │
├─────────────────────────────────────────────────────────────────┤
│                     bjj_semantics.rs                            │
│     ┌─────────────────┬─────────────────┬─────────────────┐    │
│     │  SplitMix64     │  Gay-TOFU       │   GF(3) Trits   │    │
│     │  seed → u64     │  plastic/golden │   MINUS/ERG/+   │    │
│     └─────────────────┴─────────────────┴─────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                        jj-lib (unchanged)                        │
│                     Git Backend (unchanged)                      │
└─────────────────────────────────────────────────────────────────┘
```

## Component Mapping

| lazyjj component | lazybjj addition | Source |
|------------------|------------------|--------|
| `App` | `BjjApp` with trit state | lazyjj `src/app.rs` |
| `Commander` | `BjjCommander` with color methods | lazyjj `src/commander.rs` |
| `LogTab` | Colored change-ids via gay-tofu | `gay-tofu.ts` plastic_color |
| `FilesTab` | Diff lines get trit classification | GF(3) from hue |
| `BookmarksTab` | Balance indicator (Σtrits mod 3) | Gay.jl share3_hash |
| **NEW** `TritsTab` | GF(3) conservation dashboard | Gay MCP `skill_quad` |

## Core Integration: gay-tofu → bjj_semantics

Port from [gay-tofu.ts](/Users/bob/ies/gay-tofu/gay-tofu.ts):

```rust
// bjj_semantics.rs

const PHI: f64 = 1.618033988749895;   // Golden ratio
const PHI2: f64 = 1.3247179572447460; // Plastic constant

/// Plastic constant color (2D optimal) - mirrors gay-tofu.ts
pub fn plastic_color(n: u64, seed: u64, lightness: f32) -> (f32, f32, f32) {
    let h = (((seed as f64 + n as f64 / PHI2) % 1.0) * 360.0) as f32;
    let s = ((((seed as f64 + n as f64 / (PHI2 * PHI2)) % 1.0) * 0.5) + 0.5) as f32;
    hsl_to_rgb(h, s, lightness)
}

/// Derive GF(3) trit from hue angle
pub fn trit_from_hue(hue: f32) -> Trit {
    // 120° sectors: [0,120) = PLUS, [120,240) = ERGODIC, [240,360) = MINUS
    match ((hue / 120.0) as u8) % 3 {
        0 => Trit::Plus,
        1 => Trit::Ergodic,
        _ => Trit::Minus,
    }
}

/// Bijective inversion - recover index from color
pub fn invert_color(rgb: (f32, f32, f32), seed: u64, max_search: u64) -> Option<u64> {
    for n in 1..=max_search {
        let candidate = plastic_color(n, seed, 0.5);
        if color_distance(rgb, candidate) < 0.01 {
            return Some(n);
        }
    }
    None
}
```

## Verifiable Outcomes

### V1: Color Determinism
**Given**: change-id `abc123def`
**When**: converted to seed via `as_seed_u64()`
**Then**: same color every time across sessions

```bash
# Test
lazybjj log | grep abc123def  # → always same ANSI color
lazybjj log | grep abc123def  # → identical
```

### V2: Bijective Index Recovery
**Given**: colored change-id displayed
**When**: `lazybjj invert #A855F7 --seed 42`
**Then**: recovers original change-id

```bash
# Test
COLOR=$(lazybjj show --color-only abc123def)
lazybjj invert $COLOR --seed 42  # → abc123def
```

### V3: GF(3) Trit Classification
**Given**: any change-id
**When**: `lazybjj trit abc123def`
**Then**: returns MINUS (-1), ERGODIC (0), or PLUS (+1)

```bash
# Test
lazybjj trit abc123def  # → "PLUS (+1)"
lazybjj trit def456abc  # → "MINUS (-1)"
lazybjj trit 789xyz123  # → "ERGODIC (0)"
```

### V4: Conservation on Merge
**Given**: merge of parents A (PLUS) and B (MINUS)
**When**: merge creates commit C
**Then**: C.trit == -(A.trit + B.trit) mod 3 (conservation)

```bash
# Test
lazybjj new A B  # Creates merge
lazybjj trit @   # Should conserve: if A=+1, B=-1 → C=0
```

### V5: Bookmark Balance Indicator
**Given**: set of bookmarked changes
**When**: displayed in BookmarksTab
**Then**: shows Σtrits and balance status

```
Bookmarks (balanced ✓):
  main     [+1] #A855F7
  feature  [-1] #37C0C8  
  hotfix   [0]  #6CEC13
  ────────────────────
  Σ = 0 (GF(3) conserved)
```

### V6: TritsTab Dashboard
**Given**: repository with N changes
**When**: viewing TritsTab (`Ctrl+T`)
**Then**: shows distribution and conservation metrics

```
┌─────────── TritsTab ───────────┐
│ PLUS (+1):   34 commits  ███▓  │
│ ERGODIC (0): 31 commits  ███   │
│ MINUS (-1):  35 commits  ███▓  │
│ ──────────────────────────────│
│ Σ = 0 (mod 3) ✓ BALANCED      │
│                                │
│ Recent unbalanced merges:      │
│   [!] abc123 broke conservation│
└────────────────────────────────┘
```

### V7: Visual Diff with Trit Annotations
**Given**: file diff in FilesTab
**When**: viewing changes
**Then**: added lines show PLUS, removed show MINUS

```diff
[+1] + fn new_feature() {
[+1] +     do_something();
[+1] + }
[-1] - fn old_code() {
[-1] -     deprecated();
[-1] - }
```

## Command Additions (beyond jj)

| Command | Description | Verifiable |
|---------|-------------|------------|
| `lazybjj trit <rev>` | Show trit classification | V3 |
| `lazybjj invert <hex>` | Recover change-id from color | V2 |
| `lazybjj balance` | Check GF(3) conservation | V5 |
| `lazybjj seed` | Show/set repository seed | V1 |
| `lazybjj colortest` | Display color palette | V1 |

## Keybindings (TritsTab)

| Key | Action |
|-----|--------|
| `t` | Toggle trit display mode |
| `b` | Show balance for selection |
| `c` | Copy color hex |
| `i` | Invert selected color |
| `g` | Go to commit by color |

## Implementation Phases

### Phase 1: Fork & Scaffold (Day 1)
- [ ] Fork Cretezy/lazyjj → lazybjj
- [ ] Add `bjj_semantics.rs` module
- [ ] Port `plastic_color` from gay-tofu.ts
- [ ] **Verify**: V1 passes (deterministic colors)

### Phase 2: LogTab Colors (Day 2)
- [ ] Modify LogTab to color change-ids
- [ ] Add `--color` flag to jj log wrapper
- [ ] Implement ANSI escape from HSL
- [ ] **Verify**: V1, V2 pass

### Phase 3: Trit Classification (Day 3)
- [ ] Implement `trit_from_hue`
- [ ] Add `lazybjj trit` command
- [ ] Show trit in LogTab status line
- [ ] **Verify**: V3 passes

### Phase 4: TritsTab (Day 4)
- [ ] Create new TritsTab component
- [ ] Compute repository-wide trit distribution
- [ ] Add balance indicator
- [ ] **Verify**: V5, V6 pass

### Phase 5: Conservation Logic (Day 5)
- [ ] Hook into merge/new operations
- [ ] Warn on conservation violations
- [ ] Add `--gf3` mode for strict enforcement
- [ ] **Verify**: V4 passes

### Phase 6: FilesTab Integration (Day 6)
- [ ] Add trit annotations to diff
- [ ] Color-code added/removed lines
- [ ] **Verify**: V7 passes

## Test Matrix

| Test | V1 | V2 | V3 | V4 | V5 | V6 | V7 |
|------|----|----|----|----|----|----|----| 
| Color determinism | ✓ | | | | | | |
| Bijective inversion | | ✓ | | | | | |
| Trit classification | | | ✓ | | | | |
| Merge conservation | | | | ✓ | | | |
| Bookmark balance | | | | | ✓ | | |
| TritsTab dashboard | | | | | | ✓ | |
| Diff annotations | | | | | | | ✓ |

## Dependencies

```toml
[dependencies]
ratatui = "0.28"          # TUI framework (from lazyjj)
crossterm = "0.28"        # Terminal handling (from lazyjj)
# NEW
palette = "0.7"           # Color space conversions
```

## Relationship to Gay.jl Ecosystem

```
Gay.jl (Julia)           gay-tofu.ts (TypeScript)     bjj_semantics.rs (Rust)
     │                         │                             │
     │ SplitMix64              │ plastic_color               │ plastic_color
     │ GF(3) trits             │ invertColor                 │ trit_from_hue
     │ MCP tools               │ getUserColor                │ invert_color
     │                         │                             │
     └────────────────────────┴─────────────────────────────┘
                    Same algorithms, same colors, same trits
```

## Success Criteria

1. **All V1-V7 tests pass**
2. **No lazyjj functionality broken**
3. **Git compatibility preserved** (no storage format changes)
4. **Sub-ms color computation** (no perceptible lag)
5. **Visual distinction**: Adjacent commits have ≥60° hue difference

---

*lazybjj: Where every commit has a color, every merge conserves, and identity persists through mutation.*
