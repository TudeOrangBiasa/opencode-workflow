# React Patterns — Reference

> Full patterns, examples, and anti-patterns. See SKILL.md for when-to-use.

## Core Principles

- Render is a pure function of props and state — derive during render, not in useEffect
- Side effects outside render
- Composition over inheritance

## Hooks Discipline

See rules/react/hooks.md for the full ruleset. Highlights:
- Top-level only, never conditional
- Cleanup every subscription, interval, listener
- Functional updater when new state depends on old
- Default position: do not memoize
- Extract custom hook only when the same sequence appears in 2+ components

## State Location Decision Tree

```
Used by one component? → useState
Used by parent + few descendants? → lift state
Used across distant branches AND low-frequency reads? → React Context
High-frequency updates shared across tree? → external store (Zustand, Jotai, Redux Toolkit)
Derived from server? → TanStack Query, SWR, RSC fetch
```

## Server / Client Components (RSC)

Server Component is the default, async, never ships JS. Use `"use client"` for interactivity. Pass serializable props or `children` across the boundary. Never import a Server Component from a Client Component file.

## Suspense + Error Boundaries

Place Suspense boundaries close to the data, not at the route root. Error Boundary is still a class API; use `react-error-boundary` for a hook-friendly wrapper.

## Forms

React 19 form actions with `useActionState` (preferred for new code). Controlled inputs when value drives other UI. For complex forms, use React Hook Form or TanStack Form.

## Data Fetching Decision Matrix

| Need | Tool |
|---|---|
| Per-request data in Next.js App Router | RSC `await fetch()` |
| Client-side cache + mutations | TanStack Query |
| Lightweight client cache | SWR |
| Real-time subscriptions | SSE, WebSockets |

## Composition Recipes

Slot via `children`, named slots, compound components with Context, render props/function-as-child (modern alternative: hooks).

## Performance

React.memo only when: (1) frequent re-renders, (2) same props usually, (3) expensive render. Avoid render cascades: lift state down, split context, useSyncExternalStore. Stable `key` props, virtualize long lists.

## Accessibility-First Composition

Semantic HTML first, keyboard reachable, labeled inputs, focus management, axe in component tests.

## Examples

Custom hook for debounced search, optimistic UI with `useOptimistic`, splitting context to avoid render cascades.
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
# React Performance — Reference

> Full performance patterns and rules. See SKILL.md for when-to-use.

## Priority Index

| Priority | Category | When it matters |
|---|---|---|
| 1 — CRITICAL | Eliminating Waterfalls | Anytime `await` is followed by independent `await` |
| 2 — CRITICAL | Bundle Size Optimization | First-load JS, route-level imports |
| 3 — HIGH | Server-Side Performance | RSC, Server Actions, API routes |
| 4 — MEDIUM-HIGH | Client-Side Data Fetching | SWR/TanStack/raw fetch |
| 5 — MEDIUM | Re-render Optimization | High-frequency state updates |
| 6 — MEDIUM | Rendering Performance | Long lists, animations |
| 7 — LOW-MEDIUM | JavaScript Performance | Hot loops, allocations |
| 8 — LOW | Advanced Patterns | Effect-event, stable refs |

## 1. Eliminating Waterfalls

Cheap conditions before await, defer awaits until used, Promise.all for independent work, partial dependencies (start early, await late), Suspense for streaming, parallel Server Components through composition.

## 2. Bundle Size Optimization

Direct imports (not barrels), statically analyzable dynamic imports, dynamic imports for heavy components, defer third-party scripts, conditional module loading, preload on hover/focus.

## 3. Server-Side Performance

Authenticate Server Actions, React.cache() for per-request dedup, LRU cache for cross-request data, avoid duplicate serialization in RSC props, hoist static I/O to module scope, minimize data passed to Client Components, use after() for non-blocking work.

## 4. Client-Side Data Fetching

SWR/TanStack Query for deduplication, deduplicate global event listeners, passive listeners for scroll, localStorage version + minimize.

## 5. Re-render Optimization

Don't subscribe to state used only in callbacks, extract expensive work into memoized components, hoist default non-primitive props, primitive dependencies in effects, subscribe to derived booleans, derive during render (not useEffect), functional setState, lazy state initializer, avoid memo for simple primitives, split hooks with independent deps, move interaction logic into event handlers, startTransition, useDeferredValue, useRef for transient values, don't define components inside components.

## 6. Rendering Performance

Animate wrapper not SVG, content-visibility: auto, hoist static JSX, reduce SVG coordinate precision, hydration inline script, suppressHydrationWarning narrowly, `<Activity>` for show/hide, ternary over &&, useTransition, React DOM resource hints, defer/async on scripts.

## 7. JavaScript Performance

Batch DOM changes, Map for lookups, cache property access in loops, memoize pure functions, cache localStorage reads, combine filter().map(), check array length first, early return, hoist RegExp, loop for min/max, Set/Map for membership, flatMap, requestIdleCallback.

## 8. Advanced Patterns

useEffectEvent deps, event handler refs, init once per app load, useLatest for stable callback refs.

## Automated Tools

Next.js 13.5+ Optimize Package Imports, React Compiler (canary), Turbopack, Bundle Analyzer.

## Lighthouse / Web Vitals Mapping

LCP → Waterfalls, Bundle Size; INP → Re-render, Rendering; CLS → Suspense placement; TBT → Bundle Size, JS.
