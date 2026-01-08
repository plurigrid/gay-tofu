#!/bin/bash
# Create GitHub Gists for Gay-TOFU project

echo "Creating Gists for Gay-TOFU..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not installed"
    echo "Install with: brew install gh"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI ready"
echo ""

# Core implementation
echo "📤 Creating gist: gay-tofu.ts (TypeScript implementation)..."
gh gist create gay-tofu.ts -d "Gay-TOFU: Bijective low-discrepancy color sequences (TypeScript)" -p

echo "📤 Creating gist: gay-tofu.test.ts (Test suite)..."
gh gist create gay-tofu.test.ts -d "Gay-TOFU: Test suite (45+ tests)" -p

# Visualizations
echo "📤 Creating gist: world.html (Interactive demo)..."
gh gist create world.html -d "Gay-TOFU: Interactive color generation demo" -p

echo "📤 Creating gist: alphabet-tensor.html (Hamming swarm)..."
gh gist create alphabet-tensor.html -d "Gay-TOFU: 3×3×3 Hamming swarm visualization" -p

echo "📤 Creating gist: hamming-codec.html (Error correction)..."
gh gist create hamming-codec.html -d "Gay-TOFU: Error-correcting codec demo" -p

echo "📤 Creating gist: visualize-optimality.html (Proof)..."
gh gist create visualize-optimality.html -d "Gay-TOFU: Plastic constant optimality proof" -p

# Documentation
echo "📤 Creating gist: README.md (Project overview)..."
gh gist create README.md -d "Gay-TOFU: Bijective color sequences - README" -p

echo "📤 Creating gist: QUICKSTART.md (Getting started)..."
gh gist create QUICKSTART.md -d "Gay-TOFU: 5-minute quickstart guide" -p

echo "📤 Creating gist: PROJECT_SUMMARY.md (Executive summary)..."
gh gist create PROJECT_SUMMARY.md -d "Gay-TOFU: Executive summary" -p

echo "📤 Creating gist: WHY_PLASTIC_2D_OPTIMAL.md (Math proof)..."
gh gist create WHY_PLASTIC_2D_OPTIMAL.md -d "Gay-TOFU: Why plastic constant is optimal for 2D" -p

echo "📤 Creating gist: HAMMING_SWARM.md (Error correction theory)..."
gh gist create HAMMING_SWARM.md -d "Gay-TOFU: Hamming swarm error correction structure" -p

echo "📤 Creating gist: VISUALIZATIONS.md (Demo guide)..."
gh gist create VISUALIZATIONS.md -d "Gay-TOFU: Interactive visualizations guide" -p

echo ""
echo "✅ All gists created!"
echo ""
echo "To view your gists:"
echo "  gh gist list"
echo ""
echo "To share a specific gist:"
echo "  gh gist view <gist-id> --web"

