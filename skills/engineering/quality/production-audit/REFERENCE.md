# Production Audit — Reference

> Moved from SKILL.md. See SKILL.md for when-to-use and quick start.

## Evidence Checklist

Start with cheap, local signals:

```text
git status --short --branch
git log --oneline --decorate -20
git diff --stat origin/main...HEAD
```

Then inspect the project-specific surface:

- Package scripts, CI workflows, release scripts, Docker files, and deployment manifests.
- API routes, webhooks, auth middleware, background workers, cron jobs, and database migrations.
- Environment variable documentation and startup checks.
- Observability hooks, error reporting, logs, health checks, and dashboards.
- Rollback, seed, migration, and backfill instructions.
- E2E coverage for the user paths that matter most.

If a deployed URL is in scope, use browser or HTTP checks only against that URL and avoid credentialed actions unless the user supplies a safe test account.

## Risk Lenses

### Security And Auth

- Are public routes, API routes, and admin routes clearly separated?
- Are auth and authorization enforced server-side?
- Are secrets kept out of client bundles, logs, example output, and checked-in files?
- Are rate limits, CSRF protections, CORS policy, and upload validation present where the app needs them?
- Does the AI or agent surface defend against prompt injection, tool abuse, and untrusted content crossing into privileged actions?

### Data Integrity

- Do migrations run forward cleanly and have a rollback or recovery plan?
- Are destructive migrations, backfills, and data imports staged safely?
- Do database policies, grants, and service-role boundaries match the app's tenancy model?
- Are retries idempotent for writes, jobs, and webhook handlers?

### Payments And Webhooks

- Are webhook signatures verified before parsing trusted payload fields?
- Is each payment, subscription, or fulfillment webhook idempotent?
- Are replay, duplicate delivery, and out-of-order delivery handled?
- Are test-mode and live-mode credentials separated?

### Operations

- Can the app start from a clean checkout using documented commands?
- Are required environment variables named, validated, and fail-fast?
- Is there a health check that proves dependencies are reachable?
- Are deploy, rollback, and incident-owner paths documented?
- Are logs useful without leaking secrets or personal data?

### User Experience

- Are the launch-critical paths covered on desktop and mobile?
- Are forms usable on mobile without input zoom, layout overlap, or blocked submission states?
- Do loading, empty, error, and permission-denied states tell the user what happened?
- Is there a support or recovery path when a critical operation fails?

## Scoring

Use scores to force prioritization, not to imply mathematical certainty.

| Band | Score | Meaning |
| --- | --- | --- |
| Blocked | 0-49 | Do not ship until the top risks are fixed |
| Risky | 50-69 | Ship only behind a small rollout or internal beta |
| Launchable With Caveats | 70-84 | Ship if owners accept the listed risks |
| Strong | 85-100 | No obvious launch blockers from available evidence |

Cap the score at `69` if any of these are true:

- Authentication or authorization is missing on sensitive data.
- Payment or fulfillment webhooks are not idempotent.
- Required migrations cannot be run safely.
- Secrets are exposed in client bundles, logs, or committed files.
- There is no rollback path for a high-impact release.

Cap the score at `84` if CI is not green or the launch-critical path was not tested end to end.

## Output Format

Lead with one sentence:

```text
Production audit: 76/100, launchable with caveats, with webhook idempotency and rollback docs as the two risks to fix before public launch.
```

Then list:

- `Blockers`: must-fix items before deploy.
- `High-value fixes`: next fixes if the user wants to improve the score.
- `Evidence checked`: files, commands, CI, deployed URL, or PRs inspected.
- `Evidence missing`: what would change confidence if provided.
- `Next action`: one concrete fix or verification step.

Keep strengths short. The user asked for readiness, so the useful answer is the remaining risk and the next action.

## Example

User:

```text
is this ready to ship?
```

Response:

```text
Production audit: 68/100, risky, because Stripe webhooks are verified but not idempotent and there is no rollback note for the pending migration.

Blockers:
- Add idempotency for `checkout.session.completed` before fulfilling orders.
- Write and test the rollback path for `20260511_add_billing_state.sql`.

High-value fixes:
- Add a health check that verifies database and payment-provider reachability.
- Add one E2E path for upgrade, webhook fulfillment, and billing-page refresh.

Evidence checked:
- `api/stripe/webhook.ts`
- `db/migrations/20260511_add_billing_state.sql`
- GitHub Actions run for the release branch

Next action: Want me to patch webhook idempotency first?
```

## Anti-Patterns

- Running `npx <package>@latest` or a remote scanner as the default audit path.
- Uploading source, secrets, customer data, or private topology to an external audit service without explicit approval.
- Producing a score without naming the evidence checked.
- Treating green CI as production readiness.
- Ending with a generic "let me know what you want to do."

## See Also

- Skill: `security-review`
- Skill: `deployment-patterns`
- Skill: `e2e-testing`
- Skill: `tdd-workflow`
- Skill: `verification-loop`
