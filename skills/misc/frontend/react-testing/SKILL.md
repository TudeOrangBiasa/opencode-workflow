---
name: react-testing
description: Use when react component testing with React Testing Library, Vitest, MSW, and axe accessibility assertions. Use only when writing or fixing tests for React components, hooks, or pages.
---

# React Testing

Adapted from ECC's `react-testing` skill (MIT).

For full patterns, examples, and configuration, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Writing tests for React components, custom hooks, or pages
- Adding test coverage to legacy untested components
- Migrating from Enzyme or class-component-era patterns to React Testing Library
- Setting up Vitest or Jest for a new React project
- Mocking HTTP requests in tests
- Asserting accessibility violations
- Deciding which tests belong in RTL vs Playwright Component Testing vs full E2E

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Principle](REFERENCE.md#core-principle) | Test behavior, not implementation |
| [Library Choice](REFERENCE.md#library-choice) | Vitest vs Jest vs Playwright CT |
| [Query Priority](REFERENCE.md#query-priority) | Accessible queries, getBy vs queryBy vs findBy |
| [userEvent](REFERENCE.md#user-interaction-with-userevent) | User interaction patterns |
| [Async Patterns](REFERENCE.md#async-patterns) | findBy, waitFor, waitForElementToBeRemoved |
| [MSW](REFERENCE.md#network-mocking-with-msw) | Network mocking setup |
| [Provider Wrapping](REFERENCE.md#provider-wrapping) | test-utils renderWithProviders |
| [Hook Testing](REFERENCE.md#custom-hook-testing) | renderHook, act patterns |
| [Accessibility](REFERENCE.md#accessibility-assertions) | jest-axe integration |
| [E2E Decision](REFERENCE.md#when-to-reach-for-playwright--cypress) | RTL vs Playwright CT vs E2E |
| [Coverage Targets](REFERENCE.md#coverage-targets) | Per-layer thresholds |
| [Anti-Patterns](REFERENCE.md#anti-patterns) | Common mistakes |
| [TDD Workflow](REFERENCE.md#tdd-workflow) | Red-green-refactor for components |
| [Commands](REFERENCE.md#test-commands) | Vitest/Jest CLI |
