# Orchestration Boundaries

## Boundary

The orchestrator routes work. Subagents do not spawn subagents.

## Out of Scope

- Nested agents.
- Agent swarms.
- Multi-agent mission-control dashboard/app.
- Autonomous loops without issue, acceptance criteria, and checkpoint.
- More than 3 subagents per user request unless user explicitly expands budget.
- Parallel implementation touching shared files or shared state.

## Required Shape

Normal implementation flow:

```text
orchestrator → planner? → builder → verify-evidence? → reviewer? → final report
```

AFK flow requires:

- issue or written scope
- acceptance criteria
- verification command/evidence target
- checkpoint log when long-running
- human checkpoint for destructive/irreversible work

## Stop Conditions

Stop and ask when:

- Requirement is ambiguous.
- Action modifies remote state irreversibly.
- Database/billing/secrets/DNS/production deploy risk appears.
- Cost risk exceeds approved budget.
- Same failure repeats without progress.
