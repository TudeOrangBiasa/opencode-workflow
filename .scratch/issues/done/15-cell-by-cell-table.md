# Issue 15: Cell-by-cell table verification pattern

## Status

**RESOLVED** by `document-writing` skill (v2, 2026-06-23). No separate implementation needed.

## Resolution

`document-writing` skill §6 anti-pattern #6 covers this:

> "Only first cell of table styled → Verify ALL cells got the style, not just the one you spot-checked"

Plus §9 self-review checklist: "Tables: ALL cells styled, not just first".

Plus §3 PATH B Phase 4 (Edit safely) includes the officecli pattern for table work:

```bash
# Get all header rows
officecli query doc.docx "table[1]/tr[1]/tc" --json | jq -r '.[].path' | wc -l
# Should match expected header cell count
```

## Why consolidated

The verification is just an officecli `query` call. The skill teaches WHEN to do it (after every table edit) and HOW to interpret the result. A separate "table-verify" tool would be a one-liner.

## What changed

- Issue 15 marked Done in 00-index.md
- No code/script added
- Resolution lives in `skills/productivity/document-writing/SKILL.md`
