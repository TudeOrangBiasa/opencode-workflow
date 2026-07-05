---
name: ai-regression-testing
description: Use when regression testing for AI-assisted development — sandbox-mode API testing without DB, automated bug-check workflows, and patterns for AI blind spots where same model writes and reviews code. Use only when AI agents have modified API routes, after bug fixes, or running bug-check review.
---

# AI Regression Testing

Adapted from ECC's `ai-regression-testing` skill (MIT).

Testing patterns specifically designed for AI-assisted development, where the same model writes code and reviews it — creating systematic blind spots that only automated tests can catch.

## When to Activate

- AI agent (OpenCode, Cursor, Codex) has modified API routes or backend logic
- A bug was found and fixed — need to prevent re-introduction
- Project has a sandbox/mock mode that can be leveraged for DB-free testing
- Running `/bug-check` or similar review commands after code changes
- Multiple code paths exist (sandbox vs production, feature flags, etc.)

## The Core Problem

When an AI writes code and then reviews its own work, it carries the same assumptions into both steps.

See [REFERENCE.md](REFERENCE.md) for setup, test helpers, regression test patterns, bug-check workflow, common AI regression patterns with code examples, and best practices.
