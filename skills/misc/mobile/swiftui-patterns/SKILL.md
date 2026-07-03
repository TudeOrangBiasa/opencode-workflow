---
name: swiftui-patterns
description: Use only when building SwiftUI views — @Observable, state management, view composition, NavigationStack, performance optimization, and testing.
---

# SwiftUI Patterns

Adapted from ECC's `swiftui-patterns` skill (MIT).

For full patterns, examples, and anti-patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Building SwiftUI views and managing state (`@State`, `@Observable`, `@Binding`)
- Designing navigation flows with `NavigationStack`
- Structuring view models and data flow
- Optimizing rendering performance for lists and complex layouts
- Working with environment values and dependency injection in SwiftUI

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [State Management](REFERENCE.md#state-management) | @State, @Observable, @Bindable, @Environment |
| [ViewModel Pattern](REFERENCE.md#observable-viewmodel) | @Observable class, DI |
| [View Composition](REFERENCE.md#view-composition) | Subview extraction, ViewModifier |
| [Navigation](REFERENCE.md#navigation) | Type-safe NavigationStack, Router |
| [Performance](REFERENCE.md#performance) | Lazy containers, stable IDs, Equatable |
| [Previews](REFERENCE.md#previews) | #Preview with mock data |
| [Anti-Patterns](REFERENCE.md#anti-patterns-to-avoid) | ObservableObject, AnyView, Sendable |
