---
name: java-coding-standards
description: Use only when writing Java code in Spring Boot or Quarkus projects — naming, immutability, Optional, streams, exceptions, generics, CDI, and project layout.
---

# Java Coding Standards

Adapted from ECC's `java-coding-standards` skill (MIT).

Standards for readable, maintainable Java (17+) code in Spring Boot and Quarkus services.

## When to Use

- Writing or reviewing Java code in Spring Boot or Quarkus projects
- Enforcing naming, immutability, or exception handling conventions
- Working with records, sealed classes, or pattern matching (Java 17+)
- Reviewing use of Optional, streams, or generics
- Structuring packages and project layout
- **[QUARKUS]**: Working with CDI scopes, Panache entities, or reactive pipelines

## How It Works

### Framework Detection

Before applying standards, determine the framework from the build file:

- Build file contains `quarkus` → apply **[QUARKUS]** conventions
- Build file contains `spring-boot` → apply **[SPRING]** conventions
- Neither detected → apply shared conventions only

## Core Principles

- Prefer clarity over cleverness
- Immutable by default; minimize shared mutable state
- Fail fast with meaningful exceptions
- Consistent naming and package structure
- **[QUARKUS]**: Favor build-time over runtime processing; avoid runtime reflection where possible

## Examples

The sections below show concrete Spring Boot, Quarkus, and shared Java examples
for naming, immutability, dependency injection, reactive code, exceptions,
project layout, logging, configuration, and tests.

See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
