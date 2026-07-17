# Verify-Evidence — Reference

See [SKILL.md](SKILL.md) for quick checklist. This reference covers detailed patterns per domain.

## Domain Verification Patterns

### Web/UI Changes

| Criterion Type | Verification Command | Pass Signal |
|----------------|---------------------|-------------|
| Page loads | `curl -s -o /dev/null -w "%{http_code}" <url>` | 200 |
| Console errors | Chrome DevTools `list_console_messages` | 0 errors |
| Layout | `take_screenshot` + visual diff | < 1% pixel diff |
| Responsive | `resize_page` 375×667 + screenshot | No overflow |
| Form submit | `fill_form` → `click` → check network | 200 + no error |
| API response | `get_network_request` response body | Expected shape |

### Database Changes

| Criterion Type | Verification Command | Pass Signal |
|----------------|---------------------|-------------|
| Migration runs | `php artisan migrate --pretend` | No errors |
| Rollback | `php artisan migrate:rollback --pretend` | Reverses |
| Data integrity | `SELECT COUNT(*)` before/after | Matches expected delta |
| Index added | `EXPLAIN SELECT ...` | Uses index |
| FK constraint | `INSERT` invalid FK | Expected error |

### Deployment Changes

| Criterion Type | Verification Command | Pass Signal |
|----------------|---------------------|-------------|
| Build passes | `npm run build` or `composer install --no-dev` | Exit 0 |
| Assets load | `curl <deploy-url>/assets/main.js` | 200, content-type js |
| Health endpoint | `curl <deploy-url>/health` | 200, `{"status":"ok"}` |
| Rollback ready | `git tag` exists for previous release | Tag present |

### Config Changes

| Criterion Type | Verification Command | Pass Signal |
|----------------|---------------------|-------------|
| Syntax valid | `php artisan config:validate` or `node -e "require('./config')"` | No error |
| Env vars set | `echo $VAR` | Non-empty |
| No secrets leaked | `grep -r 'api_key\|password\|secret' target` | 0 matches |

### Docker/Infra Changes

| Criterion Type | Verification Command | Pass Signal |
|----------------|---------------------|-------------|
| Container builds | `docker compose build --no-cache <service>` | Exit 0 |
| Container runs | `docker compose up -d && sleep 5 && docker compose ps` | healthy/Up |
| Port exposed | `curl localhost:<port>` | 200/connection |
| Volume mounted | `docker exec <container> ls <mount-point>` | Expected files |

## AFK Verification Workflow

When running without user supervision:

1. **Load verify-evidence skill**
2. **Read acceptance criteria** from task/ticket
3. **Map each criterion** using patterns above
4. **Run all commands**, collect evidence table
5. **Check eval history**: scan `.scratch/evals/` for matching `target` or `category`
6. **Report**: Status + Evidence table + Gaps + Eval cross-ref
7. **Save to** `.scratch/verification/<date>-<slug>/`

## Stuck-Loop Diagnosis Examples

| Symptom | Pattern | Action |
|---------|---------|--------|
| Same `grep "foo"` 4+ times | Repeating Action-Observation | BLOCKED — propose tool substitution |
| `npm install` fails 3x same error | Repeating Action-Error | BLOCKED — suggest cache clear / lockfile regen |
| Agent explains 3+ msgs no output | Agent Monologue | BLOCKED — ask user for direction |
| edit A → edit B → edit A → edit B | Ping-Pong | BLOCKED — lock file, restart |

## Integration with Validator Agent

When validation-lead subagent is available:
- Delegate UI verification: screenshots, console, network, responsive
- Delegate API verification: endpoint responses, status codes
- Validation-lead returns compact facts only — see `validation-lead.md` agent file

## Test Scenarios for Improvement Baseline

To measure if verify-evidence improves over time, run these test scenarios. Each maps to a real eval finding from `.scratch/evals/`:

**How to use**: Load the referenced eval report, find the matching finding, run the scenario command, verify verify-evidence catches it.

### Scenario 1: Silent Photo Upload Failure (CRITICAL)
- **Source**: `.scratch/evals/2026-07-01-pweb-swarakarna.md` — finding "Shipped broken cetak page"
- **Setup**: App has file upload without success confirmation
- **Expected**: verify-evidence catches silent failure (upload returns 200 but file not saved)
- **Command**: `curl -F "file=@test.jpg" <upload-url> && curl <check-url>` — verify file exists

### Scenario 2: Broken Render Page (CRITICAL)
- **Source**: `.scratch/evals/2026-07-01-pweb-swarakarna.md` — same finding as above
- **Setup**: Page renders inside wrong layout wrapper (e.g., cetak page)
- **Expected**: verify-evidence catches output in wrong context
- **Command**: `curl <cetak-url>` — verify response is clean HTML, not wrapped in layout

### Scenario 3: Rate Limiter Unsafe Default (HIGH)
- **Source**: `.scratch/evals/2026-07-05-scholar-paper-mcp.md` — finding "10 critical issues shipped"
- **Setup**: API rate limiter set to 100 req/s (should be 0.5)
- **Expected**: verify-evidence flags non-production-safe defaults
- **Command**: `grep -r "rate.limit\|rate_limit\|throttle" <config-dir>` — verify value

### Scenario 4: Null Handling Gap (MEDIUM)
- **Source**: `.scratch/evals/2026-07-05-scholar-paper-mcp.md` — finding "Null handling blind spot"
- **Setup**: External API returns null on some fields
- **Expected**: verify-evidence checks null handling on all external API consumers
- **Command**: `grep -rn "fetch\|axios\|\.get\|\.post" src/ | grep -v "\.catch\|try\|null"` — count uncovered calls

### Scenario 5: Input Validation Missing (HIGH)
- **Source**: `.scratch/evals/2026-07-05-scholar-paper-mcp.md` — same finding
- **Setup**: API endpoint accepts arbitrary input without validation
- **Expected**: verify-evidence flags missing validation
- **Command**: `grep -rn "async function\|def " routes/` — cross-ref with validation middleware

## Output Format Example

```
Status: VERIFIED
Evidence:
- [cetak page renders] — curl <cetak-url> → 200, clean HTML — PASS
- [photo upload saves] — curl upload + check → file exists — PASS
- [eval cross-ref] — scanned 5 reports, 0 CRITICAL for verify-evidence — PASS
Gaps:
- None
Blocked:
- None
```
