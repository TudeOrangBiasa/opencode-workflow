---
name: architecture
description: How opencode-workflow is structured — what lives here vs external packages, and how skills integrate. Use when asking about the overall layout, where to add new content, or how skills/packages connect.
---

# Architecture

## Role of opencode-workflow

opencode-workflow is the **personal dotfiles + workflow pipeline**. It contains:

- The AI agent's core workflow management skills (grill-with-docs, dev-workflow, memory-dreaming, etc.)
- Personal setup scripts (install, hooks, audit)
- Documentation for project decisions
- Symlinks to heavy skills that live in their own repos

## What lives here vs external

| Lives in opencode-workflow | Lives in external repo | Decision criteria |
|---------------------------|------------------------|-------------------|
| Pipeline/agent skills | Anything with 4+ external deps | Heavy = extract |
| Workflow management | Multiple templates/patterns | Multi-purpose = extract |
| Personal dotfiles | Fully automates a task | Automation = extract |
| Meta-skills (skill-author) | Used by others (OSS) | Reusable = extract |
| Documentation | | |

## Layout

```
opencode-workflow/
├── .opencode/                 ← OpenCode project config (empty placeholder)
├── skills/
│   ├── engineering/          ← pipeline skills (sub-dirs: planning, design, quality, workflow)
│   │   ├── planning/         ← to-spec, to-tickets, triage
│   │   ├── design/           ← 6 sub-skills (incl. design-skill external repo)
│   │   ├── quality/          ← code-review, tdd, diagnosing-bugs, ponytail, verify-evidence
│   │   └── workflow/         ← agent-config, canary-watch, codebase-onboarding, context-budget, deployment-patterns, dev-workflow, eval, git-workflow, github-ops, implement, memory-dreaming, prototype, search-first, skill-author, workflow-audit, zoom-out
│   ├── misc/                 ← specialist domain skills
│   │   ├── backend/
│   │   ├── devops/
│   │   ├── frontend/
│   │   ├── languages/
│   │   ├── ml/
│   │   ├── mobile/
│   │   ├── security/
│   │   └── data/
│   ├── productivity/         ← daily non-code workflow tools
│   │   ├── deep-research/
│   │   ├── grill-me/
│   │   ├── handoff/
│   │   └── write-a-skill/
│   └── ...
├── scripts/                  ← check-portable, check-skill-structure, audit-skill, pre-commit
├── docs/                     ← architecture, extraction-criteria, anti-hardcoded-pattern
├── .git/hooks/pre-commit     ← installed by scripts/install-hooks.sh
└── AGENTS.md / README.md     ← entry points
```

## How integration works

External skill packages integrate via symlinks + MCP registration. All config MUST go through `opencode-workflow` first, never direct to `~/.config/opencode/`.

OpenCode scans 1 level deep per path. `opencode.json` defines multiple leaf paths matching bucket structure (one per sub-bucket with skills). `link-skills.sh` manages this on install/update. See [AGENTS.md](../AGENTS.md) for the full policy.

Setup: `scripts/link-skills.sh` creates categorized symlinks in `~/.config/opencode/`.

## When to extract a skill

If a skill:
- Has 4+ external dependencies (MCP, CLI, libs)
- Needs additional skills to function (composition)
- Fully automates a task (not just a helper)
- Has multiple patterns/templates
- Updates frequently independent of the workflow

→ Extract to its own repo, integrate via symlink + setup script.

See [skills/extraction-criteria.md](skills/extraction-criteria.md) for the full checklist.

## How to add a new skill

1. Decide: pipeline-level (here) or extractable (own repo)? See above.
2. If here, pick the right bucket:
   - `engineering/` — pipeline/daily code-work skills (sub-dirs: `planning/`, `design/`, `quality/`, `workflow/`)
   - `productivity/` — non-code workflow tools (documents, research, handoffs, skill authoring)
   - `misc/<domain>/` — specialist skills grouped by domain (`frontend`, `backend`, `languages`, `workflow`, `security`, `ml`, `mobile`, `devops`)
3. Create `skills/{bucket}/skill-name/` with `SKILL.md` + optional `REFERENCE.md`
4. If external: create repo with same structure, integrate via symlink
5. Run `./scripts/audit-skill.sh skills/path/to/skill` to verify
6. Run `./scripts/install-hooks.sh` if not already done
7. Update the bucket `README.md` (and `skills/misc/README.md` for misc sub-domains)

## Reference

- **write-a-skill** — skill structure principles (the rulebook)
- **skill-author** — meta-skill for creating new skills
- design-skill — example external package
- [skills/extraction-criteria.md](skills/extraction-criteria.md) — when to extract
- [skills/anti-hardcoded-pattern.md](skills/anti-hardcoded-pattern.md) — portability rules
