---
name: react-performance
description: Use only when optimizing React application performance: rendering profiling, memo strategies, state management, code splitting, and bundle analysis.
---

# React Performance

Adapted from ECC's `react-performance` skill (MIT).

Performance optimization patterns for React 18/19 and Next.js, adapted from [Vercel Labs `react-best-practices`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) (MIT, v1.0.0). This skill organizes rules by priority and provides decision-tree guidance for active code review and refactoring.

## When to Activate

- Writing or reviewing React/Next.js code for performance
- Diagnosing slow page loads, slow interactions, or high CPU on the client
- Auditing bundle size or Lighthouse Core Web Vitals regressions
- Removing waterfalls in Server Components / API routes
- Reducing client-side re-renders
- Optimizing long lists, animations, or hydration
- Auditing optimization choices in PRs touching `app/`, `pages/`, `components/`, or data layers

For full performance rules, patterns, and examples, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Writing or reviewing React/Next.js code for performance
- Diagnosing slow page loads, slow interactions, or high CPU on the client
- Auditing bundle size or Lighthouse Core Web Vitals regressions
- Removing waterfalls in Server Components / API routes
- Reducing client-side re-renders
- Optimizing long lists, animations, or hydration
- Auditing optimization choices in PRs touching `app/`, `pages/`, `components/`, or data layers

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Waterfalls](REFERENCE.md#1-eliminating-waterfalls-critical) | Promise.all, defer awaits, parallel composition |
| [Bundle Size](REFERENCE.md#2-bundle-size-optimization-critical) | Direct imports, dynamic imports, code splitting |
| [Server-Side Perf](REFERENCE.md#3-server-side-performance-high) | React.cache, RSC dedup, after(), minimize serialization |
| [Client Fetching](REFERENCE.md#4-client-side-data-fetching-medium-high) | SWR/TanStack, dedup listeners, localStorage |
| [Re-render Optimization](REFERENCE.md#5-re-render-optimization-medium) | Memo strategy, state selection, useTransition |
| [Rendering Perf](REFERENCE.md#6-rendering-performance-medium) | content-visibility, Activity, resource hints |
| [JS Performance](REFERENCE.md#7-javascript-performance-low-medium) | Batch DOM, Map lookups, flatMap |
| [Advanced Patterns](REFERENCE.md#8-advanced-patterns-low) | useLatest, effect refs, init-once |
| [Web Vitals Mapping](REFERENCE.md#lighthouse--web-vitals-mapping) | LCP/INP/CLS/TBT category map |
