# OpenViking — Reference

See [SKILL.md](SKILL.md) for protocol, critical notes, workflow rules, and anti-patterns.

## Prerequisites

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
│   └── memories/          # including events/YYYY/MM/DD/ (auto-summarized)
└── agent/                 # READ-ONLY (managed by OpenViking internally)
    ├── default/memories/  # trajectories, experiences, identity, soul, tools, skills
    └── patterns/          # agent-learned patterns
```

**Important**: `viking://agent/...` is READ-ONLY. Use `ov add-memory` (auto-routes to `agent/default/memories/`) or `ov add-resource` (must be in `resources/` scope).

## Triggers

### Auto (agent fires without asking)

| Trigger | Command |
|---------|---------|
| User expresses preference ("gw suka X") | `ov add-memory "user preference: ..."` |
| User corrects agent ("kok salah lagi") | `ov add-memory "user correction: ..."` |
| Agent learns significant pattern (3+ confirmations) | `ov add-memory "pattern: ..."` |

### Manual (user triggers)

| Trigger | Command |
|---------|---------|
| Session start (continuing prior work) | `ov find "<query>"` |
| "Remember this" | `ov add-memory "<content>"` |
| "What do you know about X" | `ov find "<query>"` |
| New project context | `ov add-resource <path-or-url>` |
