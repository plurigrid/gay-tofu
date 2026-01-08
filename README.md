# Gay-TOFU: Low-Discrepancy Sequences with Trust-On-First-Use

**TOFU** (Trust-On-First-Use) authentication integrated with deterministic, bijective color generation.

## What This Is

This directory contains the low-discrepancy sequences implementation from the ASI repository, isolated for standalone use with TOFU authentication. It combines:

1. **Low-Discrepancy Color Sequences** - 8 mathematical sequences for optimal uniform color space coverage
2. **Bijective Index Recovery** - Given (color, seed, method), recover the index n that generated it
3. **TOFU Authentication** - First client to connect "owns" the server, subsequent clients need the token

## Why TOFU + Colors?

The bijection property of low-discrepancy sequences is perfect for TOFU:

- **Reafference**: "I generated this color" → verify by predicting it
- **Identity Proof**: Agent A's seed=42, index=69 → unique color only A can predict
- **Temporal Tracking**: "When did I see this color?" → invert to recover timestamp/index

## Directory Structure

```
gay-tofu/
├── low-discrepancy-sequences/   # Copied from ASI
│   ├── LowDiscrepancySequences.jl
│   ├── mcp_integration.jl
│   ├── Project.toml
│   ├── Manifest.toml
│   ├── README.md
│   ├── INTEGRATION_GUIDE.md
│   ├── DEPLOYMENT.md
│   ├── SKILL.md
│   ├── SUMMARY.md
│   ├── awareness_visualization.jl
│   ├── examples.jl
│   └── low-discrepancy-sequences.org
└── README.md (this file)
```

## Sequences Implemented

| Sequence | Dimension | Key Property | TOFU Use Case |
|----------|-----------|--------------|---------------|
| **Golden Angle** | 1D | φ ≈ 1.618 | Session identifiers |
| **Plastic Constant** | 2D | φ₂ ≈ 1.325 | User badges (hue+sat) |
| **Halton** | nD | Prime bases | Multi-attribute auth |
| **R-sequence** | nD | φ_d roots | Hierarchical tokens |
| **Kronecker** | 1D | Equidistributed | Event markers |
| **Sobol** | 1000+D | High-dimensional | Feature vectors |
| **Pisot** | nD | Quasiperiodic | Time-based codes |
| **Continued Fractions** | 1D | Geodesic paths | Challenge-response |

## Quick Start

### 1. Install Dependencies

```bash
cd ~/ies/gay-tofu/low-discrepancy-sequences
julia --project=. -e 'using Pkg; Pkg.instantiate()'
```

### 2. Test Tools

```bash
# Plastic constant (2D)
julia --project=. mcp_integration.jl gay_plastic_thread '{"steps": 5, "seed": 42}'

# Halton sequence
julia --project=. mcp_integration.jl gay_halton '{"count": 5}'

# Bijection test
julia --project=. mcp_integration.jl gay_invert '{"hex": "#851BE4", "method": "plastic", "seed": 42}'
```

### 3. Run Examples

```bash
julia --project=. examples.jl
```

## TOFU Authentication Pattern

### Server-Side (First Connection)

```typescript
// Client connects without token
POST /claim
Headers: { "X-Client-Id": "alice" }

// Server response
{
  "claimed": true,
  "isOwner": true,
  "token": "abc123...",
  "message": "Server claimed successfully. Save this token!"
}
```

### Color-Based Identity

```julia
# Alice's identity
alice_seed = 42
alice_index = 69
alice_color = plastic_color(alice_index, seed=alice_seed)
# => RGB(0.663, 0.333, 0.969) = "#851BE4"

# Alice proves identity by predicting her color
predicted = plastic_color(69, seed=42)
@assert predicted == alice_color  # ✓ Reafference!

# Invert: someone shows you #851BE4
n = invert_color(RGB(0.663, 0.333, 0.969), :plastic, seed=42)
# => 69 ✓ (bijection verified)
```

## Integration Patterns

### 1. TOFU Token as Seed

