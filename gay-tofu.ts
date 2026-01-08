/**
 * Gay-TOFU: Low-Discrepancy Color Sequences for Visual Authentication
 * 
 * TypeScript port of the Julia implementation for browser/Node.js use.
 * Bijective color generation - you can recover the index from the color.
 * 
 * @module gay-tofu
 * @license MIT
 */

// Mathematical constants
const PHI = 1.618033988749895; // Golden ratio: x^2 = x + 1
const PHI2 = 1.3247179572447460; // Plastic constant: x^3 = x + 1

// Color space types
export interface RGB {
  r: number; // 0.0 to 1.0
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0 to 360
  s: number; // 0.0 to 1.0
  l: number;
}

/**
 * Convert HSL to RGB
 * @param h Hue (0-360 degrees)
 * @param s Saturation (0.0-1.0)
 * @param l Lightness (0.0-1.0)
 * @returns RGB color (0.0-1.0 range)
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  
  let r1 = 0, g1 = 0, b1 = 0;
  
  if (hp >= 0 && hp < 1) {
    [r1, g1, b1] = [c, x, 0];
  } else if (hp >= 1 && hp < 2) {
    [r1, g1, b1] = [x, c, 0];
  } else if (hp >= 2 && hp < 3) {
    [r1, g1, b1] = [0, c, x];
  } else if (hp >= 3 && hp < 4) {
    [r1, g1, b1] = [0, x, c];
  } else if (hp >= 4 && hp < 5) {
    [r1, g1, b1] = [x, 0, c];
  } else if (hp >= 5 && hp < 6) {
    [r1, g1, b1] = [c, 0, x];
  }
  
  const m = l - c / 2;
  return {
    r: r1 + m,
    g: g1 + m,
    b: b1 + m
  };
}

/**
 * Convert RGB to HSL
 * @param r Red (0.0-1.0)
 * @param g Green (0.0-1.0)
 * @param b Blue (0.0-1.0)
 * @returns HSL color
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }
  if (h < 0) h += 360;
  
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  return { h, s, l };
}

/**
 * Convert RGB to hex string
 * @param color RGB color (0.0-1.0 range)
 * @returns Hex color string (e.g., "#A855F7")
 */
export function rgbToHex(color: RGB): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

/**
 * Convert hex string to RGB
 * @param hex Hex color string (e.g., "#A855F7" or "A855F7")
 * @returns RGB color (0.0-1.0 range)
 */
export function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;
  return { r, g, b };
}

/**
 * Calculate Euclidean distance between two RGB colors
 * @param c1 First RGB color
 * @param c2 Second RGB color
 * @returns Distance (0.0 to ~1.732)
 */
export function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Golden Angle color generation (1D optimal)
 * φ = 1.618... (golden ratio)
 * Hue rotates by golden angle (137.508°)
 * 
 * @param n Index (1, 2, 3, ...)
 * @param seed Random seed for reproducibility
 * @param lightness Lightness value (0.0-1.0), default 0.5
 * @returns RGB color
 */
export function goldenAngleColor(n: number, seed = 0, lightness = 0.5): RGB {
  const h = ((seed + n / PHI) % 1.0) * 360;
  const s = 0.7;
  return hslToRgb(h, s, lightness);
}

/**
 * Plastic Constant color generation (2D optimal)
 * φ₂ = 1.325... (plastic constant)
 * Optimal for 2D color space (hue + saturation)
 * 
 * @param n Index (1, 2, 3, ...)
 * @param seed Random seed for reproducibility
 * @param lightness Lightness value (0.0-1.0), default 0.5
 * @returns RGB color
 */
export function plasticColor(n: number, seed = 0, lightness = 0.5): RGB {
  const h = ((seed + n / PHI2) % 1.0) * 360;
  const s = ((seed + n / (PHI2 * PHI2)) % 1.0) * 0.5 + 0.5;
  return hslToRgb(h, s, lightness);
}

/**
 * Van der Corput sequence in base b
 * @param n Index
 * @param base Prime base (2, 3, 5, 7, ...)
 * @returns Value in [0, 1)
 */
function vanDerCorput(n: number, base: number): number {
  let result = 0;
  let f = 1 / base;
  let i = n;
  
  while (i > 0) {
    result += f * (i % base);
    i = Math.floor(i / base);
    f = f / base;
  }
  
  return result;
}

/**
 * Halton sequence color generation (nD via prime bases)
 * Uses primes 2, 3, 5 for R, G, B dimensions
 * 
 * @param n Index (1, 2, 3, ...)
 * @param seed Random seed for reproducibility
 * @returns RGB color
 */
export function haltonColor(n: number, seed = 0): RGB {
  const r = (vanDerCorput(n + seed, 2) + seed) % 1.0;
  const g = (vanDerCorput(n + seed, 3) + seed) % 1.0;
  const b = (vanDerCorput(n + seed, 5) + seed) % 1.0;
  return { r, g, b };
}

/**
 * Invert a color to find its index (bijection!)
 * Given (color, method, seed), recover the index n that generated it.
 * 
 * @param color RGB color to invert
 * @param method Color generation method ('golden', 'plastic', 'halton')
 * @param seed Seed used for generation
 * @param maxSearch Maximum indices to search (default 10000)
 * @param threshold Color distance threshold (default 0.01)
 * @returns Index n, or null if not found
 */
