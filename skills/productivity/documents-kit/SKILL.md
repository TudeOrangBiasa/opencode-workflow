---
name: documents-kit
description: Use when working on documents, presentations, diagrams, or text in the documents-kit pipeline — docx/pptx/xlsx, drawio diagrams, humanized prose, PDF export, deck storytelling, or any documents-kit sub-skill. Use only as a package entry; prefer loading specific sub-skills (document-writing, drawio, humanizer, etc.) for focused work.
---

# documents-kit

Package entry for the documents-kit-skills ecosystem. 10 sub-skills + 15 tools + asset templates/presets/diagrams/examples.

## When to use

- You need to **write a document** from scratch or extend existing (load **document-writing**)
- You want to **draw a diagram** (load **drawio**)
- You need to **humanize prose** or remove AI writing patterns (load **humanizer**)
- You need to **create/modify Office files** (load **officecli**)
- You need to **export PDF** from docx/pptx (load **pdf-export**)
- You want to **scaffold a document** from a template (load **scaffold-doc**)
- You need to **turn a report into a slide deck** (load **report-to-deck**)
- You need to **format Word document structure** (load **document-format**)
- You need to **build a narrative pitch deck** (load **storytelling**)
- You just want the **unified CLI** (load **documents-kit** sub-skill)

## Structure

```
skills/productivity/documents-kit/
├── SKILL.md               (this file)
├── REFERENCE.md           (overview & integration)
├── skills/                (10 sub-skills, symlinks)
│   ├── document-format/
│   ├── document-writing/
│   ├── documents-kit/
│   ├── drawio/
│   ├── humanizer/
│   ├── officecli/
│   ├── pdf-export/
│   ├── report-to-deck/
│   ├── scaffold-doc/
│   └── storytelling/
├── tools/                 (15 glue scripts)
├── templates/             (paper, presentation, report, thesis)
├── presets/               (drawio-styles, hackathon, material-light, storytelling-fallback)
├── diagrams/              (drawio templates: architecture, aws-3-tier, c4-context, …)
└── examples/
```

## Sub-skills

| Skill | Purpose |
|-------|---------|
| **document-format** | Heading numbering, TOC, captions, cross-references in .docx |
| **document-writing** | Full document workflow (scaffold → write → cite → format → export) |
| **documents-kit** | Unified CLI — delegates to all other sub-skills |
| **drawio** | Generate .drawio diagrams with style presets & reusable templates |
| **humanizer** | Remove AI-generated writing patterns from prose |
| **officecli** | Create, analyze, proofread, modify Office documents |
| **pdf-export** | Export DOCX/PPTX to PDF via LibreOffice |
| **report-to-deck** | Convert markdown report → story.yaml + story.md for storytelling |
| **scaffold-doc** | Scaffold new documents from built-in templates |
| **storytelling** | Generate narrative PPTX pitch decks from YAML + Markdown |

## Tools

15 glue scripts in `tools/` (Python + shell) — see REFERENCE.md for full table.

## Assets

- **templates/** — 4 document template directories (paper, presentation, report, thesis)
- **presets/** — drawio-styles, hackathon-energetic.json, material-light.json, storytelling_fallback.json
- **diagrams/** — 15+ drawio template diagrams (architecture, C4, ERD, flowchart, sequence, …)
- **examples/** — example document

See [REFERENCE.md](./REFERENCE.md) for full details.