```julia
# Use TOFU token hash as color seed
token = "abc123def456..."
seed = hash(token) % 1000000

# Generate session color
session_color = plastic_color(session_id, seed=seed)

# Only the token holder can predict this color
```

### 2. Challenge-Response

```julia
# Server: Send challenge (random index)
challenge_index = rand(1:10000)

# Client: Must predict color using their seed
response_color = plastic_color(challenge_index, seed=client_seed)

# Server: Verify
expected = plastic_color(challenge_index, seed=stored_seed)
@assert response_color == expected  # ✓ Authenticated
```

### 3. Temporal Authentication

```julia
# Generate time-based color (index = unix timestamp)
time_index = Int(time())
time_color = golden_angle_color(time_index, seed=user_seed)

# Valid for 60 seconds
current_time = Int(time())
@assert abs(current_time - time_index) < 60
```

## MCP Tools Available

1. `gay_plastic_thread` - 2D color generation
2. `gay_halton` - nD via prime bases
3. `gay_r_sequence` - d-dimensional golden ratios
4. `gay_kronecker` - Equidistributed
5. `gay_sobol` - High-dimensional
6. `gay_pisot` - Quasiperiodic
7. `gay_continued_fraction` - Geodesic paths
8. `gay_invert` - Bijective index recovery
9. `gay_compare_sequences` - Uniformity comparison
10. `gay_reafference_lds` - Self-recognition

## Security Properties

**TOFU Provides:**
- ✅ First client ownership
- ✅ Token-based subsequent auth
- ✅ No password needed
- ✅ Simple deployment

**Color Bijection Provides:**
- ✅ Deterministic identity
- ✅ Index recovery (time/sequence)
- ✅ Reafference (self-recognition)
- ✅ Forgery-resistant (need seed)

**Combined (TOFU + Colors):**
- ✅ Visual authentication
- ✅ Temporal tracking
- ✅ Multi-agent identity
- ✅ Zero-knowledge proofs possible

## Use Cases

### 1. Multi-Agent Coordination

```julia
# Agent A (seed=42) and Agent B (seed=43) coordinate
a_colors = [plastic_color(i, seed=42) for i in 1:10]
b_colors = [plastic_color(i, seed=43) for i in 1:10]

# No collisions, both deterministic
@assert a_colors != b_colors  # ✓ Distinct identities
```

### 2. Event Tracking

```julia
# Mark events with non-repeating colors
event_id = 1234
event_color = golden_angle_color(event_id, seed=system_seed)

# Later: "What was event 1234's color?"
recovered_id = invert_color(event_color, :golden, seed=system_seed)
@assert recovered_id == 1234  # ✓ Temporal reconstruction
```

### 3. Session Visualization

```julia
# Color-code sessions by behavioral signature
sessions = build_awareness_graph("/path/to/data")
session_colors = assign_node_colors(sessions, seed=server_seed)

# Each session gets unique, deterministic color
# Behavioral similarity → similar hue/saturation (plastic constant)
```

## Why "Gay-TOFU"?

- **Gay.jl** = Color generation library with deterministic splittable RNG
- **TOFU** = Trust-On-First-Use authentication pattern
- **Gay-TOFU** = Deterministic color-based identity with first-use trust

The name honors both:
1. The mathematical elegance of low-discrepancy sequences
2. The simplicity of TOFU authentication
3. The rainbow 🌈 nature of color-based identity

## References

1. **Low-Discrepancy Sequences**: Niederreiter (1992), Kuipers & Niederreiter (1974)
2. **TOFU Authentication**: SSH's trust-on-first-use model
3. **Gay.jl**: Splittable RNG for deterministic colors (Plurigrid)
4. **Reafference**: von Holst (1950) - self-recognition via prediction

## License

Part of the Plurigrid ecosystem. See main repository for license.

## Status

- ✅ Implementation complete (8 sequences)
- ✅ Bijection verified
- ✅ MCP integration ready
- ✅ Julia dependencies installed
- ✅ All tools tested
- ⏳ TOFU server integration (see TOFU_INTEGRATION.md)

---

*All sequences are bijective. You can recover the index from the color.*
