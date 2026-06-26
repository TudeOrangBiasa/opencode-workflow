---
name: dart-flutter-patterns
description: Use when dart/Flutter production patterns — null safety, immutable state, async composition, widget architecture, state management (BLoC/Riverpod), GoRouter, Dio networking, Freezed, and testing. Use only when starting Flutter features, reviewing Dart code, or implementing state management.
---

# Dart/Flutter Patterns

Adapted from ECC's `dart-flutter-patterns` skill (MIT).

## When to Use

Use this skill when:
- Starting a new Flutter feature and need idiomatic patterns for state management, navigation, or data access
- Reviewing or writing Dart code and need guidance on null safety, sealed types, or async composition
- Setting up a new Flutter project and choosing between BLoC, Riverpod, or Provider
- Implementing secure HTTP clients, WebView integration, or local storage
- Writing tests for Flutter widgets, Cubits, or Riverpod providers
- Wiring up GoRouter with authentication guards

## How It Works

This skill provides copy-paste-ready Dart/Flutter code patterns organized by concern:
1. **Null safety** — avoid `!`, prefer `?.`/`??`/pattern matching
2. **Immutable state** — sealed classes, `freezed`, `copyWith`
3. **Async composition** — concurrent `Future.wait`, safe `BuildContext` after `await`
4. **Widget architecture** — extract to classes (not methods), `const` propagation, scoped rebuilds
5. **State management** — BLoC/Cubit events, Riverpod notifiers and derived providers
6. **Navigation** — GoRouter with reactive auth guards via `refreshListenable`
7. **Networking** — Dio with interceptors, token refresh with one-time retry guard
8. **Error handling** — global capture, `ErrorWidget.builder`, crashlytics wiring
9. **Testing** — unit (BLoC test), widget (ProviderScope overrides), fakes over mocks

