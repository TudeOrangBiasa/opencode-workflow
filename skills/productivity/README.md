# Productivity

Daily non-code workflow tools — research, documents, handoffs, skill authoring.

## When to use

You are writing documents, researching topics, handing off context, creating skills, or editing prose. These tools are not code-specific but support the work around code.

## Boundary with sibling buckets

**Productivity** covers tools that support the workflow around code but are not code skills themselves: deep research (web search), document creation (docx/pptx/diagrams), context handoffs, and meta-skill creation. Use **Engineering** for pipeline code-work skills (planning, review, TDD, diagnose). Use **Misc** for specialist domain skills (specific frameworks, databases, languages). Use **Personal** for setup-specific tools tied to this machine. If a skill involves document generation, prose editing, or presentation building, it belongs in Productivity.

## Structure

Standalone skills plus the **documents-kit** sub-package (10 sub-skills + 15 tools + assets).

### documents-kit (sub-package)

See [./documents-kit/SKILL.md](./documents-kit/SKILL.md) for full documentation.

Package entry for the documents-kit-skills ecosystem. Includes 10 sub-skills, 15 glue scripts, and 4 asset directories (templates, presets, diagrams, examples). Sub-skills:

- **document-format** — Heading numbering, TOC, captions, cross-references in .docx
- **document-writing** — Full document workflow (scaffold → write → cite → format → export)
- **documents-kit** — Unified CLI delegating to all sub-skills
- **drawio** — Generate .drawio diagrams with style presets and reusable templates
- **humanizer** — Remove AI-generated writing patterns from prose
- **officecli** — Create, analyze, proofread, modify Office documents
- **pdf-export** — Export DOCX/PPTX to PDF via LibreOffice
- **report-to-deck** — Convert markdown report → story.yaml + story.md for storytelling
- **scaffold-doc** — Scaffold new documents from built-in templates
- **storytelling** — Generate narrative PPTX pitch decks from YAML + Markdown

### Standalone skills

- **deep-research** — Multi-source deep research using web search MCP — searches, synthesizes, delivers cited reports with source attribution.
- **grill-me** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.
- **handoff** — Compact the current conversation into a handoff document so another agent can continue the work.
- **write-a-skill** — Create new skills with proper structure, progressive disclosure, and bundled resources.
