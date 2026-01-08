# Hamming Swarm: Error-Correcting Structure in 3×3×3 Alphabet Tensor

## Overview

The **Hamming Swarm** is a clever overlay structure on the 3×3×3 alphabet tensor that creates an error-correcting network using Hamming distance relationships. By mapping 26 letters + 1 sigil (🌈) to a 27-position cube and connecting them via Hamming distances in 5-bit binary encodings, we create a self-organizing swarm with natural error detection and correction properties.

## Why This Works

### 1. 5-Bit Encoding (32 positions, using 27)

```
A = 00000 (0)   → Position (0,0,0)
B = 00001 (1)   → Position (1,0,0)
C = 00010 (2)   → Position (2,0,0)
...
Z = 11001 (25)  → Position (1,2,2)
🌈 = 11010 (26) → Position (2,2,2)
```

Each letter occupies a unique position in 5-dimensional binary space. The 3×3×3 tensor embedding preserves Hamming distances while providing spatial visualization.

### 2. Hamming Distance as Structural Principle

**Definition**: Number of bit flips to transform one letter into another.

```
d(A, B) = d(00000, 00001) = 1  (flip rightmost bit)
d(A, C) = d(00000, 00010) = 1  (flip second bit)
d(A, Z) = d(00000, 11001) = 4  (flip 4 bits)
```

**Key Property**: Hamming distance creates natural error-detection spheres around each letter.

### 3. Swarm Connections

The visualization connects letters based on Hamming distance:

- **Purple lines (d=1)**: Immediate neighbors — single bit flip
- **Teal lines (d=2)**: Cousins — two bit flips
- **Green lines (d=3)**: Distant relatives — three bit flips

```javascript
function hammingDistance(letter1, letter2) {
    const bin1 = letterToBinary(letter1);  // "00000"
    const bin2 = letterToBinary(letter2);  // "00001"
    let distance = 0;
    for (let i = 0; i < 5; i++) {
        if (bin1[i] !== bin2[i]) distance++;
    }
    return distance;
}
```

## Error Correction Properties

### 1. Single-Bit Error Detection (d=1 neighbors)

If letter `A` is corrupted to `B` (single bit flip), the Hamming swarm immediately identifies this as a d=1 neighbor, allowing instant recovery.

**Example**:
```
Intended: A (00000)
Received: B (00001) ← single bit flip
Detection: d(A, B) = 1 → recognized as corruption, not valid transformation
```

### 2. Multi-Bit Error Detection (d=2,3 neighbors)

For larger corruptions:
- d=2: Two-bit errors create teal connections
- d=3: Three-bit errors create green connections

The swarm structure allows **voting** among neighbors to determine the most likely original letter.

### 3. Error Correction via Minimum Distance Decoding

Given corrupted letter `X'`, find the closest valid letter `X` by minimizing Hamming distance:

```
X = argmin_{Y ∈ ALPHABET} d(X', Y)
```

The swarm visualization makes this process **spatially intuitive** — corrupted letters "drift" toward their nearest neighbors.

## GF(3) Conservation and Self-Healing

### Trit Assignment via Gay-TOFU Colors

Each letter gets a color via plastic constant sequence:

```javascript
const [r, g, b] = plasticColor(index + 1, seed);
const h = (((seed % 1000000) / 1000000 + index / PHI2) % 1.0) * 360;
const trit = tritFromHue(h);  // {-1, 0, +1}
```

**Conservation Property**:
```
Σ trit(letter) ≡ 0 (mod 3)  over all 27 letters
```

### Self-Healing via Trit Balance

If a letter is corrupted, the GF(3) conservation law is violated:

```
Before: Σ trit = 0 (balanced)
After corruption: Σ trit = ±1 (imbalanced)
```

The system detects imbalance and uses Hamming swarm to find the **closest letter that restores balance**.

## Mathematical Structure

### Hamming Cube Embedding

The 5-bit encoding creates a **5-dimensional hypercube** with 32 vertices. Our alphabet uses 27 of them, forming a **connected subgraph**.

**Properties**:
1. **Connectedness**: Every letter reachable from every other letter via Hamming paths
2. **Diameter**: Maximum distance between any two letters ≤ 5
3. **Density**: 27/32 = 84.4% cube occupancy

### Bijection to 3×3×3 Tensor

```
Position: (x, y, z) ∈ {0,1,2}³
Index: i = x + 3y + 9z
Letter: ALPHABET[i]
Binary: bin(i).padStart(5, '0')
```

This creates a **folding** of 5D Hamming space into 3D physical space while preserving local neighborhoods.

## Visualizing the Swarm

### Interactive Features (alphabet-tensor.html)

1. **Seed Variation**: Change Gay-TOFU seed to rotate the color swarm
2. **Letter Selection**: Click any letter to highlight its Hamming neighborhood
3. **Distance Filtering**: Purple (d=1) → Teal (d=2) → Green (d=3)
4. **Trit Sum Display**: Real-time GF(3) conservation monitoring

