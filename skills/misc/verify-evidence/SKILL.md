---
name: verify-evidence
description: Tool-based verification checklist for acceptance criteria, test evidence, stuck-loop detection, and AFK/high-risk review. Use when reviewer/orchestrator needs independent evidence for non-trivial changes, AFK tasks, flaky/failing tests, deployment, auth, DB, payment, or ambiguous verification.
---

Load this skill when orchestrator or reviewer needs independent evidence. Do not load for trivial docs/config changes.

## When to Use

- Non-trivial changes (behavior, security, data)
- AFK/unattended tasks
- Flaky or failing tests need confirmation
- Explicit acceptance criteria must be verified
- Deployment, auth, DB, or payment changes
- Reviewer needs independent evidence

## When to Skip

- Trivial docs/config changes — inspect diff directly
- No acceptance criteria AND no high-risk/AFK/reviewer evidence need exists
- Review is purely style/naming suggestions

## Eval Pattern Integration

If `.scratch/evals/eval-agent-error-patterns.md` exists, cross-reference verification evidence against known agent error patterns. Flag any pattern violations as part of the evidence report.

## Evidence Mapping

Map each acceptance criterion to a verifiable signal. Run commands, inspect output.

```
| Criterion | Command/Evidence | Status |
|-----------|------------------|--------|
| "form submits" | curl POST → 200, no console error | PASS |
| "no layout shift" | screenshot A vs B diff < 1% | PASS |
```

## Statuses

| Status | Meaning |
|--------|---------|
| `VERIFIED` | All criteria have PASS evidence |
| `FAILED` | Any criterion has FAIL evidence |
| `INCONCLUSIVE` | Verification could not fully run (missing tools, broken infra) or criterion lacks objective signal |
| `BLOCKED` | Human checkpoint needed or stuck loop detected |

## Stop Conditions

Immediately report BLOCKED:

- **Destructive ops without checkpoint**: `DROP TABLE`, `DELETE FROM`, `rm -rf`, billing commands
- **Remote irreversible state**: deployment to production, DNS changes, API key rotation
- **Cost >$1**: operation exceeds $1 in API calls without prior approval
- **Secrets/security boundary**: verification step would write outside allowed paths or make unauthorized network calls
- **Human decision needed**: acceptance criterion cannot be mapped to verifiable signal and human judgment required
- **Stuck loop**: same failure pattern 3+ times with no progress

## Stuck-Loop Heuristic

Check for:
- Same error message appearing 3+ times in consecutive runs
- Output size not growing across retries
- No new files or file changes after M minutes
- Builder repeatedly touching same files with no resolution

## Output Format

```
Status: VERIFIED | FAILED | INCONCLUSIVE | BLOCKED
Evidence:
- [criterion/risk] — [command/check] — [result]
Gaps:
- [missing evidence or none]
Blocked:
- [if BLOCKED: blocker + needed input]
```

## Rules

- **No fixing in verify mode.** Report evidence only. Do not implement fixes, edit files, or commit.
- **Report what tools say.** Do not re-interpret results optimistically. Pass = clean exit + expected output.
- **If verification command is unavailable**, say so. Do not simulate results.
- **Keep compact.** Prefer evidence paths over inline dumps. Reference log files, screenshots, test outputs.
- **No secrets in output.** Truncate logs >200 lines; link to evidence files.
