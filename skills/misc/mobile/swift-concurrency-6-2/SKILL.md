---
name: swift-concurrency-6-2
description: Use only when working with Swift 6.0/6.2 concurrency — strict Sendable checking, data-race safety, actor isolation, and migration from 5.x concurrency models.
---

# Swift 6.2 Approachable Concurrency

Adapted from ECC's `swift-concurrency-6-2` skill (MIT).

For full patterns, examples, and migration steps, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Migrating Swift 5.x or 6.0/6.1 projects to Swift 6.2
- Resolving data-race safety compiler errors
- Designing MainActor-based app architecture
- Offloading CPU-intensive work to background threads
- Implementing protocol conformances on MainActor-isolated types
- Enabling Approachable Concurrency build settings in Xcode 26

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Problem](REFERENCE.md#core-problem-implicit-background-offloading) | Why Swift 6.2 changed the default |
| [Isolated Conformances](REFERENCE.md#core-pattern--isolated-conformances) | MainActor protocol conformances |
| [Globals & MainActor](REFERENCE.md#core-pattern--global-and-static-variables) | Global state protection, inference mode |
| [@concurrent](REFERENCE.md#core-pattern--concurrent-for-background-work) | Explicit background offloading |
| [Design Decisions](REFERENCE.md#key-design-decisions) | Single-threaded by default, opt-in adoption |
| [Migration Steps](REFERENCE.md#migration-steps) | Xcode settings, SPM, tooling |
| [Best Practices](REFERENCE.md#best-practices) | MainActor first, profile before offloading |
| [Anti-Patterns](REFERENCE.md#anti-patterns-to-avoid) | Common mistakes |
