---
name: workflow-audit
description: Use when audit the opencode-workflow state — read opencode.json, verify symlinks, check repo sync, analyze recent sessions, surface mismatches. Use when user says audit, workflow status, check changes, verify sync, what did I change, opencode config status, lint workflow.
---

# Workflow Audit

For full audit workflow and details, see [REFERENCE.md](REFERENCE.md).

## When to Activate

Use this skill when the user wants to know:

- "What did I change in my opencode config?"
- "Is opencode-workflow in sync with global?"
- "What skills/agents are active right now?"
- "What did recent sessions cost?"
- "Any drift between repo and global?"
- "Are there broken symlinks?"

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Config Audit](REFERENCE.md#1-opencode-config-audit) | opencode.json, symlinks |
| [Repo Sync](REFERENCE.md#2-repo-sync-audit) | git status, unpushed |
| [Match Check](REFERENCE.md#3-skillagent-match-check) | Config vs files cross-ref |
| [Session Activity](REFERENCE.md#4-recent-session-activity) | DB query, pain patterns |
| [Output Format](REFERENCE.md#5-output-format) | Markdown report template |
| [Rules](REFERENCE.md#rules) | Read-only, live state, specific, actionable |
