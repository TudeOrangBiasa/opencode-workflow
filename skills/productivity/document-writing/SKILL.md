---
name: document-writing
description: How to write documents properly — academic reports, technical docs, READMEs, BAB sections. Decision tree for from-scratch (pandoc) vs extending existing (officecli). Citation finding via scout. 10 universal docx failure modes. Format-agnostic — pulls format from project's design.md or reference template, NOT hardcoded. Auto-loads on document writing intent (laporan, dokumen, bab, extend, lanjutkan, write, etc.).
---

# Document Writing

Write documents the right way. Two paths, smart tool routing, zero AI slop, citations that actually exist.

## What This Skill Is NOT

This skill does NOT hardcode any specific format. No "Primakara style", no "BAB I numbering", no specific font. Those are project-specific and live in `design.md`. **This skill is the workflow; your project provides the format.**

---

## Decision Tree — Which Path?

```
START: "I need to write a document"
  │
  ├─ Does an existing .docx with custom styling exist?
  │    │
  │    ├─ YES → PATH B (Extend Existing) → officecli
  │    │
  │    └─ NO  → PATH A (From Scratch) → pandoc (+ CSL)
  │
  ├─ Format source?
  │    ├─ design.md exists → read it (project format)
  │    ├─ Reference template (.docx) → extract style
  │    └─ None → ask user: "Format apa? Citation style?"
  │
  └─ Citations needed?
       ├─ references.bib exists → use it
       ├─ User has Mendeley/Zotero → ask for .bib export
       └─ Need new citations → spawn scout (Google Scholar, SINTA, Crossref)
```

**Common mistake: agent takes PATH A when PATH B is correct.** User says "extend the UTS laporan" and agent regenerates from markdown. This loses all custom styling (fonts, margins, custom styles) and breaks numbering. Always read existing first.

---

## §1. Format Discovery (run first)

Before writing ANY content:

```bash
# 1. Look for project design.md
ls docs/agents/design.md 2>/dev/null && cat docs/agents/design.md

# 2. Look for citation style file
ls *.csl 2>/dev/null

# 3. Look for references
ls references.bib refs.bib *.bib 2>/dev/null

# 4. Look for reference template (for pandoc --reference-doc)
ls template.docx ref.docx 2>/dev/null
```

**If `design.md` exists** → it has the format spec. Follow it. Don't invent new styles.

**If `design.md` missing** → ask user: "Format apa? Citation style? Reference template?" Then either:
- Create a minimal `design.md` (typography, headings, citation style) — see `setup-matt-pocock-skills`
- Pass format directly via flags (pandoc `--reference-doc`, `--csl`)

**If citation style ambiguous** → user points to a published example, agent extracts style.

---

## §2. PATH A — From Scratch (use pandoc)

Use when: creating new docx/pptx/xlsx with no existing content. The user has a markdown source or is starting fresh.

### Phase 1: Setup (5 min)

```bash
# 1. Install pandoc
sudo apt install pandoc

# 2. Get citation style (if academic)
# Download from https://github.com/citation-style-language/styles
# Examples: ieee.csl, acm-sig-proceedings.csl, apa-7th.csl, chicago-author-date.csl
ls *.csl  # user provides, or ask

# 3. Get reference template (for style inheritance)
# User provides a .docx template, or pandoc uses default

# 4. Set up references.bib
# User exports from Mendeley/Zotero, or scout finds new ones
```

### Phase 2: Write Markdown (your job)

```markdown
# Title

Author Name. 2026. Paper Title. *Journal Name*.

## Section 1

Cite like this [@doi:10.1145/xxxxxxx]. Multiple citations [@smith2020; @jones2021].

## Section 2

As shown in [@table-1].

| Col 1 | Col 2 |
|-------|-------|
| A     | B     |
| C     | D     |

: Table caption {#tbl:table-1}
```

### Phase 3: Convert via pandoc

