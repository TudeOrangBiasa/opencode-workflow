---
name: modular-monolith
description: Architecture guidance for modular monolith and backend evolution — decision framework (when/why to add stages: DB, LB, gateway, broker, cache/CDN) and implementation patterns (domain separation, Client/Implementation, no cross-domain FKs, ArchUnit enforcement, microservice migration). Use when designing backend architecture, deciding monolith vs microservices, structuring a modular monolith, or planning scaling evolution.
---

# Modular Monolith

Architecture guidance for modular monolith and backend evolution. Two documents:

| Document | Content |
|---|---|
| [DECISIONS.md](DECISIONS.md) | When/why to add each stage: single server → cache+CDN. Pain-driven triggers, heuristics, 6-stage progression. |
| [PATTERNS.md](PATTERNS.md) | How to structure a modular monolith: domain separation, Client/Implementation, no cross-domain FKs, ArchUnit enforcement, microservice migration. |

## Companion Skills

- `backend-patterns` — API design, validation, error handling
- `api-design` — REST/GraphQL contract patterns
- `architecture-decision-records` — capture architecture decisions
