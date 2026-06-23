---
name: openviking
description: Persistent memory for AI agents — store/retrieve context across sessions. Triggers on "memory", "remember", "openviking", "store", "retrieve", "start", "begin", "task", "fix", "implement", "build", "create", "update", "modify", "refactor", "add", "find", "search memory".
---

# OpenViking Context Database

## PROTOCOL (mandatory on every task)

This skill auto-loads on task-start keywords (start, begin, fix, implement, build, create, update, modify, refactor, add, find). When loaded, follow this protocol:

**1. At task start** — check for prior context (SEMANTIC SEARCH, not URI):
```bash
ov find "<task-keyword-or-project-name>"   # e.g. "dbl-data-management lesson", "laporan docx", "auth fix"
```
Skip ONLY if task is a one-line typo fix.

**2. At task end** (user signals done / ship / finish) — store what you learned:
```bash
ov add-memory "<1-2 sentence: what was done, what worked, what to avoid — include project name in content for searchability>"
```

**3. Before retrying a tool that failed** — check for known patterns (semantic search):
```bash
ov find "<tool-name> failure pattern"
```

**4. When user expresses preference** ("gw suka X", "jangan Y", "biasanya Z") — store immediately:
```bash
ov add-memory "user preference: <preference>"
```

**5. When agent makes same mistake twice** — store as lesson via `ov add-memory`, retrieve via `ov find` before retrying.

## Critical: `ov remember` is NOT a real command

**DO NOT use `ov remember`** — it does not exist in OpenViking v0.3.25.

The real commands are:
- `ov add-memory "<text>"` — store a text memory (auto-routed to `viking://agent/default/memories/`)
- `ov add-resource <path> --to <uri>` — store a file (only `viking://resources/...` is writeable)
- `ov write <uri> --content "<text>"` — update an existing resource

For semantic search:
- `ov find "<query>"` — natural language query, returns ranked results

## Reference

Persistent memory and context management for AI agents.

## Prerequisites

OpenViking server must be running:

```bash
openviking-server &
# or via system service
```

## Core Commands (v0.3.25)

### Store Context

```bash
# Plain text memory (most common for lessons)
ov add-memory "Lesson: BAB numbering in officecli — use 'add' with --num-id, never raw-set on numbering.xml"

# File/URL to OpenViking
ov add-resource /path/to/file.md
ov add-resource /path/to/folder
ov add-resource https://example.com/spec.md

# Update existing resource
ov write "viking://resources/projects/foo/notes.md" --content "new text"
```

### Retrieve Context

```bash
# Semantic search (natural language query)
ov find "dbl-data-management lessons about officecli"
ov find "browser quirks for mobile viewport"

# Read exact URI
ov read "viking://resources/projects/foo/notes.md"
```

### Browse

```bash
ov ls viking://
ov tree viking://resources -L 2
ov status
```

## URI Scheme (v0.3.25)

```text
viking://
├── resources/             # WRITEABLE — project docs, repos, web pages
│   └── projects/<name>/   # per-project context
├── user/                  # WRITEABLE — personal preferences, habits
│   ├── preferences/       # durable user prefs
│   ├── lessons/           # lessons learned
│   └── memories/           # including events/YYYY/MM/DD/ (auto-summarized)
└── agent/                 # READ-ONLY (managed by OpenViking internally)
    ├── default/memories/  # trajectories, experiences, identity, soul, tools, skills
    └── patterns/          # agent-learned patterns
```

**Important**: `viking://agent/...` is READ-ONLY. To add memories, use `ov add-memory` (auto-routes to `agent/default/memories/`) or `ov add-resource` (must be in `resources/` scope).

## Triggers

### Auto (agent fires without asking)

| Trigger | Command | Example |
|---------|---------|---------|
| User expresses preference ("gw suka X", "jangan Y") | `ov add-memory "user preference: ..."` | "user prefers terse responses" |
| User corrects agent ("kok salah lagi") | `ov add-memory "user correction: ..."` | "use caveman style, not polite" |
| Agent learns significant pattern (3+ confirmations) | `ov add-memory "pattern: ..."` | "circuits break at 0 results × 3" |
| Session event (auto-summarized) | (OpenViking internal) | `viking://user/default/memories/events/YYYY/MM/DD/` |

### Manual (user triggers)

| Trigger | Command |
|---------|---------|
| Session start (continuing prior work) | `ov find "<query>"` |
| "Remember this" | `ov add-memory "<content>"` |
| "What do you know about X" | `ov find "<query>"` |
| New project context | `ov add-resource <path-or-url>` |

## Workflow Rules

- Use `ov find` (semantic search) before broad exploration when continuing prior work.
- Treat OpenViking as memory/RAG context, not current-file truth.
- Current local files and git diff win over indexed memory.
- Store durable decisions, repeated mistakes, and stable user preferences.
- Do not store secrets or provider keys.
- When user says "remember" or "jangan lupa" → store via `ov add-memory` immediately.
- When agent makes same mistake twice → store via `ov add-memory`, retrieve via `ov find` before retrying.

## Anti-Patterns

- **DON'T use `ov remember`** — not a real command. Use `ov add-memory` or `ov add-resource`.
- **DON'T use `viking://agent/...` URIs** for writes — that scope is read-only.
- Don't store transient state (current task progress, temp variables)
- Don't store secrets, API keys, tokens
- Don't store speculation as lesson (wait for confirmation)
- Don't retrieve on every turn (expensive, pollutes context)
- Don't forget to include project name in lesson content (for searchability)
