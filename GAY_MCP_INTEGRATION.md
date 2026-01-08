# Gay-MCP Integration: Visual Affordances for Gay-TOFU

**How to compress Gay-TOFU sequences into MCP tool UI elements**

---

## The Core Idea

**Gay-TOFU generates deterministic colors. Gay-MCP exposes these as MCP tools. The UI shows colors as visual affordances.**

```
Gay-TOFU (math) → Gay-MCP (tools) → UI (visual affordances)
     ↓                  ↓                    ↓
plasticColor(n)    mcp__gay__next_color    ████ colored dots
```

---

## Visual Affordances

### 1. **Colored Dots/Badges** (Most Compact)

```typescript
// MCP tool returns color
const color = await mcp__gay__next_color();  // → "#851BE4"

// UI renders as dot
<span class="color-dot" style="background: #851BE4"></span>
```

**CSS**:
```css
.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 4px;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
```

**Visual**:
```
User 1: ● Alice
User 2: ● Bob
User 3: ● Carol
```

**Compression**: Name + color in 12px circle

---

### 2. **Border Colors** (Medium Compression)

```typescript
// Apply to container borders
const userColor = await mcp__gay__color_at({ index: userId });

document.querySelector('.user-panel').style.borderLeft = 
  `4px solid ${userColor}`;
```

**Visual**:
```
┃ Alice's message    (purple border)
┃ Bob's message      (teal border)
┃ Carol's message    (green border)
```

**Compression**: User identity encoded in border

---

### 3. **Background Gradients** (High Information)

```typescript
// Multi-color palette for richer encoding
const palette = await mcp__gay__palette({ n: 3, start_index: userId });

const gradient = `linear-gradient(135deg, 
  ${palette[0]} 0%, 
  ${palette[1]} 50%, 
  ${palette[2]} 100%)`;

element.style.background = gradient;
```

**Visual**:
```
╔════════════════════╗
║ Alice's Session    ║  (purple → teal gradient)
╚════════════════════╝

╔════════════════════╗
║ Bob's Session      ║  (teal → green gradient)
╚════════════════════╝
```

**Compression**: Multi-dimensional state in gradient

---

### 4. **Color Strips** (Timeline Compression)

```typescript
// Generate sequence of colors for timeline
const timeline = await Promise.all(
  events.map((e, i) => mcp__gay__color_at({ index: i }))
);

// Render as strip
timeline.forEach((color, i) => {
  const bar = document.createElement('div');
  bar.style.background = color;
  bar.style.width = '4px';
  bar.style.height = '20px';
  strip.appendChild(bar);
});
```

**Visual**:
```
Timeline: ████████████████████
          ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
          Each color = event at index
```

**Compression**: 100+ events in 400px strip

---

### 5. **Glyph Coloring** (Typography + Color)

```typescript
// Color individual characters with Hamming swarm
const text = "HELLO";
const colored = text.split('').map((letter, i) => {
  const color = letterToColor(letter, seed);
  return `<span style="color: ${color}">${letter}</span>`;
}).join('');
```

**Visual**:
```
HELLO  (each letter has distinct color from tensor)
```

**Compression**: Letter identity + color in single glyph

---

## MCP Tool → UI Affordance Mapping

### Tool: `mcp__gay__next_color()`

**Returns**: `{ color: "#851BE4", trit: 1, ... }`

**UI Affordances**:
1. **Dot**: `<div style="background: #851BE4; width: 12px; height: 12px; border-radius: 50%"></div>`
2. **Badge**: `<span class="badge" style="background: #851BE4">User 1</span>`
3. **Border**: `<div style="border-left: 4px solid #851BE4">...</div>`
4. **Highlight**: `<mark style="background: #851BE470">text</mark>`

---

### Tool: `mcp__gay__palette({ n: 5 })`

**Returns**: `{ colors: ["#851BE4", "#37C0C8", ...] }`

**UI Affordances**:
1. **Gradient**: `background: linear-gradient(90deg, #851BE4, #37C0C8, ...)`
2. **Strip**: Multiple `<div>` elements side-by-side
3. **Legend**: Color swatches with labels
4. **Chart**: Pie chart sectors or bar colors

---

### Tool: `mcp__gay__skill_quad({ skills: "a,b,c,d" })`

**Returns**: `{ colors: [...], trits: [...], balanced: true }`

**UI Affordances**:
1. **Quad Grid**:
```
┌─────┬─────┐
│  A  │  B  │  (each cell colored)
├─────┼─────┤
│  C  │  D  │
└─────┴─────┘
```

2. **Balance Indicator**:
```
Skills: ● ● ● ●  ✓ Balanced (sum ≡ 0 mod 3)
```

