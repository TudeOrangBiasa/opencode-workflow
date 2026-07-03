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
