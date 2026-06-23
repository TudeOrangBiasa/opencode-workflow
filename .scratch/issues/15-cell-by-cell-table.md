# Issue 15: Cell-by-cell table verification pattern

## Status

New. Source: dbl-data-management 3-angle synthesis. Pattern #4 (table styling incomplete) hit 3x.

## Pain

Agent styles table header cells but only verifies the FIRST cell. The other 19 cells stay unstyled. 3 iterations to get all 5 tables right because agent only spot-checks.

User pain: "table shading, borders, alignment wrong" repeated.

## Fix (ponytail)

Add to `agents/builder.md` self-review:

**After any table style edit**:
1. Run `officecli query doc.docx "table[1]"` to get all rows/cells
2. Verify the styling was applied to ALL header cells, not just first
3. If not all cells match: re-apply with explicit loop, OR revert and use `add` with style template

**Officecli pattern**:
```bash
# Get all header rows
officecli query doc.docx "table[1]/tr[1]/tc" --json | jq -r '.[].path' | wc -l
# Should match expected header cell count
```

Better: use a template-based add that applies consistent style:
```bash
officecli add doc.docx /body --type table --prop style="Krisna Properti Header" --prop header_shading=1F4E5F
```

## Acceptance criteria

- [ ] `agents/builder.md` has "After table edit, verify all cells" rule
- [ ] `officecli` SKILL.md has a "Table Styling" section
- [ ] Self-review checklist: "Verified table styling applied to ALL cells, not just first"

## Out of scope

- Auto-detect header cells (low ROI)
- Visual style editor (over-engineering)
- Cross-table style consistency check (rare use case)

## Notes

The fix is essentially: "don't trust your own edit, verify the whole table." Standard engineering hygiene. 10-min fix prevents a 30-min redo cycle.
