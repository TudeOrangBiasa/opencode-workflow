---
name: document-writing
description: How to write documents properly — academic reports, technical docs, READMEs, BAB sections. Decision tree for from-scratch vs extending existing. Anti-patterns from real dbl-data-management session analysis (numbering corruption, styleId by-name, choppy prose, prose in SQL code, etc.). Auto-loads on document writing intent (laporan, dokumen, bab, extend, lanjutkan, write, etc.).
---

# Document Writing

Write documents the right way. Two scenarios, one workflow, zero AI slop.

## Decision Tree — Which Path?

```
START: "I need to write a document"
  │
  ├─ Does an existing docx exist with content I should extend?
  │    │
  │    ├─ YES → PATH B (Extend Existing) — see §2
  │    │
  │    └─ NO  → PATH A (From Scratch) — see §1
  │
  └─ Which path requires template matching?
       │
       ├─ Reference template exists (Krisna, ACM, IEEE) → extract format first
       │
       └─ No reference → follow `design.md` if it exists, else academic default
```

**Common mistake: agent takes PATH A when PATH B is correct.** User says "extend the UTS laporan" and agent writes content from scratch. This is the #1 cause of "aduh filenya hancur" sessions.

---

## §1. PATH A — From Scratch

Use when: creating new docx/pptx/xlsx with no existing content.

### Phase 1: Discovery (5 min)

```bash
# Check if design.md exists in project
ls docs/agents/design.md 2>/dev/null && cat docs/agents/design.md

# Check if reference template exists
ls *.docx 2>/dev/null

# Extract styleId mapping (cache this for later)
officecli query doc.docx "style[name=Heading 1]" --json
```

**Why**: design.md is the source of truth for format. styleId mapping is per-docx, must discover once.

### Phase 2: Planning (10 min)

Before writing ANY content:

1. **Outline** — list BAB I/II/III/... + sub-bab 1.1, 1.2, ...
2. **Style mapping** — write to `design.md`:
   ```markdown
   ## StyleId Mapping
   - Heading 1 → styleId 779 (BAB titles, 16pt bold center)
   - Heading 2 → styleId 778 (sub-bab, 13pt bold left)
   - Heading 3 → styleId 889 (sub-sub-bab, 11pt italic)
   - Normal → styleId 937
   ```
3. **Numbering strategy** — assign numId per BAB:
   - BAB I → numId=10, abstractNumId=10
   - BAB II → numId=11, abstractNumId=11
   - etc.
4. **Style vs run vs paragraph** — know the difference:
   - Style: applied to paragraph, named (Heading 1, Normal)
   - Run: applied to inline text, has rPr (font, size, color)
   - Paragraph: has pPr (alignment, spacing, indent, numPr)

### Phase 3: Create + Add (use officecli)

```bash
# 1. Create blank
officecli create doc.docx

# 2. Add content via DOM (NOT raw XML)
officecli add doc.docx /body --type paragraph --prop style="Heading 1" --prop text="BAB I" --prop num-id=10
officecli add doc.docx /body --type paragraph --prop style="Heading 2" --prop text="Pendahuluan" --prop num-id=10
officecli add doc.docx /body --type paragraph --prop text="Body content here..." --prop style="Normal"

# 3. NEVER raw-set numbering.xml
# ❌ officecli raw-set doc.docx numbering --xpath "..." --xml "..."
# ✅ Use officecli add with --num-id (high-level)
```

### Phase 4: Verify (before declaring done)

```bash
officecli view doc.docx outline          # structure
officecli view doc.docx issues          # format problems
officecli validate doc.docx             # OpenXML schema
officecli view doc.docx screenshot      # visual check
```

### Phase 5: Snapshot (before next edit)

```bash
cp doc.docx .scratch/snapshot-$(date +%s).docx
```

Always snapshot before major edits. Recovery is cheap; data loss is not.

---

## §2. PATH B — Extend Existing

Use when: continuing UTS, adding BAB X to existing laporan, fixing existing docx.

### Phase 1: Read existing BEFORE writing (5 min)

```bash
# Get the full outline first
officecli view existing.docx outline

# Read BAB I/II as style reference (how headings look, what voice)
officecli view existing.docx text --max-lines 500

# Find all headings to know the pattern
officecli query existing.docx "heading" --json
```

**Critical**: do NOT skip this. The user said "extend from existing, follow that style" — read the existing first.

### Phase 2: Discover styleId + numbering scheme (5 min)

```bash
# Get styleId mapping (per-docx)
officecli query existing.docx "style[name=Heading 1]" --json

# Get current numId assignments (so BAB X doesn't conflict)
officecli query existing.docx "numId" --json
```

Add to `design.md` so future BABs reuse:
```markdown
## StyleId Mapping (cached 2026-06-23)
- Heading 1 → styleId 779
- Heading 2 → styleId 778
- Heading 3 → styleId 889
- Normal → styleId 937

## Numbering (cached 2026-06-23)
- BAB I: numId=10
- BAB II: numId=11
- BAB III: numId=12
- BAB IV: numId=13
- BAB V: numId=20
- BAB VI: numId=21
- BAB VII: numId=22
```

### Phase 3: Plan the new BAB (5 min)

