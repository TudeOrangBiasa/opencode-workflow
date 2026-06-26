---
name: tdd
description: Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.
---

# Test-Driven Development

For full details on anti-patterns, workflow, and refactoring, see [REFERENCE.md](REFERENCE.md).

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Anti-Pattern: Horizontal Slices](REFERENCE.md#anti-pattern-horizontal-slices) | Why vertical slices matter |
| [Planning](REFERENCE.md#planning) | Pre-coding checklist |
| [Tracer Bullet](REFERENCE.md#tracer-bullet) | One test at a time |
| [Incremental Loop](REFERENCE.md#incremental-loop) | RED→GREEN→REFACTOR repetition |
| [Refactor](REFERENCE.md#refactor) | After all tests pass |
| [Checklist](REFERENCE.md#checklist-per-cycle) | Per-cycle verification |
