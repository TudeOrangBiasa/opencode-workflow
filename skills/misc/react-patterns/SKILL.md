---
name: react-patterns
description: Use when react 18/19 patterns — hooks discipline, server/client component boundaries, Suspense + error boundaries, form actions, state management decisions. Use only when writing, reviewing, or refactoring React components.
---

# React Patterns

Adapted from ECC's `react-patterns` skill (MIT).

Idiomatic React 18/19 patterns for building robust, accessible, performant component trees.

## When to Activate

- Writing or modifying React function components, custom hooks, or component trees
- Reviewing JSX/TSX files
- Designing state shape or component composition
- Migrating class components or older `forwardRef`/`useEffect`-heavy code
- Choosing between local state, lifted state, context, and external stores
- Working with Server Components / Client Components (Next.js App Router, RSC)
- Implementing forms with React 19 actions or controlled inputs
- Wiring data fetching with TanStack Query / SWR / RSC

For full patterns, examples, and anti-patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Writing or modifying React function components, custom hooks, or component trees
- Reviewing JSX/TSX files
- Designing state shape or component composition
- Migrating class components or older `forwardRef`/`useEffect`-heavy code
- Choosing between local state, lifted state, context, and external stores
- Working with Server Components / Client Components (Next.js App Router, RSC)
- Implementing forms with React 19 actions or controlled inputs
- Wiring data fetching with TanStack Query / SWR / RSC

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Principles](REFERENCE.md#core-principles) | Pure render, side effects, composition |
| [Hooks Discipline](REFERENCE.md#hooks-discipline) | Rules, memoization strategy |
| [State Location](REFERENCE.md#state-location-decision-tree) | useState vs context vs external store |
| [RSC Boundaries](REFERENCE.md#server--client-components-rsc) | Server/Client Component patterns |
| [Suspense & Error Boundaries](REFERENCE.md#suspense--error-boundaries) | Progressive loading, error recovery |
| [Forms](REFERENCE.md#forms) | useActionState, controlled inputs, complex forms |
| [Data Fetching](REFERENCE.md#data-fetching-decision-matrix) | RSC vs TanStack Query vs SWR |
| [Composition](REFERENCE.md#composition-recipes) | Slots, compound components, render props |
| [Performance](REFERENCE.md#performance) | React.memo, render cascades, lists |
| [Accessibility](REFERENCE.md#accessibility-first-composition) | Semantic HTML, keyboard, labels |
| [Examples](REFERENCE.md#examples) | Debounced search, optimistic UI, context splitting |
