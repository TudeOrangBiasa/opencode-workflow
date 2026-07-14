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
├── .opencode/                                   (local config, package.json)
├── skills/                                     (pipeline + symlinks)
│   ├── engineering/                             (pipeline skills)
│   │   ├── planning/                            (wayfinder, to-spec, to-tickets, triage, ask-matt)
│   │   ├── design/                              (architecture-decision-records, codebase-design, design-skill, design-system, domain-modeling, grill-with-docs, improve-codebase-architecture)
│   │   ├── quality/                             (code-review, diagnosing-bugs, tdd, ponytail, verify-evidence)
│   │   └── workflow/                            (implement, search-first, prototype, memory, skill-author)
│   ├── personal/workflow/                       (personal workflow skills)
│   │   ├── dev-workflow/
│   │   ├── eval/
│   │   ├── idea-fragments/
│   │   └── workflow-audit/
│   ├── personal/tools/                          (personal tools)
│   │   ├── ddev/
│   │   └── openviking/
│   ├── productivity/                            (daily non-code workflow tools)
│   │   ├── deep-research/
│   │   ├── grill-me/
│   │   ├── handoff/
│   │   ├── write-a-skill/
│   │   └── writing-great-skills/
│   ├── misc/                                    (specialist domains: frontend, backend, languages, security, ml, mobile, devops, data)
│   └── ...
├── scripts/                                    (check, audit, install)
│   ├── check-portable.sh      (hardcoded path lint)
│   ├── check-skill-structure.sh (write-a-skill compliance)
│   ├── audit-skill.sh         (single-skill audit)
│   ├── pre-commit.sh          (runs all before commit)
│   ├── install-hooks.sh       (installs pre-commit hook)
│   └── audit-skill.sh         (single-skill audit)
├── docs/                                       (architecture, extraction criteria, anti-hardcoded)
│   ├── architecture.md        (overall layout)
│   ├── skills/extraction-criteria.md
│   └── skills/anti-hardcoded-pattern.md
├── .scratch/out-of-scope/                       (boundary notes — what repo does NOT do)
│   ├── agent-boundaries.md
│   ├── orchestration-boundaries.md
│   ├── skill-placement-boundaries.md
│   ├── docs-and-research-boundaries.md
│   └── ...
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

# Audit any skill
./scripts/audit-skill.sh skills/engineering/skill-author

# Audit any skill
./scripts/audit-skill.sh skills/engineering/skill-author
```

## How to add a new skill

1. Decide: pipeline-level (here) or extractable (own repo)? See [docs/skills/extraction-criteria.md](docs/skills/extraction-criteria.md).
2. Load: **write-a-skill** + **skill-author**
3. Pick the right bucket:
   - `skills/engineering/` — pipeline/daily code-work skills (with sub-dirs: `planning/`, `design/`, `quality/`, `workflow/`)
   - `skills/productivity/` — non-code workflow tools (documents, research, handoffs, skill authoring)
   - `skills/misc/<domain>/` — specialist skills grouped by domain (`frontend`, `backend`, `languages`, `workflow`, `security`, `ml`, `mobile`, `devops`)
4. Create `skills/<bucket>/skill-name/` with `SKILL.md` (≤100 lines) + optional `REFERENCE.md`
5. Update the bucket `README.md` (and `skills/misc/README.md` for misc sub-domains)
6. Run `./scripts/audit-skill.sh skills/path/to/skill` to verify
7. Pre-commit hook catches hardcoded paths + structural issues

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

## Reference

- [AGENTS.md](AGENTS.md) — agent-facing context (rules, conventions)
- [docs/architecture.md](docs/architecture.md) — overall layout
- [.scratch/out-of-scope/](.scratch/out-of-scope/README.md) — boundary decisions (what this repo does NOT do)
- [docs/skills/extraction-criteria.md](docs/skills/extraction-criteria.md) — when to extract
- [docs/skills/anti-hardcoded-pattern.md](docs/skills/anti-hardcoded-pattern.md) — portability
- **write-a-skill** — skill structure principles (load before creating skills)
- **skill-author** — meta-skill for creating skills

## License

This is personal dotfiles / workflow setup. Not for public distribution as a whole. Individual skills may be extracted for distribution (see extraction criteria).

## Skill compliance

104 active skills pass write-a-skill compliance. Personal/in-progress/deprecated excluded by design. 0 failed.

Last skill merge: 2026-07-09 — 32 framework + language skills merged into 10 (net -22). 6 generic skills recategorized from misc/ to engineering/. SKILL.md average: 27 lines. See [AGENTS.md § Maintenance](AGENTS.md#maintenance) for the pattern.

Compliance is enforced by:
- `scripts/check-skill-structure.sh` (pre-commit, runs automatically)
- `scripts/audit-skill.sh <skill-path>` (manual single-skill audit)