---

### Tool: `mcp__gay__lattice_2d({ lx: 3, ly: 3 })`

**Returns**: `{ positions: [{x,y,color},...] }`

**UI Affordances**:
1. **Checkerboard**:
```css
.cell[data-parity="even"] { background: color1; }
.cell[data-parity="odd"]  { background: color2; }
```

2. **Heatmap**: Canvas with colored pixels

---

### Tool: `mcp__gay__mc_sweep({ n_sweeps: 100 })`

**Returns**: `{ sweep_colors: [...] }`

**UI Affordances**:
1. **Progress Bar**:
```html
<div class="progress">
  <div style="background: linear-gradient(90deg, 
    ${sweep_colors.join(', ')})">
  </div>
</div>
```

2. **Animation**: Each frame colored differently

---

## Practical Examples

### Example 1: Chat UI with User Colors

```typescript
// On user join
const userId = users.length;
const { color } = await mcp__gay__next_color();

// Store mapping
userColors.set(userId, color);

// Render message
function renderMessage(userId, text) {
  return `
    <div class="message">
      <span class="user-dot" style="background: ${userColors.get(userId)}"></span>
      <span class="user-name">${getUserName(userId)}</span>
      <span class="message-text">${text}</span>
    </div>
  `;
}
```

**Visual Result**:
```
● Alice: Hello!
● Bob: Hi there!
● Carol: How's it going?
```

---

### Example 2: Skill Selection with GF(3) Balance

