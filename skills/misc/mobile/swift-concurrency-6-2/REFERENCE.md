# Swift 6.2 Concurrency — Reference

> Full patterns and examples. See SKILL.md for when-to-use.

## Core Problem: Implicit Background Offloading

In Swift 6.1 and earlier, async functions could be implicitly offloaded to background threads, causing data-race errors. Swift 6.2 fixes this: async functions stay on the calling actor by default.

## Core Pattern: Isolated Conformances

MainActor types can now conform to non-isolated protocols safely via `@MainActor` conformance extension.

## Core Pattern: Global and Static Variables

Protect global/static state with `@MainActor`. Swift 6.2 introduces MainActor default inference mode — no manual annotations needed.

## Core Pattern: @concurrent for Background Work

Explicitly offload CPU-intensive work with `@concurrent`. Requires:
1. Mark containing type as `nonisolated`
2. Add `@concurrent` to the function
3. Add `async` if not already
4. Add `await` at call sites

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Single-threaded by default | Most natural code is data-race free |
| Async stays on calling actor | Eliminates implicit offloading |
| Isolated conformances | MainActor types conform safely |
| @concurrent explicit opt-in | Background execution is deliberate |
| MainActor default inference | Reduces boilerplate annotations |

## Migration Steps

1. Enable in Xcode: Swift Compiler > Concurrency build settings
2. Enable in SPM: SwiftSettings API
3. Use migration tooling: swift.org/migration
4. Start with MainActor defaults
5. Add @concurrent where profiled
6. Test thoroughly (data-race issues become compile-time errors)

## Best Practices

Start on MainActor, use @concurrent only for CPU-intensive work, enable MainActor inference mode, profile before offloading, protect globals with MainActor, use isolated conformances, migrate incrementally.

## Anti-Patterns

@concurrent on every async function, nonisolated to suppress errors, legacy DispatchQueue patterns, assuming all async runs in background.
