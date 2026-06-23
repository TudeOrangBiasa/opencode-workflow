# Issue 17: SQL code block must contain executable SQL

## Status

New. Source: dbl-data-management 3-angle synthesis. Pattern #9: 3 of 7 BAB VII SQL code blocks contain zero executable SQL, just prose wrapped in `--` comments. KONTEN_BAB.md source has 70+ `--` comment lines across 24 SQL blocks.

## Pain

Agent wraps prose documentation INSIDE SQL code blocks using `--` comments. Result:
- Code block is "valid SQL" (just comments)
- Reader can't copy-paste and run it
- Format claim "SQL code block" is misleading
- Design.md says "SQL code block + tabel parameter wajib" — intent is executable code

Example from KONTEN_BAB_V_VI_VII.md:
```sql
-- Composite index: low-cardinality leading column
CREATE INDEX idx_transaksi_jenis_tanggal
ON transaksi (jenis, tanggal);
-- jenis ENUM (low-cardinality)

ON transaksi (jenis, tanggal);  # <-- duplicate line, looks like paste error
```

The duplicate `ON transaksi (jenis, tanggal);` is a paste artifact that survived the strip-comments session.

## Fix (ponytail)

Add to `humanizer` SKILL.md and `agents/builder.md`:

**Rule for SQL code blocks**:
- Must contain at least 1 executable statement (CREATE, INSERT, SELECT, etc.)
- Prose explanations go in BODY paragraph ABOVE the code block, not as `--` comments
- "Output" explanations go in BODY paragraph BELOW the code block
- Code blocks with ONLY comments = wrong format; rewrite as prose

**Self-review**:
- [ ] Every SQL code block has ≥1 executable statement
- [ ] No code block is 100% `--` comments
- [ ] Prose explanations are in body paragraphs, not `--` comments

Add to `humanizer` trigger: "code", "sql", "snippet"

## Acceptance criteria

- [ ] `humanizer` SKILL.md has "Code Block Content Check" section
- [ ] `agents/builder.md` has "SQL code block must have executable SQL" rule
- [ ] Self-review checklist includes code block verification

## Out of scope

- SQL syntax validation (different problem)
- Linting SQL blocks (over-engineering)
- Auto-detect prose-in-comments (low ROI)

## Notes

Simple rule, easy to check. The fix is one line in humanizer + one line in builder.md self-review.
