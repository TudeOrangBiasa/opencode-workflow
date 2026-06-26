---
name: laravel-verification
description: Use when verification loop for Laravel projects — env checks, linting (Pint), static analysis (PHPStan), tests, security audit, migrations, and deploy readiness. Use only before PRs, after major changes, or pre-deployment for Laravel projects.
---

# Laravel Verification Loop

Adapted from ECC's `laravel-verification` skill (MIT).

Run before PRs, after major changes, and pre-deploy.

## When to Use

- Before opening a pull request for a Laravel project
- After major refactors or dependency upgrades
- Pre-deployment verification for staging or production
- Running full lint -> test -> security -> deploy readiness pipeline

## How It Works

- Run phases sequentially from environment checks through deployment readiness so each layer builds on the last.
- Environment and Composer checks gate everything else; stop immediately if they fail.
- Linting/static analysis should be clean before running full tests and coverage.
- Security and migration reviews happen after tests so you verify behavior before data or release steps.
- Build/deploy readiness and queue/scheduler checks are final gates; any failure blocks release.


See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
