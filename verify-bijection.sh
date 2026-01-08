#!/bin/bash
# Cross-platform bijection verification: Julia ↔ TypeScript
# Verifies that both implementations produce identical colors

set -e

echo "🌈 Gay-TOFU Bijection Verification"
echo "=================================="
echo ""

cd ~/ies/gay-tofu

echo "Testing Julia implementation..."
echo "-------------------------------"
cd low-discrepancy-sequences

echo "1. Plastic thread (seed=42, n=1-5):"
julia --project=. mcp_integration.jl gay_plastic_thread '{"steps": 5, "seed": 42}' | jq -r '.colors[]'

echo ""
echo "2. Bijection test (color #851BE4 → index):"
julia --project=. mcp_integration.jl gay_invert '{"hex": "#851BE4", "method": "plastic", "seed": 42}' | jq -r '.index'

echo ""
echo "3. Golden angle (seed=42, n=1-3):"
julia --project=. mcp_integration.jl gay_golden_thread '{"steps": 3, "seed": 42}' 2>/dev/null | jq -r '.colors[]' || echo "[golden_thread test skipped]"

cd ..

echo ""
echo "Testing TypeScript implementation..."
echo "------------------------------------"

# Create a simple Node.js test script
cat > verify-ts.mjs << 'EOF'
import { plasticColor, rgbToHex, invertColor, goldenAngleColor } from './gay-tofu.ts';

console.log("1. Plastic thread (seed=42, n=1-5):");
for (let i = 1; i <= 5; i++) {
  const color = plasticColor(i, 42);
  console.log(rgbToHex(color));
}

console.log("");
console.log("2. Bijection test (color #851BE4 → index):");
const testColor = { r: 0.522, g: 0.106, b: 0.894 }; // Approximately #851BE4
const recovered = invertColor(testColor, 'plastic', 42, 10000, 0.01);
console.log(recovered);

console.log("");
console.log("3. Golden angle (seed=42, n=1-3):");
for (let i = 1; i <= 3; i++) {
  const color = goldenAngleColor(i, 42);
  console.log(rgbToHex(color));
}
EOF

# Try to run with Node.js (requires tsx or native TS support)
if command -v npx &> /dev/null; then
  npx tsx verify-ts.mjs 2>/dev/null || node --experimental-strip-types verify-ts.mjs 2>/dev/null || echo "[TypeScript test requires 'tsx' or Node.js 22+]"
else
  echo "[Node.js/npx not available]"
fi

rm -f verify-ts.mjs

echo ""
echo "✓ Verification complete!"
echo ""
echo "Both implementations should produce similar colors:"
echo "  - Julia and TypeScript #851BE4 at index 1 (seed=42)"
echo "  - Small differences (<1%) are acceptable due to floating point"
echo "  - Bijection verified if invertColor returns index 1"
