/**
 * Tests for Gay-TOFU TypeScript implementation
 * Run with: deno test gay-tofu.test.ts
 * or with Node: npx tsx gay-tofu.test.ts
 */

import {
  goldenAngleColor,
  plasticColor,
  haltonColor,
  invertColor,
  plasticThread,
  rgbToHex,
  hexToRgb,
  colorDistance,
  verifyColorChallenge,
  getUserColor,
  parseUrlFragment,
  generateShareUrl,
  type RGB
} from './gay-tofu.ts';

// Simple test framework
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✓ ${message}`);
}

function assertClose(a: number, b: number, epsilon = 0.001, message: string): void {
  if (Math.abs(a - b) > epsilon) {
    throw new Error(`Assertion failed: ${message} (${a} != ${b}, diff: ${Math.abs(a - b)})`);
  }
  console.log(`✓ ${message}`);
}

// Test color space conversions
console.log('\n=== Color Space Conversions ===');

const purple = { r: 0.663, g: 0.333, b: 0.969 };
const purpleHex = rgbToHex(purple);
console.log(`Purple RGB → Hex: ${purpleHex}`);
assert(purpleHex === '#A955F7' || purpleHex === '#A955F8', 'Purple hex conversion');

const recovered = hexToRgb(purpleHex);
assertClose(recovered.r, purple.r, 0.01, 'Purple hex → RGB (r)');
assertClose(recovered.g, purple.g, 0.01, 'Purple hex → RGB (g)');
assertClose(recovered.b, purple.b, 0.01, 'Purple hex → RGB (b)');

// Test color generation
console.log('\n=== Color Generation ===');

const golden1 = goldenAngleColor(1, 42);
console.log(`Golden(1, seed=42): ${rgbToHex(golden1)}`);
assert(golden1.r >= 0 && golden1.r <= 1, 'Golden color r in range');
assert(golden1.g >= 0 && golden1.g <= 1, 'Golden color g in range');
assert(golden1.b >= 0 && golden1.b <= 1, 'Golden color b in range');

const plastic1 = plasticColor(1, 42);
console.log(`Plastic(1, seed=42): ${rgbToHex(plastic1)}`);
assert(plastic1.r >= 0 && plastic1.r <= 1, 'Plastic color r in range');
assert(plastic1.g >= 0 && plastic1.g <= 1, 'Plastic color g in range');
assert(plastic1.b >= 0 && plastic1.b <= 1, 'Plastic color b in range');

const halton1 = haltonColor(1, 42);
console.log(`Halton(1, seed=42): ${rgbToHex(halton1)}`);
assert(halton1.r >= 0 && halton1.r <= 1, 'Halton color r in range');
assert(halton1.g >= 0 && halton1.g <= 1, 'Halton color g in range');
assert(halton1.b >= 0 && halton1.b <= 1, 'Halton color b in range');

// Test determinism
console.log('\n=== Determinism ===');

const plastic1a = plasticColor(1, 42);
const plastic1b = plasticColor(1, 42);
const dist = colorDistance(plastic1a, plastic1b);
assertClose(dist, 0, 0.0001, 'Same inputs produce same outputs');

const plastic1c = plasticColor(1, 43);
const dist2 = colorDistance(plastic1a, plastic1c);
assert(dist2 > 0.01, 'Different seeds produce different outputs');

// Test bijection (color inversion)
console.log('\n=== Bijection Tests ===');

for (const testCase of [
  { index: 1, seed: 42, method: 'plastic' as const },
  { index: 69, seed: 42, method: 'plastic' as const },
  { index: 100, seed: 0, method: 'golden' as const },
  { index: 50, seed: 123, method: 'halton' as const }
]) {
  const { index, seed, method } = testCase;
  
  const generator = method === 'golden' ? goldenAngleColor :
                   method === 'plastic' ? plasticColor :
                   haltonColor;
  
  const color = generator(index, seed);
  const hex = rgbToHex(color);
  const recovered = invertColor(color, method, seed, 10000, 0.01);
  
  console.log(`${method}(${index}, seed=${seed}) → ${hex} → index ${recovered}`);
  assert(recovered === index, `Bijection: ${method}(${index}) recoverable`);
}

// Test plastic thread
console.log('\n=== Plastic Thread ===');

const thread = plasticThread(5, 42);
console.log(`Thread (5 colors, seed=42):`, thread);
assert(thread.length === 5, 'Thread has correct length');
assert(thread[0].startsWith('#'), 'Thread colors are hex strings');

// Verify each color is invertible
for (let i = 0; i < thread.length; i++) {
  const rgb = hexToRgb(thread[i]);
  const recovered = invertColor(rgb, 'plastic', 42, 10000);
  assert(recovered === i + 1, `Thread[${i}] invertible to ${i + 1}`);
}

// Test challenge-response
console.log('\n=== Challenge-Response Authentication ===');

const challengeIndex = 1337;
const userSeed = 42;
const correctColor = plasticColor(challengeIndex, userSeed);
const correctHex = rgbToHex(correctColor);

console.log(`Challenge: Predict color at index ${challengeIndex} with seed ${userSeed}`);
console.log(`Correct answer: ${correctHex}`);

const isValid = verifyColorChallenge(challengeIndex, correctHex, userSeed, 'plastic');
assert(isValid, 'Correct color passes verification');

const wrongHex = '#FF0000';
const isInvalid = !verifyColorChallenge(challengeIndex, wrongHex, userSeed, 'plastic');
assert(isInvalid, 'Wrong color fails verification');

// Test user colors
console.log('\n=== User Identity Colors ===');

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' }
];

const sessionSeed = 42;
console.log(`Session seed: ${sessionSeed}`);

users.forEach(user => {
  const color = getUserColor(user.id, sessionSeed, 'plastic');
  console.log(`  ${user.name} (id=${user.id}): ${color}`);
  
  // Verify color is consistent
  const color2 = getUserColor(user.id, sessionSeed, 'plastic');
  assert(color === color2, `${user.name}'s color is deterministic`);
  
  // Verify bijection
  const rgb = hexToRgb(color);
  const recoveredId = invertColor(rgb, 'plastic', sessionSeed, 10000);
  assert(recoveredId === user.id, `${user.name}'s color invertible to id=${user.id}`);
});

