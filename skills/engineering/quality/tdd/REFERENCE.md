# Test-Driven Development — Reference

> Full patterns and examples. See SKILL.md for quick start.

## Anti-Pattern: Horizontal Slices

**DO NOT** write all tests first, then all implementation. This produces crap tests that test _imagined_ behavior, not _actual_ behavior.

Correct approach: vertical slices via tracer bullets. One test → one implementation → repeat.

```
WRONG: RED: test1..5 → GREEN: impl1..5
RIGHT: RED→GREEN per cycle (test1→impl1, test2→impl2, ...)
```

## Planning

Before writing any code:
- Confirm interface changes with user
- Confirm behavior priorities
- Identify deep module opportunities
- Design for testability
- List behaviors to test

## Tracer Bullet

Write ONE test that confirms ONE thing. RED → GREEN proves the path works end-to-end.

## Incremental Loop

For each remaining behavior: RED (write failing test) → GREEN (minimal code to pass).

Rules: one test at a time, only enough code to pass, don't anticipate future tests.

## Refactor

After all tests pass: extract duplication, deepen modules, apply SOLID, run tests after each step. Never refactor while RED.

## Checklist Per Cycle

- Test describes behavior, not implementation
- Test uses public interface only
- Test would survive internal refactor
- Code is minimal for this test
- No speculative features added
