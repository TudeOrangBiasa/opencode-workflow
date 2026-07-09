---
name: error-handling
description: Use when error-handling review checklist for typed errors, retry boundaries, user-safe messages, logging, API error envelopes, and swallowed exceptions. Use only when error paths are the task focus or code is at a high-risk boundary.
---

# Error Handling Patterns

Adapted from ECC's `error-handling` skill (MIT).

Consistent, robust error handling patterns for production applications.

## When to Activate

- Designing error types or exception hierarchies for a new module or service
- Adding retry logic or circuit breakers for unreliable external dependencies
- Reviewing API endpoints for missing error handling
- Implementing user-facing error messages and feedback
- Debugging cascading failures or silent error swallowing

See [REFERENCE.md](REFERENCE.md) for typed error classes, Result pattern, API error handlers, React Error Boundaries, Python/FastAPI/Go examples, retry with backoff, and user-facing messages.
