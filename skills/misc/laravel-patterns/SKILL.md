---
name: laravel-patterns
description: Use when laravel app structure — controllers → services → actions, Eloquent models, routing, form requests, API resources, queues, events, caching. Use only when building or reviewing Laravel code.
---

# Laravel Development Patterns

Adapted from ECC's `laravel-patterns` skill (MIT).

Production-grade Laravel architecture patterns for scalable, maintainable applications.

## When to Use

- Building Laravel web applications or APIs
- Structuring controllers, services, and domain logic
- Working with Eloquent models and relationships
- Designing APIs with resources and pagination
- Adding queues, events, caching, and background jobs

## How It Works

- Structure the app around clear boundaries (controllers -> services/actions -> models).
- Use explicit bindings and scoped bindings to keep routing predictable; still enforce authorization for access control.
- Favor typed models, casts, and scopes to keep domain logic consistent.
- Keep IO-heavy work in queues and cache expensive reads.
- Centralize config in `config/*` and keep environments explicit.

## Examples

See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
