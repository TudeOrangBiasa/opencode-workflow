---
name: openviking
description: Use when persist agent memory across sessions — store, retrieve, find, or update long-term context. Use when user says memory, remember, openviking, store, retrieve, save context, find memory, search memory. Persistent memory for AI agents with namespace routing (user/agent/resources).
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

See [REFERENCE.md](REFERENCE.md) for core commands, URI scheme, triggers, and prerequisites.

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
