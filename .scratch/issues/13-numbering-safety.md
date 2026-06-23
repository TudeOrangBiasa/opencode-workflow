# Issue 13: Numbering safety — never raw-set numbering.xml

## Status

New. Source: dbl-data-management 3-angle synthesis. Pattern #1 (numbering corruption) hit 4x. Worst: BAB VII edit wiped BAB VI text + broke BAB V numbering, required recovery from UTS backup.

## Pain

Numbering corruption pattern:
- BAB V built → BAB V works
- BAB VI built → BAB V numbering breaks
- BAB VII built → BAB VI text wiped, BAB V double-numbers

Root cause: each BAB builder used `raw-set` to inject new abstractNum/numId definitions, overwriting or conflicting with existing ones. numbering.xml is a SHARED resource — touching it affects all chapters.

User quote: "aduh filenya hancur banget grgr lu, btw ada backupnya ga?"

## Fix (ponytail)

Add to `agents/builder.md` and `officecli` SKILL.md:

**Hard rule for any docx edit:**
1. NEVER use `raw-set` on `numbering.xml` part. Use `add` with `--num-id` and `--abstract-num-id` parameters.
2. After ANY docx edit, run `officecli validate doc.docx` — abort if structural errors.
3. Before any BAB-level edit, snapshot the docx with `cp doc.docx .scratch/snapshot-<timestamp>.docx`.

**Self-review checklist** (already in `builder.md` Step 4):
- [ ] Used `add` with explicit num-id, NOT raw-set on numbering.xml
- [ ] `officecli validate` returned no errors after edit
- [ ] BAB I-IV numbering unchanged (compare to snapshot)

## Acceptance criteria

- [ ] `agents/builder.md` has explicit "Never raw-set numbering.xml" rule
- [ ] `officecli` SKILL.md has a "Numbering Safety" section
- [ ] `officecli validate` is in self-review checklist
- [ ] Auto-snapshot before BAB-level edits: builder creates `.scratch/snapshot-<timestamp>.docx` automatically

## Out of scope

- numbering.xml introspection tools (over-engineering)
- Automatic conflict detection (low ROI)
- Per-BAB isolated numbering (different problem)

## Notes

This is a 5-min fix that prevents the WORST failure mode (data loss). The "always snapshot before BAB edit" rule is a single line of bash. The "use add not raw-set" is one sentence in builder.md.
