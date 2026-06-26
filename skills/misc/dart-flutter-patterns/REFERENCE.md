# Dart/Flutter Patterns — Reference

## Null Safety
- Prefer `?.`/`??`/pattern matching over `!`
- Avoid `late` overuse — nullable with explicit init is safer
- Dart 3 switch expressions for exhaustive null handling

## Immutable State
- Sealed classes for state hierarchies with exhaustive switch
- Freezed for immutable data classes with `copyWith`/`toJson`
- Union types prevent impossible states

## Async Composition
- `Future.wait` / Dart 3 records for concurrent operations
- Stream patterns with `StreamBuilder` and pattern matching
- Always check `mounted` after `await` in StatefulWidget

## Widget Architecture
- Extract to widget classes (not methods) — enables `const`, element reuse
- `const` constructors stop rebuild propagation
- Isolate rebuilding parts into separate `ConsumerWidget` classes

## BLoC/Cubit
- Single sealed state class per feature
- Events drive state transitions
- `BlocBuilder` with exhaustive pattern matching

## Riverpod
- `@riverpod` for auto-dispose async providers
- `Notifier` for complex mutations
- Derived providers for computed values
- `firstWhereOrNull` from collection package

## GoRouter Navigation
- `refreshListenable` for reactive auth guards
- Redirect logic: unauthenticated → login, authenticated at login → home
- `ShellRoute` for persistent layouts

## Dio Networking
- Interceptors for auth tokens
- One-time retry guard on 401 to prevent infinite loops
- `baseUrl` from environment

## Error Handling
- `FlutterError.onError` for global capture
- `PlatformDispatcher.instance.onError` for platform errors
- Custom `ErrorWidget.builder` for production

## Testing
- Fakes over mocks for stateful dependencies
- `blocTest` for Cubit/BLoC state assertions
- `ProviderScope` overrides for Riverpod widget tests
