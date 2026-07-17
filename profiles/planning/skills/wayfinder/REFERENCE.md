# Wayfinder — Reference

See [SKILL.md](SKILL.md) for the core workflow: chart map, work tickets, ticket types.

## The Map Body Template

The whole map at low resolution, loaded once per session:

```markdown
## Destination

<what reaching the end looks like — spec, decision, or change>

## Notes

<domain; skills every session should consult; standing preferences>

## Decisions so far

- [<closed ticket title>](link) — <one-line gist of answer>

## Not yet specified

<!-- in-scope fog you can't ticket yet; graduates as frontier advances -->

## Out of scope

<!-- work ruled beyond the destination; closed, never graduates -->
```

## Ticket Body Template

```markdown
## Question

<the decision or investigation this ticket resolves>
```

## Ticket Type Detail

- **Research** (AFK): Reading docs/third-party APIs/local knowledge bases. Creates markdown summary as linked asset.
- **Prototype** (HITL): Raise discussion fidelity via cheap rough artifact (outline, stub, UI/logic code via `/prototype`). Links prototype as asset.
- **Grilling** (HITL): Conversation via `/grilling` and `/grill-with-docs`, one question at a time. Default case.
- **Task** (HITL or AFK): Manual work blocking a decision — nothing to decide, but discussion blocked until done. Agent drives alone where possible (AFK); otherwise hands precise checklist (HITL). Resolved when work done.

## Fog of War Detail

The map is deliberately incomplete. Beyond live tickets lies the dim view of decisions you can tell are coming but can't pin down. Resolving a ticket clears the fog ahead of it, graduating whatever's now specifiable into fresh tickets.

Fog belongs in **Not yet specified**. Out of scope belongs in its own section — ruled out of this effort, never graduates unless destination redrawn.

## Out of Scope Detail

When a ticket turns out to sit past the destination: close it, add one line to Out of scope (gist + why). It stays out of Decisions so far, which records the route actually walked.

## Work Through Map Detail

1. Load map — low-res view, not every ticket body.
2. If user named a ticket, use it. Otherwise first unblocked frontier.
3. Assign to yourself before any work.
4. Resolve — zoom as needed; invoke skills from Notes.
5. Post answer as resolution comment, close issue, append to map Decisions-so-far.
6. Create newly-surfaced tickets; graduate fog from Not yet specified.
7. If answer reveals a ticket sits beyond destination, rule it out of scope.
8. User may run unblocked tickets in parallel — other sessions may edit tracker concurrently.