```bash
# Basic: md → docx with citations
pandoc paper.md --citeproc --bibliography=references.bib -o paper.docx

# With citation style (specific format)
pandoc paper.md --citeproc --csl=ieee.csl --bibliography=references.bib -o paper.docx

# With reference template (copies style from template.docx)
pandoc paper.md --citeproc --reference-doc=template.docx -o paper.docx

# With metadata (title, author, date)
pandoc paper.md \
  --citeproc \
  --metadata=title:"Paper Title" \
  --metadata=author:"Author Name" \
  --metadata=date:"2026" \
  -o paper.docx
```

### Phase 4: Verify

```bash
# Open in LibreOffice, check:
# - Citations appear correctly
# - Bibliography is at the end
# - Tables converted properly
# - Headings have right style

# Convert back to md to check round-trip
pandoc paper.docx -o check.md
diff paper.md check.md  # should be minimal diff
```

### Phase 5: Snapshot (before any manual .docx edit)

```bash
cp paper.docx .scratch/snapshot-$(date +%s).docx
```

---

## §3. PATH B — Extend Existing (use officecli)

Use when: continuing UTS, adding BAB X to existing laporan, fixing existing docx. The existing file has custom styling that must be preserved.

### Phase 1: Read existing BEFORE writing (5 min)

```bash
# Get the full outline
officecli view existing.docx outline

# Read the source-of-truth BABs as style reference
officecli view existing.docx text --max-lines 500

# Find all headings to know the pattern
officecli query existing.docx "heading" --json
```

**Critical**: do NOT skip this. The user said "extend from existing, follow that style" — read the existing first. Officecli's query tells you what styles are actually used, not what you assume.

### Phase 2: Discover styleId + numbering scheme (5 min)

```bash
# Get styleId mapping (per-docx, critical!)
officecli query existing.docx "style[name=Heading 1]" --json
officecli query existing.docx "style[name=Heading 2]" --json
officecli query existing.docx "style[name=Normal]" --json

# Get current numId assignments
officecli query existing.docx "num" --json
```

Cache to `design.md` so future edits reuse:

```markdown
## StyleId Mapping (cached YYYY-MM-DD)
- Heading 1 → styleId 779
- Heading 2 → styleId 778
- Normal → styleId 937
- ...

## Numbering (cached YYYY-MM-DD)
- BAB I: numId=10
- BAB II: numId=11
- ...
```

### Phase 3: Plan the new content (5 min)

Before any edit, state:
- BAB number → next numId (assigned per project, check existing)
- Sub-bab count
- StyleId to use (from cached mapping)
- Page break before/after
- Reference to existing BAB X-1 (style match)

### Phase 4: Edit safely

```bash
# 1. Snapshot first
cp existing.docx .scratch/snapshot-$(date +%s).docx

# 2. Use add (NOT raw-set on numbering.xml)
officecli add existing.docx /body --type paragraph --prop styleId=779 --prop text="BAB VIII" --prop num-id=23
officecli add existing.docx /body --type paragraph --prop styleId=778 --prop text="Sub-bab title" --prop num-id=23
officecli add existing.docx /body --type paragraph --prop styleId=937 --prop text="Body content..."

# 3. Validate after every edit
officecli validate existing.docx

# 4. If validate fails, restore from snapshot
cp .scratch/snapshot-*.docx existing.docx
```

### Phase 5: Verify nothing broke

```bash
# 1. Check existing BABs still parse correctly
officecli view existing.docx outline | head -50

# 2. Check numbering didn't break
officecli view existing.docx text | grep -E "^[0-9]+\.[0-9]+" | head -20

# 3. Visual screenshot for the user
officecli view existing.docx screenshot -o .scratch/verification/<date>-<intent>/page1.png
```

---

## §4. Citation Discovery (scout when user lacks references.bib)

When the user needs citations but doesn't have a `.bib` file, spawn scout.

### When to spawn scout

