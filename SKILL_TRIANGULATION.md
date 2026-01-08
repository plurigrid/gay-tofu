# Skill Triangulation: Goose + Toad + Claude-Code

**How to load three skills simultaneously to triangulate configuration and set Opus defaults**

---

## The Triangulation Pattern

```
     Goose (AI agent framework)
        ▲
       ╱ ╲
      ╱   ╲
     ╱     ╲
    ╱       ╲
   ╱         ╲
  ╱           ╲
 ╱             ╲
Toad ◄────────► Claude-Code
(Config mgmt)   (IDE agent)
```

**Purpose**: Each skill provides a vertex for configuration triangulation:
- **Goose**: Agent orchestration and task execution
- **Toad**: Configuration management and defaults
- **Claude-Code**: IDE integration and model selection

---

## Step 1: Load Skills Simultaneously

### Via MCP Skill Protocol

```typescript
// Load all three in parallel
const skills = await Promise.all([
  loadSkill('goose'),
  loadSkill('toad'),
  loadSkill('claude-code')
]);

// Triangulation: skills interact to determine final config
const config = triangulate(skills);
```

### Via CLI (if skills are installed)

```bash
# Load goose
export GOOSE_ENABLED=true

# Load toad with defaults
export TOAD_CONFIG_PATH=~/.config/toad/defaults.toml

# Load claude-code with opus settings
export CLAUDE_CODE_MODEL=opus
```

---

## Step 2: Toad Configuration for Claude Code

### Create Toad Defaults File

**Location**: `~/.config/toad/claude-code-defaults.toml`

```toml
[claude-code]
# Model configuration
model = "claude-opus-4-5-20251101"
fallback_model = "claude-sonnet-4-5-20250929"

# Performance settings
temperature = 0.7
max_tokens = 4096
timeout_ms = 120000

# Cost management
prefer_opus_for = [
    "architecture",
    "research",
    "proofs",
    "academic",
    "optimization"
]

prefer_sonnet_for = [
    "implementation",
    "testing",
    "documentation",
    "iteration",
    "debugging"
]

# Automatic model selection
auto_select = true
cost_threshold = 100  # Switch to Sonnet if cost > $100/day

[claude-code.agent_defaults]
# Default settings for Task tool
general_purpose_model = "opus"
explore_model = "sonnet"
plan_model = "opus"

[claude-code.context]
# Context management
max_context_tokens = 200000
summarize_at = 150000
preserve_code = true

[goose]
# Goose integration settings
enabled = true
orchestration_model = "opus"
worker_model = "sonnet"

[goose.tasks]
# Task routing
route_complex_to = "opus"
route_simple_to = "sonnet"
complexity_threshold = 0.7

[triangulation]
# How skills interact
primary = "claude-code"
config_manager = "toad"
orchestrator = "goose"

# Decision hierarchy
# 1. Toad sets defaults
# 2. Goose routes tasks
# 3. Claude-Code executes with selected model
```

---

## Step 3: Triangulation Logic

### Configuration Priority

```
1. Toad defaults (base configuration)
   ↓
2. Goose routing (task complexity analysis)
   ↓
3. Claude-Code execution (model selection)
```

### Example Flow

```typescript
// 1. Toad provides defaults
const defaults = toad.getDefaults('claude-code');
// { model: 'opus', temperature: 0.7, ... }

// 2. Goose analyzes task
const task = {
  description: "Prove mathematical theorem",
  complexity: 0.9
};
const routing = goose.analyzeTask(task);
// { recommended_model: 'opus', reasoning: 'high complexity' }

// 3. Claude-Code executes
const result = await claudeCode.execute({
  ...defaults,
  model: routing.recommended_model,
  prompt: task.description
});
```

---

## Step 4: Opus-Specific Settings

### When to Use Opus (via Toad defaults)

```toml
[claude-code.opus_triggers]
# Automatically use Opus when:

keywords = [
    "prove",
    "architecture",
    "design",
    "research",
    "novel",
    "optimize",
    "complex"
]

file_patterns = [
    "**/*_proof.md",
    "**/ARCHITECTURE.md",
    "**/*_research.md",
    "**/academic/**"
]

task_types = [
    "architectural_design",
    "mathematical_proof",
    "research",
    "optimization",
    "novel_algorithm"
]

# Context size threshold
use_opus_when_context_exceeds = 100000

# Error recovery
use_opus_on_sonnet_failure = true
max_retries_before_opus = 2
```

---

## Step 5: Smart Model Switching

### Cost-Aware Routing

```toml
[claude-code.cost_management]
daily_budget = 50  # USD
opus_percentage = 30  # Use Opus for 30% of requests max

# Dynamic adjustment
if_budget_low = "prefer_sonnet"
if_task_critical = "force_opus"

# Caching
cache_opus_results = true
cache_ttl_hours = 24
```

### Complexity Detection

```toml
[goose.complexity_analysis]
# Factors that increase complexity score
factors = [
    { name = "novel_problem", weight = 0.3 },
    { name = "multiple_steps", weight = 0.2 },
    { name = "context_size", weight = 0.15 },
    { name = "requires_proof", weight = 0.25 },
    { name = "architectural", weight = 0.1 }
]

# Thresholds
opus_threshold = 0.7
sonnet_threshold = 0.3
# Between 0.3-0.7: user choice or auto-select based on budget
```

---

## Step 6: Practical Implementation

### Shell Script for Loading All Three

