# Document Writing — Reference

See [SKILL.md](SKILL.md) for the decision tree, format discovery, writing rules, anti-patterns, tool routing, self-review checklist, and when to ask user.

## §2. PATH A — From Scratch (use pandoc)

Use when: creating new docx/pptx/xlsx with no existing content.

### Phase 1: Setup
```bash
sudo apt install pandoc
ls *.csl                       # citation style
ls template.docx ref.docx      # reference template
ls references.bib refs.bib     # bibliography
```

### Phase 2: Write Markdown
```markdown
# Title
Author Name. 2026. Paper Title. *Journal Name*.

## Section 1
Cite like this [@doi:10.1145/xxxxxxx]. Multiple citations [@smith2020; @jones2021].
```

### Phase 3: Convert via pandoc
```bash
# Basic md → docx with citations
pandoc paper.md --citeproc --bibliography=references.bib -o paper.docx

# With citation style
pandoc paper.md --citeproc --csl=ieee.csl --bibliography=references.bib -o paper.docx

# With reference template
pandoc paper.md --citeproc --reference-doc=template.docx -o paper.docx

# With metadata
pandoc paper.md --citeproc \
  --metadata=title:"Paper Title" --metadata=author:"Name" --metadata=date:"2026" \
  -o paper.docx
```

### Phase 4: Verify
```bash
# Check round-trip
pandoc paper.docx -o check.md
diff paper.md check.md  # should be minimal diff
```

### Phase 5: Snapshot
```bash
cp paper.docx .scratch/snapshot-$(date +%s).docx
```

## §3. PATH B — Extend Existing (use officecli)

Use when: continuing UTS, adding BAB X, fixing existing docx.

### Phase 1: Read existing BEFORE writing
```bash
officecli view existing.docx outline
officecli view existing.docx text --max-lines 500
officecli query existing.docx "heading" --json
```

### Phase 2: Discover styleId + numbering scheme
```bash
officecli query existing.docx "style[name=Heading 1]" --json
officecli query existing.docx "style[name=Heading 2]" --json
officecli query existing.docx "style[name=Normal]" --json
officecli query existing.docx "num" --json
```

Cache to `design.md`:
```markdown
## StyleId Mapping (cached YYYY-MM-DD)
- Heading 1 → styleId 779
- Heading 2 → styleId 778
- Normal → styleId 937

## Numbering (cached YYYY-MM-DD)
- BAB I: numId=10
- BAB II: numId=11
```

### Phase 3: Plan the new content
State: BAB number, sub-bab count, styleId to use, page break before/after, reference to existing BAB X-1.

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

### Phase 5: Verify
```bash
officecli view existing.docx outline | head -50
officecli view existing.docx text | grep -E "^[0-9]+\.[0-9]+" | head -20
officecli view existing.docx screenshot -o .scratch/verification/<date>-<intent>/page1.png
```

## §4. Citation Discovery (scout)

When the user needs citations but doesn't have a `.bib` file, spawn scout.

### When to spawn scout
- User says "cari paper X", "find citation for Y", "butuh referensi"
- User mentions Google Scholar, SINTA, DOI, Scopus, journal/conference name
- User asks for recent papers on a topic

### What scout does
```bash
Scout searches Google Scholar + SINTA + Crossref,
returns BibTeX entries ready for references.bib.
DO NOT hallucinate authors/years/titles. If not findable, say so.
Prefer recent (last 5 years) over old.
```

### Mendeley/Zotero integration
User manages their own library. Agent reads the `.bib` export:
```bash
# User exports BibTeX from Mendeley/Zotero → references.bib
# Agent uses pandoc with --bibliography=references.bib
```

## §8. Quick Reference

### Pandoc
```bash
# Install
sudo apt install pandoc

# Basic md → docx with citations
pandoc paper.md --citeproc --bibliography=references.bib -o paper.docx

# With specific citation style
pandoc paper.md --citeproc --csl=ieee.csl --bibliography=references.bib -o paper.docx

# With reference template
pandoc paper.md --citeproc --reference-doc=template.docx -o paper.docx

# With metadata
pandoc paper.md --citeproc \
  --metadata=title:"Title" --metadata=author:"Name" --metadata=date:"2026" \
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

# SAFETY: NEVER do this
officecli raw-set doc.docx numbering --xpath "..." --xml "..."
```

### Scout
```bash
# Triggered via orchestrator delegation, NOT direct call.
# Scout searches Google Scholar + SINTA + Crossref,
# returns BibTeX entries ready for references.bib.
```
