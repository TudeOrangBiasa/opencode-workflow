# OpenCode Workflow Kit

> Personal dotfiles + workflow pipeline for OpenCode. Heavy skills (4+ deps, full automation) live in their own repos and integrate via symlinks.

## What this is

This repo is the **personal AI workflow setup**:

- The AI agent's core workflow management skills (write-a-skill, skill-author, dev-workflow, memory-dreaming, etc.)
- Personal setup scripts (install, audit, pre-commit hooks)
- Documentation for project decisions (architecture, extraction criteria, portability rules)
- Symlinks to **external skill packages** that live in their own repos

## Architecture

```
opencode-workflow/                              (this repo)
├── skills/                                     (pipeline + symlinks)
│   ├── engineering/                             (pipeline skills)
│   ├── personal/documents-kit-skills/           (symlink to external)
│   │   ├── document-writing/  (symlink)
│   │   ├── drawio/            (symlink)
│   │   ├── humanizer/         (symlink)
│   │   └── officecli/         (symlink)
│   ├── productivity/  (legacy)
│   ├── misc/         (legacy)
│   └── ...
├── scripts/                                    (check, audit, install)
│   ├── check-portable.sh      (hardcoded path lint)
│   ├── check-skill-structure.sh (write-a-skill compliance)
│   ├── audit-skill.sh         (single-skill audit)
│   ├── pre-commit.sh          (runs all before commit)
│   ├── install-hooks.sh       (installs pre-commit)
│   └── setup-documents-kit.sh (creates symlink chain)
├── docs/                                       (project decisions)
│   ├── architecture.md        (overall layout)
│   ├── skills/extraction-criteria.md
│   ├── skills/anti-hardcoded-pattern.md
│   └── integrations/documents-kit.md
└── AGENTS.md / README.md       (entry points)
```

## Quick start

```bash
# Clone repo
git clone <opencode-workflow-url>

# Install scripts
chmod +x scripts/*.sh

# Install pre-commit hook (catches hardcoded paths + bad structure)
./scripts/install-hooks.sh

# Set up documents-kit-skills (4 coupled skills for document creation)
./scripts/setup-documents-kit.sh

# Audit any skill
./scripts/audit-skill.sh skills/engineering/skill-author
```

## How to add a new skill

1. Decide: pipeline-level (here) or extractable (own repo)? See [docs/skills/extraction-criteria.md](docs/skills/extraction-criteria.md).
2. Load: **write-a-skill** + **skill-author**
3. Create `skills/{category}/skill-name/` with `SKILL.md` (≤100 lines) + optional `REFERENCE.md`
4. Run `./scripts/audit-skill.sh skills/path/to/skill` to verify
5. Pre-commit hook catches hardcoded paths + structural issues

## When to extract a skill

3+ of the 5-point checklist:
- External dependencies > 4
- Needs additional skills to function
- Fully automates a task
- Has multiple patterns/templates
- Independent update cadence

If yes → extract to own repo, integrate via symlink. See [docs/architecture.md](docs/architecture.md) for the model.

## Anti-hardcoded (portability)

All skills, scripts, and tools must be portable — installable by anyone on any machine. No absolute paths, no OS assumptions, no user-specific defaults.

Rules: [docs/skills/anti-hardcoded-pattern.md](docs/skills/anti-hardcoded-pattern.md)

Enforced by `scripts/check-portable.sh` (pre-commit hook).

## Tools (workflow scripts)

| Script | Purpose |
|--------|---------|
| `check-portable.sh` | Scan for hardcoded paths |
| `check-skill-structure.sh` | Verify write-a-skill compliance |
| `audit-skill.sh <path>` | Full single-skill audit |
| `pre-commit.sh` | Run all checks before commit |
| `install-hooks.sh` | Install pre-commit hook |
| `setup-documents-kit.sh` | Create documents-kit symlinks |

## Reference

- [AGENTS.md](AGENTS.md) — agent-facing context (rules, conventions)
- [docs/architecture.md](docs/architecture.md) — overall layout
- [docs/skills/extraction-criteria.md](docs/skills/extraction-criteria.md) — when to extract
- [docs/skills/anti-hardcoded-pattern.md](docs/skills/anti-hardcoded-pattern.md) — portability
- [docs/integrations/documents-kit.md](docs/integrations/documents-kit.md) — example integration
- [DOCUMENTS_KIT.md](docs/DOCUMENTS_KIT.md) — documents-kit integration details
- **write-a-skill** — skill structure principles (load before creating skills)
- **skill-author** — meta-skill for creating skills

## License

This is personal dotfiles / workflow setup. Not for public distribution as a whole. Individual skills may be extracted for distribution (see extraction criteria).
