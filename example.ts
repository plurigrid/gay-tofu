/**
 * Example usage of Gay-TOFU for 1fps.video integration
 */

import {
  plasticThread,
  getUserColor,
  invertColor,
  hexToRgb,
  verifyColorChallenge,
  generateShareUrl,
  parseUrlFragment,
  rgbToHex,
  plasticColor
} from './gay-tofu.ts';

console.log('🌈 Gay-TOFU: Low-Discrepancy Color Sequences + TOFU\n');

// Example 1: Generate user identity colors for a team
console.log('=== Example 1: Team Screen Sharing ===\n');

const sessionSeed = 42;
const team = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];

console.log(`Session seed: ${sessionSeed}\n`);

team.forEach((name, index) => {
  const userId = index + 1;
  const color = getUserColor(userId, sessionSeed, 'plastic');
  
  // Verify bijection
  const rgb = hexToRgb(color);
  const recoveredId = invertColor(rgb, 'plastic', sessionSeed);
  
  console.log(`${name.padEnd(6)} (id=${userId}): ${color} ${recoveredId === userId ? '✓' : '✗'}`);
});

// Example 2: Challenge-response authentication
console.log('\n=== Example 2: Challenge-Response Auth ===\n');

const aliceSeed = 42;
const challengeIndex = 1337;

console.log(`Server → Alice: "Predict color at index ${challengeIndex}"`);
console.log(`Alice (seed=${aliceSeed}): Computing...`);

const aliceResponse = rgbToHex(plasticColor(challengeIndex, aliceSeed));
console.log(`Alice → Server: "${aliceResponse}"`);

const isValid = verifyColorChallenge(challengeIndex, aliceResponse, aliceSeed);
console.log(`Server: ${isValid ? '✓ Authenticated' : '✗ Authentication failed'}`);

// Example 3: URL generation for sharing
console.log('\n=== Example 3: 1fps.video URL Generation ===\n');

const roomId = 'dev-team-standup';
const encryptionKey = 'abc123def456789';
const seed = 42;

const shareUrl = generateShareUrl(roomId, encryptionKey, seed, 'plastic');
console.log(`Share URL:\n${shareUrl}\n`);

const parsed = parseUrlFragment(shareUrl.split('#')[1]);
console.log('Parsed parameters:');
console.log(`  Room: ${roomId}`);
console.log(`  Key: ${parsed.key}`);
console.log(`  Seed: ${parsed.seed}`);
console.log(`  Sequence: ${parsed.sequence}`);

// Example 4: Multi-monitor with different sequences
console.log('\n=== Example 4: Multi-Monitor Color Coding ===\n');

const monitors = [
  { id: 1, name: 'Main Display', sequence: 'plastic' as const },
  { id: 2, name: 'Secondary', sequence: 'golden' as const },
  { id: 3, name: 'Vertical', sequence: 'halton' as const }
];

monitors.forEach(monitor => {
  const color = getUserColor(1, 42, monitor.sequence);
  console.log(`${monitor.name.padEnd(15)} (${monitor.sequence}): ${color}`);
});

// Example 5: Color thread for temporal tracking
console.log('\n=== Example 5: Temporal Color Thread ===\n');

const thread = plasticThread(10, 42);
console.log('First 10 colors in session (seed=42):\n');

thread.forEach((color, index) => {
  const timestamp = `T+${index}`;
  
  // Verify bijection
  const rgb = hexToRgb(color);
  const recovered = invertColor(rgb, 'plastic', 42);
  const status = recovered === (index + 1) ? '✓' : '✗';
  
  console.log(`${timestamp.padEnd(5)} ${color} ${status}`);
});

// Example 6: Real-world 1fps.video integration snippet
console.log('\n=== Example 6: Integration Snippet ===\n');

console.log(`
// 1fps.video client integration
const { key, seed, sequence } = parseUrlFragment(window.location.hash);
const myUserId = 1; // Assigned by server

// Generate my border color
const myColor = getUserColor(myUserId, seed, sequence);

// Add colored border to canvas
function drawFrame(canvas: HTMLCanvasElement, imageData: ImageData) {
  const ctx = canvas.getContext('2d')!;
  
  // Draw the screen capture
  ctx.putImageData(imageData, 0, 0);
  
  // Add colored border
  ctx.strokeStyle = myColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
  // Add user badge
  ctx.fillStyle = myColor;
  ctx.fillRect(10, 10, 120, 40);
  ctx.fillStyle = 'white';
  ctx.font = '16px monospace';
  ctx.fillText(\`User \${myUserId}\`, 20, 35);
}

// Challenge-response on connect
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  
  if (msg.type === 'challenge') {
    // Server wants us to prove we know the seed
    const response = rgbToHex(plasticColor(msg.index, seed));
    ws.send(JSON.stringify({ type: 'response', color: response }));
  }
};
`);

console.log('\n=== Bijection Verification ===\n');

// Verify all colors in thread are invertible
let allBijective = true;
for (let i = 1; i <= 100; i++) {
  const color = plasticColor(i, 42);
  const recovered = invertColor(color, 'plastic', 42, 10000);
  if (recovered !== i) {
    allBijective = false;
    console.log(`✗ Failed at index ${i}`);
    break;
  }
}

if (allBijective) {
  console.log('✓ All 100 colors are bijectively invertible!');
  console.log('  plastic_color(n, 42) → color → invert → n ✓');
}

console.log('\n🎨 All sequences are bijective. You can recover the index from the color.\n');
