# Workflow

Workflow principles, agents, skills, routing, and session log for the primitive-agent architecture.

## Principles

- **Cheap-first**: cheap models for exploration and execution; expensive models for planning, routing, review.
- **Maintainable**: compact agent files, precise skill triggers, minimal docs. No duplicated rules.
- **Team-friendly**: real project output (PRs, issues, changelogs) over ephemeral agent artifacts.
- **Anti-tech-debt**: every slice leaves the codebase no worse than found. Reject hacks, stubs, workarounds.
- **Real project output**: durable artifacts (PRs, commits, ADRs, verified tests) over agent-to-agent handoffs.

## Primitive Agents

Small set of agents, each with a single narrow responsibility.

| Agent | Mode | Model Cost | Responsibility |
|-------|------|-----------|---------------|
| `orchestrator` | primary | Expensive | Router, planner-in-chief, scope keeper, final synthesizer |
| `planner` | subagent | Expensive | Read-only planning, issue breakdown, risk ordering |
| `builder` | subagent | Cheap | Narrow bounded code edits, verification, status report |
| `reviewer` | subagent | Expensive/Medium | Behavior + Change Health diff review, escalation hints |
| `session-evaluator` | subagent | Medium | Agent behavior audit: tool efficiency, skills, scope, token waste |
| `browser-qa` | subagent | Expensive (browser) | Browser QA: layout, responsive, console/network, data consistency |
| `explore` (built-in) | — | Cheap | Built-in OpenCode read-only discovery agent |
| `scout` (built-in) | — | Cheap | Built-in OpenCode external docs / dependency / upstream source research |

**Verifier**: No dedicated primitive agent. Start with `verify-evidence` on-demand skill (in `skills/misc/`). Promote to dedicated agent only if the skill is used in >50% of sessions and its routing/context cost justifies a separate agent file.

### Design Rules

- **No mega-agents.** If an agent prompt covers multiple domains, split it.
- **No nested subagents.** A subagent must never spawn another subagent. Escalate to orchestrator for re-routing.
- **Max 3 subagents per request.** Prevents runaway costs. Batch or escalate if more needed.
- **Orchestrator routes, rarely edits.** Direct implementation is last resort for tiny config/docs fixes.

## On-Demand Skills and Promotion Rule

Specialist prompts are skills, not active agents. Skills load on demand — they do not pollute daily agent context.

### When to Promote

An agent file is a candidate for skill promotion when:
1. **Niche domain** — narrow topic (e.g. PHP review, security audit).
2. **On-demand use** — not needed for every workflow.
3. **No distinct permission/model boundary** — no special tools, browser access, or guaranteed model routing needed.
4. **Bundled resources** — code samples, command snippets, templates that a skill directory can hold.

### Current Specialist Outcomes

| Specialist Need | Outcome | Rationale |
|-----------|---------|-----------|
| Security review | `skills/misc/security-review/` | Niche, OWASP-heavy, on-demand |
| PHP/Laravel review | `skills/misc/php-review/` | Language-specific, on-demand |
| Database review | `skills/misc/database-review/` | Topic-specific, bundles SQL patterns |
| Architecture review | `skills/engineering/improve-codebase-architecture/` | Existing Matt skill covers it better |
| E2E testing | `skills/engineering/tdd/` + `browser-qa` | Test creation and browser evidence already covered |
| Verify evidence | `skills/misc/verify-evidence/` | Tool-based verification checklist |

### Boundaries

- **Do not promote** `orchestrator`, `planner`, `builder`, `reviewer`, or `browser-qa` — these are routing and execution primitives.
- **Do not promote** skills already well-served by built-in OpenCode agents (`explore`, `scout`).

## Routing Rules

Use the cheapest reliable context source. Do not spawn subagents for work one direct read or grep can answer.

| Source | Use for | Do not use for |
| --- | --- | --- |
| Direct `read` / `grep` / `glob` | Known files, exact strings, quick checks | Broad codebase discovery |
| OpenViking (optional) | Prior decisions, memories, workspace preferences, indexed docs | Current local-file truth |
| `explore` | Current working tree discovery, symbols, flows, file maps | External library docs |
| `scout` | External docs, dependency source, upstream API behavior | Local repo search |
| `browser-qa` | Runtime UI/browser truth | Static code exploration |

### Decision Order

