---
name: documents-kit-integration
description: How documents-kit-skills integrates with opencode-workflow. Use when setting up the integration, troubleshooting, or planning changes to either side.
---

# Documents Kit Skills Integration

## What is it

[documents-kit-skills](https://github.com/TudeOrangBiasa/documents-kit-skills) — a separate repo containing 4 coupled skills + 1 MCP server + utility tools for AI-assisted document creation:

| Component | Type | Purpose |
|-----------|------|---------|
| `document-writing` | Skill | Document orchestrator (workflow, decision rules, anti-slop) |
| `drawio` | Skill | Diagram generation with style presets + templates |
| `humanizer` | Skill | 30-pattern anti-AI catalog for prose |
| `officecli` | Skill | docx/pptx/xlsx manipulation |
| `scholar-paper-mcp` | MCP server | Semantic Scholar citation pipeline (search, track, BibTeX export) |
| `tools/` | Glue scripts | officecli_helper, pandoc_citeproc, scholar_bibtex, asset-validator, etc. |

Plus design assets (5 style presets, 5 diagram templates).

## How it's integrated here

### Skills (symlink chain)
```
documents-kit-skills/skills/                       (source of truth)
  ↓ symlinks
opencode-workflow/skills/personal/documents-kit-skills/   (package folder)
  ↓ symlinks
~/.config/opencode/skills/{X}                       (OpenCode global)
  ↓
OpenCode loads skill content
```

### MCP (registered in opencode.json)
```
scholar-paper-mcp/                                 (cloned peer dep)
  ↓ registered as local MCP in ~/.config/opencode/opencode.json
OpenCode loads tools at startup
```

### Tools (symlink chain)
```
documents-kit-skills/tools/                        (source of truth)
  ↓ symlinks
opencode-workflow/tools/                           (accessible in agent context)
```

## Setup

Full bundle (skills + MCP + tools):

```bash
# 1. Symlink skills (4) + tools (8)
cd /path/to/opencode-workflow
./scripts/setup-documents-kit.sh

# 2. Clone & install scholar-paper-mcp (peer dep)
git clone https://github.com/TudeOrangBiasa/scholar-paper-mcp \
  /path/to/scholar-paper-mcp
cd /path/to/scholar-paper-mcp
git lfs pull
uv sync

# 3. Symlink model files for runtime
mkdir -p ~/.local/share/scholar-paper-mcp/models
ln -s /path/to/scholar-paper-mcp/models/model_quantized.onnx \
  ~/.local/share/scholar-paper-mcp/models/model_quantized.onnx
ln -s /path/to/scholar-paper-mcp/models/tokenizer.json \
  ~/.local/share/scholar-paper-mcp/models/tokenizer.json

# 4. Restart OpenCode to pick up MCP registration + skill changes
```

## Components

### 4 Skills (symlinked → `skills/personal/documents-kit-skills/`)
- `document-writing`, `drawio`, `humanizer`, `officecli`

### 1 MCP Server (registered in `~/.config/opencode/opencode.json`)
- **scholar-paper-mcp**: 15 tools — search papers, get details, citations, references, recommendations, session tracking, BibTeX export
- Config entry:
  ```json
  "scholar-paper-mcp": {
    "type": "local",
    "command": ["uv", "--directory", "/path/to/scholar-paper-mcp", "run", "scholar-paper-mcp"],
    "enabled": true
  }
  ```

### 8 Tools (symlinked → `opencode-workflow/tools/`)
- `officecli_helper.py` — Python interface to officecli
- `pandoc_citeproc.py` — Pandoc + citeproc pipeline
- `scholar_bibtex.py` — BibTeX export from scholar session
- `asset-validator.sh` — Document asset validation
- `doc-audit-pipeline.sh` — Full document audit pipeline
- `pdf-from-docx.sh` — docx → PDF conversion
- `__init__.py` — package init
- `tests/` — test suite

## Updating

### Skills
```bash
cd /path/to/documents-kit-skills
git pull origin main
# Changes propagate via symlinks immediately
```

### scholar-paper-mcp
```bash
cd /path/to/scholar-paper-mcp
git pull origin main
uv sync
# Restart OpenCode
```

## Why integrated via symlink (not submodule)

- Single source of truth (two repos)
- Edits propagate without explicit git operations
- Simpler for solo maintenance
- Tradeoff: cloning opencode-workflow alone doesn't include the skills — must run setup script + clone deps

## Troubleshooting

### Skill not loading in OpenCode

```bash
ls -la ~/.config/opencode/skills/document-writing
# → skills/personal/documents-kit-skills/document-writing
# → documents-kit-skills/skills/document-writing
```

### scholar-paper-mcp not connecting

```bash
# Test MCP server standalone
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  timeout 10 uv run scholar-paper-mcp
# Should return tool list after init

# Check registration
grep -A 5 "scholar-paper-mcp" ~/.config/opencode/opencode.json

# Check model files
ls -la ~/.local/share/scholar-paper-mcp/models/
```

### Hardcoded path error on pre-commit

Run `scripts/check-portable.sh` to find violations.

### Want to use without opencode-workflow

Install documents-kit-skills standalone:
```bash
git clone https://github.com/TudeOrangBiasa/documents-kit-skills.git
cd documents-kit-skills
./install.sh  # handles skills + peer deps + MCP registration
```

## Reference

- **write-a-skill** — skill structure principles
- **skill-author** — meta-skill for creating skills
- [architecture.md](../architecture.md) — overall layout
- [extraction-criteria.md](../skills/extraction-criteria.md) — when to extract
- [anti-hardcoded-pattern.md](../skills/anti-hardcoded-pattern.md) — portability rules
