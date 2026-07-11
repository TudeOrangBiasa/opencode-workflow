# Self-Improvement Pipeline

Three skills form a feedback loop for continuous improvement:

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   eval      │ ──► │  aggregate   │ ──► │ verify-evidence  │
│ session     │     │  prioritize  │     │ delivery gate    │
│ scoring     │     │  pattern     │     │ + pattern check  │
└─────────────┘     └──────────────┘     └──────────────────┘
       │                                       │
       ▼                                       ▼
┌──────────────┐                        ┌──────────────┐
│ workflow-    │                        │  skill fix   │
│ audit        │                        │  cycle       │
│ repo health  │                        │  (manual)    │
└──────────────┘                        └──────────────┘
```

## Purpose

- **Improve workflow**: eval findings → fix skills → less repeat mistakes
- **Training data**: eval reports structured YAML → feed SkillOpt later
- **Delivery safety**: verify-evidence checks eval history before ship

---

## Step 1: Eval — Score Session

**Skill**: `eval`
**Input**: Current conversation or past project context
**Output**: Report in `.scratch/evals/<session-id>.md`

Each report has YAML frontmatter with:

| Field | Purpose | Consumer |
|-------|---------|----------|
| `findings[].target` | Which skill/agent needs fixing | Aggregate |
| `findings[].severity` | CRITICAL/HIGH/MEDIUM/LOW | Prioritize |
| `findings[].category` | Enum: stuck-pattern, scope-drift, tool-misuse, etc. | Pattern detection |
| `findings[].verdict` | fail/warn/pass | Aggregate pass@1 |
| `findings[].fix` | Actionable suggestion | Skill fix cycle |
| `metrics.pass_at_1` | First-try success rate | Trend tracking |

**Memory protocol**: After creating report, store:
```
ov add-memory "[workflow:eval] <session-id>: <key findings, severity count>"
```

---

## Step 2: Workflow-Audit — Score Repo Health

**Skill**: `workflow-audit`
**Input**: Current repo state (config, symlinks, git, sessions)
**Output**: Structured report with sections: Config, Symlinks, Repo Sync, Match Check, Sessions

Runs independently from eval. Can trigger before or after eval.

**Memory protocol**: After audit, store:
```
ov add-memory "[workflow:audit] <date>: <key findings, drift count>"
```

---

## Step 3: Aggregate — Prioritize Fixes

**Script**: `scripts/aggregate-eval.sh` — parses YAML frontmatter from all eval reports, produces priority fix list.

```bash
# Default: scan .scratch/evals/
./scripts/aggregate-eval.sh

# Custom path
./scripts/aggregate-eval.sh .scratch/evals/

# JSON output for machine processing
./scripts/aggregate-eval.sh --json
```

Output includes:
- Total findings by verdict (pass/fail/warn)
- Category distribution (most common failure patterns)
- Target priority (skills ranked by severity weight × count)
- Per-target detail (each finding's verdict, severity, category, summary, fix suggestion)

**Before the script existed**, manual aggregation was done with this mental model:

```yaml
# From 5 eval reports:
targets_most_failed:
  - verify-evidence: 2 CRITICAL (verification-gap)
  - builder: 2 MEDIUM (null handling, AI slop comments)
  - prototype: 2 HIGH (scope-drift, research paralysis)
  - orchestrator: 1 MEDIUM (tool-misuse)

categories_most_common:
  - verification-gap: 2 CRITICAL, 0 HIGH
  - scope-drift: 2 HIGH, 0 MEDIUM
  - tool-misuse: 1 HIGH, 2 MEDIUM
  - stuck-pattern: 1 HIGH, 1 MEDIUM
  - debug-leftover: 2 LOW
```

**Memory protocol**: After aggregation, store:
```
ov add-memory "[workflow:pipeline] <date>: aggregated <N> reports, top target: <skill>, top category: <cat>"
```

---

## Step 4: Verify-Evidence Gate — Check Before Ship

**Skill**: `verify-evidence`
**Input**: Diff/changes to verify + optional eval history
**Output**: `VERIFIED | FAILED | INCONCLUSIVE | BLOCKED`

**Before** running standard verification, check eval history:

1. Scan `.scratch/evals/` for findings with matching `target` or `category`
2. If previous eval found `CRITICAL` or `HIGH` findings for same skill, **flag**:
   ```
   CAUTION: <N> previous CRITICAL findings in <target>.
   Last: <summary> — <fix>
   Verify fixes applied.
   ```
3. If same finding repeats 2+ times across eval reports, escalate to **BLOCKED** with recommendation to fix skill before shipping

**Memory protocol**: After verify gate, store:
```
ov add-memory "[workflow:verify] <change>: <status>, <N> eval patterns checked"
```

---

## Step 5: Skill Fix Cycle (Manual)

1. Prioritize: fail > warn, repeated > first, CRITICAL > HIGH > MEDIUM > LOW
2. For each finding: read `findings[].fix`, apply to target skill's SKILL.md
3. Re-run eval on similar session to verify fix worked
4. If fix worked: add `fix_applied` to the original eval report
5. If fix failed: try different approach, update `fix_applied.result: failed`

---

## Concrete Example

From report `2026-07-01-pweb-swarakarna.md`:

```yaml
findings:
  - severity: CRITICAL
    category: verification-gap
    target: verify-evidence
    verdict: fail
    summary: "Shipped broken cetak page, silent photo upload failure"
    fix: "Add pre-ship verification: render check for cetak, upload confirmation"
```

**Pipeline processing**:

1. **eval** created this report
2. **aggregate** identifies `verify-evidence` as top-target (2 CRITICAL findings across reports)
3. **verify-evidence gate** loads: sees 2 CRITICAL history → adds caution banner on next verification
4. **skill fix cycle**: update verify-evidence SKILL.md to require render check + upload confirmation
5. **re-eval**: next session verifies fix works → add `fix_applied` to report

---

## Memory Protocol Summary

| Step | Category | When | Example |
|------|----------|------|---------|
| Eval | `[workflow:eval]` | After creating report | `[workflow:eval] pweb-swarakarna: 1 CRITICAL, 1 HIGH, 2 MEDIUM` |
| Audit | `[workflow:audit]` | After audit | `[workflow:audit] 2026-07-10: 2 broken symlinks, 3 unpushed` |
| Aggregate | `[workflow:pipeline]` | After aggregation | `[workflow:pipeline] 5 reports aggregated, top target: verify-evidence` |
| Verify | `[workflow:verify]` | After gate | `[workflow:verify] cetak-fix: VERIFIED, 2 eval patterns checked, 0 matches` |

---

## Current State

- 5 eval reports in `.scratch/evals/` (as of 2026-07-10)
- verify-evidence now scans `.scratch/evals/` for matching findings (no longer hardcoded)
- verify-evidence REFERENCE.md created with 5 test scenarios
- `scripts/aggregate-eval.sh` automates step 3 aggregation

## Next

- [ ] Ticket-002: SkillOpt integration when eval data mature
