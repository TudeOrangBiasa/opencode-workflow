# Skill Author — Reference

Detailed guidance for creating skills that follow both **write-a-skill** principles and opencode-workflow project decisions.

---

## Frontmatter Template

```yaml
---
name: skill-name              # matches directory name
description: One-line description with "Use when..." triggers. Max 1024 chars. Third person.
---
```

**Description format**:
- Sentence 1: what the skill does
- Sentence 2: "Use when [specific triggers]"

Good:
> "Generate .drawio diagrams with style presets and routing rules. Use when user requests architecture diagrams, flowcharts, ER/UML/BPMN/C4, network topology, or any visualization."

Bad:
> "Helps with diagrams."

---

## SKILL.md body template

```markdown
# Skill Name

[One-sentence summary]

## When to use

- [trigger 1]
- [trigger 2]

## Workflow

[Step 1: short]
[Step 2: short]
[Step 3: short]

## Quick reference

[Table or short list, no long prose]

## See also

- **other-skill** — one-line description
- [REFERENCE.md](REFERENCE.md) — for details
```

---

## Decision: Inline vs Extract

Run the 5-point checklist from [extraction-criteria.md](../../docs/skills/extraction-criteria.md):

```
[ ] External deps > 4
[ ] Needs other skills
[ ] Fully automates a task
[ ] Multiple templates/patterns
[ ] Independent update cadence
```

If 3+ checked → extract to own repo. Otherwise → inline.

---

## Portability checklist

From [anti-hardcoded-pattern.md](../../docs/skills/anti-hardcoded-pattern.md):

```bash
# Good
SKILLS_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/my-skill"
KIT_DIR="${DOCUMENTS_KIT_DIR:-$HOME/.local/share/documents-kit-skills}"

# Bad
KIT_DIR="<HOME>/Workspace/ai-kit/my-skill"
```

Run `./scripts/check-portable.sh` before commit.

---

## Common mistakes to avoid

| Mistake | Fix |
|---------|-----|
| Description missing "Use when" triggers | Add specific trigger keywords |
| SKILL.md > 100 lines | Split to REFERENCE.md |
| Absolute paths in code | Use env vars + XDG defaults |
| Cross-skill reference by absolute path | Reference by skill name only |
| Time-sensitive info in SKILL.md | Use timeless language |
| "If X then Y" in prose | Extract to `scripts/` |
| Inline-header vertical lists | Use proper headings |

---

## Audit workflow

```bash
# Single skill audit
./scripts/audit-skill.sh skills/engineering/skill-author

# Project-wide check
./scripts/check-portable.sh
./scripts/check-skill-structure.sh

# Pre-commit (install once)
./scripts/install-hooks.sh
```

Audit checks:
1. SKILL.md exists and has frontmatter
2. Description has "Use when..." triggers
3. SKILL.md ≤ 100 lines
4. No hardcoded absolute paths
5. Cross-references use skill name (not absolute paths)
6. No time-sensitive info (dates, version refs)

---

## Extract workflow

When a skill qualifies for extraction:

1. Create new repo (e.g., `documents-kit-skills`)
2. Structure:
   ```
   documents-kit-skills/
   ├── README.md
   ├── install.sh          ← curl-friendly public installer
   ├── setup.sh            ← local setup (for testing)
   ├── skills/<skill-name>/
   │   ├── SKILL.md
   │   └── REFERENCE.md
   ├── scripts/             ← utility scripts
   ├── presets/             ← design tokens (if any)
   ├── diagrams/            ← templates (if any)
   └── docs/                ← architecture, decisions
   ```
3. In opencode-workflow:
   - Create `skills/personal/<package-name>/<skill-name>/` symlinks
   - Add `scripts/setup-<package-name>.sh` to create symlinks
   - Update `docs/architecture.md`

---

## Reference

- **write-a-skill** — canonical source for skill structure
- [docs/architecture.md](../../docs/architecture.md)
- [docs/skills/extraction-criteria.md](../../docs/skills/extraction-criteria.md)
- [docs/skills/anti-hardcoded-pattern.md](../../docs/skills/anti-hardcoded-pattern.md)
- [docs/architecture.md](../../docs/architecture.md)
