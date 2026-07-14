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
| 0001 | [readme-to-issues-tracker-wording](./done/0001-readme-to-issues-tracker-wording.md) | — | — | Archived (orphan, not in 01-18 series) |
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
| 12 | [Auto-extract docx styleId mapping on first edit](./done/12-docx-styleid-auto-extract.md) | Done (by skill) | — | Resolved by `document-writing` skill §3 Phase 2 + §6 anti-pattern #1 |
| 13 | [Numbering safety — never raw-set numbering.xml](./done/13-numbering-safety.md) | Done (by skill) | — | Resolved by `document-writing` skill §3 Phase 4 + §6 anti-pattern #2 + §9 checklist |
| 14 | [Subagent lessons persistence via OpenViking](./14-subagent-lessons-persistence.md) | **Done (P0, verified)** | — | Implemented + verified via live test. **CRITICAL FIX**: replaced hallucinated `ov remember` command with real `ov add-memory`. `viking://agent/...` is READ-ONLY. P0 of Issue 18 |
| 15 | [Cell-by-cell table verification pattern](./done/15-cell-by-cell-table.md) | Done (by skill) | — | Resolved by `document-writing` skill §6 anti-pattern #6 + §9 checklist |
| 16 | [Sentence length guard against over-correction](./done/16-sentence-length-guard.md) | Done (by skill) | — | Resolved by `document-writing` skill §5 rule 7 + Issue 11 humanizer |
| 17 | [SQL code block must contain executable SQL](./done/17-sql-code-block-content.md) | Done (by skill) | — | Resolved by `document-writing` skill §6 anti-pattern #9 + §9 checklist |
| 18 | [Self-Learning via Memory + Dreaming](./18-self-learning-memory-dreaming.md) | Done (P0+P1+P2) | — | Shipped in `b7a764d`. P1 = `memory-dreaming` skill 95 lines, 2-phase (YAGNI-cut from 4-phase spec). P2 = 1 orchestrator line (broad `ov find` query, covers all subagent namespaces). P0 leftover = `ov remember` hallucination killed in orchestrator (4 sites). **Visual memory (v1.5)** = OpenViking VLM (Gemini via 9router) for image indexing, deferred. Live test: skill correctly returns 11 entries / 0 dupes / honest "no action needed" |
| 003 | [Design Slop Framework (master)](./done/003-design-slop-framework.md) | **Done (3/3 sub-issues)** | 003a → 003b → 003c | CommandCode /design reverse engineering. 7-surface patterns, taste bootstrap, ban consolidation. All sub-issues executed. |
| 003a | [CORE — surface + taste](./done/003a-design-slop-core.md) | Done | — | 10/10 AC pass. surface-patterns.md + taste-bootstrap.md created. 7 files edited. |
| 003b | [SMELL — ban consolidation](./done/003b-design-slop-smell.md) | Done | — | 2/2 AC pass. 3 bans added to SKILL.md. audit.md tells updated. |
| 002 | [Taste Plugin — auto-learn coding preferences](./done/002-taste-plugin.md) | **Done** | — | taste.ts + taste.test.ts (36/36 pass). Extracts preferences from user messages via 6 regex patterns, stores in OpenViking with confidence scores, injects into system prompt, KL divergence filter for common conventions. |
| 003c | ~~EMIL — animate delegation~~ | **Done (superseded)** | — | Achieved via restructure: impeccable+emil → /design. animate.md = emil content natively |
| 20 | [Setup-matt-pocock-skills revamp for meta-repo](./20-setup-matt-pocock-revamp.md) | **Done** | A→D→C→B→E | setup-matt-pocock-skills SKILL.md+REFERENCE.md revamp with meta-repo mode, AGENTS.md block, triage labels senior scheme, domain/design split, bucket README links (renamed to `agent-config` 2026-07-14) |
| 19 | [Taste + Lesson-Injector Plugins — Archived](./done/19-taste-lesson-injector-plugins.md) | **Archived** | — | Both plugins tested, TS→JS compile + runtime instability. Taste KL divergence filter unreliable. Lesson-injector redundant with `ov find` + `memory-dreaming`. Removed from opencode.json |
| 21 | [Design Skill Merge P1 — Foundation](./21-design-skill-merge-p1.md) | **Done** | — | SKILL.md routing, merged design laws, bans, Emil animate, truthful completion, scope gate, persona mode |
| 22 | [Design Skill Merge P2 — New Tools](./22-design-skill-merge-p2.md) | **Done** | — | 15 new ref files: checkup/smell/review/deslop/motion/interaction/responsive/voice/access |
| 23 | [Design Skill Merge P3 — Integration](./23-design-skill-merge-p3.md) | **Done** | — | Report workflow, auto-handoff, brief sufficiency, persona enforce |

