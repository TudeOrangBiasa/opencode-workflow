---
title: "Fix verify-evidence gate — ensure loaded before ship in orchestrator workflow"
status: open
priority: critical
labels: ["fix", "verify-evidence", "verification-gap"]
created: 2026-07-11
source: "aggregation from 5 eval reports — 2 CRITICAL fail findings"
---

## Problem

Two CRITICAL findings: broken cetak page shipped, 10 security/data issues shipped. verify-evidence skill exists and has correct instructions, but was never loaded before ship.

This is **not a skill content problem** — verify-evidence SKILL.md + REFERENCE.md are correct. It's a **process problem**: orchestrator workflow doesn't enforce verification gate.

## Root Cause

orchestrator.md has "Verification Gate" section (line 67-75) but it's advisory — says "Load verify-evidence skill" without making it mandatory. No mechanism prevents ship without verify.

## Fix

Update orchestrator.md:

1. **Hard gate**: "Before ship/done/merge/deploy: MUST load verify-evidence. If blocked (skill unavailable), document why and get user approval to proceed."
2. **Automated trigger**: "After builder report STATUS=DONE, auto-load verify-evidence before reporting to user."
3. **No bypass**: "Only user can override this gate. Orchestrator cannot self-bypass."

## Success Criteria

- orchestrator.md verification gate changed from advisory to mandatory
- verify-evidence loaded before any "done" report
- Next eval on sessions with fixes shows 0 CRITICAL verification-gap

## Related

- `agents/orchestrator.md` (line 67-75: verification gate section)
- `.scratch/evals/2026-07-01-pweb-swarakarna.md`
- `.scratch/evals/2026-07-05-scholar-paper-mcp.md`
- `docs/engineering/self-improvement-pipeline.md`
