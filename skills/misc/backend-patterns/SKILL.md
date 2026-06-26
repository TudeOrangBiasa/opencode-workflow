---
name: backend-patterns
description: Use when designing backend services: layered architecture, error handling, logging, API design, database access, and security patterns.
---

# Backend Development Patterns

Adapted from ECC's `backend-patterns` skill (MIT).

Backend architecture patterns and best practices for scalable server-side applications.

## When to Activate

- Designing REST or GraphQL API endpoints
- Implementing repository, service, or controller layers
- Optimizing database queries (N+1, indexing, connection pooling)
- Adding caching (Redis, in-memory, HTTP cache headers)
- Setting up background jobs or async processing
- Structuring error handling and validation for APIs
- Building middleware (auth, logging, rate limiting)

See [REFERENCE.md](REFERENCE.md) for API design, repository pattern, service layer, middleware, database patterns, caching strategies, error handling, auth/authz, rate limiting, background jobs, and logging patterns.

For deeper API contract patterns (REST/GraphQL contracts, error formats, versioning, pagination), see `api-design`.