- User says "cari paper X", "find citation for Y", "butuh referensi"
- User mentions Google Scholar, SINTA, DOI, Scopus, journal/conference name
- User asks "apa paper terbaru tentang X"

### What scout does

```bash
# Scout prompt template
"Find academic citations for: <user's topic>
- Search Google Scholar: scholar.google.com
- Search SINTA (Indonesia): sinta.kemdikbud.go.id
- Validate DOIs via Crossref: api.crossref.org
- Return BibTeX entries ready to append to references.bib
- DO NOT hallucinate authors/years/titles. If not findable, say so.
- Prefer recent (last 5 years) over old."
```

### What scout returns

- List of `key = {type, author, title, journal, year, doi}` BibTeX entries
- Each entry verified (DOI resolves, author names check out)
- Appended to `references.bib` by the calling agent

### Mendeley/Zotero integration (out of scope for scout)

User manages their own library. Agent just reads the `.bib` export:

```bash
# User exports BibTeX from Mendeley/Zotero → references.bib
# Agent uses pandoc with --bibliography=references.bib
```

Don't ask the agent to manage a citation library. It just reads.

---

## §5. The 7 Writing Rules (apply to ALL prose)

Load `humanizer` skill for the full list. These 7 are the non-negotiable minimum:

1. **No em dashes (—)** — use comma, period, or rephrase
2. **No "stands as", "serves as"** — say what it does directly
3. **No rule of three** — don't pad with three-item lists
4. **No promotional vocab** — "pivotal", "vibrant", "intricate", "tapestry", "testament"
5. **No signposting** — "Berikut adalah...", "In this section..." — just start
6. **No repetition** — same idea in 2+ sentences = AI slop, keep one
7. **Sentence length: 15-25 words** for academic Indonesian, 10-20 for casual/README

If `design.md` has project-specific style (e.g. "caveman mode for prose", "no first-person", etc.), follow that IN ADDITION to these 7.

---

## §6. The 10 Anti-Patterns (universal docx failure modes)

These are mistakes the agent has made. Universal — apply to ANY docx, any format, any project.

| # | Anti-pattern | Fix |
|---|--------------|-----|
| 1 | Using `style="Heading 1"` (by-name) | Use `styleId=NNN` (numeric) — by-name doesn't resolve in some operations |
| 2 | `raw-set` on `numbering.xml` part | Use `add --num-id` (high-level) — raw-set breaks cross-BAB numbering |
| 3 | Numbering breaks when editing other BABs | Each BAB = own numId, never share — verify with `validate` after every edit |
| 4 | "Build from scratch" when user said "extend" | Read first, then extend. Don't recreate. Recreating loses custom styles. |
| 5 | TOC entries as plain text | Use PAGEREF field + tab + leader — text gets out of sync with pages |
| 6 | Only first cell of table styled | Verify ALL cells got the style, not just the one you spot-checked |
| 7 | Same sentence verbatim in 2+ sections | Repetition check before done — `sort \| uniq -d` on sentences |
| 8 | 30% sentences < 8 words (over-correction) | Target 15-25 words for academic — 10-20 for casual/README |
| 9 | Prose in SQL code block via `--` comments | Code blocks = executable SQL only. Prose goes in body paragraphs. |
| 10 | No snapshot before major edit | `cp doc.docx .scratch/snapshot-<timestamp>.docx` first |

---

## §7. Tool Routing — Which Tool When?

| Scenario | Tool | Why |
|----------|------|-----|
| New document, markdown source, citations | **pandoc** + CSL | Citation engine, batch conversion, 1000+ citation styles |
| New document, no existing template, no citations | **pandoc** with default style | Fast, simple |
| Extend existing .docx (preserve styling) | **officecli** | Preserves custom styles, surgical edits |
| Fix existing .docx (numbering, tables, headings) | **officecli** | Path-based addressing, validation |
| Find new citations | **scout** | Google Scholar + SINTA + Crossref validation |
| Convert .docx to .md for inspection | **pandoc** | `pandoc doc.docx -o check.md` |
| Apply citation style change | **pandoc** + CSL | User drops new `*.csl`, rerun pandoc |

