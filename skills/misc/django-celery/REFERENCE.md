# Django + Celery — Reference

## Setup
```python
# config/celery.py
import os; from celery import Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
app = Celery('myproject')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

### Settings
```python
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = 'django-db'
CELERY_TASK_TIME_LIMIT = 30 * 60
CELERY_TASK_SOFT_TIME_LIMIT = 25 * 60
CELERY_TASK_ACKS_LATE = True
```

## Task Patterns

### Basic Task
```python
@shared_task(name='notifications.send_welcome_email')
def send_welcome_email(user_id: int) -> None:
    from apps.users.models import User
    try: user = User.objects.get(pk=user_id)
    except User.DoesNotExist: return  # idempotent
```

### Retryable
```python
@shared_task(bind=True, max_retries=5, default_retry_delay=60, autoretry_for=(ConnectionError, TimeoutError), retry_backoff=True)
def sync_contact_to_crm(self, contact_id: int) -> dict:
    try: return CRMClient().sync(contact_id)
    except CRMClient.RateLimitError as exc: raise self.retry(exc=exc, countdown=int(exc.retry_after))
```

### Idempotent
```python
@shared_task(name='orders.mark_shipped')
def mark_order_shipped(order_id: int, tracking_number: str) -> None:
    updated = Order.objects.filter(pk=order_id, status=Order.Status.PROCESSING).update(status=Order.Status.SHIPPED, tracking_number=tracking_number)
```

### Soft Time Limit
```python
@shared_task(bind=True, soft_time_limit=120, time_limit=150)
def generate_pdf_report(self, report_id: int) -> str:
    try: return PDFGenerator.build(report_id)
    except SoftTimeLimitExceeded: PDFGenerator.cleanup(report_id); raise
```

## Calling Tasks
```python
send_welcome_email.delay(user.pk)
send_reminder.apply_async(args=[user.pk], countdown=3600)
sync_contact_to_crm.apply_async(args=[contact.pk], queue='high_priority')
```

## Beat Scheduling
```python
CELERY_BEAT_SCHEDULE = {
    'cleanup-expired-sessions': { 'task': 'users.cleanup_expired_sessions', 'schedule': crontab(hour=2, minute=0) },
}
```

## Canvas (Chaining/Grouping)
```python
chain(fetch_data.s(source_id), transform_data.s(), load_to_warehouse.s()).delay()
group(send_welcome_email.s(uid) for uid in new_user_ids).delay()
chord(group(process_chunk.s(c) for c in chunks), aggregate_results.s()).delay()
```

## Error Handling / Dead Letter
```python
@task_failure.connect
def on_task_failure(sender, task_id, exception, args, kwargs, traceback, einfo, **kw):
    sentry_sdk.capture_exception(exception)
```

## Testing
```python
# settings: CELERY_TASK_ALWAYS_EAGER = True; CELERY_TASK_EAGER_PROPAGATES = True
@pytest.mark.django_db
def test_sends_email_to_existing_user(self, user):
    with patch('apps.notifications.services.EmailService') as mock_email:
        send_welcome_email(user.pk)
        mock_email.send_welcome.assert_called_once_with(user)
```

## Anti-Patterns
- Passing model instances (stale by execution) → pass PKs
- Calling `.apply()` synchronously in views
- Non-idempotent tasks without guards
- `CELERY_TASK_ALWAYS_EAGER = False` in tests