Before any edit, state:
- BAB number → next numId (e.g. BAB VIII → 23)
- Sub-bab count (will affect abstractNumId level structure)
- StyleId to use (from cached mapping)
- Page break before/after BAB
- Reference to existing BAB X-1 (style match)

### Phase 4: Edit safely

```bash
# 1. Snapshot first
cp existing.docx .scratch/snapshot-$(date +%s).docx

# 2. Use add (not raw-set)
officecli add existing.docx /body --type paragraph --prop styleId=779 --prop text="BAB VIII" --prop num-id=23
officecli add existing.docx /body --type paragraph --prop styleId=778 --prop text="Sub-bab title" --prop num-id=23

# 3. Validate after every edit
officecli validate existing.docx

# 4. If validate fails, restore from snapshot
cp .scratch/snapshot-*.docx existing.docx
```

### Phase 5: Verify nothing broke

```bash
# 1. Check BAB I-VII still parse correctly
officecli view existing.docx outline | head -50

# 2. Check numbering didn't break
officecli view existing.docx text | grep -E "^[0-9]+\.[0-9]+" | head -20

# 3. Visual screenshot for the user
officecli view existing.docx screenshot -o .scratch/verification/<date>-add-bab-VIII/page1.png
```

---

## §3. Writing Phase — The 7 Rules (apply to ALL prose)

Load `humanizer` skill for the full list. These 7 are the non-negotiable minimum:

1. **No em dashes (—)** — use comma, period, or rephrase
2. **No "stands as", "serves as"** — say what it does directly
3. **No rule of three** — don't pad with three-item lists
4. **No promotional vocab** — "pivotal", "vibrant", "intricate", "tapestry", "testament"
5. **No signposting** — "Berikut adalah...", "In this section..." — just start
6. **No repetition** — same idea in 2+ sentences = AI slop, keep one
7. **Sentence length: 15-25 words** for academic Indonesian, 10-20 for casual/README

If `design.md` has project-specific style (e.g. "caveman mode for prose"), follow that.

---

## §4. The 10 Anti-Patterns (from dbl-data-management)

These are REAL mistakes the agent made. Memorize them.

| # | Anti-pattern | Fix |
|---|--------------|-----|
| 1 | Using `style="Heading 1"` (by-name) | Use `styleId=779` (numeric) |
| 2 | `raw-set` on numbering.xml | Use `add --num-id` (high-level) |
| 3 | Numbering breaks when editing other BABs | Each BAB = own numId, never share |
| 4 | "Build from scratch" when user said "extend" | Read first, then extend. Don't recreate |
| 5 | TOC entries as plain text | Use PAGEREF field + tab + leader |
| 6 | Only style first cell of table | Verify ALL cells got the style |
| 7 | Same sentence verbatim in 2+ sections | Repetition check before done |
| 8 | 30% sentences < 8 words (over-correction) | Target 15-25 words for academic |
| 9 | Prose in SQL code block via `--` comments | Code blocks = executable SQL only |
| 10 | No snapshot before major edit | `cp doc.docx .scratch/snapshot-<ts>.docx` first |

---

## §5. Officecli Quick Reference

```bash
# Discovery
officecli view doc.docx outline              # structure
officecli view doc.docx text                 # all text
officecli query doc.docx "heading" --json    # all headings
officecli query doc.docx "table" --json      # all tables
officecli query doc.docx "style[name=X]" --json  # styleId lookup

# Create / Add
officecli create doc.docx
officecli add doc.docx /body --type paragraph --prop text="..." --prop styleId=937
officecli add doc.docx /body --type table --prop rows=3 --prop cols=3

# Modify
officecli set doc.docx /body/p[1] --prop text="new text" --prop bold=true
officecli remove doc.docx /body/p[1]
officecli move doc.docx /body/p[1] --to /body --index 5

# Verify
officecli validate doc.docx
officecli view doc.docx issues
officecli view doc.docx screenshot -o /tmp/page1.png

# SAFETY: NEVER do this
officecli raw-set doc.docx numbering --xpath "..." --xml "..."
```

---

## §6. Self-Review Checklist (before reporting DONE)

- [ ] Used `styleId` (numeric), not by-name
- [ ] No `raw-set` on numbering.xml
- [ ] Validated with `officecli validate` — no errors
- [ ] If extended existing, BAB I-VII numbering unchanged
- [ ] Tables: ALL cells styled, not just first
- [ ] No em dashes, no "stands as", no "Berikut adalah"
- [ ] Mean sentence length 15-25 (academic) or 10-20 (casual)
- [ ] No verbatim sentence repetition (run `sort | uniq -d` on sentences)
- [ ] SQL code blocks contain ≥1 executable statement
- [ ] Snapshot taken before major edit (`cp doc.docx .scratch/snapshot-*.docx`)
- [ ] Screenshot taken for visual verification

---

## §7. When to Ask User

Don't guess. Ask if:

- Existing docx is corrupted, can't be opened
- styleId mapping is ambiguous (multiple Heading 1 candidates)
- Numbering conflict detected but unclear how to resolve
- User said "extend" but extension point unclear (which BAB? which page?)
- Template not found but reference was implied

Otherwise: discover, plan, execute, verify.
