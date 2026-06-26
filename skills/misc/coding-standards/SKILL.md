---
name: coding-standards
description: Use only when enforcing baseline coding conventions — naming, readability, immutability, error handling, type safety, and code quality across any project.
---

# Coding Standards & Best Practices

Adapted from ECC's `coding-standards` skill (MIT).

Baseline coding conventions applicable across projects.

This skill is the shared floor, not the detailed framework playbook.

- Use `frontend-patterns` for React, state, forms, rendering, and UI architecture.
- Use `backend-patterns` or `api-design` for repository/service layers, endpoint design, validation, and server-specific concerns.
- Use `rules/common/coding-style.md` when you need the shortest reusable rule layer instead of a full skill walkthrough.

## When to Activate

- Starting a new project or module
- Reviewing code for quality and maintainability
- Refactoring existing code to follow conventions
- Enforcing naming, formatting, or structural consistency
- Setting up linting, formatting, or type-checking rules
- Onboarding new contributors to coding conventions

## Scope Boundaries

Activate this skill for:
- descriptive naming
- immutability defaults
- readability, KISS, DRY, and YAGNI enforcement
- error-handling expectations and code-smell review

Do not use this skill as the primary source for:
- React composition, hooks, or rendering patterns
- backend architecture, API design, or database layering
- domain-specific framework guidance when a narrower ECC skill already exists

## Scope Boundaries

Activate this skill for naming, immutability, readability, KISS/DRY/YAGNI, error-handling expectations, and code-smell review.

Do not use as primary source for React composition, backend architecture, API design, or domain-specific framework guidance.

See [REFERENCE.md](REFERENCE.md) for full code quality principles, language-specific standards (TypeScript, React, API), file organization, testing standards, code smell detection, and best practices.
