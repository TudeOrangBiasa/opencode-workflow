---
name: wayfinder
description: Plan a huge chunk of work — more than one agent session can hold — as a shared map of investigation tickets on your issue tracker, and resolve them one at a time until the way to the destination is clear.
disable-model-invocation: true
---

A loose idea arrived — too big for one session, route to destination unclear. Wayfinding charts the way as a **shared map** on the repo's issue tracker, then works tickets one at a time until the route is clear.

## Plan, don't do

Wayfinder is **planning** by default: each ticket resolves a decision. Map done when nothing left to decide before someone does the thing. An effort can override via its **Notes** — carrying execution into the map — but default: produce decisions, not deliverables.

## Refer by name

Every map and ticket is an issue with a **name** (its title). In narration, decisions, summaries — refer by name, never bare id/slug. The id and URL ride inside the name, never stand in for it.

## The Map

The map is a single issue labelled `wayfinder:map`. Its tickets are child issues. The map is an **index**, not a store — lists decisions made, points at tickets for detail. See [REFERENCE.md](REFERENCE.md) for map body template.

### Tickets

Each ticket is a **child issue** of the map, sized to one 100K-token session. Body = the question. Carries a `wayfinder:<type>` label. Claim by assigning yourself before work. Blocking uses the tracker's native dependency relationship.

### Ticket Types

| Type | HITL/AFK | Use when |
|------|----------|----------|
| Research | AFK | Reading docs/APIs outside codebase |
| Prototype | HITL | "How should it look/work?" — make a rough artifact |
| Grilling | HITL | Conversation one question at a time (default) |
| Task | HITL/AFK | Work that must happen before a decision (sign up, provision, move data) |

## Fog of war

Beyond live tickets lies **fog of war** — decisions you know are coming but can't pin down. Not-yet-specified goes in the map's **Not yet specified** section. Test: can you state the question precisely now? Yes → ticket. No → fog.

Out-of-scope work (beyond the destination) never graduates — it gets its own **Out of scope** section.

## Invocation

Two modes. **Never resolve more than one ticket per session.**

### Chart the map

1. **Name the destination** via `/grilling` and `/grill-with-docs`.
2. **Map the frontier** breadth-first. If no fog (route already clear for one session) → stop, no map needed.
3. **Create the map** (label `wayfinder:map`).
4. **Create tickets** as child issues, wire blocking edges in second pass.
5. Stop — charting is one session's work.

### Work through the map

1. Load the map.
2. Pick the first unblocked frontier ticket (or user's choice). **Claim it**.
3. Resolve — zoom as needed, invoke skills from Notes.
4. Record: resolution comment → close issue → append to Decisions-so-far.
5. Graduate fog, create new tickets, rule out-of-scope as needed.