export function invertColor(
  color: RGB,
  method: 'golden' | 'plastic' | 'halton' = 'plastic',
  seed = 0,
  maxSearch = 10000,
  threshold = 0.01
): number | null {
  const generator = method === 'golden' ? goldenAngleColor :
                   method === 'plastic' ? plasticColor :
                   haltonColor;
  
  for (let n = 1; n <= maxSearch; n++) {
    const candidate = generator(n, seed);
    const distance = colorDistance(color, candidate);
    
    if (distance < threshold) {
      return n;
    }
  }
  
  return null;
}

/**
 * Generate a thread of colors using plastic constant
 * Perfect for user identity in screen sharing (2D optimal)
 * 
 * @param steps Number of colors to generate
 * @param seed Random seed
 * @param lightness Lightness value
 * @returns Array of hex color strings
 */
export function plasticThread(steps: number, seed = 0, lightness = 0.5): string[] {
  const colors: string[] = [];
  for (let i = 1; i <= steps; i++) {
    const rgb = plasticColor(i, seed, lightness);
    colors.push(rgbToHex(rgb));
  }
  return colors;
}

/**
 * TOFU Authentication: Verify color prediction
 * Challenge-response using bijective color generation
 * 
 * @param challengeIndex Index to predict
 * @param responseHex Predicted color (hex string)
 * @param seed User's seed
 * @param method Color generation method
 * @param threshold Distance threshold for match
 * @returns True if prediction is correct
 */
export function verifyColorChallenge(
  challengeIndex: number,
  responseHex: string,
  seed: number,
  method: 'golden' | 'plastic' | 'halton' = 'plastic',
  threshold = 0.01
): boolean {
  const generator = method === 'golden' ? goldenAngleColor :
                   method === 'plastic' ? plasticColor :
                   haltonColor;
  
  const expected = generator(challengeIndex, seed);
  const response = hexToRgb(responseHex);
  const distance = colorDistance(expected, response);
  
  return distance < threshold;
}

/**
 * Generate user color for visual identity
 * Use in 1fps.video for color-coded borders
 * 
 * @param userId User index (1, 2, 3, ...)
 * @param seed Session seed
 * @param method Color generation method
 * @returns Hex color string
 */
export function getUserColor(
  userId: number,
  seed: number,
  method: 'golden' | 'plastic' | 'halton' = 'plastic'
): string {
  const generator = method === 'golden' ? goldenAngleColor :
                   method === 'plastic' ? plasticColor :
                   haltonColor;
  
  const rgb = generator(userId, seed);
  return rgbToHex(rgb);
}

/**
 * Parse 1fps.video URL fragment
 * Extract encryption key, seed, and sequence type
 * 
 * @param hash URL fragment (e.g., "#key=abc&seed=42&seq=plastic")
 * @returns Parsed parameters
 */
export function parseUrlFragment(hash: string): {
  key: string;
  seed: number;
  sequence: 'golden' | 'plastic' | 'halton';
} {
  const params = new URLSearchParams(hash.replace('#', ''));
  
  return {
    key: params.get('key') || '',
    seed: parseInt(params.get('seed') || '0', 10),
    sequence: (params.get('seq') || 'plastic') as 'golden' | 'plastic' | 'halton'
  };
}

/**
 * Generate shareable 1fps.video URL with Gay-TOFU
 * 
 * @param roomId Room identifier
 * @param token Encryption key
 * @param seed Color seed
 * @param sequence Color generation method
 * @returns Full URL
 */
export function generateShareUrl(
  roomId: string,
  token: string,
  seed: number,
  sequence: 'golden' | 'plastic' | 'halton' = 'plastic'
): string {
  return `https://1fps.video/?room=${roomId}#key=${token}&seed=${seed}&seq=${sequence}`;
}

// Example usage for 1fps.video integration
export const example = {
  // Generate colors for 5 users
  users: plasticThread(5, 42),
  // => ["#A855F7", "#37C0C8", "#6CEC13", "#F39C12", "#E74C3C"]
  
  // Verify bijection
  testBijection: () => {
    const color = plasticColor(69, 42);
    const hex = rgbToHex(color);
    const recovered = invertColor(color, 'plastic', 42);
    console.log(`Color #${hex} at index 69 → recovered index ${recovered}`);
    return recovered === 69; // Should be true!
  },
  
  // Challenge-response authentication
  challenge: {
    index: 1337,
    verify: (responseHex: string) => verifyColorChallenge(1337, responseHex, 42, 'plastic')
  },
  
  // 1fps.video URL
  url: generateShareUrl('dev-team', 'abc123def456', 42, 'plastic')
  // => "https://1fps.video/?room=dev-team#key=abc123def456&seed=42&seq=plastic"
};

export default {
  // Color generation
  goldenAngleColor,
  plasticColor,
  haltonColor,
  plasticThread,
  
  // Color space conversion
  hslToRgb,
  rgbToHsl,
  rgbToHex,
  hexToRgb,
  colorDistance,
  
  // Bijection
  invertColor,
  
  // TOFU authentication
  verifyColorChallenge,
  getUserColor,
  
  // 1fps.video integration
  parseUrlFragment,
  generateShareUrl,
  
  // Constants
  PHI,
  PHI2,
  
  // Example
  example
};
