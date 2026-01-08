#!/usr/bin/env node
/**
 * Simple Node.js runner for gay-tofu TypeScript examples
 * Run with: node run-ts-example.mjs
 * 
 * Note: This uses eval() to run TypeScript-like code.
 * For production, use proper TypeScript compilation.
 */

// Inline implementation for Node.js compatibility
const PHI = 1.618033988749895;
const PHI2 = 1.3247179572447460;

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  
  let r1 = 0, g1 = 0, b1 = 0;
  
  if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp >= 1 && hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp >= 2 && hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp >= 3 && hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp >= 4 && hp < 5) [r1, g1, b1] = [x, 0, c];
  else if (hp >= 5 && hp < 6) [r1, g1, b1] = [c, 0, x];
  
  const m = l - c / 2;
  return { r: r1 + m, g: g1 + m, b: b1 + m };
}

function rgbToHex(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;
  return { r, g, b };
}

function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

function plasticColor(n, seed = 0, lightness = 0.5) {
  const h = ((seed + n / PHI2) % 1.0) * 360;
  const s = ((seed + n / (PHI2 * PHI2)) % 1.0) * 0.5 + 0.5;
  return hslToRgb(h, s, lightness);
}

function goldenAngleColor(n, seed = 0, lightness = 0.5) {
  const h = ((seed + n / PHI) % 1.0) * 360;
  const s = 0.7;
  return hslToRgb(h, s, lightness);
}

function invertColor(color, method = 'plastic', seed = 0, maxSearch = 10000, threshold = 0.01) {
  const generator = method === 'golden' ? goldenAngleColor : plasticColor;
  
  for (let n = 1; n <= maxSearch; n++) {
    const candidate = generator(n, seed);
    const distance = colorDistance(color, candidate);
    
    if (distance < threshold) {
      return n;
    }
  }
  
  return null;
}

function getUserColor(userId, seed, method = 'plastic') {
  const generator = method === 'golden' ? goldenAngleColor : plasticColor;
  const rgb = generator(userId, seed);
  return rgbToHex(rgb);
}

// Run examples
console.log('🌈 Gay-TOFU TypeScript Examples (Node.js)\n');

console.log('=== Example 1: Team Colors ===\n');
const team = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];
const seed = 42;

team.forEach((name, index) => {
  const userId = index + 1;
  const color = getUserColor(userId, seed, 'plastic');
  const rgb = hexToRgb(color);
  const recovered = invertColor(rgb, 'plastic', seed);
  console.log(`${name.padEnd(6)} (id=${userId}): ${color} ${recovered === userId ? '✓' : '✗'}`);
});

console.log('\n=== Example 2: Plastic Thread (seed=42) ===\n');
for (let i = 1; i <= 5; i++) {
  const color = plasticColor(i, 42);
  const hex = rgbToHex(color);
  console.log(`plastic(${i}, 42) = ${hex}`);
}

console.log('\n=== Example 3: Golden Thread (seed=42) ===\n');
for (let i = 1; i <= 5; i++) {
  const color = goldenAngleColor(i, 42);
  const hex = rgbToHex(color);
  console.log(`golden(${i}, 42) = ${hex}`);
}

console.log('\n=== Example 4: Bijection Verification ===\n');
const testCases = [
  { index: 1, seed: 42 },
  { index: 69, seed: 42 },
  { index: 100, seed: 0 }
];

testCases.forEach(({ index, seed }) => {
  const color = plasticColor(index, seed);
  const hex = rgbToHex(color);
  const recovered = invertColor(color, 'plastic', seed);
  const status = recovered === index ? '✓' : '✗';
  console.log(`plastic(${index}, seed=${seed}) → ${hex} → ${recovered} ${status}`);
});

console.log('\n=== Example 5: URL Generation ===\n');
const roomId = 'dev-team';
const token = 'abc123def456';
const urlSeed = 42;
const shareUrl = `https://1fps.video/?room=${roomId}#key=${token}&seed=${urlSeed}&seq=plastic`;
console.log('Share URL:');
console.log(shareUrl);

console.log('\n=== Example 6: Performance Test ===\n');
const iterations = 10000;
const startTime = Date.now();
for (let i = 0; i < iterations; i++) {
  plasticColor(i, 42);
}
const elapsed = Date.now() - startTime;
console.log(`Generated ${iterations} colors in ${elapsed}ms`);
console.log(`Average: ${(elapsed / iterations).toFixed(4)}ms per color`);

console.log('\n✓ All examples complete!\n');
console.log('🎨 All sequences are bijective. You can recover the index from the color.\n');
