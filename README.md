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
├── .opencode/plugins/                          (active OpenCode plugins)
│   ├── repair-harness.ts       (tool call repair — 4 patterns)
│   ├── taste.ts                (preference extraction → OpenViking)
│   ├── lesson-injector.ts      (past-lesson injection into system prompt)
│   └── ov-helper.ts            (shared ov CLI wrapper)
├── skills/                                     (pipeline + symlinks)
│   ├── engineering/                             (pipeline skills)
│   │   ├── planning/                            (PRD, issues, triage)
│   │   ├── design/                              (UI design, architecture review, grilling)
│   │   ├── quality/                             (review, TDD, diagnose, ponytail)
│   │   └── workflow/                            (prototype, memory, setup, skill-author, zoom-out)
│   ├── personal/documents-kit-skills/           (symlink to external, 10 skills)
│   │   ├── document-format/        (symlink)
│   │   ├── document-writing/       (symlink)
│   │   ├── documents-kit/          (symlink)
│   │   ├── drawio/                 (symlink)
│   │   ├── humanizer/              (symlink)
│   │   ├── officecli/              (symlink)
│   │   ├── pdf-export/             (symlink)
│   │   ├── report-to-deck/         (symlink)
│   │   ├── scaffold-doc/           (symlink)
│   │   └── storytelling/           (symlink)
│   ├── personal/workflow/                         (personal workflow skills)
│   │   ├── dev-workflow/
│   │   ├── eval/
│   │   ├── idea-fragments/
│   │   └── workflow-audit/
│   ├── personal/tools/                            (personal tools)
│   │   ├── ddev/
│   │   └── openviking/
│   ├── productivity/                             (daily non-code workflow tools)
│   ├── misc/                                      (specialist domains: frontend, backend, languages, workflow, security, ml, mobile, devops)
│   └── ...
├── documents-kit/                               (symlinks to documents-kit-skills assets)
│   ├── templates/    (paper, presentation, report, thesis)
│   ├── presets/      (drawio-styles, hackathon-energetic, material-light, storytelling-fallback)
│   ├── diagrams/     (architecture, aws-3-tier, c4-context, erd, flowchart, microservices, network, org-chart, sequence, uml-class, venn, bpmn, …)
│   └── examples/
├── scripts/                                    (check, audit, install)
│   ├── check-portable.sh      (hardcoded path lint)
│   ├── check-skill-structure.sh (write-a-skill compliance)
│   ├── audit-skill.sh         (single-skill audit)
│   ├── pre-commit.sh          (runs all before commit)
│   ├── install-hooks.sh       (installs pre-commit hook)
│   └── setup-documents-kit.sh (creates documents-kit symlinks)
├── tools/                                      (symlinks to documents-kit-skills glue scripts)
│   ├── __init__.py
│   ├── officecli_helper.py
│   ├── officecli_numbering.py
│   ├── pandoc_citeproc.py
│   ├── scholar_bibtex.py
│   ├── documents_kit.py
│   ├── export_pdf.py
│   ├── new_document.py
│   ├── fetch_drawio_template.py
│   ├── report_to_deck.py
│   ├── storytelling_pptx.py
│   ├── asset-validator.sh
│   ├── doc-audit-pipeline.sh
│   ├── pdf-from-docx.sh
│   └── tests/
│   ├── architecture.md        (overall layout)
│   ├── skills/extraction-criteria.md
│   ├── skills/anti-hardcoded-pattern.md
│   └── integrations/documents-kit.md
├── .out-of-scope/                              (boundary notes — what repo does NOT do)
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

# Set up documents-kit-skills (10 skills + 15 tools + templates/presets/diagrams/examples assets)
./scripts/setup-documents-kit.sh

# Audit any skill
./scripts/audit-skill.sh skills/engineering/skill-author
```

## How to add a new skill

1. Decide: pipeline-level (here) or extractable (own repo)? See [docs/skills/extraction-criteria.md](docs/skills/extraction-criteria.md).
2. Load: **write-a-skill** + **skill-author**
3. Pick the right bucket:
   - `skills/engineering/` — pipeline/daily code-work skills (with sub-dirs: `planning/`, `design/`, `quality/`, `workflow/`)
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
| `setup-documents-kit.sh` | Create documents-kit symlinks |

## OpenCode Plugins (`.opencode/plugins/`)

Runtime plugins that intercept OpenCode hooks for reliability and personalization:

| Plugin | Tests | Lines | Role |
|--------|-------|-------|------|
| `repair-harness` | 81 | 209 | Intercepts malformed tool args, fixes via 4 deterministic patterns (null drop, JSON parse, markdown strip, array wrap). Auto-disables per-tool when repair rate stabilizes. Kill switch: `REPAIR_HARNESS=off`. |
| `taste` | 34 | 332 | Extracts user preferences from messages (patterns, convention, category) and persists to OpenViking via `ov add-memory`. KL divergence filter for common conventions. |
| `lesson-injector` | 21 | 129 | Fetches past lessons via `ov find` and injects into system prompt. Session cache with 30-min TTL. |
| `ov-helper` | — | 30 | Shared `ovFindJson()` helper — async `Bun.spawn` wrapper for `ov find -o json`. |

All plugins pass **136 tests** (0 fail), **tsc --noEmit clean** (0 errors). Developed via TDD + ponytail across 13 issues (19–31). Per-issue atomic commits.

## Reference

- [AGENTS.md](AGENTS.md) — agent-facing context (rules, conventions)
- [docs/architecture.md](docs/architecture.md) — overall layout
- [.out-of-scope/](.out-of-scope/README.md) — boundary decisions (what this repo does NOT do)
- [docs/skills/extraction-criteria.md](docs/skills/extraction-criteria.md) — when to extract
- [docs/skills/anti-hardcoded-pattern.md](docs/skills/anti-hardcoded-pattern.md) — portability
- [docs/integrations/documents-kit.md](docs/integrations/documents-kit.md) — example integration
- [DOCUMENTS_KIT.md](docs/DOCUMENTS_KIT.md) — documents-kit integration details
- **write-a-skill** — skill structure principles (load before creating skills)
- **skill-author** — meta-skill for creating skills

## License

This is personal dotfiles / workflow setup. Not for public distribution as a whole. Individual skills may be extracted for distribution (see extraction criteria).

## Skill compliance

126/146 skills pass write-a-skill compliance. 20 are in external/personal directories (excluded by design). 0 failed.

Compliance is enforced by:
- `scripts/check-skill-structure.sh` (pre-commit, runs automatically)
- `scripts/audit-skill.sh <skill-path>` (manual single-skill audit)

Last full cleanup: 2026-06-26 — 107 violations (P1 file size + P2 missing trigger) fixed via 3 parallel builder subagents. SKILL.md average went from 377 → 27 lines; 98 new REFERENCE.md created. See [AGENTS.md § Maintenance](AGENTS.md#maintenance) for the pattern.
