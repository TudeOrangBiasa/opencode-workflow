# Writing Skills — Reference

> Full process, description requirements, and checklist. See SKILL.md for quick start.

## Process

1. **Gather requirements** — ask user about task/domain, use cases, need for scripts, reference materials.
2. **Classify as deterministic or judgement** — deterministic = script work (file ops, fixed commands); judgement = LLM context (ambiguous intent, design tradeoffs). Rule of thumb: if it can be expressed as "If [condition] then [command]", extract to script.
3. **Draft** — SKILL.md, REFERENCE.md if content > 500 lines, scripts if needed.
4. **Review with user** — coverage, clarity, detail level.

## Skill Structure

```
skill-name/
├── SKILL.md       # Main instructions (required)
├── REFERENCE.md   # Detailed docs (if needed)
├── EXAMPLES.md    # Usage examples (if needed)
└── scripts/       # Utility scripts (if needed)
```

## Description Requirements

Max 1024 chars. Third person. First sentence: what it does. Second sentence: "Use when [specific triggers]".

**Good:** `Extract text and tables from PDF files. Use when working with PDF files or user mentions PDFs.`
**Bad:** `Helps with documents.`

## When to Add Scripts

Default: extract deterministic logic to a script. Skill stays a thin dispatcher; script does the work.

| Skill says (anti-pattern) | Should be |
|---|---|
| "If AGENTS.md exists, edit it. If not, create it." | `test -f AGENTS.md && edit || create` in script |
| "If design.md is present, read it" | Script: emit JSON {design_md: "path-or-null"} |
| "Run pandoc with these flags, or --csl if CSL exists" | Script: discover_format() returns flag set |

When NOT to script: judgement-heavy decisions (approach, design, phrasing).

## When to Split Files

SKILL.md exceeds 100 lines, distinct domains (finance vs sales schemas), advanced features rarely needed.

## Review Checklist

- [ ] Description includes triggers ("Use when...")
- [ ] SKILL.md under 100 lines
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples included
- [ ] References one level deep
- [ ] No English if-statements for checkable conditions
- [ ] Deterministic work in scripts, not prose

## SKILL.md Template

```md
---
name: skill-name
description: Brief capability description. Use when [triggers].
---

# Skill Name

## Quick start

[Minimal working example]

## Workflows

[Step-by-step checklists]

## Advanced features

See [REFERENCE.md](REFERENCE.md)
```