1. Known file or exact term: use direct tools.
2. Continuation or "what did we decide": search OpenViking first if available; otherwise continue with local files.
3. Current repo unknowns: use built-in `explore`.
4. External dependency docs or upstream source: use built-in `scout`.
5. UI/runtime behavior: use `browser-qa`.

### Explore Prompt Contract

Include: target question, desired thoroughness (`quick`/`medium`/`very thorough`), files to include/exclude, exact output shape.

### Scout Prompt Contract

Include: library/framework name + version, exact API/behavior to verify, preferred source (official docs or source), output shape with citations/URLs.

### Optional OpenViking Discipline

- OpenViking is optional. Do not block work if missing.
- Detect availability: MCP tools available, skill available, or server reachable.
- If missing and persistent memory would help, recommend once. Do not ask repeatedly.
- Local files and `git diff` are authoritative. If OpenViking conflicts with local files, trust local files and flag discrepancy.
- Store durable decisions only after user confirmation.
- Never store secrets, API keys, transient command output, or unconfirmed assumptions.

## Implementation / Review Gate

For each implementation slice:

1. Give `builder` self-contained scope, constraints, acceptance criteria, and verification command.
2. Wait for status (`DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, `BLOCKED`).
3. Load `verify-evidence` skill for tool-based verification when non-trivial, AFK, failing/flaky tests, explicit AC, or reviewer needs evidence. For trivial docs/config, inspect diff directly and mark `unverified` or ask user for expanded budget.
4. Inspect diff, verification evidence, test output.
5. Send verification evidence + diff to `reviewer` when behavior, security, or maintainability risk exists.
6. Allow one focused retry. Escalate after second failure.

### Flow

```
User Request
  └─ orchestrator
       ├─ planner (if plan needed)
       ├─ grill-with-docs (if terminology/decisions fuzzy)
       ├─ explore/scout (when direct read/grep insufficient)
       ├─ builder (code changes, sequential)
       ├─ verify-evidence (on-demand skill, loaded for verification)
       ├─ browser-qa (browser evidence, token-heavy)
       └─ reviewer (diff review using verification evidence)
  └─ report to user
```

## AFK Session Log

Durable state for unattended/long-running orchestrator sessions. Lets the orchestrator resume after interruption without redoing verified work.

### Location

- **Multi-issue or full session**: `.scratch/afk-sessions/<session-id>.jsonl`
- **Single-issue session**: next to the issue file (e.g. `.scratch/issues/doing/0001-fix-auth.md.jsonl`)

Session ID format: `YYYYMMDD-HHMMSS-shortname`.

### Event Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timestamp` | ISO 8601 | yes | When the event happened |
| `session_id` | string | yes | Session identifier |
| `issue_path` | string | no | Path to the issue file, if scoped to one issue |
| `phase` | string | yes | One of: `plan`, `build`, `verify`, `review`, `checkpoint`, `blocked` |
| `actor` | string | yes | Which agent or skill: `orchestrator`, `planner`, `builder`, `reviewer`, `verify-evidence` |
| `status` | string | yes | `started`, `passed`, `failed`, `blocked`, `skipped` |
| `summary` | string | yes | One-line description of what happened |
| `files_changed` | array | no | File paths modified in this slice |
| `evidence` | array | no | Evidence references: paths, commands run, output hashes |
| `remaining_work` | string | no | What is still pending |
| `human_checkpoint_needed` | boolean | no | If true, orchestrator must block until user input |
| `next_action` | string | yes | What the orchestrator should do next |

### Checkpoint Events

After every complete work slice (plan → build → verify → review), append a checkpoint event with: what changed, verified evidence, remaining work, human checkpoint needed boolean. Phase is always `checkpoint`, actor is `orchestrator`.

### Blocked Events

Record a `blocked` phase event with: exact blocker (condition, error, missing input), why it is unresolvable, needed input to unblock. Do not retry into a blocker.

### Privacy Rules

- No secrets: do not log API keys, tokens, passwords, or PII.
- Truncate command output >200 lines; note `truncated: true` in evidence entry.
- Link evidence paths instead of dumping inline.

## Boundaries

- **No mega-agents.** Each agent does one thing.
- **Max 3 subagents per request.** If more needed, batch or escalate.
- **Sandbox research in `sandbox/` is temporary.** Delete sandbox files once decisions are promoted.
- **Do not add `verifier` as a primitive agent** until sustained usage proves need.