## Pending Issues

_(none — all resolved)_

## Recently Done

| # | Title | Type | Status |
|---|-------|------|--------|
| — | _26, 27, 30 moved to done/_ | — | See table below |

## Done (moved from inbox)

| # | Title | File |
|---|-------|------|
| 26 | Advisor Judge Runtime — Spec | [done/26-...](done/26-advisor-judge-spec.md) |
| 27 | Advisor Judge Runtime — Tickets | [done/27-...](done/27-advisor-judge-tickets.md) |
| 28 | Skill Triggers Optimization — Spec | [done/28-...](done/28-skill-triggers-optimization-spec.md) |
| 29 | Skill Triggers Optimization — Tickets | [done/29-...](done/29-skill-triggers-tickets.md) |
| 30 | Fix Design Categorization | [done/30-...](done/30-design-categorization-ticket.md) |

## Archived / YAGNI

| # | Title | Type | Status |
|---|-------|------|--------|
| 24 | [Hashline Edit — Spec](done/24-hashline-edit-spec.md) | Spec | YAGNI — token savings not worth TS impl cost |
| 25 | [Hashline Edit — Tickets](done/25-hashline-edit-tickets.md) | Tickets | YAGNI — same as #24 |

## Dependency Graph

```
02 (pre-flight) → 03 (smart fallback)
04 (re-snapshot) → 05 (mandatory QA) → 10 (skip tiny QA)

01 (verify)  — independent
06 (loops)   — independent
07 (scout)   — independent
08 (context) — independent
09 (triggers)— independent

003a → 003b (sequential, surface framework first)
003c = DONE (superseded by restructure)

21 → 22 → 23 (sequential, design skill merge phases)

PENDING:
004 (Wiring — depends on 001 + 002 + 003, all done now → unblocked)
```

## New Issue Dependencies

```
30 (design fix) — DONE ✓
24 → 25 (hashline) — YAGNI, archived
26 → 27 (advisor judge) — DONE ✓

28 → 29 (skill triggers: spec → tickets) — DONE ✓ (2026-07-14: 5 triggers added, openviking trimmed)
```

## Priority Order (New Issues)

**Phase 0 (done)**:
30. Fix design categorization ✅
24 → 25. Hashline Edit — YAGNI, archived

**Phase 1 (high impact, low risk)**:
26 → 27. Advisor Judge Runtime — solves reviewer pain, auto-quality gate

**Phase 2 (medium impact)**:
28 → 29. Skill Triggers Optimization — DONE ✓ (5 triggers added, openviking trimmed)

**Phase 1 (verify existing, low risk)**:
1. Issue 01 — verify OpenViking protocol works
2. Issue 09 — verify impeccable triggers complete
3. Issue 08 — verify skill context delegation

**Phase 2 (high impact, AFK)**:
4. ~~Issue 02 — OfficeCLI pre-flight~~ _(moot — documents-kit removed)_
5. ~~Issue 04 — Browser-QA re-snapshot~~ _(moot — QA in reviewer)_
6. ~~Issue 03 — OfficeCLI smart fallback~~ _(moot — documents-kit removed)_

**Phase 3 (medium impact, AFK)**:
7. Issue 07 — Scout URL cache + rate limit

**Phase 4 (design decisions, HITL)**:
8. Issue 05 — Mandatory QA framework
9. Issue 10 — Skip QA for tiny diffs
10. Issue 06 — Stuck-loop detection mechanism

**Phase 5 (design slop, AFK)**:
11. 003a — Surface framework + taste bootstrap (CORE)
12. 003b — Ban consolidation (SMELL)
13. ~~003c~~ — Animate delegation to emil — DONE (superseded by restructure)
