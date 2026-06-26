---
name: swift-actor-persistence
description: Use only when implementing actor-based persistence in Swift — SwiftData actors, Core Data concurrency, thread-safe storage, and testing actor isolation.
---

# Swift Actors for Thread-Safe Persistence

Adapted from ECC's `swift-actor-persistence` skill (MIT).

For full code examples and patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Building a data persistence layer in Swift 5.5+
- Need thread-safe access to shared mutable state
- Want to eliminate manual synchronization (locks, DispatchQueues)
- Building offline-first apps with local storage

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Pattern](REFERENCE.md#core-pattern-actor-based-repository) | Actor-based repository with @Observable |
| [Design Decisions](REFERENCE.md#key-design-decisions) | Actor vs lock, cache + file, sync init |
| [Best Practices](REFERENCE.md#best-practices) | Sendable, minimal API, atomic writes |
| [Anti-Patterns](REFERENCE.md#anti-patterns-to-avoid) | Common mistakes |
