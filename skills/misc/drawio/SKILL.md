# Draw.io Diagrams

Generate professional `.drawio` diagrams from natural language — architecture, ERD, UML, flowcharts, ML/DL models, network topology. Exports to PNG/SVG/PDF/JPG via the native draw.io desktop CLI.

**Upstream:** [Agents365-ai/drawio-skill](https://github.com/Agents365-ai/drawio-skill) (MIT) — full credit for the workflow, scripts, 10k+ shape search, and 321 AI/LLM brand logos. This is an OpenCode-adapted wrapper.

## Prerequisites

### 1. Draw.io desktop CLI

```bash
# macOS
brew install --cask drawio
drawio --version

# Linux — download .deb/.rpm from https://github.com/jgraph/drawio-desktop/releases
# DO NOT use snap (AppArmor sandbox breaks it)
# For headless servers:
sudo apt install xvfb
xvfb-run -a drawio --version --no-sandbox

# Windows — download installer from releases page
```

Verify with `drawio --version` (or `draw.io --version` on older installs).

### 2. (Optional) Upstream scripts for advanced features

The full upstream provides Python scripts for shape search, AI/LLM logos, codebase visualization, and auto-layout:

```bash
# Recommended: clone upstream alongside this skill
git clone https://github.com/Agents365-ai/drawio-skill.git \
  ~/.config/opencode/skills/drawio/upstream

# Or install globally via npx (if you use SkillsMP)
npx skills add Agents365-ai/365-skills -g
```

Without the scripts, basic diagram generation (`drawio` XML + CLI export) still works. Shape search, AI brand logos, and codebase visualization need the upstream repo.

## When To Use

**Use for:** polished precise diagrams — architecture, network topology, strict UML, ERD, ML/DL model figures, any diagram with solid fills, branded icons, swimlanes, or needing export to PNG/SVG/PDF.

**Use sibling skills instead for:**
- Casual hand-drawn / whiteboard look → `excalidraw` or `tldraw`
- Diagrams-as-code in git + Markdown → `mermaid` (general) or `plantuml` (UML)
- Freeform infinite-canvas sketching → `tldraw`

## Quick Start — Basic Diagram

Describe what you want naturally. Example:

> Draw a microservices e-commerce architecture with Mobile/Web/Admin clients, API Gateway (auth + rate limiting + routing), Auth/User/Order/Product/Payment services, Kafka message queue, Notification service, and User DB / Order DB / Product DB / Redis Cache / Stripe API

## Workflow

### Step 1 — Check deps

Resolve the drawio binary name on this system:

```bash
if command -v drawio &>/dev/null; then DRAWIO="drawio"
elif command -v draw.io &>/dev/null; then DRAWIO="draw.io"
elif [ -f "/Applications/draw.io.app/Contents/MacOS/draw.io" ]; then
  DRAWIO="/Applications/draw.io.app/Contents/MacOS/draw.io"
elif grep -qi microsoft /proc/version 2>/dev/null && [ -f "/mnt/c/Program Files/draw.io/draw.io.exe" ]; then
  DRAWIO="/mnt/c/Program Files/draw.io/draw.io.exe"
else
  echo "drawio not found — install from https://github.com/jgraph/drawio-desktop/releases"
fi
```

Remember the resolved binary name; use it in every export command below.

### Step 2 — Plan layout

Identify shapes, relationships, layout direction (LR or TB), group by tier/layer. For small diagrams (<15 nodes), hand-place coordinates on a grid snapped to multiples of 10.

### Step 3 — Generate XML

Write `.drawio` XML to disk. Example skeleton:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="drawio" version="26.0.0">
  <diagram name="Page-1">
    <mxGraphModel>
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- user shapes start at id="2" -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### Step 4 — Export draft

Export a preview PNG (no `-e` flag — `-e` corrupts the PNG for vision self-check):

```bash
$DRAWIO -x -f png --width 2000 -o diagram.png input.drawio
```

**Linux headless:** `xvfb-run -a --server-args="-screen 0 1280x1024x24" $DRAWIO ... --no-sandbox --disable-gpu`

### Step 5 — Vision self-check

Read the exported PNG with your vision capability. Check for:
- Overlapping shapes → shift apart by ≥200px
- Clipped labels → increase shape width/height
- Missing connections → verify source/target ids
- Off-canvas shapes → move to positive coords
- Edge-shape overlap → add waypoints or increase spacing
- Stacked edges → distribute entry/exit points

Max **2 auto-fix rounds**. If vision unavailable, skip to step 6.

### Step 6 — Review loop

Show the image to user, collect feedback, apply targeted XML edits, re-export, repeat until approved. Max 5 iteration rounds.

### Step 7 — Final export

Once approved, re-export with `-e` (embedded XML) for deliverable:

```bash
$DRAWIO -x -f png -e -s 2 -o diagram.drawio.png input.drawio
```

If upstream scripts are available, run the PNG repair (fixes draw.io's truncated IEND chunk):

```bash
python3 <upstream-dir>/scripts/repair_png.py diagram.drawio.png
```

Report file paths. Offer to open in draw.io desktop: `open diagram.drawio` (macOS) / `xdg-open` (Linux).

### Browser fallback (no CLI)

If drawio CLI unavailable, generate a diagrams.net URL (needs upstream Python scripts):

```bash
python3 <upstream-dir>/scripts/encode_drawio_url.py input.drawio          # viewer
python3 <upstream-dir>/scripts/encode_drawio_url.py --edit input.drawio   # editor
```

Or deliver the `.drawio` XML file directly — user opens in [diagrams.net](https://app.diagrams.net) or draw.io desktop.

## Advanced Features (need upstream scripts)

| Feature | File | Usage |
|---------|------|-------|
| Shape search (10k+ AWS/Azure/GCP/UML shapes) | `<upstream>/scripts/shapesearch.py` | `python3 shapesearch.py "aws lambda" --limit 5` |
| AI/LLM brand logos (321 logos) | `<upstream>/scripts/aiicons.py` | `python3 aiicons.py "claude"` |
| Codebase → diagram (Python/JS/Go/Rust) | `<upstream>/scripts/pyimports.py`, `jsimports.py`, etc. | Extract import graph for autolayout |
| Auto-layout (Graphviz) | `<upstream>/scripts/autolayout.py` | Layout large graphs automatically |
| Deterministic validator | `<upstream>/scripts/validate.py` | Lint `.drawio` files |
| Diagram type presets | `<upstream>/references/diagram-types.md` | ERD, UML, Sequence, Architecture, ML, Flowchart |
| Style presets | `<upstream>/references/style-presets.md` | Save/reuse visual styles |

## Draw.io XML Reference

### Shape types

| Style | Use for |
|-------|---------|
| `rounded=1;whiteSpace=wrap;html=1;` | Rounded rectangle — services, modules |
| `ellipse;whiteSpace=wrap;html=1;` | Circles/ovals — start/end, databases |
| `rhombus;whiteSpace=wrap;html=1;` | Diamond — decision points |
| `shape=cylinder3;whiteSpace=wrap;html=1;` | Cylinder — databases |
| `swimlane;startSize=30;` | Group/container with title bar |

### Color palette

| Color | fillColor | strokeColor | Use for |
|-------|-----------|-------------|---------|
| Blue | `#dae8fc` | `#6c8ebf` | Services, clients |
| Green | `#d5e8d4` | `#82b366` | Success, databases |
| Yellow | `#fff2cc` | `#d6b656` | Queues, decisions |
| Orange | `#ffe6cc` | `#d79b00` | Gateways, APIs |
| Red | `#f8cecc` | `#b85450` | Errors, alerts |
| Grey | `#f5f5f5` | `#666666` | External/neutral |
| Purple | `#e1d5e7` | `#9673a6` | Security, auth |

### Edge style

```xml
<mxCell id="10" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry" />
</mxCell>
```

**Always** include `rounded=1;orthogonalLoop=1;jettySize=auto` for smart routing.

## Fallback Chain

| Scenario | Behavior |
|----------|----------|
| drawio CLI missing, Python available | Browser fallback (diagrams.net URL) via upstream scripts |
| drawio CLI + Python both missing | `.drawio` XML only; user opens in diagrams.net manually |
| Drawio CLI crashes (macOS sandbox) | Treat as unavailable in-sandbox; use browser fallback / XML-only |
| Vision unavailable | Skip self-check; show user PNG directly |
| Export fails (Linux headless) | Retry with `xvfb-run -a` + `--no-sandbox` + `--disable-gpu`; else deliver XML |

## Upstream Reference

For the complete skill (full workflow, all scripts, troubleshooting):

- **GitHub:** https://github.com/Agents365-ai/drawio-skill
- **SKILL.md:** https://raw.githubusercontent.com/Agents365-ai/drawio-skill/main/skills/drawio-skill/SKILL.md
- **Docs:** https://agents365-ai.github.io/drawio-skill/
- **License:** MIT
