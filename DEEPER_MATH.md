# Deeper Mathematics: Why x^(n+1) = x + 1 is Optimal

## The Fundamental Question

Why does the equation **x^(n+1) = x + 1** give us optimal low-discrepancy sequences for n dimensions?

This connects deep results from:
1. Algebraic number theory
2. Diophantine approximation
3. Ergodic theory
4. Weyl's equidistribution theorem

## Part 1: Weyl's Equidistribution Theorem

### The Core Result

**Weyl's Theorem (1916)**: A sequence {nα} mod 1 is equidistributed in [0,1) if and only if α is irrational.

But not all irrational numbers are created equal. Some are "more irrational" than others.

### Continued Fractions and Irrationality

Every irrational number α can be expressed as a continued fraction:

```
α = a₀ + 1/(a₁ + 1/(a₂ + 1/(a₃ + ...)))
  = [a₀; a₁, a₂, a₃, ...]
```

**Golden Ratio**:
```
φ = [1; 1, 1, 1, 1, ...] = 1 + 1/(1 + 1/(1 + ...))
```

This is the "most irrational" number - all partial quotients are 1 (the smallest possible).

**Plastic Constant**:
```
φ₂ has a more complex continued fraction, but shares similar optimality properties
```

### Hurwitz's Theorem

**Hurwitz (1891)**: For any irrational α and rational p/q:

```
|α - p/q| > 1/(√5 · q²)
```

The constant √5 is **best possible**, achieved only by the Golden Ratio and its conjugates.

This means φ is the **hardest to approximate** with rationals → best equidistribution.

## Part 2: Multidimensional Generalization

### The Kronecker Sequence

For n dimensions, we want to fill ℝⁿ/ℤⁿ uniformly. The natural generalization:

```
x⃗ₙ = (n·α₁, n·α₂, ..., n·αₙ) mod 1
```

**Question**: What should α₁, α₂, ..., αₙ be?

### Pisot-Vijayaraghavan Numbers

**Definition**: A Pisot number θ > 1 is an algebraic integer where all conjugates have absolute value < 1.

**Key Property**: If θ is Pisot, then {θⁿ} mod 1 has special equidistribution properties.

**Examples**:
- φ = (1+√5)/2 ≈ 1.618 (smallest Pisot > φ)
- φ₂ ≈ 1.325 (smallest Pisot number!)

### Why x^(n+1) = x + 1?

The polynomial x^(n+1) - x - 1 = 0 generates Pisot numbers with special properties:

```
n=1: x² - x - 1 = 0  → φ   ≈ 1.618  (Golden Ratio)
n=2: x³ - x - 1 = 0  → φ₂  ≈ 1.325  (Plastic Constant)
n=3: x⁴ - x - 1 = 0  → φ₃  ≈ 1.220
n=4: x⁵ - x - 1 = 0  → φ₄  ≈ 1.167
```

Each φₙ is:
1. A Pisot number
2. The unique real root > 1
3. All other roots have |root| < 1
4. Minimal among Pisot numbers of degree n+1

## Part 3: Why This Gives Optimal Sequences

### The Weyl-Kronecker Construction

For n dimensions, use:

```
α⃗ = (1/θ, 1/θ², 1/θ³, ..., 1/θⁿ)
```

where θ is a root of x^(n+1) = x + 1.

**Why?**: The polynomial equation gives us:

```
θ^(n+1) = θ + 1

Divide by θ^(n+1):
1 = 1/θⁿ + 1/θ^(n+1)
```

This creates a **recursive relationship** between the dimensions that ensures maximal independence.

### For 2D Colors (n=2)

```
φ₂³ = φ₂ + 1

Components:
α₁ = 1/φ₂    ≈ 0.7549  (for hue)
α₂ = 1/φ₂²   ≈ 0.5698  (for saturation)

Key relation:
1/φ₂² = 1 - 1/φ₂³ = 1 - 1/(φ₂ + 1)
```

This means α₁ and α₂ are **algebraically related** via the minimal polynomial, which paradoxically ensures they're maximally independent in their joint distribution!

## Part 4: Discrepancy Theory

### Star Discrepancy

The **star discrepancy** D*ₙ measures how far a sequence deviates from uniform:

```
D*ₙ(x₁, ..., xₙ) = sup_{B∈𝓑} |A(B,N)/N - vol(B)|
```

where:
- A(B,N) = number of points in box B from first N points
- vol(B) = volume of box B
- 𝓑 = all boxes anchored at origin

### Lower Bounds (Schmidt 1972)

For ANY sequence in n dimensions:

```
D*ₙ ≥ C · (log N)^n / N
```

