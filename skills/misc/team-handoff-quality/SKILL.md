---
name: team-handoff-quality
description: Team-ready handoff checklist for changes, verification evidence, version bump decisions, changelog entries, migration notes, rollback notes, and next-owner actions. Use when preparing work for teammates, AFK handoff, release notes, changelog updates, version management, or final delivery summaries.
---

For full details on version rules, changelog format, and team rules, see [REFERENCE.md](REFERENCE.md).

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

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Version Rules](REFERENCE.md#version-rules-semver) | SemVer bump table |
| [Changelog](REFERENCE.md#changelog) | When to update, format, what goes in |
| [Team Rules](REFERENCE.md#team-friendly-rules) | Specificity, links, env changes |
| [BLOCKED conditions](REFERENCE.md#blocked) | When to reject a handoff |
