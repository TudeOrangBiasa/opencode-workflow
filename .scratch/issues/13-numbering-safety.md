# Issue 13: Numbering safety — never raw-set numbering.xml

## Status

**RESOLVED** by `document-writing` skill (v2, 2026-06-23). No separate implementation needed.

## Resolution

`document-writing` skill covers numbering safety in 3 places:

1. **§6 Anti-pattern #2**: "raw-set on numbering.xml part → Use add --num-id (high-level) — raw-set breaks cross-BAB numbering"
2. **§3 Phase 4 Edit safely**: explicit step "Use add (NOT raw-set on numbering.xml)"
3. **§9 Self-review**: "No raw-set on numbering.xml part"
4. **§8 Officecli quick reference**: explicit "SAFETY: NEVER do this — raw-set on numbering"

The skill's decision tree also routes PATH B through officecli (which uses safe `add --num-id`), avoiding the raw-set failure mode entirely for new BAB additions.

## Snapshot recovery

`document-writing` skill §3 Phase 4 step 1 + §6 anti-pattern #10 enforce snapshot before major edit:

```bash
cp existing.docx .scratch/snapshot-$(date +%s).docx
```

If numbering breaks, recovery is automatic (restore from snapshot).

## Why consolidated

Numbering safety is a workflow concern, not a separate tool. The skill teaches the agent WHEN and HOW to snapshot, edit, and validate. A separate "numbering-safety" tool would have been a thin wrapper around officecli.

## What changed

- Issue 13 marked Done in 00-index.md
- No code/script added
- Resolution lives in `skills/productivity/document-writing/SKILL.md`
