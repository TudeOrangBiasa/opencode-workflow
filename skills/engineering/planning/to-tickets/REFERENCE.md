# To Tickets — Reference

See [SKILL.md](SKILL.md) for the core process: gather context, draft vertical slices, quiz user, publish.

## Tickets File Template (local files)

```markdown
# Tickets: <short name of the work>

A one-line summary of what these tickets build. Reference the source spec if there is one.

Work the **frontier**: any ticket whose blockers are all done.

## <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from user's perspective.

**Blocked by:** titles of gating tickets, or "None — can start immediately".

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

## <Ticket title>
...
```

## Issue Template (real tracker)

```markdown
## Parent

Reference to parent issue on tracker (omit if source wasn't an existing issue).

## What to build

The end-to-end behaviour this ticket makes work, from user's perspective.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- Reference to each blocking ticket, or "None — can start immediately".
```

## Wide Refactor Detail

One mechanical change whose blast radius fans across the whole codebase (rename a column, retype a shared symbol). A single edit breaks thousands of call sites; no vertical slice can land green.

**Sequence: expand–contract**

1. **Expand**: add new form beside old — nothing breaks.
2. **Migrate**: batches sized by blast radius (per package, per directory). Each batch = its own ticket blocked by expand. CI stays green because old form still exists.
3. **Contract**: delete old form once no caller remains. Ticket blocked by every migrate batch.

When batches can't stay green alone: sequence stays, but share an integration branch. All block a final integrate-and-verify ticket — green promised only there.

## Avoiding stale content

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet encoding a decision more precisely than prose (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly it came from a prototype. Trim to decision-rich parts.
