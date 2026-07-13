---
name: setup-matt-pocock-skills
description: Use when first-time setup of repo-aware engineering skills (diagnosing-bugs, tdd, triage, to-spec, to-tickets, improve-codebase-architecture, zoom-out). Use when user says setup matt pocock, set up engineering skills, configure repo skills. ALSO use when reconfiguring skill management repo (detects meta-repo mode).
disable-model-invocation: true
---
# Setup Matt Pocock's Skills

Prompt-driven skill, not deterministic script. Explore, present, confirm, then write.

Scaffold per-repo config that engineering skills assume. For meta-repos (skill managers), also audits skill_triggers, plugin health, and agent sync.

- **Issue tracker** — where issues live (GitHub default; local markdown supported)
- **Triage labels** — five canonical triage role strings
- **Domain docs** — CONTEXT.md and ADR consumer rules
- **Design reference** — `design.md` with tokens, anti-patterns, component rules
- **Skill triggers** — which skills auto-load via opencode.json (meta-repo only)

For full process, templates, and meta-repo mode, see [REFERENCE.md](REFERENCE.md).

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Process](REFERENCE.md#process) | Explore → present → confirm → write |
| [Standard Mode](REFERENCE.md#standard-mode) | Issue tracker, triage, domain, design |
| [Meta-Repo Mode](REFERENCE.md#meta-repo-mode) | Detection, exploration, write behavior, config audit |
| [Pre-flight Checks](REFERENCE.md#pre-flight-checks) | OfficeCLI, chrome-devtools, exa, drawio, OpenViking |
| [Seed Templates](REFERENCE.md#seed-templates) | Standard + meta-repo templates |
