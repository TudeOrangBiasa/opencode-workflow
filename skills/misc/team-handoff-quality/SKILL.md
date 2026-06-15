---
name: team-handoff-quality
description: Team-ready handoff checklist for changes, verification evidence, version bump decisions, changelog entries, migration notes, rollback notes, and next-owner actions. Use when preparing work for teammates, AFK handoff, release notes, changelog updates, version management, or final delivery summaries.
---

## Output Template

```
Summary: one-line what this change does
Changed: files/areas touched
Verification: evidence per change (commands run, test output, curl results)
Risks: known side effects, edge cases not covered
Migration: steps required (DB, env, config)
Rollback: exact steps to undo
Version: major.minor.patch | minor | patch | none
Changelog: one entry per user-facing change
Next owner actions: who does what next
```

## Version Rules (SemVer)

| Scope | Bump | Example |
|-------|------|---------|
| Breaking API/behavior | major | `2.0.0` |
| New feature backwards-compatible | minor | `1.3.0` |
| Bug fix / internal refactor | patch | `1.2.1` |
| Docs/internal/unreleased | none | — |

No version bump allowed for unreleased work-in-progress. Version decision is required for any merged change.

## Changelog Categories

`Added` `Changed` `Fixed` `Removed` `Security` `Migration`

Each entry: `- Category: short description (PR/issue link)`

## Team-Friendly Rules

- Replace vague "done" with specific: what was done, how verified, what changed
- Link issue/PR/verification evidence in every handoff
- Note environment/config changes — teammates need to sync `.env.example`, php.ini, etc.
- Note backwards compatibility: "drops support for PHP 8.0" not "updated deps"
- Note manual QA gaps: things only a human can check (visual, edge cases not automated)

## BLOCKED

- Behavior change with no verification evidence
- DB/deploy change missing migration OR rollback steps
- Secrets exposed in diff or committed files
- Breaking change without version decision