```typescript
// User selects 3 skills
const selected = ["acsets", "gay-mcp", "beeper"];

// Get balancing skill
const { required_trit, suggestions } = await mcp__gay__balance_triad({
  skills: selected.join(',')
});

// Render with color indicators
function renderSkillPicker() {
  return `
    <div class="skill-grid">
      ${selected.map(s => `
        <div class="skill-card" style="border-left: 5px solid ${getSkillColor(s)}">
          ${s}
          <span class="trit-badge">${getSkillTrit(s)}</span>
        </div>
      `).join('')}
      
      <div class="balancer">
        Need trit: ${required_trit}
        Suggestions: 
        ${suggestions.map(s => `
          <span class="skill-chip" style="background: ${getSkillColor(s)}">
            ${s}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}
```

**Visual Result**:
```
┌─────────────────┐
│ acsets          │ (purple border, trit=+1)
└─────────────────┘

┌─────────────────┐
│ gay-mcp         │ (teal border, trit=0)
└─────────────────┘

┌─────────────────┐
│ beeper          │ (green border, trit=+1)
└─────────────────┘

Need trit: -1
Suggestions: [julia] [testing] [security]
             ████    ████      ████
```

---

### Example 3: Session Timeline

```typescript
// Generate timeline colors
const sessions = await Promise.all(
  sessionIds.map(id => mcp__gay__color_at({ index: id }))
);

// Render as timeline strip
function renderTimeline() {
  return `
    <div class="timeline">
      ${sessions.map((color, i) => `
        <div class="timeline-marker" 
             style="background: ${color}"
             title="Session ${i}"
             onclick="jumpToSession(${i})">
        </div>
      `).join('')}
    </div>
  `;
}
```

**CSS**:
```css
.timeline {
  display: flex;
  height: 30px;
  gap: 2px;
}

.timeline-marker {
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s;
}

.timeline-marker:hover {
  transform: scaleY(1.5);
}
```

**Visual Result**:
```
████████████████████████████████
↑                              ↑
Session 0                Session 31
(hover to preview, click to jump)
```

---

### Example 4: Hamming Distance Visualization

```typescript
// Get colors for alphabet tensor
const { positions } = await mcp__gay__lattice_2d({ lx: 3, ly: 3 });

// Get Hamming connections from selected letter
const selected = 'A';
const neighbors = getHammingNeighbors(selected, distance=1);

// Render tensor with highlights
function renderTensor() {
  return `
    <div class="tensor-grid">
      ${ALPHABET.map(letter => {
        const color = letterToColor(letter);
        const isNeighbor = neighbors.includes(letter);
        const isSelected = letter === selected;
        
        return `
          <div class="tensor-cell ${isSelected ? 'selected' : ''} ${isNeighbor ? 'neighbor' : ''}"
               style="background: ${color}">
            ${letter}
          </div>
        `;
      }).join('')}
    </div>
  `;
}
```

**CSS**:
```css
.tensor-cell {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
}

.tensor-cell.selected {
  border: 2px solid white;
  box-shadow: 0 0 10px rgba(255,255,255,0.5);
}

.tensor-cell.neighbor {
  outline: 2px solid purple;
  outline-offset: 2px;
}
```

**Visual Result**:
```
┌────┬────┬────┐
│ A  │ B  │ C  │  (A selected with white border)
├────┼────┼────┤  (B highlighted as d=1 neighbor)
│ D  │ E  │ F  │
├────┼────┼────┤
│ G  │ H  │ I  │
└────┴────┴────┘
```

---

## Design Patterns

### Pattern 1: **Color as Identity**

```typescript
const identity = await mcp__gay__color_at({ index: entityId });
// → Use as avatar background, border, badge
```

**Where**: User lists, chat messages, session indicators

---

### Pattern 2: **Color as State**

```typescript
const { color, trit } = await mcp__gay__next_color();
// trit ∈ {-1, 0, +1} encodes state
```

**Where**: Status indicators (error/neutral/success)

---

### Pattern 3: **Gradient as Dimension**

```typescript
const palette = await mcp__gay__palette({ n: dimensions });
const gradient = `linear-gradient(${palette.join(', ')})`;
```

**Where**: Multi-dimensional data (skill quads, parameter spaces)

---

### Pattern 4: **Strip as Timeline**

```typescript
const colors = events.map((e, i) => getColorAt(i));
// Render as horizontal strip
```

**Where**: Event logs, session history, Monte Carlo sweeps

---

### Pattern 5: **Tensor as Structure**

```typescript
const { positions } = await mcp__gay__lattice_2d({ lx, ly });
// Render as grid with checkerboard coloring
```

**Where**: Alphabet tensor, skill lattice, spatial data

---

## Implementation Strategy

### Step 1: **Color Cache**

```typescript
class ColorCache {
  private cache = new Map<number, string>();
  
  async getColor(index: number): Promise<string> {
    if (!this.cache.has(index)) {
      const { color } = await mcp__gay__color_at({ index });
      this.cache.set(index, color);
    }
    return this.cache.get(index)!;
  }
}
```

---

### Step 2: **CSS Custom Properties**

```css
:root {
  --user-1-color: #851BE4;
  --user-2-color: #37C0C8;
  --user-3-color: #6CEC13;
}

.user-1 { border-left: 4px solid var(--user-1-color); }
.user-2 { border-left: 4px solid var(--user-2-color); }
```

---

### Step 3: **React Components**

```typescript
function ColorDot({ index }: { index: number }) {
  const [color, setColor] = useState<string>('');
  
  useEffect(() => {
    mcp__gay__color_at({ index }).then(({ color }) => setColor(color));
  }, [index]);
  
  return (
    <span 
      className="color-dot" 
      style={{ background: color }}
    />
  );
}
```

---

### Step 4: **Canvas Rendering** (High Performance)

```typescript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

async function renderColorStrip(indices: number[]) {
  for (let i = 0; i < indices.length; i++) {
    const { color } = await mcp__gay__color_at({ index: indices[i] });
    ctx.fillStyle = color;
    ctx.fillRect(i * 4, 0, 4, 20);
  }
}
```

---

## Performance Considerations

### Caching Strategy

```typescript
// Batch fetch colors upfront
const indices = [1, 2, 3, 4, 5];
const colors = await Promise.all(
  indices.map(i => mcp__gay__color_at({ index: i }))
);

// Store in Map for O(1) lookup
const colorMap = new Map(
  colors.map((c, i) => [indices[i], c.color])
);
```

### CSS Injection (Fastest)

```typescript
// Generate CSS once, use many times
const styleSheet = document.createElement('style');
styleSheet.textContent = colors.map((c, i) => `
  .color-${i} { background: ${c.color}; }
`).join('');
document.head.appendChild(styleSheet);

// Usage: <div class="color-5">...</div>
```

---

## Summary Table

| Affordance | Size | Information Density | Use Case |
|------------|------|---------------------|----------|
| Dot | 12px | Low (identity only) | User indicators |
| Border | 4px | Low (identity only) | Message attribution |
| Badge | 80px | Medium (identity + label) | User chips |
| Gradient | Full width | High (multi-dimensional) | Skill quads |
| Strip | Variable | Very High (timeline) | Event logs |
| Tensor | Grid | Extreme (structure) | Alphabet/lattice |

---

## Next Steps

1. **Choose affordances** based on UI context
2. **Implement ColorCache** for performance
3. **Add CSS custom properties** for consistency
4. **Create React components** for reusability
5. **Test with real data** (users, skills, events)

---

**The key insight: Color = compressed identity/state. Gay-MCP tools generate it. UI renders it visually.**

🎨 **One color contains: index, seed, trit, Hamming neighbors, gradient position.** 🌈
