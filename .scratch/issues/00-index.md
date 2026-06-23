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
| 06 | [Stuck-loop detection mechanism](./06-stuck-loop-detection.md) | Skipped (YAGNI) | 17, 18 | 0.1% frequency, 8 rules already cover it |
| 07 | [URL cache + scout rate-limiting + batch](./07-url-cache-scout-batching.md) | Done | 19, 20, 21 | Implemented in `15ff44c` |
| 08 | [Pass skill context in subagent delegations](./08-skill-context-delegation.md) | Done | 7, 8 | Delegation Protocol format added to orchestrator.md |
| 09 | [Skill intent-based triggers — fixed](./09-skill-intent-triggers.md) | Done | 5, 22, 23, 24 | ROUTING TABLE added to impeccable SKILL.md |
| 10 | [Skip browser-qa for tiny diffs — ponytail cut](./10-skip-qa-tiny-diffs.md) | Done | 15 | Implemented in `45d02ea` (1 row in ship gate table) |
| 11 | [Default humanizer + caveman for prose writing](./11-humanizer-default-prose.md) | Done | 26 | humanizer added to skill_triggers (27 keywords) + Quick Reference in SKILL.md + builder/orchestrator prose-default rule |
| 12 | [Auto-extract docx styleId mapping on first edit](./12-docx-styleid-auto-extract.md) | New | — | 3x hit, caused 4-session TOC fix. Ponytail: 5-line bash + design.md cache |
| 13 | [Numbering safety — never raw-set numbering.xml](./13-numbering-safety.md) | New | — | 4x hit, 1x data loss. Ponytail: 1 rule + validate + snapshot |
| 14 | [Subagent lessons persistence via OpenViking](./14-subagent-lessons-persistence.md) | New | — | 3x user re-typed 11 rules. BIGGEST impact. Ponytail: extend openviking PROTOCOL |
| 15 | [Cell-by-cell table verification pattern](./15-cell-by-cell-table.md) | New | — | 3x hit, 3-iteration table styling. Ponytail: 1 query + self-review |
| 16 | [Sentence length guard against over-correction](./16-sentence-length-guard.md) | New | — | 30% sents < 8w. Ponytail: extend humanizer with 15-25 target |
| 17 | [SQL code block must contain executable SQL](./17-sql-code-block-content.md) | New | — | 3 of 7 SQL blocks were 100% comments. Ponytail: 1 rule + self-review |

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
