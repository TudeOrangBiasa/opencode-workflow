# Documents Kit Skills Integration

This repo (opencode-workflow) integrates with [documents-kit-skills](https://github.com/your-org/documents-kit-skills) — a separate repo containing 3 coupled skills for AI-assisted document creation.

## What is symlinked

| Path in opencode-workflow | Points to | Purpose |
|---------------------------|-----------|---------|
| `skills/productivity/document-writing` | `documents-kit-skills/skills/document-writing` | Document orchestrator |
| `skills/productivity/humanizer` | `documents-kit-skills/skills/humanizer` | Prose anti-AI |
| `skills/misc/drawio` | `documents-kit-skills/skills/drawio` | Diagram generation |
| `documents-kit-skills/` (top-level) | `documents-kit-skills/` | Full repo access |

## Why symlink?

- **Single source of truth**: documents-kit-skills is the canonical repo for the 3 skills
- **Auto-propagation**: updates to documents-kit-skills automatically reflect in opencode-workflow
- **No duplication**: skills aren't copied between repos
- **No drift**: skill versions stay in sync across the workspace

## Setup (one-time, after cloning)

```bash
# 1. Clone documents-kit-skills
git clone <documents-kit-url> /path/to/documents-kit-skills

# 2. Run setup (creates symlinks)
cd /path/to/opencode-workflow
./scripts/setup-documents-kit.sh

# Or with custom location:
DOCUMENTS_KIT_DIR=/custom/path ./scripts/setup-documents-kit.sh
```

## Updating

To update the skills, just `git pull` in documents-kit-skills. Changes propagate to opencode-workflow automatically via symlinks.

```bash
cd /path/to/documents-kit-skills
git pull origin main
# No restart of opencode-workflow needed for symlink changes
# Restart OpenCode if skill content changed
```

## Workflow

```
documents-kit-skills/  (source of truth)
       |
       | (symlinks)
       v
opencode-workflow/
├── skills/productivity/document-writing  → ─┐
├── skills/productivity/humanizer        → ─┤
├── skills/misc/drawio                   → ─┤─── (auto-propagated)
└── documents-kit-skills/                 → ─┘
       |
       | (symlinks from ~/.config/opencode/skills/)
       v
~/.config/opencode/skills/{document-writing,drawio,humanizer}
       |
       v
OpenCode (loads skills from global config)
```

## Backup and Removal

The setup script backs up existing skill dirs to `.scratch/backup/` before symlinking. To remove symlinks and restore backups:

```bash
# Manual removal
rm skills/productivity/document-writing skills/productivity/humanizer skills/misc/drawio documents-kit-skills
mv .scratch/backup/document-writing-bak skills/productivity/document-writing
mv .scratch/backup/humanizer-bak skills/productivity/humanizer
mv .scratch/backup/drawio-bak skills/misc/drawio
```

## Why not a git submodule?

Git submodules require explicit init/update commands and add complexity. Symlinks are simpler for local development where the repos live in known locations.

For distributed teams, consider:
- Git submodules with explicit `git submodule update --init --recursive`
- npm/pip-style package manager
- Monorepo (single repo, multiple packages)

## See also

- [documents-kit-skills README](documents-kit-skills/README.md)
- [ARCHITECTURE.md](documents-kit-skills/docs/ARCHITECTURE.md) — how the 3 skills work together