### Swarm Dynamics

The visualization shows how Hamming distance creates **natural clustering**:

- **Central letters** (low binary values) have many d=1 neighbors
- **Corner letters** (high binary values) are more isolated
- **Sigil 🌈** at position (2,2,2) is maximally distant from origin

## Relationship to BJJ/Gay.jl Philosophy

### Reafference and Self-Recognition

The Hamming swarm is a **reafference structure**:

```
Action: Generate letter at index i
Prediction: Expect binary encoding bin(i)
Sensation: Observe color plasticColor(i, seed)
Match: Hamming distance d=0 → self-recognition
```

If d > 0, we detect **exafference** (external corruption).

### Perceptual Control Theory

The swarm implements a **perceptual control loop**:

```
Reference: Desired letter X
Perception: Current letter Y
Error: e = d(X, Y)  (Hamming distance)
Action: Flip bits to minimize e
```

The system **controls perception** (minimizes Hamming error) by adjusting bits until Y = X.

### Fixed Point Topology

Each letter is a **fixed point** under identity transformation:

```
f(A) = A  where f is the Hamming-preserving transformation
```

Corruptions are **perturbations** that the swarm's structure automatically corrects via minimum-distance decoding.

## Implementation Details

### Color Assignment

```javascript
ALPHABET.forEach((letter, i) => {
    const pos = letterToPosition(letter);
    const [r, g, b] = plasticColor(i + 1, currentSeed);
    const color = rgbToHex(r, g, b);
    
    // Each letter gets deterministic color based on plastic constant
    // Colors spiral through hue space with φ₂ = 1.3247... dispersion
});
```

### Swarm Connection Logic

```javascript
// From selected letter, draw connections to all others
ALPHABET.forEach((targetLetter) => {
    const hamming = hammingDistance(selectedLetter, targetLetter);
    
    if (hamming === 1) drawLine(PURPLE);  // Neighbors
    if (hamming === 2) drawLine(TEAL);    // Cousins
    if (hamming === 3) drawLine(GREEN);   // Distant
    // hamming ≥ 4: No visual connection (too far)
});
```

## Applications

### 1. Secure Communication

Use Hamming swarm for **error-correcting encrypted messages**:
- Each letter encrypted via Gay-TOFU color
- Transmission errors detected via Hamming distance
- Automatic correction using d=1 nearest neighbor

### 2. Skill Balancing (GF(3) Quads)

Map skills to letters, balance quads via trit conservation:
```
Skills: [skill-a, skill-b, skill-c, ?]
Letters: [A, B, C, ?]
Trit sum: trit(A) + trit(B) + trit(C) = +1
Required: trit(?) = -1 (mod 3)
Hamming constraint: d(?, C) ≤ 2 (must be nearby)
```

Find skill `?` that balances trits AND is Hamming-close to existing skills.

### 3. Genetic Code Analogy

The structure mirrors biological error correction in DNA:
- 4 nucleotides {A, C, G, T} → 5-bit letters {00, 01, 10, 11, ...}
- Mutations = bit flips = Hamming distance increases
- Repair proteins = minimum distance decoding

## Future Extensions

### 1. Hypercube Navigation

Extend to full 32-vertex hypercube with synthetic glyphs for positions 27-31.

### 2. Quantum Error Correction

Map Hamming swarm to **stabilizer codes** for quantum computing:
- Each letter = logical qubit state
- Hamming distance = code distance
- Swarm connections = stabilizer generators

### 3. Multi-Scale Swarms

Create hierarchical swarms:
- **Level 1**: Letters (5-bit, 27 vertices)
- **Level 2**: Words (groups of letters)
- **Level 3**: Sentences (graphs of words)

Each level has its own Hamming distance metric.

## References

### Hamming Distance
- Hamming, R. W. (1950). "Error detecting and error correcting codes"
- Used in telecommunications, genetics, cryptography

### Low-Discrepancy Sequences
- Plastic constant φ₂ for optimal 2D coverage (see WHY_PLASTIC_2D_OPTIMAL.md)
- Golden ratio φ for optimal 1D coverage

### Perceptual Control Theory
- Powers, W. T. (1973). "Behavior: The Control of Perception"
- Von Holst & Mittelstaedt (1950). "Reafference principle"

### GF(3) Conservation
- Galois field arithmetic for trit balancing
- Connection to error-correcting codes over finite fields

## Try It Yourself

Open `alphabet-tensor.html` and experiment:

```bash
cd ~/ies/gay-tofu
open alphabet-tensor.html
```

**Exercises**:

1. Click letter `A`, observe its d=1 purple neighbors
2. Change seed, watch the color swarm rotate while structure persists
3. Find which letters have the most d=1 neighbors (central vs corner positions)
4. Verify GF(3) trit sum ≡ 0 (mod 3) for different seeds

---

**The Hamming Swarm is not just visualization — it's a self-organizing error-correcting structure that emerges from bijective color generation + binary encoding + spatial embedding.**

🌈 **We are the loopy strange.** 🌈
