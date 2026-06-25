---
name: documents-kit-integration
description: How documents-kit-skills integrates with opencode-workflow. Use when setting up the integration, troubleshooting, or planning changes to either side.
---

# Documents Kit Skills Integration

## What is it

[documents-kit-skills](https://github.com/your-org/documents-kit-skills) — a separate repo containing 4 coupled skills for AI-assisted document creation:

| Skill | Purpose |
|-------|---------|
| `document-writing` | Document orchestrator (workflow, decision rules, anti-slop) |
| `drawio` | Diagram generation with style presets + templates |
| `humanizer` | 30-pattern anti-AI catalog for prose |
| `officecli` | docx/pptx/xlsx manipulation (used by document-writing) |

Plus utility tools (`fix-pandoc-leaks.sh`, `detection-audit.sh`, etc.) and design assets (5 style presets, 5 diagram templates).

## How it's integrated here

```
documents-kit-skills/                              (source of truth, lives in own repo)
  ↓ symlinks
opencode-workflow/skills/personal/documents-kit-skills/   (package folder)
  ↓ symlinks
~/.config/opencode/skills/{X}                       (OpenCode global)
  ↓
OpenCode loads skill content
```

## Setup

One-time, on this machine:
```bash
cd /path/to/opencode-workflow
./scripts/setup-documents-kit.sh
```

This creates:
- `skills/personal/documents-kit-skills/{X}` symlinks (4 skills)
- `~/.config/opencode/skills/{X}` symlinks (4 global)

## Updating

Edit in `documents-kit-skills/` workspace. Changes propagate via symlinks. No action needed in opencode-workflow unless you want to commit changes to the symlink tracking.

```bash
cd /path/to/documents-kit-skills
git pull origin main
# Changes visible in opencode-workflow immediately
# Restart OpenCode if SKILL.md content changed
```

## Why integrated via symlink (not submodule)

- Single source of truth (documents-kit-skills)
- Edits propagate without explicit `git submodule update`
- Simpler for solo maintenance
- Tradeoff: cloning opencode-workflow alone doesn't include the skills — must run setup script

## Troubleshooting

### Skill not loading in OpenCode

```bash
# Check symlink chain
ls -la ~/.config/opencode/skills/document-writing
# Should point to opencode-workflow/skills/personal/documents-kit-skills/document-writing
# Which should point to documents-kit-skills/skills/document-writing
```

### Hardcoded path error on pre-commit

Run `scripts/check-portable.sh` to find violations. Use env vars (see [anti-hardcoded-pattern](../skills/anti-hardcoded-pattern.md)).

### Want to use without opencode-workflow

Just install documents-kit-skills standalone:
```bash
git clone https://github.com/your-org/documents-kit-skills.git
cd documents-kit-skills
./install.sh  # or run setup-documents-kit.sh on this side
```

## Reference

- **write-a-skill** — skill structure principles
- **skill-author** — meta-skill for creating skills
- [architecture.md](../architecture.md) — overall layout
- [extraction-criteria.md](../skills/extraction-criteria.md) — when to extract
- [anti-hardcoded-pattern.md](../skills/anti-hardcoded-pattern.md) — portability rules
- [DOCUMENTS_KIT.md](../../DOCUMENTS_KIT.md) — full integration doc
