---
title: "Fix drawio skill — add PlantUML preference + first-use test"
status: open
priority: high
labels: ["fix", "drawio", "tool-misuse"]
created: 2026-07-11
source: "aggregation from 5 eval reports — 1 HIGH fail finding"
---

## Problem

drawio tool required 6 consecutive fix commits for diagram rendering: duplicate IDs, layout overlap, sequence diagrams wrong, class/ERD broken. Final commit abandoned drawio for PlantUML.

## Root Cause

drawio skill (`skills/productivity/documents-kit/skills/drawio/`) doesn't warn about known rendering limitations. Agent commits to drawio for complex layouts when PlantUML would be more reliable.

## Fix

Add to drawio SKILL.md or SKILL.md reference:

1. **First-use test**: "Before committing to drawio for complex diagrams, test render on first shape. If layout broken, switch to PlantUML."
2. **Complexity gate**: "For class diagrams, ERDs, or multi-layer layouts: prefer PlantUML over drawio. drawio is for simple flowcharts and wireframes."
3. **PlantUML fallback**: Link to PlantUML skill or instructions.

## Success Criteria

- drawio SKILL.md updated with complexity gate + PlantUML fallback
- Next diagram session uses PlantUML for complex layouts first time

## Related

- `.scratch/evals/2026-06-25-itfest-nusacommodity.md`
