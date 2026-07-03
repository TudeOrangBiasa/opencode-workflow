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
├── .opencode/plugins/        ← runtime plugins loaded by OpenCode
│   ├── repair-harness.ts     ← tool-call repair (4 patterns, kill switch, auto-disable)
│   ├── taste.ts              ← preference extraction → OpenViking
│   ├── lesson-injector.ts    ← past-lesson injection into system prompt
│   └── ov-helper.ts          ← shared ov CLI wrapper
├── skills/
│   ├── engineering/          ← pipeline skills (write-a-skill, dev-workflow, etc.)
│   ├── misc/                 ← specialist domain skills
│   │   ├── backend/
│   │   ├── devops/
│   │   ├── frontend/
│   │   ├── languages/
│   │   ├── ml/
│   │   ├── mobile/
│   │   ├── security/
│   │   └── workflow/
│   ├── personal/             ← personal skills + symlinks to documents-kit-skills/
│   │   └── documents-kit-skills/   ← symlink to external package
│   │       ├── document-writing/    (symlink)
│   │       ├── drawio/              (symlink)
│   │       ├── humanizer/           (symlink)
│   │       └── officecli/           (symlink)
│   └── ...
├── tools/                    ← symlinks to documents-kit-skills glue scripts
│   ├── officecli_helper.py   (symlink)
│   ├── pandoc_citeproc.py    (symlink)
│   ├── scholar_bibtex.py     (symlink)
│   ├── asset-validator.sh    (symlink)
│   ├── doc-audit-pipeline.sh (symlink)
│   ├── pdf-from-docx.sh      (symlink)
│   ├── __init__.py           (symlink)
│   └── tests/                (symlink)
├── scripts/                  ← check-portable, check-skill-structure, audit-skill, pre-commit
├── docs/                     ← architecture, extraction-criteria, anti-hardcoded-pattern, integrations
├── .git/hooks/pre-commit     ← installed by scripts/install-hooks.sh
└── AGENTS.md / README.md     ← entry points
```

## How integration works

External skill packages integrate via symlinks + MCP registration:

```
documents-kit-skills/                              (source of truth)
  ↓ symlinks
opencode-workflow/skills/personal/documents-kit-skills/   (package folder — 4 skills)
  ↓ symlinks
~/.config/opencode/skills/                          (OpenCode global)

documents-kit-skills/tools/                         (source of truth)
  ↓ symlinks
opencode-workflow/tools/                            (glue scripts)

scholar-paper-mcp/                                  (peer dep, cloned separately)
  ↓ MCP registration in ~/.config/opencode/opencode.json
OpenCode loads 15 scholar tools at startup
```

Setup: `scripts/setup-documents-kit.sh` creates the skill + tools symlink chain. scholar-paper-mcp cloned and MCP-registered separately. See [integrations/documents-kit.md](integrations/documents-kit.md).

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
   - `engineering/` — pipeline/daily code-work skills
   - `misc/<domain>/` — specialist skills grouped by domain (`frontend`, `backend`, `languages`, `workflow`, `security`, `ml`, `mobile`, `devops`)
3. Create `skills/{bucket}/skill-name/` with `SKILL.md` + optional `REFERENCE.md`
4. If external: create repo with same structure, integrate via symlink
5. Run `./scripts/audit-skill.sh skills/path/to/skill` to verify
6. Run `./scripts/install-hooks.sh` if not already done
7. Update the bucket `README.md` (and `skills/misc/README.md` for misc sub-domains)

## Reference

- **write-a-skill** — skill structure principles (the rulebook)
- **skill-author** — meta-skill for creating new skills
- [integrations/documents-kit.md](integrations/documents-kit.md) — example integration
- [skills/extraction-criteria.md](skills/extraction-criteria.md) — when to extract
- [skills/anti-hardcoded-pattern.md](skills/anti-hardcoded-pattern.md) — portability rules
