# React Testing — Reference

> Full patterns, examples, and APIs. See SKILL.md for when-to-use.

## Core Principle

Test what the user sees and does, not implementation details. Use accessible queries and userEvent.

## Library Choice

| Runner | When |
|---|---|
| Vitest | Vite, Remix, modern setups |
| Jest | Next.js, CRA, established repos |
| Playwright CT | Real browser engine needed |
| Cypress CT | Cypress already in use |

## Query Priority

1. Accessible: getByRole, getByLabelText, getByPlaceholderText, getByText, getByDisplayValue
2. Semantic: getByAltText, getByTitle
3. Test IDs (escape hatch): getByTestId

Variants: getBy* (throws), queryBy* (null), findBy* (async/Promise).

## User Interaction with userEvent

Always `await` userEvent calls, setup once per test. userEvent > fireEvent.

## Async Patterns

findByText, waitFor, waitForElementToBeRemoved. Never setTimeout + assertion.

## Network Mocking with MSW

Mock at the network layer. Setup server with handlers, per-test override with server.use(). Configure `onUnhandledRequest: "error"`.

## Provider Wrapping

Create a `renderWithProviders` wrapper in test-utils.tsx for QueryClient, ThemeProvider, MemoryRouter.

## Custom Hook Testing

renderHook + act from @testing-library/react. Test through public API only. For hooks with context, pass a `wrapper`.

## Accessibility Assertions

jest-axe/vitest-axe with toHaveNoViolations matcher. Run for every interactive component.

## Snapshots

Don't snapshot rendered output — breaks on styling changes, tests implementation detail. Acceptable: pure data serialization functions, generated config files.

## When to Reach for Playwright/Cypress

JSDOM can't do real layout, animations, scrolling, drag-and-drop, clipboard, iframes, cross-origin.

Decision: RTL for hooks/presentational, Playwright CT for layout-heavy, E2E for full user flows.

## Coverage Targets

| Layer | Target |
|---|---|
| Pure utilities | ≥90% |
| Custom hooks | ≥85% |
| Presentational | ≥80% |
| Container | ≥70% |

## Anti-Patterns

container.querySelector, asserting on render count, mocking React, mocking child components by default, ignoring act() warnings, sharing mutable state across tests.

## TDD Workflow

RED → GREEN → REFACTOR → REPEAT. One test at a time, minimal code to pass.
