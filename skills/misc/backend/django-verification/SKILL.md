---
name: django-verification
description: Use only when verifying Django applications: smoke tests, security scans, performance benchmarks, migration checks, and deployment readiness.
---

# Django Verification Loop

Adapted from ECC's `django-verification` skill (MIT).

Run before PRs, after major changes, and pre-deploy to ensure Django application quality and security.

## When to Activate

- Before opening a pull request for a Django project
- After major model changes, migration updates, or dependency upgrades
- Pre-deployment verification for staging or production
- Running full environment → lint → test → security → deploy readiness pipeline
- Validating migration safety and test coverage

See [REFERENCE.md](REFERENCE.md) for all 12 phases: environment, code quality, migrations, tests, security, management commands, performance, static assets, config, logging, API docs, and diff review.
