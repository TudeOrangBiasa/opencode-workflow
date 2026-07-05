---
name: canary-watch
description: Use when post-deploy monitoring for deployed URLs — HTTP status, console errors, static assets, performance, API health, and SSE streams. Use only after deploys, risky PR merges, dependency upgrades, or during launch windows.
---

# Canary Watch — Post-Deploy Monitoring

Adapted from ECC's `canary-watch` skill (MIT).

## When to Use

- After deploying to production or staging
- After merging a risky PR
- When you want to verify a fix actually fixed it
- Continuous monitoring during a launch window
- After dependency upgrades

## How It Works

Monitors a deployed URL for regressions. Runs in a loop until stopped or until the watch window expires.

### Watch Modes

**Quick check** (default): single pass, report results
```
/canary-watch https://myapp.com
```

**Sustained watch**: check every N minutes for M hours
```
/canary-watch https://myapp.com --interval 5m --duration 2h
```

**Diff mode**: compare staging vs production
```
/canary-watch --compare https://staging.myapp.com https://myapp.com
```

See [REFERENCE.md](REFERENCE.md) for alert thresholds, output format, and integration details.