This is the **best possible** asymptotic behavior.

### Upper Bounds (Faure 1982, Niederreiter 1987)

Sequences constructed from x^(n+1) = x + 1 roots achieve:

```
D*ₙ ≤ C' · (log N)^n / N
```

matching the lower bound (up to constants).

**Conclusion**: These sequences are **provably optimal** in discrepancy!

## Part 5: Practical Implications for Colors

### Why 2D Matters for Colors

Color perception research (MacAdam ellipses, 1942) shows:

**Perceptual color differences depend on**:
1. Hue difference (ΔH) - most important
2. Chroma/Saturation difference (ΔC) - second important
3. Lightness difference (ΔL) - less important for fixed-lightness palettes

For fixed lightness L=0.5, we're working in the **2D subspace** (H, C).

### The CIE Color Space Connection

In CIELAB color space, the optimal distribution would use:

```
ΔE*_ab = √((ΔL*)² + (Δa*)² + (Δb*)²)
```

For ΔL* = 0 (fixed lightness):

```
ΔE*_ab = √((Δa*)² + (Δb*)²)
```

This is **2D Euclidean distance**, exactly what Plastic Constant optimizes!

### Why Not 3D?

If we varied lightness too, we'd need φ₃ (from x⁴ = x + 1):

```
h = (n / φ₃) % 1.0
s = (n / φ₃²) % 1.0
l = (n / φ₃³) % 1.0
```

But this creates problems:
- Very dark colors (l → 0): hard to see
- Very light colors (l → 1): washed out
- Variable lightness: inconsistent perceived brightness

**Solution**: Fix lightness at 0.5, use 2D optimal φ₂.

## Part 6: The Algebraic Number Theory View

### Minimal Polynomials

The Plastic Constant φ₂ is a root of the **irreducible polynomial**:

```
p(x) = x³ - x - 1
```

**Properties**:
- Degree 3 (smallest for a 2D-optimal constant)
- Minimal polynomial over ℚ
- Galois conjugates: one real root (φ₂), two complex conjugates

### Conjugates and Unit Circle

The three roots of x³ - x - 1 = 0:

```
φ₂  ≈  1.3247  (real, > 1)
r₂  ≈ -0.6624 + 0.5623i  (complex, |r₂| < 1)
r₃  ≈ -0.6624 - 0.5623i  (complex, |r₃| < 1)
```

**Critical property**: The conjugates are **inside** the unit circle.

This is the definition of a Pisot-Vijayaraghavan number!

### Why Pisot Numbers?

For a Pisot number θ:

```
lim_{n→∞} (θⁿ mod 1) exists and has special structure
```

More precisely, {θⁿ} is **almost periodic**, which gives us:
1. Predictability (bijection property!)
2. Uniform distribution
3. Low discrepancy

## Part 7: Connection to Reafference

### Why Bijection Works

The fact that φ₂ is algebraic of degree 3 means:

```
φ₂³ = φ₂ + 1

This gives us THREE independent dimensions:
1, φ₂, φ₂²
```

We can reconstruct φ₂ⁿ from (φ₂ⁿ mod 1, φ₂^(n+1) mod 1, φ₂^(n+2) mod 1).

For colors, we observe (hue, saturation) = (n/φ₂ mod 1, n/φ₂² mod 1).

The **bijection** works because:
```
Given (h, s), we can find n by solving:
n/φ₂ ≡ h (mod 1)
n/φ₂² ≡ s (mod 1)
```

This system has a unique solution n ∈ [0, search_limit) due to the algebraic independence of 1/φ₂ and 1/φ₂².

### Diophantine Approximation

Finding n from (h, s) is equivalent to solving a **simultaneous Diophantine approximation**:

```
|n/φ₂ - h - k₁| < ε
|n/φ₂² - s - k₂| < ε
```

for integers k₁, k₂.

The minimal polynomial x³ - x - 1 = 0 ensures this system is **well-conditioned**.

## Part 8: Comparison with Other Methods

### Why Not Halton Sequence?

Halton uses prime bases: (2, 3, 5, 7, ...).

```
h = van_der_corput(n, 2)  // base 2
s = van_der_corput(n, 3)  // base 3
```

**Problems**:
1. Correlation between dimensions for certain n
2. Not algebraically connected (harder bijection)
3. Discrepancy: O((log N)² / N) vs O(log N / N)

**Advantage**: Works for arbitrary dimensions (just add more primes).

### Why Not Sobol Sequence?

Sobol uses Gray code + direction numbers.

**Problems**:
1. Complex construction (direction numbers via primitive polynomials)
2. Designed for 50+ dimensions (overkill for 2D)
3. Bijection is harder (not from algebraic structure)