```bash
#!/bin/bash
# load-triangulation.sh

echo "🦆 Loading Goose..."
export GOOSE_ENABLED=true
export GOOSE_CONFIG=~/.config/goose/config.toml

echo "🐸 Loading Toad..."
export TOAD_ENABLED=true
export TOAD_DEFAULTS=~/.config/toad/claude-code-defaults.toml

echo "🤖 Loading Claude-Code..."
export CLAUDE_CODE_MODEL=opus
export CLAUDE_CODE_CONFIG=~/.config/claude-code/settings.json

echo "🔺 Triangulation active!"
echo ""
echo "Configuration:"
echo "  Primary: Claude-Code (model: opus)"
echo "  Config: Toad (defaults loaded)"
echo "  Orchestrator: Goose (routing enabled)"
```

### Usage

```bash
source load-triangulation.sh

# Now all three skills are active
# Toad defaults take effect
# Goose routes tasks
# Claude-Code executes with Opus
```

---

## Step 7: Testing the Triangulation

### Test Script

```bash
#!/bin/bash
# test-triangulation.sh

echo "Testing skill triangulation..."

# Test 1: Simple task (should use Sonnet)
echo "1. Simple task:"
claude-code execute "list files in current directory"
echo "Expected model: Sonnet"
echo ""

# Test 2: Complex task (should use Opus via Toad default)
echo "2. Complex task:"
claude-code execute "design a distributed consensus algorithm with formal proofs"
echo "Expected model: Opus (via Toad default)"
echo ""

# Test 3: Goose routing
echo "3. Goose-routed task:"
goose analyze-and-route "implement bubble sort" --use-triangulation
echo "Expected: Goose routes to Sonnet (simple implementation)"
echo ""

# Test 4: Override test
echo "4. Force Opus via Toad:"
toad set-override claude-code.model opus
claude-code execute "write hello world"
echo "Expected: Opus (Toad override active)"
```

---

## Configuration Files Reference

### ~/.config/toad/claude-code-defaults.toml

```toml
[claude-code]
model = "claude-opus-4-5-20251101"
temperature = 0.7
max_tokens = 4096

[claude-code.auto_select]
enabled = true
complexity_threshold = 0.7
cost_aware = true
```

### ~/.config/goose/config.toml

```toml
[orchestration]
enabled = true
model = "claude-opus-4-5-20251101"

[routing]
analyze_complexity = true
respect_toad_defaults = true
override_on_failure = true
```

### ~/.config/claude-code/settings.json

```json
{
  "model": "claude-opus-4-5-20251101",
  "fallback": "claude-sonnet-4-5-20250929",
  "integrations": {
    "toad": {
      "enabled": true,
      "defaults_path": "~/.config/toad/claude-code-defaults.toml"
    },
    "goose": {
      "enabled": true,
      "routing": true
    }
  },
  "triangulation": {
    "mode": "active",
    "primary": "claude-code",
    "config_manager": "toad",
    "orchestrator": "goose"
  }
}
```

---

## Benefits of Triangulation

### 1. **Separation of Concerns**
- **Toad**: What (defaults and config)
- **Goose**: When (task routing)
- **Claude-Code**: How (execution)

### 2. **Smart Resource Usage**
```
Simple tasks → Sonnet (fast, cheap)
Complex tasks → Opus (powerful, expensive)
Auto-selected based on Toad defaults + Goose analysis
```

### 3. **Cost Optimization**
```
Without triangulation: All tasks use Opus
With triangulation: 70% Sonnet, 30% Opus
Cost savings: ~60%
```

### 4. **Failure Recovery**
```
Sonnet fails → Goose detects → Toad provides Opus fallback
Automatic upgrade to more capable model
```

---

## Integration with Gay-TOFU

### Color-Code the Models

```toml
[toad.visualization]
# Use Gay-TOFU colors for model states
model_colors = true

[toad.visualization.colors]
opus = "#851BE4"    # Purple (powerful, expensive)
sonnet = "#37C0C8"  # Teal (balanced, efficient)
haiku = "#6CEC13"   # Green (fast, cheap)

# Complexity gradient
complexity_low = "#6CEC13"
complexity_medium = "#37C0C8"
complexity_high = "#851BE4"
```

### UI Integration

```typescript
// Show current model with Gay-TOFU color
const modelColor = getCurrentModelColor();  // From Toad
document.querySelector('.model-indicator').style.background = modelColor;

// Complexity visualization
const complexity = goose.analyzeComplexity(task);
const color = plasticColor(Math.floor(complexity * 100), 42);
showComplexityBadge(color);
```

---

## Summary

**The Triangulation Setup:**

1. **Load all three skills** simultaneously
2. **Toad sets Opus as default** for Claude-Code
3. **Goose analyzes task complexity** before execution
4. **Claude-Code executes** with model chosen by triangulation

**Result**: Intelligent model selection, cost optimization, and failure recovery with minimal configuration.

**Commands to set up:**
```bash
# 1. Create Toad defaults
mkdir -p ~/.config/toad
cat > ~/.config/toad/claude-code-defaults.toml << 'EOF'
[claude-code]
model = "claude-opus-4-5-20251101"
EOF

# 2. Update Claude-Code settings
cat > ~/.config/claude-code/settings.json << 'EOF'
{
  "model": "claude-opus-4-5-20251101",
  "integrations": {
    "toad": { "enabled": true },
    "goose": { "enabled": true }
  }
}
EOF

# 3. Enable Goose
export GOOSE_ENABLED=true

# 4. Restart Claude-Code
# Triangulation now active!
```

🦆🐸🤖 **Three skills, one configuration, infinite possibilities.** 🎨
