# Django — Reference

This reference is adapted from ECC's django-patterns, django-celery, django-security, django-tdd, and django-verification skills.


## Architecture & Development Patterns

# Django Patterns — Reference

## Project Structure
```
config/settings/{base,development,production,test}.py
apps/{users,products}/{models,views,serializers,urls,services,tests}.py
```

## Model Design
```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='products')
    objects = ProductQuerySet.as_manager()
    class Meta: indexes = [models.Index(fields=['slug']), models.Index(fields=['category', 'is_active'])]
```

### QuerySet Best Practices
```python
class ProductQuerySet(models.QuerySet):
    def active(self): return self.filter(is_active=True)
    def with_category(self): return self.select_related('category')
    def in_stock(self): return self.filter(stock__gt=0)
```

## DRF Serializers
```python
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta: model = Product; fields = ['id', 'name', 'price', 'stock', 'category_name']
```

## ViewSets
```python
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('tags')
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
```

## Service Layer
```python
class OrderService:
    @staticmethod
    @transaction.atomic
    def create_order(user, cart: Cart) -> Order:
        order = Order.objects.create(user=user, total_price=cart.total_price)
        for item in cart.items.all(): OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
        cart.items.all().delete()
        return order
```

## Caching
```python
from django.core.cache import cache
def get_featured_products():
    products = cache.get('featured_products')
    if products is None: products = list(Product.objects.filter(is_featured=True)); cache.set('featured_products', products, timeout=60*15)
    return products
```

## Signals
```python
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created: Profile.objects.create(user=instance)
```

## Performance
- `select_related` for FK (1 query vs N+1)
- `prefetch_related` for ManyToMany
- `bulk_create`/`bulk_update` for batch operations
- `db_index` on frequently filtered fields
- Combined indexes for common query patterns

## Celery Async Tasks

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

## Security

# Django Security — Reference

## Production Settings
```python
DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True
```

## Auth
```python
AUTH_USER_MODEL = 'users.User'
PASSWORD_HASHERS = ['django.contrib.auth.hashers.Argon2PasswordHasher', ...]
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
```

## Authorization
```python
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS: return True
        return obj.author == request.user
```

## SQL Injection Prevention
```python
# GOOD: User.objects.get(username=username)
# GOOD: User.objects.raw('SELECT * FROM users WHERE username = %s', [query])
# BAD: User.objects.raw(f'SELECT * FROM users WHERE username = {username}')
```

## XSS Prevention
```django
{{ user_input }} {# auto-escaped #}
{{ trusted_html|safe }} {# only for trusted content #}
{# Use format_html for HTML with variables #}
```

## CSRF
- Enabled by default — do not disable
- `CSRF_COOKIE_SECURE = True`, `CSRF_COOKIE_HTTPONLY = True`
- `{% csrf_token %}` in all forms

## File Uploads
```python
def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    if not ext.lower() in valid_extensions: raise ValidationError('Unsupported file extension.')
```

## API Security
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle'],
    'DEFAULT_THROTTLE_RATES': {'anon': '100/day', 'user': '1000/day'},
}
```

## Security Headers
- `Content-Security-Policy`: restrict sources
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`: 1 year

## Checklist
- [ ] DEBUG = False in production
- [ ] HTTPS only, secure cookies
- [ ] Strong SECRET_KEY (env var, >30 chars)
- [ ] Password validators enabled
- [ ] CSRF enabled
- [ ] Auto-escaping, no `|safe` on user input
- [ ] ORM only, no raw SQL with string concat
- [ ] File upload validation (type + size)
- [ ] Rate limiting on API
- [ ] Security headers set
- [ ] Security events logged

## TDD Workflow

# Django TDD — Reference

## TDD Workflow
RED → GREEN → REFACTOR: write failing test, implement minimal fix, clean up.

## pytest Configuration
```ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
testpaths = tests
addopts = --reuse-db --nomigrations --cov=apps --cov-report=html
```

## Test Settings
```python
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': ':memory:'}}
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
CELERY_TASK_ALWAYS_EAGER = True
```

## conftest.py Fixtures
```python
@pytest.fixture
def user(db): return User.objects.create_user(email='test@example.com', password='testpass123')
@pytest.fixture
def authenticated_client(client, user): client.force_login(user); return client
@pytest.fixture
def api_client(): return APIClient()
@pytest.fixture
def authenticated_api_client(api_client, user): api_client.force_authenticate(user=user); return api_client
```

