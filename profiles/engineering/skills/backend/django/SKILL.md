---
name: django
description: Use only when building, securing, or verifying Django applications — project structure, DRF, ORM optimization, service layer, Celery async tasks, security hardening, pytest TDD, and pre-deployment verification.
---

# Django

Adapted from ECC's `django-patterns`, `django-celery`, `django-security`, `django-tdd`, `django-verification` skills (MIT).

Production-grade Django patterns for scalable, secure, testable applications.

## When to Use

- Building Django web apps or DRF APIs
- Structuring project, settings, models, and ORM queries
- Adding Celery async tasks and beat scheduling
- Security hardening (settings, XSS, CSRF, SSRF)
- TDD with pytest, factory_boy, and coverage
- Pre-deployment verification (lint → test → security → deploy)

## Sections

- [Architecture & Patterns](REFERENCE.md#architecture--development-patterns) — project structure, DRF, ORM, signals, middleware
- [Celery Async Tasks](REFERENCE.md#celery-async-tasks) — task design, beat scheduling, canvas, monitoring
- [Security](REFERENCE.md#security) — settings hardening, auth, SQL injection, CSRF, XSS
- [TDD Workflow](REFERENCE.md#tdd-workflow) — pytest, factory_boy, API testing, coverage
- [Verification Loop](REFERENCE.md#verification-loop) — 12-phase pre-deployment pipeline