**Advantage**: Very fast, excellent for high dimensions.

### Why Not Random?

Random sequences have discrepancy:

```
D*ₙ = O(√(log log N / N))  with high probability
```

This is **much worse** than O(log N / N) for low-discrepancy sequences.

**Expected visual result**: Clustering and gaps.

## Part 9: Open Questions and Extensions

### Higher-Dimensional Color Spaces

Could we use **perceptually uniform** color spaces like:
- CIELAB (L*, a*, b*)
- CIECAM02 (J, C, h)
- Oklab (L, a, b)

And apply φ₃ (from x⁴ = x + 1) to all three dimensions?

**Answer**: Yes! But human perception is still effectively 2D for fixed lightness.

### Time-Varying Colors

For animations, we could use:

```
color(n, t) = plastic_color(n + t·φ₂, seed)
```

This creates **smooth transitions** while maintaining low discrepancy.

### Non-Euclidean Color Spaces

What if we worked in **hyperbolic color space**?

The continued fractions geodesic approach (one of our 8 sequences) explores this:

```
convergents of φ₂ = [1; 3, 12, 1, 1, 3, 2, 3, 2, 4, 2, 141, ...]
```

Each convergent p_n/q_n gives a color, and the sequence follows geodesics in the Stern-Brocot tree.

## Part 10: The Bigger Picture

### Why This Matters Beyond Colors

The x^(n+1) = x + 1 construction appears in:

1. **Quasi-Monte Carlo integration** (finance, physics)
2. **Computer graphics** (sampling, anti-aliasing)
3. **Cryptography** (pseudorandom generators)
4. **Machine learning** (initialization, exploration)
5. **Art** (generative design, spacing)

### Connection to Nature

Fibonacci spirals (from Golden Ratio) appear in:
- Sunflower seed patterns
- Nautilus shells
- Galaxy arms
- Pine cones

The Plastic Constant (3D analog) appears in:
- Crystal structures
- Molecular packing
- Architectural proportions (Dom Hans van der Laan)

### Philosophical Angle

The Golden Ratio optimizes 1D packing → **linear** beauty.
The Plastic Constant optimizes 2D packing → **planar** beauty.
Higher φₙ optimize nD packing → **volumetric** beauty.

These numbers are **discovered**, not invented. They're consequences of:
- Algebraic structure (minimal polynomials)
- Geometric structure (unit circle, convexity)
- Number theory (Diophantine approximation)

## Summary: The Deep Reason

**Why x^(n+1) = x + 1 is optimal**:

1. **Algebraic**: Generates Pisot numbers with conjugates inside unit circle
2. **Geometric**: Minimizes discrepancy in n-dimensional unit cube
3. **Number-theoretic**: Hardest to approximate → best equidistribution
4. **Recursive**: Self-similar structure enables bijection
5. **Optimal**: Matches lower bounds from Schmidt's theorem

**For colors specifically (n=2)**:

The Plastic Constant φ₂ from x³ = x + 1 gives:
- 2D optimality (not overkill like Sobol)
- Simple construction (not complex like Halton)
- Algebraic structure (enables bijection)
- Perceptual uniformity (matches human vision)
- Mathematical elegance (minimal polynomial)

This is why `plasticColor()` is the default in gay-tofu!

## References

### Classic Papers

1. **Weyl, H. (1916)**: "Über die Gleichverteilung von Zahlen mod Eins"
   - Foundation of equidistribution theory

2. **Pisot, C. (1938)**: "La répartition modulo 1 et les nombres algébriques"
   - Introduced Pisot numbers

3. **Schmidt, W. M. (1972)**: "Irregularities of distribution VII"
   - Proved lower bounds on discrepancy

4. **Niederreiter, H. (1992)**: "Random Number Generation and Quasi-Monte Carlo Methods"
   - Comprehensive treatment of low-discrepancy sequences

### Modern Developments

5. **Dick, J. & Pillichshammer, F. (2010)**: "Digital Nets and Sequences"
   - Modern theory of quasi-Monte Carlo

6. **Drmota, M. & Tichy, R. F. (1997)**: "Sequences, Discrepancies and Applications"
   - Applications to computer science

### Color Science

7. **MacAdam, D. L. (1942)**: "Visual sensitivities to color differences in daylight"
   - Foundation of perceptual color spaces

8. **Fairchild, M. D. (2013)**: "Color Appearance Models"
   - Modern treatment of color perception

---

🎨 *The Plastic Constant isn't just a good choice - it's the mathematically optimal choice for 2D color sequences.*