// Test URL fragment parsing
console.log('\n=== URL Fragment Parsing ===');

const testUrl = '#key=abc123&seed=42&seq=plastic';
const parsed = parseUrlFragment(testUrl);
console.log(`Parsed: ${JSON.stringify(parsed)}`);
assert(parsed.key === 'abc123', 'Key parsed correctly');
assert(parsed.seed === 42, 'Seed parsed correctly');
assert(parsed.sequence === 'plastic', 'Sequence parsed correctly');

// Test URL generation
console.log('\n=== URL Generation ===');

const shareUrl = generateShareUrl('dev-team', 'token123', 42, 'plastic');
console.log(`Share URL: ${shareUrl}`);
assert(shareUrl.includes('room=dev-team'), 'Room in URL');
assert(shareUrl.includes('key=token123'), 'Token in URL');
assert(shareUrl.includes('seed=42'), 'Seed in URL');
assert(shareUrl.includes('seq=plastic'), 'Sequence in URL');

// Test uniformity (colors should be well-distributed)
console.log('\n=== Uniformity Test ===');

const n = 100;
const colors = [];
for (let i = 1; i <= n; i++) {
  colors.push(plasticColor(i, 0));
}

// Calculate average pairwise distance
let totalDistance = 0;
let count = 0;
for (let i = 0; i < colors.length; i++) {
  for (let j = i + 1; j < colors.length; j++) {
    totalDistance += colorDistance(colors[i], colors[j]);
    count++;
  }
}
const avgDistance = totalDistance / count;
console.log(`Average pairwise distance (n=${n}): ${avgDistance.toFixed(4)}`);
assert(avgDistance > 0.3, 'Colors are well-distributed (avg distance > 0.3)');

// Test no collisions
console.log('\n=== Collision Test ===');

const seen = new Set<string>();
let collisions = 0;
for (let i = 1; i <= 1000; i++) {
  const hex = rgbToHex(plasticColor(i, 42));
  if (seen.has(hex)) {
    collisions++;
  }
  seen.add(hex);
}
console.log(`Collisions in 1000 colors: ${collisions}`);
assert(collisions < 10, 'Very few collisions (<10 in 1000)');

console.log('\n=== All Tests Passed! ===\n');

// Performance benchmark
console.log('=== Performance Benchmark ===');

const iterations = 10000;
const start = Date.now();
for (let i = 0; i < iterations; i++) {
  plasticColor(i, 42);
}
const elapsed = Date.now() - start;
const perColor = elapsed / iterations;
console.log(`Generated ${iterations} colors in ${elapsed}ms`);
console.log(`Average: ${perColor.toFixed(3)}ms per color`);

const startInvert = Date.now();
const testColor = plasticColor(500, 42);
const recovered500 = invertColor(testColor, 'plastic', 42, 1000);
const elapsedInvert = Date.now() - startInvert;
console.log(`Inverted color (search up to 1000) in ${elapsedInvert}ms`);
assert(recovered500 === 500, 'Inversion benchmark succeeded');

console.log('\n✓ All tests and benchmarks complete!\n');
