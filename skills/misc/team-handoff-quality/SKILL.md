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

## Changelog

### When to Update

| Trigger | Action |
|---------|--------|
| Periodic (every N changes / session end) | Append entries to `CHANGELOG.md` under `[Unreleased]` |
| Pre-release | Move `[Unreleased]` entries to versioned section, bump version |

### Format (Caveman Style)

```markdown
# Changelog

## [Unreleased]
- Feature: invoice export PDF
- Fix: pricing discount calc
- Checkout: 4 steps → 2

## [1.2.0] - 2026-06-15
- Feature: multi-currency support
- Feature: PDF export
- Fix: pricing discount calc
- Checkout: 4 steps → 2

## [1.1.0] - 2026-06-10
- Feature: dark mode
- Fix: login redirect loop
```

Rules:
- Terse, no fluff. Caveman style.
- User-facing only. No internal refactor, no debug cleanup.
- One line per change. No paragraphs.
- Prefix: `Feature:`, `Fix:`, `Breaking:`, `Security:` (optional, use only when clarifying)
- Date format: `YYYY-MM-DD`

### File Location

```
CHANGELOG.md  (project root)
```

Not in `.scratch/` — changelog is a first-class project artifact, not temporary.

### What Goes In

| Type | Include? | Example |
|------|----------|---------|
| New user-facing feature | ✅ | `Feature: invoice PDF export` |
| Bug fix user felt | ✅ | `Fix: pricing calc wrong on discount` |
| Breaking change | ✅ | `Breaking: API v1 removed, use v2` |
| Security fix | ✅ | `Security: XSS in comment field` |
| Internal refactor | ❌ | (git log only) |
| Debug cleanup | ❌ | (git log only) |
| Docs update | ❌ | (git log only) |
| Dependency bump | ❌ | (git log only) |
| CI/CD change | ❌ | (git log only) |

### Dual-Layer for Agents

Agents can read `CHANGELOG.md` directly — it's terse enough for context window. For detailed context, agent reads git log for specific version tag.

```bash
# Agent wants detail for v1.2.0
git log v1.1.0..v1.2.0 --oneline
```

Changelog = summary for humans + quick-parse for agents. Git log = detail when needed.

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
