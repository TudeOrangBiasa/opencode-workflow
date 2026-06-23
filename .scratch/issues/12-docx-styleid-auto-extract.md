# Issue 12: Auto-extract docx styleId mapping on first edit

## Status

New. Source: dbl-data-management 3-angle synthesis. Pattern #2 (styleId by-name vs numeric) hit 3x and caused 4-session TOC fix.

## Pain

Agent uses `style="Heading 1"` (by name) thinking it works. officecli accepts the by-name but doesn't resolve to internal `styleId=763`. The docx opens fine in Word but TOC generation, numbering, and cross-references break.

3 sessions to discover:
- `Heading 1` → styleId `779` (BAB titles)
- `Heading 2` → styleId `778` (sub-bab)
- `Heading 3` → styleId `889` (sub-sub-bab)
- `toc 1` → styleId `945` (BAB entries in TOC)
- `toc 2` → styleId `952` (sub-bab entries in TOC)
- `Hyperlink` → styleId `946` (TOC hyperlink character style)
- `Normal` → styleId `937`

The mapping is **per-docx** — different docx files have different numeric IDs. Re-discovery every time.

## Fix (ponytail)

Add to `agents/builder.md` and to `officecli` SKILL.md (or `setup-matt-pocock-skills` preflight):

**Before any docx edit, run styleId discovery**:
```bash
officecli query doc.docx "style[name=Heading 1]" --json | jq -r '.[].path'
# Then numeric ID is in the path. Cache in design.md.
```

Better: extract all styleIds once and cache to project's `design.md`:
```bash
officecli query doc.docx "style" --json > .scratch/style-mapping.json
```

Builder self-review rule: never use by-name styles. Always use the numeric styleId from the cached mapping.

**Auto-update `design.md`** on first docx edit: append a "## StyleId Mapping" section to the project's `docs/agents/design.md` with the discovered IDs.

## Acceptance criteria

- [ ] `agents/builder.md` has rule: "Before any docx edit, run styleId discovery. Never use by-name styles."
- [ ] `officecli` SKILL.md has a "StyleId Discovery" section
- [ ] `design.md` template includes a "## StyleId Mapping" section placeholder
- [ ] Manual test: build BAB X in a new docx, verify styleId mapping is auto-discovered and cached

## Out of scope

- Per-docx style migration tools (over-engineering)
- Cross-docx style normalization (rare use case)
- Style conflict detection (low frequency)

## Notes

This is a 5-min fix that prevents a 4-session discovery chain. Same pattern as Issue 11: use what we have, don't build new.
