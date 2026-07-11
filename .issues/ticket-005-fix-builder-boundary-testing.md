---
title: "Fix builder process — add boundary case testing before fix commits"
status: open
priority: high
labels: ["fix", "builder", "stuck-pattern"]
created: 2026-07-11
source: "aggregation from 5 eval reports — 1 HIGH fail, 3 MEDIUM warn findings"
---

## Problem

builder shows repeated pattern of shallow fixes that break on edge cases:

- **Search fix broke, had to revert** (HIGH): "Fix search by doctor name" was wrong, reverted, re-fixed with different approach.
- **Null handling blind spot** (MEDIUM): Consistent failure to handle null returns across multiple models.
- **AI slop in comments** (MEDIUM): Generated comments needed 2 cleanup passes.
- **Dev setup failures** (MEDIUM): Docker, pnpm config broke on first try.

## Root Cause

builder skill (`agents/builder.md`) has no boundary case testing requirement. Agent ships fix without testing edge cases (empty search, partial match, no results, null return).

## Fix

Add to builder.md self-review checklist:

1. **Boundary case testing**: Before committing any fix, test minimum 3 cases: happy path, empty/null, edge/overflow. Document in commit message.
2. **Null protocol**: Assume every external API field can return null. Add null check in all model constructors.
3. **Comment hygiene**: Enable ponytail mode for comments by default. Strip AI tells at generation time.

## Success Criteria

- builder.md self-review checklist updated with boundary case item
- Next eval on builder sessions shows no HIGH stuck-pattern findings

## Related

- `agents/builder.md` (line 29-32: self-review checklist)
- `.scratch/evals/2026-07-01-pweb-swarakarna.md`
- `.scratch/evals/2026-07-05-scholar-paper-mcp.md`
