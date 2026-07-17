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
