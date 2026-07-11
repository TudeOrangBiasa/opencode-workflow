---
title: "Fix prototype skill — add research timebox + concept commitment"
status: open
priority: high
labels: ["fix", "prototype", "scope-drift"]
created: 2026-07-11
source: "aggregation from 5 eval reports — 2 HIGH fail findings"
---

## Problem

Two HIGH findings from different projects (geopredict, itfest) show same pattern: research over shipping, pivots without validation.

- **Research paralysis**: 690-line research doc, 7 commits code. Agent spent time on deep research (weather models, satellite) instead of building prototype.
- **3 pivots, zero code**: PanganTrace v1 → v2 → NusaCommodity. Each pivot discards all work. No prototype built before next pivot.

## Root Cause

prototype skill (`skills/engineering/workflow/prototype/`) has no timebox rule or concept commitment gate. Agent defaults to open-ended research + unvalidated pivots.

## Fix

Add to prototype SKILL.md:

1. **Research timebox**: Max 2 hours research before building. Research doc must fit in one file <200 lines.
2. **Concept commitment gate**: Before pivoting, list what existing code can be salvaged. Must build prototype before decision to pivot.
3. **Pivot protocol**: "Validate current direction before switching. One concept after 1 day research max."

## Success Criteria

- prototype SKILL.md updated with timebox + commitment rules
- Next eval on prototype-adjacent session shows no HIGH scope-drift findings

## Related

- `.scratch/evals/2026-06-15-geopredict-omnirelief.md`
- `.scratch/evals/2026-06-25-itfest-nusacommodity.md`
