---
name: architecture
description: How opencode-workflow is structured — profile-based agent teams with Herdr orchestration.
---

# Architecture

## Role of opencode-workflow

opencode-workflow is the **personal dotfiles + workflow pipeline** for profile-based agent teams. It contains:

- 4 specialized agent profiles (orchestrator, planning, engineering, validation)
- 10 agents total with hierarchical delegation
- Skills distributed per profile specialization
- Shared config (providers, plugins) that merges with profile configs
- Herdr orchestration for inter-profile communication

## Profile-Based Architecture

```
opencode-workflow/
├── profiles/
│   ├── orchestrator/       ← User's right hand, manages other profiles via Herdr
│   │   ├── opencode.json   ← Model: opencode/hy3-free, MCP: openviking
│   │   ├── agents/         ← orchestrator.md
│   │   ├── skills/         ← memory-dreaming, workflow-audit, eval, etc.
│   │   └── rules/agents.md
│   ├── planning/           ← Requirements, specs, design thinking
│   │   ├── opencode.json   ← Model: opencode/hy3-free, MCP: exa + openviking
│   │   ├── agents/         ← planning-lead, product-manager, ux-researcher
│   │   ├── skills/         ← triage, to-spec, wayfinder, design-system, etc.
│   │   └── rules/agents.md
│   ├── engineering/        ← Code execution, frontend/backend/platform
│   │   ├── opencode.json   ← Model: deepseek/deepseek-v4-flash, MCP: chrome-devtools + openviking
│   │   ├── agents/         ← engineering-lead, frontend-dev, backend-dev
│   │   ├── skills/         ← react-patterns, laravel, docker-patterns, etc.
│   │   └── rules/agents.md
│   ── validation/         ← Quality assurance, security review
│       ├── opencode.json   ← Model: opencode/hy3-free, MCP: chrome-devtools + openviking
│       ├── agents/         ← validation-lead, qa-engineer, security-reviewer
│       ├── skills/         ← tdd, security-review, code-review, etc.
│       └── rules/agents.md
├── shared/
│   ├── opencode.json       ← Providers (opencode, deepseek), plugins (caveman, ponytail)
│   ├── skills/             ← openviking (symlinked to profiles)
│   └── rules/agents.md     ← Global conventions
├── install.sh              ← Creates symlinks + shell aliases
├── .scratch/spec/          ← hierarchical-team-design.md
└── AGENTS.md / README.md   ← Entry points
```

## How It Works

### Config Merging

OpenCode configs **merge**, not replace. Precedence order:
1. Global config (`~/.config/opencode/opencode.json`) — providers, plugins
2. Profile config (`OPENCODE_CONFIG_DIR`) — agents, skills, MCP, model routing

Profile configs override global on conflicts. Non-conflicting settings preserved.

### Herdr Orchestration

Each profile is an independent OpenCode instance. Herdr manages all sessions:

```bash
herdr new-session --name orchestrator -- cmd oc-orchestrator
herdr new-session --name planning -- cmd oc-planning
herdr new-session --name engineering -- cmd oc-engineering
herdr new-session --name validation -- cmd oc-validation
```

Orchestrator communicates with other profiles via Herdr:
- `herdr pane send-text <id> <text>` — send work
- `herdr pane read <id>` — read results
- `herdr wait output <id> --match <text>` — wait for completion

### Skill Distribution

Skills distributed per profile specialization:
- **Orchestrator**: workflow management (memory-dreaming, workflow-audit, eval, etc.)
- **Planning**: planning + design (triage, to-spec, wayfinder, design-system, etc.)
- **Engineering**: frontend/backend/platform (react-patterns, laravel, docker-patterns, etc.)
- **Validation**: QA + security (tdd, security-review, code-review, etc.)

### Model Routing

- **Planning/Validation**: `opencode/hy3-free` (cheap, fast)
- **Engineering**: `deepseek/deepseek-v4-flash` (code execution)

Providers configured in shared config, model routing per profile.

## Installation

```bash
./install.sh
source ~/.zshrc
```

Creates:
- `~/.config/opencode-profiles/{orchestrator,planning,engineering,validation}/`
- Shell aliases: `oc-orchestrator`, `oc-planning`, `oc-engineering`, `oc-validation`
- Symlinks to repo profiles + shared resources

## When to Add/Modify

- **New skill**: Add to appropriate profile's `skills/` directory
- **New agent**: Add to profile's `agents/` directory, update profile's `opencode.json`
- **New profile**: Create directory, add to `install.sh`, update this doc
- **Model change**: Update profile's `opencode.json` agent block

## Reference

- `.scratch/spec/hierarchical-team-design.md` — full spec
- `shared/opencode.json` — providers + plugins
- `profiles/*/opencode.json` — profile-specific config
- `profiles/*/rules/agents.md` — profile conventions
