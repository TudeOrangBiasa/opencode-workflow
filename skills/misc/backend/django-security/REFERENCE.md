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
