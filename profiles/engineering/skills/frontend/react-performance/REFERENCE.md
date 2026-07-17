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
