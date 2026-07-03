---
name: modular-monolith-patterns
description: Use when designing modular monolith architecture — domain separation, Client/Implementation pattern, cross-module contracts, no foreign keys across domains, ArchUnit enforcement, migration to microservices. Use only when structuring monolith for future microservice extraction or when refactoring tightly-coupled monolith.
---

# Modular Monolith Patterns

Based on "Modular Monolith: Arsitektur Terbaik Sebelum Microservices" by Programmer Zaman Now.

Strong boundaries like microservices, simple deployment like monolith.

## When to Activate

- Designing new monolith that may become microservices later
- Refactoring traditional monolith with spaghetti code
- Planning domain separation for e-commerce or complex business
- Enforcing architecture boundaries between modules
- Migrating from monolith to microservices incrementally

## When NOT to Use Microservices

- Business is new / small team (< 5 developers)
- User base is small / no scale requirements
- Team can't handle complex infrastructure (K8s, service discovery, API gateway)
- No need for independent deployment per module

Microservices problems:
- Complex infrastructure (CI/CD, deployment, monitoring)
- Network overhead (HTTP/gRPC calls instead of direct)
- Distributed transactions (saga pattern, 2PC)
- Over-engineering for small teams


See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
