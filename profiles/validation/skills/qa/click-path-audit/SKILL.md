---
name: click-path-audit
description: Use when trace every user-facing button through its full state change sequence to find bugs where functions individually work but cancel each other out. Use only when systematic debugging found no bugs but users report broken UI, or after refactors touching shared state stores.
---

# /click-path-audit — Behavioural Flow Audit

Adapted from ECC's `click-path-audit` skill (MIT).

Find bugs that static code reading misses: state interaction side effects, race conditions between sequential calls, and handlers that silently undo each other.

See [REFERENCE.md](REFERENCE.md) for the problem detail, full execution steps (state mapping, touchpoint audit, reporting), bug patterns, scope control, and the example that inspired this skill.
