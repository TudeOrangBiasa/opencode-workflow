---
name: django-celery
description: Use only when adding Celery async tasks to Django — configuration, task design, retries, beat scheduling, canvas workflows, monitoring, and testing.
---

# Django + Celery Async Task Patterns

Adapted from ECC's `django-celery` skill (MIT).

Production-grade patterns for background task processing in Django using Celery with Redis or RabbitMQ.

## When to Activate

- Adding background jobs or async processing to a Django app
- Implementing periodic/scheduled tasks
- Offloading slow operations (email, PDF generation, API calls) from request cycle
- Setting up Celery Beat for cron-like scheduling
- Debugging task failures, retries, or queue backlogs
- Writing tests for Celery tasks

See [REFERENCE.md](REFERENCE.md) for project setup, task design patterns, calling tasks, beat scheduling, canvas workflows, error handling, testing, and monitoring.
