---
name: search-first
description: Use when research-before-coding for external dependency, integration, or custom utility decisions. Searches npm/PyPI, MCP servers, GitHub, web. Decision matrix: adopt → extend → compose → build. Not for every small code edit.
---

# /search-first — Research Before You Code

Adapted from ECC's `search-first` skill (MIT).

Systematizes the "search for existing solutions before implementing" workflow.

## Trigger

Use this skill when:
- Starting a new feature that likely has existing solutions
- Adding a dependency or integration
- The user asks "add X functionality" and you're about to write code
- Before creating a new utility, helper, or abstraction

## Workflow

```
┌─────────────────────────────────────────────┐
│  0. TOOL AVAILABILITY PREFLIGHT             │
│     Check search channels before relying on │
│     them; report skipped channels honestly   │
├─────────────────────────────────────────────┤
│  1. NEED ANALYSIS                           │
│     Define what functionality is needed      │
│     Identify language/framework constraints  │
├─────────────────────────────────────────────┤
│  2. PARALLEL SEARCH (researcher agent)      │
│     ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│     │  npm /   │ │  MCP /   │ │  GitHub / │  │
│     │  PyPI    │ │  Skills  │ │  Web      │  │
│     └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────┤
│  3. EVALUATE                                │
│     Score candidates (functionality, maint, │
│     community, docs, license, deps)         │
├─────────────────────────────────────────────┤
│  4. DECIDE                                  │
│     ┌─────────┐  ┌──────────┐  ┌─────────┐  │
│     │  Adopt  │  │  Extend  │  │  Build   │  │
│     │ as-is   │  │  /Wrap   │  │  Custom  │  │
│     └─────────┘  └──────────┘  └─────────┘  │
├─────────────────────────────────────────────┤
│  5. IMPLEMENT                               │
│     Install package / Configure MCP /       │
│     Write minimal custom code               │
└─────────────────────────────────────────────┘
```

For full workflow details, examples, and anti-patterns, see [REFERENCE.md](REFERENCE.md).

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Workflow](REFERENCE.md#workflow-diagram) | Full research workflow diagram |
| [Decision Matrix](REFERENCE.md#decision-matrix) | Adopt vs Extend vs Compose vs Build |
| [Preflight](REFERENCE.md#step-0-tool-availability-preflight) | Channel availability checklist |
| [Quick Mode](REFERENCE.md#quick-mode-inline) | Inline mental checklist |
| [Full Mode](REFERENCE.md#full-mode-agent) | Researcher agent prompt template |
| [Shortcuts](REFERENCE.md#search-shortcuts-by-category) | Per-category search targets |
| [Examples](REFERENCE.md#examples) | Dead link check, HTTP client, config linter |
| [Anti-Patterns](REFERENCE.md#anti-patterns) | Common mistakes |
