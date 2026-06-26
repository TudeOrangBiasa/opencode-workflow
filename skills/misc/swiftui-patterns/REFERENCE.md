# SwiftUI Patterns — Reference

> Full examples. See SKILL.md for when-to-use.

## State Management

| Wrapper | Use Case |
|---|---|
| @State | View-local value types |
| @Binding | Two-way reference to parent's @State |
| @Observable class + @State | Owned model with multiple properties |
| @Observable class (no wrapper) | Read-only reference from parent |
| @Bindable | Two-way binding to @Observable property |
| @Environment | Shared dependencies |

## @Observable ViewModel

Use @Observable (not ObservableObject) for property-level change tracking. Only views reading the changed property re-render.

## View Composition

Extract subviews to limit invalidation. ViewModifier for reusable styling (cardStyle, etc.).

## Navigation

Type-safe NavigationStack with NavigationPath and Destination enum. @Environment injection of Router.

## Performance

LazyVStack/LazyHStack for large collections, stable identifiers (not array indices), avoid expensive work in body (use .task{}), Equatable conformance for expensive views.

## Previews

#Preview macro with inline mock data for fast iteration.

## Anti-Patterns

ObservableObject/@Published in new code (use @Observable), async work in body/init (use .task{}), AnyView (use @ViewBuilder), ignoring Sendable.