## Factory Boy
```python
class UserFactory(factory.django.DjangoModelFactory):
    class Meta: model = User
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')

class ProductFactory(factory.django.DjangoModelFactory):
    class Meta: model = Product
    name = factory.Faker('sentence', nb_words=3)
    price = fuzzy.FuzzyDecimal(10.00, 1000.00, 2)
    category = factory.SubFactory(CategoryFactory)
```

## Model Testing
```python
def test_product_creation(db): product = ProductFactory(); assert product.id is not None
def test_product_slug_generation(db): product = ProductFactory(name='Test Product'); assert product.slug == 'test-product'
```

## View Testing (Django)
```python
def test_product_list(client, db): response = client.get(reverse('products:list')); assert response.status_code == 200
def test_product_create_requires_login(client, db): response = client.get(reverse('products:create')); assert response.status_code == 302
```

## DRF API Testing
```python
def test_list_products(api_client, db): response = api_client.get(reverse('api:product-list')); assert response.status_code == 200
def test_create_product_authorized(authenticated_api_client, db): response = authenticated_api_client.post(url, data); assert response.status_code == 201
```

## Mocking
```python
@patch('apps.payments.services.stripe')
def test_successful_payment(self, mock_stripe, client, user, product):
    mock_stripe.Charge.create.return_value = {'id': 'ch_123', 'status': 'succeeded'}
    client.force_login(user); response = client.post(reverse('payments:process'), {'product_id': product.id})
    assert response.status_code == 302
```

## Coverage Targets
| Component | Target |
|---|---|
| Models | 90%+ |
| Serializers | 85%+ |
| Views | 80%+ |
| Services | 90%+ |
| Overall | 80%+ |

## Best Practices
**DO**: factories, one assertion per test, descriptive names, test edge cases, mock external services, keep tests fast.
**DON'T**: test Django internals, test third-party code, ignore failing tests, make tests dependent, over-mock.

## Verification Loop

# Django Verification — Reference

## Phases

### 1. Environment Check
```bash
python --version; pip list --outdated; python -c "import os; print('DJANGO_SECRET_KEY set' if os.environ.get('DJANGO_SECRET_KEY') else 'MISSING: DJANGO_SECRET_KEY')"
```

### 2. Code Quality
```bash
mypy . --config-file pyproject.toml
ruff check . --fix
black . --check; isort . --check-only
python manage.py check --deploy
```

### 3. Migrations
```bash
python manage.py showmigrations
python manage.py makemigrations --check
python manage.py migrate --plan
```

### 4. Tests + Coverage
```bash
pytest --cov=apps --cov-report=html --cov-report=term-missing --reuse-db
```

### 5. Security Scan
```bash
pip-audit; safety check --full-report
bandit -r . -f json -o bandit-report.json
python manage.py check --deploy  # verify DEBUG=False
```

### 6. Management Commands
```bash
python manage.py check
python manage.py collectstatic --noinput --clear
```

### 7. Performance
- Check for N+1 queries (Django Debug Toolbar)
- Missing indexes
- Query count < 50 per page

### 8. Static Assets
```bash
npm audit; npm run build
python manage.py findstatic css/style.css
```

### 9. Config Review
- DEBUG = False, SECRET_KEY set (>30 chars), ALLOWED_HOSTS set
- HTTPS enabled, HSTS enabled

### 10. Logging — verify log files writable
### 11. API Docs — generate schema, validate JSON
### 12. Diff Review — no debug statements, no TODOs/FIXMEs in critical code

## Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Coverage ≥ 80%
- [ ] No security vulnerabilities
- [ ] No unapplied migrations
- [ ] DEBUG = False
- [ ] SECRET_KEY configured
- [ ] ALLOWED_HOSTS set
- [ ] Database backups enabled
- [ ] Static files collected
- [ ] Logging configured
- [ ] Error monitoring configured
- [ ] HTTPS/SSL configured

## Output Template
```
DJANGO VERIFICATION REPORT
Phase 1-12: ✓/✗ per check
RECOMMENDATION: Go/No-Go
NEXT STEPS: ...
```
