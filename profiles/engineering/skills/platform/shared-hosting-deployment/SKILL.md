---
name: shared-hosting-deployment
description: Shared hosting/cPanel deployment workflow for private prod artifact repos, local JS builds, PHP/Laravel public symlinks, backups, rollback, and public_html domain paths. Use when deploying to shared hosting, cPanel, public_html, private prod build repos, local build then git pull, symlinked domains, or Laravel/PHP/static frontend deploys without VPS/Docker.
---

## Default Stance

Manual/local build + private artifact repo + server pull + symlink public artifact dir only. GitHub Actions only when explicitly requested — SSH/secrets complexity risky on shared hosting.

## Preflight Checklist

Answer before deploy:
- Domain path (`~/public_html/domain.com`)
- Stack (JS static / Laravel / PHP / other)
- Build output folder (`out`, `dist`, `build`, `public`)
- Server repo path (artifact clone)
- Current symlink target — `readlink ~/public_html/domain.com`
- Rollback target exists at recorded path
- Backup/rollback dir (~/backups or release dir)
- `.env` location (server-only, never in repo)

## Never Commit Secrets

`.env`, API keys, DB dumps, logs/cache, `node_modules`, vendor — add to `.gitignore` before first push.

## JS Static Workflow

1. Locally: `npm ci && npm run build`, smoke test
2. Copy build output (`out`/`dist`/`build`) to private artifact repo
3. Commit + push artifact repo
4. SSH to shared hosting: `git pull` in artifact clone
5. Target: `~/releases/YYYYMMDD-HHMM/<out|dist|build>`
6. Record: `current=$(readlink ~/public_html/domain.com)`
7. Verify rollback target exists on disk
8. Switch: `ln -sfn ~/releases/YYYYMMDD-HHMM/out ~/public_html/domain.com`
9. Verify: `curl -sSI https://domain.com` → 200
10. On failure: `ln -sfn "$current" ~/public_html/domain.com`

## Laravel/PHP Workflow

1. `.env` server-only, never committed
2. `composer install --no-dev --optimize-autoloader` in release
3. Record: `current=$(readlink ~/public_html/domain.com)`
4. Verify rollback target exists on disk: `test -n "$current" && test -d "$current"`
5. Storage link, cache clear, run migrations with checkpoint
6. Switch: `ln -sfn ~/releases/YYYYMMDD-HHMM/public ~/public_html/domain.com`
7. Verify: `curl -sSI https://domain.com` → 200
8. On failure: `ln -sfn "$current" ~/public_html/domain.com`

Keep release dirs: `~/releases/YYYYMMDD-HHMM`

## Backup Before Switch

1. Save rollback: `current=$(readlink ~/public_html/domain.com)`
2. If `$current` empty or path does not exist → BLOCKED
3. If target is real dir (not symlinked), optional snapshot:
   `cp -a ~/public_html/domain.com ~/backups/domain-$(date +%Y%m%d-%H%M)`
4. Only then switch symlink

## Verification

- `curl -sSI https://domain.com` → 200
- Asset URLs return 200 (JS/CSS via curl)
- PHP: `tail -20 ~/logs/error.log`
- Route smoke test: key pages, forms, auth paths

## BLOCKED

- No backup/rollback path recorded before switch
- Unknown symlink target (readlink fails or empty)
- Symlink target is release root — exposes full source, must point only at public artifact folder
- Rollback target path does not exist on disk
- Production DB migration without explicit approval
- Secrets (.env, keys) in artifact repo
- Destructive command (`rm -rf`, `DROP TABLE`) without checkpoint
