---
name: swift-protocol-di-testing
description: Use only when designing Swift dependency injection with protocols — protocol-based DI, Swift Testing framework, mock protocols, and testable architecture.
---

# Swift Protocol-Based Dependency Injection for Testing

Adapted from ECC's `swift-protocol-di-testing` skill (MIT).

For full patterns, examples, and Swift Testing test cases, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Writing Swift code that accesses file system, network, or external APIs
- Need to test error handling paths without triggering real failures
- Building modules that work across environments (app, test, SwiftUI preview)
- Designing testable architecture with Swift concurrency (actors, Sendable)

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Pattern](REFERENCE.md#core-pattern) | Protocol definition, production impl, mock impl, DI, tests |
| [Mock Pattern](REFERENCE.md#mock-implementation-pattern) | Configurable errors, in-memory storage |
| [Test Examples](REFERENCE.md#test-examples-swift-testing) | Swift Testing test cases |
| [Best Practices](REFERENCE.md#best-practices) | Single responsibility, Sendable, default params |
| [Anti-Patterns](REFERENCE.md#anti-patterns-to-avoid) | God protocols, mocking internals, #if DEBUG |
