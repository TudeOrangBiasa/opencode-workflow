---
name: laravel
description: Use when building, securing, or deploying Laravel applications — architecture patterns (controllers → services → actions), Eloquent ORM, form requests, queues, events, caching, auth, CSRF/XSS/SQLi prevention, PHPStan, Pint, and pre-deployment verification.
---

# Laravel

Adapted from ECC's `laravel-patterns`, `laravel-security`, `laravel-verification` skills (MIT).

Production-grade Laravel patterns for scalable, secure, maintainable applications.

## When to Use

- Building Laravel web apps or APIs
- Structuring controllers, services, and domain logic
- Eloquent models, relationships, scopes, and casts
- Authentication, authorization, and security hardening
- Queues, events, caching, and background jobs
- Pre-deployment verification (lint → test → security → deploy)

## Sections

- [Architecture & Patterns](REFERENCE.md#architecture--development-patterns) — controllers, services, Eloquent, routing
- [Security](REFERENCE.md#security) — auth, CSRF, XSS, SQL injection, encryption
- [Verification Loop](REFERENCE.md#verification-loop) — env checks, Pint, PHPStan, tests, security audit, migrations
