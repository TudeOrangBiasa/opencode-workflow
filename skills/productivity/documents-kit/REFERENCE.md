---
name: documents-kit-reference
description: Reference for the documents-kit package — sub-skills, tools, assets, and integration notes.
---

# documents-kit REFERENCE

## Sub-skills (10)

| Skill | Description |
|-------|-------------|
| **document-format** | Apply heading numbering, table of contents, figure/table captions, and cross-references to .docx files. |
| **document-writing** | Write documents with anti-AI patterns and detection-aware writing. 5-phase workflow, visual/code/color decision rules, asset management. |
| **documents-kit** | Unified CLI for the documents-kit-skills toolkit. Delegates to existing tools for scaffolding, building, validating, exporting, citing, and formatting. |
| **drawio** | Generate .drawio diagrams with style presets (semantic, AWS, Azure, Carbon, Nord), reusable templates (C4, AWS 3-tier, microservices, sequence), routing/layout rules. |
| **humanizer** | Remove signs of AI-generated writing from text. Based on Wikipedia's "Signs of AI writing" guide. Auto-loads on prose-writing intent. |
| **officecli** | Create, read, and modify Office documents (.docx, .xlsx, .pptx) via officecli CLI. Verbs: create, view, get, query, set, add, remove, move, swap, validate. |
| **pdf-export** | Export DOCX and PPTX files to PDF using LibreOffice in headless mode. CLI-first and CI-friendly. |
| **report-to-deck** | Convert a Markdown report into a story.yaml + story.md pair for the storytelling skill. |
| **scaffold-doc** | Scaffold a new document from a built-in template gallery (report, thesis, presentation, paper). |
| **storytelling** | Generate narrative-driven PPTX pitch decks from a YAML story config + Markdown narrative. Each section maps to one slide with one claim and one visual. Requires officecli and drawio on PATH. |

## Tools (15)

| Tool | Type | Purpose |
|------|------|---------|
| `__init__.py` | Python | Package init for tools module |
| `asset-validator.sh` | Shell | Validate asset files integrity |
| `doc-audit-pipeline.sh` | Shell | Full document audit pipeline |
| `documents_kit.py` | Python | Unified CLI for documents-kit operations |
| `export_pdf.py` | Python | PDF export logic |
| `fetch_drawio_template.py` | Python | Fetch drawio templates |
| `new_document.py` | Python | Scaffold new document |
| `officecli_helper.py` | Python | Helper utilities for officecli |
| `officecli_numbering.py` | Python | Document numbering logic |
| `pandoc_citeproc.py` | Python | Pandoc citation processing |
| `pdf-from-docx.sh` | Shell | Convert docx to pdf |
| `report_to_deck.py` | Python | Report to deck conversion |
| `scholar_bibtex.py` | Python | Scholar BibTeX retrieval |
| `storytelling_pptx.py` | Python | Storytelling PPTX generation |
| `tests/` | Python | Tool test suite |

## Assets

- **templates/**: 4 document template directories — `paper/`, `presentation/`, `report/`, `thesis/`
- **presets/**: 4 preset files — `drawio-styles/` directory, `hackathon-energetic.json`, `material-light.json`, `storytelling_fallback.json`
- **diagrams/**: 15+ drawio template diagrams — architecture, aws-3-tier, c4-context, erd, flowchart, microservices, network, org-chart, sequence, sequence-template, uml-class, venn, bpmn
- **examples/**: Example document (README.md)

## Integration notes

Sub-skills are symlinked from the `documents-kit-skills` source repo (external). Tools and assets are also symlinks. Run `scripts/setup-documents-kit.sh` to create all symlinks after cloning.

The sub-skills in `skills/` are symlinked to `~/.config/opencode/skills/` via the setup script. The package entry `documents-kit` is also globally accessible: `~/.config/opencode/skills/documents-kit → skills/productivity/documents-kit/`.

Key relationships:
- **document-writing** uses **humanizer** for prose quality, **pandoc_citeproc.py** for citations, **officecli** for docx output
- **storytelling** uses **drawio** for diagrams, **report-to-deck** for converting reports, **officecli** for pptx creation
- **drawio** uses templates from `diagrams/` and styles from `presets/drawio-styles/`
- **document-format** uses **officecli** for docx manipulation
- **scaffold-doc** uses templates from `templates/`
