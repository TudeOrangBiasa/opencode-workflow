---
name: agent-config
description: Scaffold per-repo agent config — scratch workspace (issues/kanban/spec), issue tracker, triage labels, domain docs, design reference, workspace skill symlinks. Use when user says setup agent config, configure repo, scaffold docs/agents, setup repo for agents. Model-invoked only (hard dependency — other skills reference this).
disable-model-invocation: true
---
# Agent Config

Prompt-driven skill, not deterministic script. Explore, present, confirm, then write.

Scaffold per-repo config that engineering skills assume. For meta-repos (skill managers), also audits skill_triggers, plugin health, and agent sync.

- **Scratch workspace** — `.scratch/` with issues/kanban/spec/evals/verification/out-of-scope buckets
- **Issue tracker** — where issues live (GitHub default; local markdown supported)
- **Triage labels** — five canonical triage role strings
- **Domain docs** — CONTEXT.md and ADR consumer rules
- **Design reference** — `design.md` with tokens, anti-patterns, component rules
- **Workspace symlinks** — skill symlinks in `.opencode/skills/` for `@skill-name` in chat
- **Skill triggers** — which skills auto-load via opencode.json (meta-repo only)

For full process, templates, and meta-repo mode, see [REFERENCE.md](REFERENCE.md).

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Process](REFERENCE.md#process) | Explore → present → confirm → write |
| [Standard Mode](REFERENCE.md#standard-mode) | Scratch workspace, issue tracker, triage, domain, design, workspace symlinks |
| [Meta-Repo Mode](REFERENCE.md#meta-repo-mode) | Detection, exploration, write behavior, config audit |
| [Pre-flight Checks](REFERENCE.md#pre-flight-checks) | OfficeCLI, chrome-devtools, exa, drawio, OpenViking |
| [Seed Templates](REFERENCE.md#seed-templates) | Standard + meta-repo templates |