**Pandoc and officecli are complementary, not alternatives.** Pandoc = generation. Officecli = surgical edit.

---

## §8. Quick Reference

### Pandoc

```bash
# Install
sudo apt install pandoc

# Basic md → docx with citations
pandoc paper.md --citeproc --bibliography=references.bib -o paper.docx

# With specific citation style
pandoc paper.md --citeproc --csl=ieee.csl --bibliography=references.bib -o paper.docx

# With reference template (style inheritance)
pandoc paper.md --citeproc --reference-doc=template.docx -o paper.docx

# With metadata
pandoc paper.md --citeproc \
  --metadata=title:"Title" \
  --metadata=author:"Name" \
  --metadata=date:"2026" \
  -o paper.docx

# docx → md (for inspection)
pandoc paper.docx -o check.md
```

### Officecli

```bash
# Discovery
officecli view doc.docx outline              # structure
officecli view doc.docx text                 # all text
officecli view doc.docx issues               # format problems
officecli view doc.docx screenshot -o img.png # visual
officecli query doc.docx "heading" --json    # all headings
officecli query doc.docx "style[name=X]" --json  # styleId lookup

# Create / Add (use --prop styleId for headings, NOT style="Heading 1")
officecli create doc.docx
officecli add doc.docx /body --type paragraph --prop text="..." --prop styleId=937
officecli add doc.docx /body --type table --prop rows=3 --prop cols=3

# Modify
officecli set doc.docx /body/p[1] --prop text="new text" --prop bold=true
officecli remove doc.docx /body/p[1]
officecli move doc.docx /body/p[1] --to /body --index 5

# Verify
officecli validate doc.docx

# SAFETY: NEVER do this
officecli raw-set doc.docx numbering --xpath "..." --xml "..."
```

### Scout (citation finding)

```bash
# Triggered via orchestrator delegation, NOT direct call.
# Scout searches Google Scholar + SINTA + Crossref,
# returns BibTeX entries ready for references.bib.
```

---

## §9. Self-Review Checklist (before reporting DONE)

### Format-specific (from `design.md` or user spec)

- [ ] Format spec followed (font, size, margins, headings — from `design.md`)
- [ ] Citation style matches user's CSL file
- [ ] Reference list present (if citations used)
- [ ] All headings in correct style (use `styleId`, not by-name)

### Writing quality

- [ ] No em dashes
- [ ] No "stands as" / "serves as" / "Berikut adalah"
- [ ] No rule of three
- [ ] No promotional vocab
- [ ] Mean sentence length 15-25 (academic) or 10-20 (casual)
- [ ] No verbatim sentence repetition

### Structural

- [ ] No `raw-set` on `numbering.xml` part
- [ ] Validated with `officecli validate` (no errors)
- [ ] If extended existing, BAB structure unchanged
- [ ] Tables: ALL cells styled, not just first
- [ ] TOC has PAGEREF + tab + leader (not plain text)
- [ ] SQL code blocks contain ≥1 executable statement

### Process

- [ ] Snapshot taken before major edit (`cp doc.docx .scratch/snapshot-*.docx`)
- [ ] Screenshot taken for visual verification (if UI or formatted doc)

---

## §10. When to Ask User

Don't guess. Ask if:

- Format source unclear (no `design.md`, no reference template, no example)
- Citation style ambiguous (multiple candidates, user hasn't said)
- Existing docx is corrupted, can't be opened
- `styleId` mapping is ambiguous (multiple Heading 1 candidates)
- Numbering conflict detected but unclear how to resolve
- User said "extend" but extension point unclear (which BAB? which page?)
- User wants new citations: ask for topic/keywords, then spawn scout

Otherwise: discover, plan, execute, verify.
