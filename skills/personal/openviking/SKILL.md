---
name: openviking
description: Persistent memory for AI agents — store/retrieve context across sessions. Triggers on "memory", "remember", "openviking", "store", "retrieve".
---

# OpenViking Context Database

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
├── resources/     # project docs, repos, web pages
├── user/          # personal preferences, habits
└── agent/         # skills, instructions, task memories
```

## Workflow Rules

- Use OpenViking before broad exploration when continuing prior work.
- Treat OpenViking as memory/RAG context, not current-file truth.
- Current local files and git diff win over indexed memory.
- Store durable decisions, repeated mistakes, and stable user preferences.
- Do not store secrets or provider keys.
