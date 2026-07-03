# Team Handoff Quality — Reference

> Full details. See SKILL.md for template.

## Version Rules (SemVer)

| Scope | Bump | Example |
|---|---|---|
| Breaking API/behavior | major | 2.0.0 |
| New feature backwards-compatible | minor | 1.3.0 |
| Bug fix / internal refactor | patch | 1.2.1 |
| Docs/internal/unreleased | none | — |

## Changelog

### When to Update
- Periodic (every N changes / session end) → append under [Unreleased]
- Pre-release → move [Unreleased] to versioned section

### Format (Caveman Style)

```
## [Unreleased]
- Feature: invoice export PDF
- Fix: pricing discount calc
```

Rules: Terse, user-facing only, one line per change, optional prefix (Feature:, Fix:, Breaking:, Security:). Date: YYYY-MM-DD.

### What Goes In

| Type | Include? |
|---|---|
| New user-facing feature | ✅ |
| Bug fix user felt | ✅ |
| Breaking change | ✅ |
| Security fix | ✅ |
| Internal refactor | ❌ |
| Debug cleanup | ❌ |

## Team-Friendly Rules

Replace vague "done" with specifics. Link issue/PR/verification. Note env/config changes. Note BC breaks. Note manual QA gaps.

## BLOCKED

Missing verification evidence, DB/deploy change without migration/rollback, secrets exposed, breaking change without version decision.
