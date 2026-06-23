# Issue 12: Auto-extract docx styleId mapping on first edit

## Status

**RESOLVED** by `document-writing` skill (v2, 2026-06-23). No separate implementation needed.

## Resolution

`document-writing` skill §3 Phase 2 ("Discover styleId + numbering scheme") covers this:

```bash
# Get styleId mapping (per-docx, critical!)
officecli query existing.docx "style[name=Heading 1]" --json
officecli query existing.docx "style[name=Heading 2]" --json
officecli query existing.docx "style[name=Normal]" --json

# Get current numId assignments
officecli query existing.docx "num" --json
```

And cache to `design.md`:
```markdown
## StyleId Mapping (cached YYYY-MM-DD)
- Heading 1 → styleId 779
- Heading 2 → styleId 778
- ...
```

Plus §6 anti-pattern #1 makes it explicit: "Use `styleId=NNN` (numeric), not by-name".

Plus §9 self-review checklist enforces it.

## Why consolidated

This issue was conceived as "auto-extract on first edit, then update design.md". The `document-writing` skill is the WORKFLOW. The user-facing artifact (skill) is more discoverable, auto-loads on intent, and the workflow is reusable across projects.

Implementing this as a separate "auto-styleid-extract" mechanism would have been:
- A wrapper script
- A hook into officecli calls
- Another piece of code to maintain

The skill is the mechanism — it tells the agent exactly what to do at Phase 2.

## What changed

- Issue 12 marked Done in 00-index.md
- No code/script added
- Resolution lives in `skills/productivity/document-writing/SKILL.md`
