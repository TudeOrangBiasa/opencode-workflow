---
name: openviking
description: Persistent memory for AI agents — store/retrieve context across sessions. Triggers on "memory", "remember", "openviking", "store", "retrieve", "start", "begin", "task", "fix", "implement", "build", "create", "update", "modify", "refactor", "add", "find", "search memory".
---

# OpenViking Context Database

## PROTOCOL (mandatory on every task)

This skill auto-loads on task-start keywords (start, begin, fix, implement, build, create, update, modify, refactor, add, find). When loaded, follow this protocol:

**1. At task start** — check for prior context:
```bash
ov find "<task-keyword>"   # e.g. "laporan docx", "laravel invoice", "auth fix"
```
Skip ONLY if task is a one-line typo fix.

**2. At task end** (user signals done / ship / finish) — store what was learned:
```bash
ov remember "viking://agent/projects/<project>" "<1-2 sentence: what was done, what worked, what to avoid>"
ov remember "viking://agent/patterns/<category>" "<pattern that emerged>"
```

**3. Before retrying a tool that failed** — check for known patterns:
```bash
ov find "viking://agent/patterns/tool-failures/<tool>"
```

**4. When user expresses preference** ("gw suka X", "jangan Y", "biasanya Z") — store immediately:
```bash
ov remember "viking://user/preferences/<topic>" "<preference>"
```

**5. When agent makes same mistake twice** — store as lesson before retrying.

## Reference

Persistent memory and context management for AI agents.

## Prerequisites

OpenViking server must be running:

```bash
openviking-server &
```

## Core Commands

### Store Context

```bash
ov add-resource <path-or-url>
ov add-memory "memory content"
```

### Retrieve Context

```bash
ov find "search query"
ov read <uri>
```

### Browse

```bash
ov ls viking://
ov tree viking://resources -L 2
ov status
```

## URI Scheme

```text
viking://
├── resources/             # project docs, repos, web pages
│   └── projects/<name>/   # per-project context
├── user/                  # personal preferences, habits
│   ├── preferences/       # durable user prefs (no TTL)
│   └── lessons/           # lessons learned (TTL: 90d, max 50)
└── agent/                 # skills, instructions, task memories
    └── patterns/          # agent-learned patterns (TTL: 60d, max 30)
```

## Triggers

### Auto (agent fires without asking)

| Trigger | URI | Example |
|---------|-----|---------|
| User expresses preference ("gw suka X", "jangan Y", "biasanya Z") | `viking://user/preferences/` | "user prefers terse responses" |
| User corrects agent ("sudah gw bilang", "kok salah lagi", "kenapa gini") | `viking://user/lessons/` | "user said use caveman style, not polite" |
| Agent learns significant pattern (3+ confirmations, repeated success) | `viking://agent/patterns/` | "circuits break at 0 results × 3" |

### Manual (user triggers)

| Trigger | Command |
|---------|---------|
| Session start (continuing prior work) | `ov find "<query>"` |
| "Remember this" | `ov add-memory "<content>"` |
| "What do you know about X" | `ov find "<query>"` |
| New project context | `ov add-resource <path-or-url>` |

## Cleanup Rules

| Namespace | TTL | Max Entries | Cleanup |
|-----------|-----|-------------|---------|
| `viking://user/preferences/` | none | none | manual only |
| `viking://user/lessons/` | 90 days | 50 | review and delete stale |
| `viking://agent/patterns/` | 60 days | 30 | review and delete stale |
| `viking://resources/projects/<name>/` | none | none | manual only |

When entry > TTL or > max:
1. Agent reviews entry
2. Decide: keep (update TTL) or delete
3. Log decision in cleanup log

## Workflow Rules

- Use OpenViking before broad exploration when continuing prior work.
- Treat OpenViking as memory/RAG context, not current-file truth.
- Current local files and git diff win over indexed memory.
- Store durable decisions, repeated mistakes, and stable user preferences.
- Do not store secrets or provider keys.
- When user says "remember" or "jangan lupa" → store immediately, confirm URI.
- When agent makes same mistake twice → store as lesson, retrieve before retry.

## Anti-Patterns

- Don't store transient state (current task progress, temp variables)
- Don't store secrets, API keys, tokens
- Don't store speculation as lesson (wait for confirmation)
- Don't retrieve on every turn (expensive, pollutes context)
- Don't store without URI prefix (agent won't find it later)
