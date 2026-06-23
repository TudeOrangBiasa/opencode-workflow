# Issue 16: Sentence length guard against over-correction

## Status

New. Source: dbl-data-management 3-angle synthesis. Pattern #6 (choppy over-correction) hit BAB VI + VII. 30% of sentences < 8 words.

## Pain

User said "short sentences" → agent over-applied. BAB VI mean = 10.1 words, BAB VII mean = 10.4 words. Target for Indonesian academic prose: 15-25 words. The result reads like notes, not academic prose.

Quote from analysis: "BAB VI and VII are notably choppier than BAB V. The mean sentence length drops below 11 words, with 1 in 3 sentences being 8 words or fewer. This is below the 15-25 word range for formal Indonesian academic prose."

## Fix (ponytail)

Extend humanizer SKILL.md (where Issue 11 already added Repetition Check) with a Sentence Length Check:

```markdown
## Sentence Length Check
- After humanizer pass, check mean sentence length
- Target for academic Indonesian: 15-25 words
- Target for casual/README: 10-20 words
- If mean < 11 words: too choppy, expand short sentences by combining or adding context
- If 30%+ sentences < 8 words: rewrite for academic register
- If mean > 30 words: too dense, split sentences
```

Add to `humanizer` description trigger keywords: "academic", "akademik", "formal", "laporan" (already in list).

Add to `agents/builder.md` self-review: "Mean sentence length matches target register (academic 15-25, casual 10-20)."

## Acceptance criteria

- [ ] `humanizer` SKILL.md has "Sentence Length Check" section
- [ ] `agents/builder.md` self-review includes sentence length check
- [ ] Default target for prose: 15-25 words (academic Indonesian)

## Out of scope

- LLM-based sentence splitting (over-engineering)
- Per-project target customization (just use defaults)
- Word frequency analysis (different problem)

## Notes

The user EXPLICITLY said "short sentences" — but in context of removing AI fluff, not in context of "write telegraph-style". The agent confused "remove fluff" with "minimize word count". This is a common AI failure mode.

The fix: provide a TARGET RANGE, not just "be short". 15-25 is concrete and checkable.
