---
name: document-writing
description: Use when write documents — academic reports, technical docs, READMEs, BAB sections. Use when user says laporan, dokumen, docx, bab, extend, lanjutkan, write, document writing, report writing, essay, paper, artikel. Decision tree for from-scratch (pandoc) vs extending existing (officecli). Citation finding via scout. Format-agnostic — pulls from project's design.md or reference template, NOT hardcoded.
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

## §1. Format Discovery

Run `ls docs/agents/design.md *.csl *.bib reference.docx` to discover format. Follow `design.md` if present; ask user if missing.

---See [REFERENCE.md](REFERENCE.md) for PATH A (pandoc), PATH B (officecli extend), Citation Discovery (scout), and Quick Reference commands.

## §5. The 7 Writing Rules

No em dashes | No "stands as"/"serves as" | No rule of three | No promotional vocab | No signposting | No repetition | Sentence length 15-25 (academic)

## §6. The 10 Anti-Patterns

1=use styleId not name | 2=add --num-id not raw-set | 3=own numId per BAB | 4=read first, then extend | 5=PAGEREF for TOC | 6=verify ALL cells | 7=dedup sentences | 8=target 15-25 words | 9=SQL=executable only | 10=snapshot before edit

## §7. Tool Routing

New doc+pandoc | Extend+officecli | Scout citations | pandoc docx→md

## §9. Self-Review Checklist

- [ ] Format from design.md | No em dashes | No raw-set | Validated | Snapshot taken

## §10. When to Ask User

Ask if: format unclear, citation ambiguous, file corrupt, extension unclear, or need new citations. Otherwise: discover, plan, execute, verify.
