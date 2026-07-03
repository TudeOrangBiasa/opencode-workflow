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
