---
name: skill-author
description: Meta-skill: create, audit, validate skills. Bundles write-a-skill principles with extraction criteria. Use when user says "create skill", "audit skill", or asks where to add it.
---

# Skill Author

Meta-skill for authoring other skills. Combines the general **write-a-skill** principles with opencode-workflow project decisions.

## When to use

- Creating a new skill (decide where: inline vs extract)
- Auditing an existing skill
- Validating skill structure before commit
- Reviewing a skill for portability

## Workflow

```
1. PLAN    → Decide inline vs extract (5-point checklist)
2. CREATE  → Write SKILL.md (≤100 lines) + optional REFERENCE.md
3. AUDIT   → Run scripts/audit-skill.sh
4. COMMIT  → Pre-commit hook runs portability + structure checks
```

## Decision: where does the skill live?

Inline (in opencode-workflow) if:
- 0-2 of the extraction criteria
- Pipeline-level (manages other skills/agents)
- Personal setup (not for distribution)

Extract (own repo) if:
- 3+ of the extraction criteria
- Has 4+ external dependencies
- Fully automates a task
- Multiple patterns/templates
- Independent update cadence

See [extraction-criteria](../../docs/skills/extraction-criteria.md) for the full checklist.

## SKILL.md structure (from write-a-skill)

Frontmatter (required):
- `name` — matches directory name
- `description` — first line, max 1024 chars, must contain "Use when..." triggers

Body (≤ 100 lines):
- Quick start or workflow
- Triggers / when to use
- Reference to deeper docs (REFERENCE.md or external)

See **write-a-skill** for full principles.

## What to avoid

- "If X then Y" English if-statements → extract to `scripts/` (deterministic)
- Hardcoded absolute paths → use env vars + XDG conventions
- Time-sensitive info (dates, version refs) → keep docs timeless
- > 100 lines in SKILL.md → split detail to REFERENCE.md
- Inline-header vertical lists → use proper headings

## Tools to run

```bash
# Audit a skill
./scripts/audit-skill.sh skills/engineering/skill-author

# Check structure compliance
./scripts/check-skill-structure.sh

# Install pre-commit hook (one-time)
./scripts/install-hooks.sh
```

## Reference

- **write-a-skill** — canonical skill structure principles
- [docs/architecture.md](../../docs/architecture.md) — overall layout
- [docs/skills/extraction-criteria.md](../../docs/skills/extraction-criteria.md) — when to extract
- [docs/skills/anti-hardcoded-pattern.md](../../docs/skills/anti-hardcoded-pattern.md) — portability rules

