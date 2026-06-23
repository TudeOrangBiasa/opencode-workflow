# Issue 16: Sentence length guard against over-correction

## Status

**RESOLVED** by `document-writing` skill (v2, 2026-06-23) + `humanizer` skill (Issue 11).

## Resolution

`document-writing` skill §5 rule 7:

> "Sentence length: 15-25 words for academic Indonesian, 10-20 for casual/README"

Plus §9 self-review checklist: "Mean sentence length 15-25 (academic) or 10-20 (casual)".

`humanizer` skill (Issue 11) has the "Repetition Check" section and is auto-loaded for prose writing via skill_triggers.

## Why consolidated

The sentence length guard is a writing rule, not a separate tool. The skill teaches the rule + the verification method (mean sentence length in self-review). A separate "sentence-length-guard" tool would be a 5-line check that the agent can do inline.

## What changed

- Issue 16 marked Done in 00-index.md
- No code/script added
- Resolution lives in `skills/productivity/document-writing/SKILL.md` + `humanizer` skill
