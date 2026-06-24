---
name: memory-dreaming
description: Use when consolidate, merge, archive, or clean up OpenViking memory entries. Use when user says consolidate, dream, clean up lessons, memory hygiene, merge duplicates, archive stale. Auto-loads on intent — finds duplicates across sessions, merges, archives stale entries.
---

# Memory Dreaming

Consolidation layer for agent lessons. Two-phase pipeline: Review → Present + Merge. Manual trigger.

## When to use

User says "consolidate", "dream", "clean up lessons", or "memory hygiene". Run periodically as lessons accumulate.

## Phase 1: Review

Query all lessons for a project:

```bash
ov find "<project-name>" -n 100 --output json
```

Extract `result.memories[]` — each has `uri`, `abstract`, `score`. Classify each entry:

- **Merge**: same lesson, different wording across 2+ entries
- **Archive**: duplicate, superseded, irrelevant
- **Keep**: unique, still relevant

Single broad query covers all subagent namespaces (builder `lessons`, reviewer `review patterns`, browser-qa `browser quirks`). No per-namespace queries.

## Phase 2: Present + Merge

Show each entry as a diff:

```
[1] <uri>
    Content: <abstract>
    Proposed: merge-into / archive / keep
```

**Mandatory**: show every entry before any write. False-merge erodes trust.

Gate on user approval:

```
Consolidate N → M? [y/n/edit]
```

On approval:

```bash
# Merged → store canonical lesson
ov add-memory "<canonical merged entry>"

# Archived → attempt removal
ov rm <uri>
```

**Graceful fallback**: if `ov rm <uri>` errors, report "N entries eligible for deletion but ov rm returned error — manual cleanup needed" and continue processing.

Report:

```
Consolidated N → M
```

No stale detection (>30d unreferenced) — YAGNI. No contradiction primitive — handle ad-hoc if user mentions. No cron/daemon — manual only.

## Anti-patterns

- NO auto-merge without user review
- NO hidden merge — show each entry's diff
- NO invented write commands — only `ov add-memory` exists for text memories
- NO direct URI writes into agent namespace — only `ov add-memory` can write there
- NO per-namespace separate queries — single broad query
- NO batch >30 entries — overwhelming for user review
- NO cron/daemon — manual trigger only
- NO stats beyond "Consolidated N → M" — YAGNI

## Self-review checklist

- [ ] All entries listed before proposing changes
- [ ] Each entry labeled with proposed action (merge/archive/keep)
- [ ] Plan presented before any write
- [ ] Merged entries use `ov add-memory` (the only real memory write command)
- [ ] `ov rm` fallback documented in case of errors
- [ ] Reported "Consolidated N → M" at end

## Acceptance criteria

- [ ] Frontmatter triggers: consolidate, dream, clean up lessons, memory hygiene
- [ ] Uses only real OpenViking commands: `ov find`, `ov add-memory`, `ov rm`
- [ ] Per-entry diff mandatory (URI + content + proposed action)
- [ ] User approval gate before any write
- [ ] `ov rm` graceful fallback documented
- [ ] 2-phase structure, not 4-phase
