# DBL-Data-Management: 3-Angle Synthesis

**Date:** 2026-06-23
**Method:** 3 parallel `explore` subagents. Each analyzed dbl-data-management sessions from one angle.
**Reports:**
- `dbl-revision-requests.md` (357 lines) — what user corrected
- `dbl-document-structure.md` (494 lines) — TOC, headings, tables, templates
- `dbl-writing-quality.md` (328 lines) — style, repetition, slop, format

**Total analyzed:** 25 sessions, 13.2M tokens, $3.74, 83 user prompts, 30 corrections detected, 2,928 prose words in final docx.

---

## Top 10 Patterns (all 3 reports agree)

| # | Pattern | Frequency | Source | Root cause |
|---|---------|-----------|--------|------------|
| 1 | Numbering corruption (numId breaks when editing other BABs) | 4x | All 3 | raw XML replace, not append |
| 2 | styleId by-name vs numeric | 3x | Structure | officecli accepts by-name but doesn't resolve to internal id |
| 3 | TOC rebuild needed | 4 sessions | Structure | Wrong style (Normal vs Heading), missing PAGEREF, title truncation |
| 4 | Table styling incomplete | 3 iterations | Structure | Spot-checked first cell only, missed the rest |
| 5 | Verbatim sentence repetition | 6 unique × 2 each | Quality | Agent summary echoes previous section verbatim |
| 6 | Choppy over-correction | 30% sents < 8w | Quality | User said "short", agent went too far |
| 7 | Data loss (BAB VI text wiped) | 1x | Revision | BAB VII edit without backup verification |
| 8 | "Don't copy-write, copy original" | 2x | Revision | Agent tried to recreate instead of using existing file |
| 9 | Code blocks as prose | 3 of 7 SQL | Quality | Prose wrapped in `--` comments, zero executable SQL |
| 10 | Lessons not preserved between subagents | 3x user repeated 11 rules | All 3 | Each subagent session starts blank |

---

## Common Root Cause

**Subagent context loss between sessions.** Each builder/reviewer subagent starts fresh, has no memory of previous sessions. The user has to re-instruct:
- 11 writing rules repeated across 3 BAB building prompts
- 4 sessions to fix TOC
- 3 sessions to fix table styling
- 2 sessions to recover from data loss

The same `ov find` + `ov remember` pattern that solved Issues 01/08/09 for the orchestrator does **not** apply to subagents. They're forked fresh.

---

## Concrete Issues to Create (ponytail cuts)

| # | Title | Ponytail cut | Source pattern |
|---|-------|-------------|----------------|
| 12 | Auto-extract docx styleId mapping on first edit | 5-line bash + design.md auto-update | #2, #3 |
| 13 | Numbering safety: never raw-set numbering.xml | 1 rule in builder.md + officecli validate after every doc edit | #1, #7 |
| 14 | Subagent lessons persistence via OpenViking | Extend openviking PROTOCOL step 3 + add subagent-ov-find rule | #10 (biggest impact) |
| 15 | Cell-by-cell table verification pattern | 1 officecli query line + builder self-review checklist | #4 |
| 16 | Sentence length guard against over-correction | Extend humanizer with `mean < 11 words = choppy` check | #6 |
| 17 | SQL code block must contain executable SQL | 1 rule in builder.md + add to humanizer default | #9 |

---

## What's Already Fixed by Other Issues (no action needed)

- AI slop words (4 found) → Issue 11 (humanizer default) handles this
- Wrong approach / misunderstanding → Issue 01 (openviking PROTOCOL) helps via "ov find" before starting
- Heading style discovery → Issue 12 (auto-extract) covers
- TOC manual rebuild → Issue 13 (validate after every edit) prevents

---

## ROI Estimate

| Issue | Effort | Saves (per session) |
|-------|--------|---------------------|
| 12 | 10 min | 1 session (-30 min TOC discovery) |
| 13 | 5 min | 1 data loss + 3 numbering fix sessions (-90 min) |
| 14 | 20 min | 11 repeated rules × 3 sessions (-60 min user typing) |
| 15 | 10 min | 1 incomplete table styling fix (-20 min) |
| 16 | 5 min | 1 choppy revision (-15 min) |
| 17 | 5 min | 1 sql-in-prose discovery (-10 min) |
| **Total** | **~55 min** | **~225 min/session** |

ROI: 4x in first re-use.

---

## Key Quotes (verbatim from user)

These are the pain signals:

1. "aduh filenya hancur banget grgr lu, btw ada backupnya ga?" (data loss)
2. "bro copy originalnya bawa kesini jangan elu yg copy write sneidir" (don't recreate)
3. "shema di query sql project ini salah yang bener ada di laporan uts saya" (wrong source)
4. "schema brarti rancang dari awal dong? , btw dosen saya nyuruh lanjutin. bukan buat dari awal" (misunderstood task)
5. "eh itu numbering formatinya masih belum bener lalu tidak ada space" (format drift)

The pattern: user is in **debug mode**, repeatedly stopping the agent to fix things that should have been done right the first time. Each stop costs ~5-10 min of user attention.

---

## Recommendation

**Priority order (ponytail — biggest impact first):**

1. **Issue 14** (subagent lessons persistence) — 20 min, biggest impact. Without this, Issues 12/13/15/16/17 will all re-occur in next project.
2. **Issue 13** (numbering safety) — 5 min, prevents data loss which is the worst failure mode.
3. **Issue 12** (styleId auto-extract) — 10 min, prevents 4-session TOC fix.
4. **Issue 15** (cell-by-cell) — 10 min, prevents 3-iteration table styling.
5. **Issue 16** (sentence length) — 5 min, prevents choppy over-correction.
6. **Issue 17** (SQL must be SQL) — 5 min, prevents prose-in-code.

All 6 can be done in 1 hour. All 6 prevent issues that cost 4 hours of session time.

---

## Notes

- The dbl-data-management analysis confirms the prompt-rule-doesn't-fire pattern (Issues 01/08/09 fix is correct direction)
- Subagent context loss is the NEXT architectural problem after orchestrator context loss
- OpenViking can be the single source of truth for "lessons learned" — between subagent sessions, between projects, between days
- This is a real workflow problem, not a tool problem
