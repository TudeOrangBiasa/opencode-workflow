# Documents Kit Skills Integration

This repo (opencode-workflow) integrates with [documents-kit-skills](https://github.com/your-org/documents-kit-skills) — a separate repo containing 3 coupled skills for AI-assisted document creation.

## Location

Documents-kit-skills lives under `opencode-workflow/skills/personal/documents-kit-skills/` as a **dedicated package** (alongside other personal skills like `ddev/`, `dev-workflow/`, `openviking/`).

## What is symlinked

| Path | Source | Purpose |
|------|--------|---------|
| `skills/personal/documents-kit-skills/` (package) | `documents-kit-skills/` (whole repo) | Top-level entry to the package |
| `skills/personal/documents-kit-skills/document-writing` | `documents-kit-skills/skills/document-writing` | Document orchestrator |
| `skills/personal/documents-kit-skills/drawio` | `documents-kit-skills/skills/drawio` | Diagram generation |
| `skills/personal/documents-kit-skills/humanizer` | `documents-kit-skills/skills/humanizer` | Prose anti-AI |
| `skills/personal/documents-kit-skills/officecli` | `documents-kit-skills/skills/officecli` | docx/pptx/xlsx manipulation (MCP wrapper) |
| `~/.config/opencode/skills/{X}` | → `opencode-workflow/skills/personal/documents-kit-skills/{X}` | OpenCode global (via package) |

## Why 4 skills (not 3)?

The `document-writing` orchestrator depends on `officecli` for:
- PATH B workflow (extend existing .docx)
- Post-conversion fixes (`fix-pandoc-leaks.sh` uses `officecli set` to apply color/indent/font fixes)
- Validation (`officecli validate` to check schema)
- Visual verification (`officecli view screenshot` for layout check)
- Image insertion (`officecli add --type picture` for diagrams)

Without `officecli` in the package, `document-writing` is incomplete.

## Why symlink under `personal/`?

Per the opencode-workflow skill organization:
- `engineering/` — daily code work
- `misc/` — kept around but rarely used
- `personal/` — tied to personal setup (where documents-kit-skills fits)
- `productivity/` — daily non-code workflow tools

Documents-kit-skills is a personal toolkit — lives under `personal/`.

## Why symlink (not copy / submodule)?

- **Single source of truth**: documents-kit-skills is the canonical repo
- **Auto-propagation**: edits in documents-kit-skills workspace auto-flow to opencode-workflow
- **No drift**: skill versions stay in sync across the workspace
- **No duplication**: skills aren't copied between repos

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

The script:
- Creates the package folder `skills/personal/documents-kit-skills/`
- Symlinks each of the 3 skills to documents-kit-skills
- Re-points `~/.config/opencode/skills/X` to the new package location
- Creates top-level `documents-kit-skills` symlink for convenience
- Backs up any existing skill dirs to `.scratch/backup/`

## Updating

To update the skills, just `git pull` in documents-kit-skills. Changes propagate everywhere via symlinks.

```bash
cd /path/to/documents-kit-skills
git pull origin main
# No restart of opencode-workflow needed for symlink changes
# Restart OpenCode if skill content (SKILL.md) changed
```

## Workflow

```
documents-kit-skills/  (source of truth)
       │
       │ (symlinks via setup script)
       ▼
opencode-workflow/
└── skills/personal/documents-kit-skills/   ← package folder
    ├── document-writing/                    ← symlink
    ├── drawio/                              ← symlink
    ├── humanizer/                           ← symlink
    └── officecli/                           ← symlink
       │
       │ (symlinks in ~/.config/opencode/)
       ▼
~/.config/opencode/skills/{document-writing,drawio,humanizer,officecli}
       │
       ▼
OpenCode (loads skills from global config)
```

## Why not git submodule?

Submodules require explicit `git submodule update --init --recursive` and add complexity. Symlinks are simpler for local development where the repos live in known locations.

For distributed teams, consider:
- Git submodules
- npm/pip-style package manager
- Monorepo (single repo, multiple packages)

## See also

- [documents-kit-skills README](https://github.com/your-org/documents-kit-skills/blob/main/README.md) — main entry to the kit
- [ARCHITECTURE.md](https://github.com/your-org/documents-kit-skills/blob/main/docs/ARCHITECTURE.md) — how the 4 skills work together
- [AGENTS.md](../AGENTS.md) — opencode-workflow skill organization
