---
name: php-review
description: PHP and Laravel review checklist for diffs touching PHP, Blade, Livewire, Filament, Eloquent, queues, policies, validation, or Composer. Use only when PHP/Laravel-specific correctness, security, framework conventions, or static-analysis review is needed.
---

# PHP Review

Use as a focused add-on to `review` or `validation-lead`. Keep findings actionable and PHP-specific.

## Process

1. Review changed PHP-related files: `.php`, Blade, config, migrations, factories, tests, Composer.
2. Prefer project commands. If DDEV is present, run PHP commands through DDEV.
3. Report only issues that matter for correctness, security, maintainability, or framework fit.

## Checks

- **Security**: SQL injection, mass assignment, command/path traversal, unsafe `{!! !!}`, unsafe `unserialize`, weak crypto, hardcoded secrets.
- **Validation**: missing FormRequest/rules, `$request->all()` instead of validated data, unvalidated uploads.
- **Authorization**: missing policies/gates, route/model access leaks, Livewire/Filament authorization gaps.
- **Eloquent**: N+1 queries, missing `$fillable`/`$casts`, raw queries with user input, missing transactions for multi-write flows.
- **PHP quality**: missing types on public APIs, unnecessary `mixed`, deep nesting, large methods, duplicate logic, magic values.
- **Queues/jobs**: idempotency, retries, timeout/backoff, transaction boundaries.

## Commands

When available:

```bash
ddev exec vendor/bin/phpstan analyse
ddev exec vendor/bin/pint --test
ddev exec vendor/bin/phpunit
ddev composer audit
```

If DDEV is not used, drop the `ddev exec`/`ddev` prefix.

## Output

```markdown
## PHP Review

Risk: low | medium | high | critical

### Blockers
- [file:line] issue. Fix direction.

### Notes
- [file:line] issue. Fix direction.

Commands reviewed: [commands or not run + reason]
```
