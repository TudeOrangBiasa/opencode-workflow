# Issues Index — OpenCode Workflow Pain Points

10 vertical slices derived from `.scratch/prd-workflow-pain-points.md`.

Since GitHub issues are disabled on this repo, these are saved as local files. When issues are re-enabled, run:

```bash
for f in .scratch/issues/*.md; do
  gh issue create --title "$(head -1 "$f" | sed 's/^# //')" \
    --body-file "$f" \
    --label "ready-for-agent"
done
```

## Issues

| # | Title | Type | Stories | Status |
|---|-------|------|---------|--------|
| 01 | [OpenViking memory protocol — fixed](./01-openviking-memory-protocol.md) | Done | 1, 2, 3, 4 | Skill added to skill_triggers + protocol in SKILL.md |
| 02 | [OfficeCLI pre-flight + .NET dep check](./02-officecli-preflight.md) | Done | 25, 11 | Implemented in `8a8cd80` |
| 03 | [OfficeCLI smart fallback (skill auto-load)](./03-officecli-smart-fallback.md) | Done | 6, 9, 10, 26, 27 | Implemented in `8a8cd80` |
| 04 | [Browser-QA re-snapshot on click failure](./04-browser-qa-resnapshot.md) | Done | 12, 13 | Implemented in `8a8cd80` |
| 05 | [Ship verification gate — UI + Docs](./05-browser-qa-mandatory.md) | Done | 14, 16 | Implemented in `9f9524c` (ship gate) |
| 06 | [Stuck-loop detection mechanism](./06-stuck-loop-detection.md) | HITL | 17, 18 | New |
| 07 | [URL cache + scout rate-limiting + batch](./07-url-cache-scout-batching.md) | Done | 19, 20, 21 | Implemented in `15ff44c` |
| 08 | [Pass skill context in subagent delegations](./08-skill-context-delegation.md) | Done | 7, 8 | Delegation Protocol format added to orchestrator.md |
| 09 | [Skill intent-based triggers — fixed](./09-skill-intent-triggers.md) | Done | 5, 22, 23, 24 | ROUTING TABLE added to impeccable SKILL.md |
| 10 | [Skip browser-qa for tiny diffs — ponytail cut](./10-skip-qa-tiny-diffs.md) | Done | 15 | Implemented in `45d02ea` (1 row in ship gate table) |

## Dependency Graph

```
02 (pre-flight) → 03 (smart fallback)
04 (re-snapshot) → 05 (mandatory QA) → 10 (skip tiny QA)

01 (verify)  — independent
06 (loops)   — independent
07 (scout)   — independent
08 (context) — independent
09 (triggers)— independent
```

## Priority Order

**Phase 1 (verify existing, low risk)**:
1. Issue 01 — verify OpenViking protocol works
2. Issue 09 — verify impeccable triggers complete
3. Issue 08 — verify skill context delegation

**Phase 2 (high impact, AFK)**:
4. Issue 02 — OfficeCLI pre-flight (unblocks 5+ errors)
5. Issue 04 — Browser-QA re-snapshot (unblocks 16 errors)
6. Issue 03 — OfficeCLI smart fallback (kills 314 bash workarounds)

**Phase 3 (medium impact, AFK)**:
7. Issue 07 — Scout URL cache + rate limit

**Phase 4 (design decisions, HITL)**:
8. Issue 05 — Mandatory QA framework
9. Issue 10 — Skip QA for tiny diffs
10. Issue 06 — Stuck-loop detection mechanism
