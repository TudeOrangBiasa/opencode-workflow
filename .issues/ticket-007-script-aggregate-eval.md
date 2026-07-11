---
title: "Script aggregate-eval.sh — automated YAML parsing + priority list"
status: open
priority: medium
labels: ["script", "pipeline", "automation"]
created: 2026-07-11
source: "pipeline doc TODO — manual aggregation done once, needs automation"
---

## Problem

Pipeline Step 3 (aggregate) is manual. Every aggregation requires:
1. Read 5+ YAML frontmatter files
2. Parse findings
3. Group by target + category
4. Sort by severity + verdict
5. Produce priority fix list

Currently done with ad-hoc Python script. Need reusable script that can run on any eval report set.

## Success Criteria

- `scripts/aggregate-eval.sh` exists
- Accepts optional path filter (default: `.scratch/evals/`)
- Outputs: target priority list, category distribution, top 10 fixes
- Handles 0-100 eval reports
- `--json` flag for machine-readable output

## Related

- `docs/engineering/self-improvement-pipeline.md` (line 180: "no script yet")
- `.scratch/evals/` — eval reports directory
