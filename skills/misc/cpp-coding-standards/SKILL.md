---
name: cpp-coding-standards
description: Use only when writing C++ code: modern C++ (17/20) idioms, RAII, smart pointers, const correctness, STL usage, and project conventions.
---

# C++ Coding Standards (C++ Core Guidelines)

Adapted from ECC's `cpp-coding-standards` skill (MIT).

Comprehensive coding standards for modern C++ (C++17/20/23) derived from the [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines). Enforces type safety, resource safety, immutability, and clarity.

## When to Use

- Writing new C++ code (classes, functions, templates)
- Reviewing or refactoring existing C++ code
- Making architectural decisions in C++ projects
- Enforcing consistent style across a C++ codebase
- Choosing between language features (e.g., `enum` vs `enum class`, raw pointer vs smart pointer)

### When NOT to Use

- Non-C++ projects
- Legacy C codebases that cannot adopt modern C++ features
- Embedded/bare-metal contexts where specific guidelines conflict with hardware constraints (adapt selectively)

