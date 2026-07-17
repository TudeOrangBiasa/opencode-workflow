1. OpenCode Workflow Kit — Profile-Based Agent Teams
2. This repo is developed for OpenCode only. Do not add compatibility surfaces for other agent runtimes unless a task explicitly asks for it.
3. When user says "zoom out" or "big picture", go up a layer of abstraction and describe the relevant module map.

## Role

opencode-workflow is the **personal dotfiles + workflow pipeline** for profile-based agent teams. It contains:

- 4 specialized agent profiles (orchestrator, planning, engineering, validation)
- 10 agents total with hierarchical delegation
- Skills distributed per profile specialization
- Shared config (providers, plugins) that merges with profile configs
- Herdr orchestration for inter-profile communication

## Scope

- Source of truth for OpenCode agent profiles in `profiles/`.
- Source of truth for shared config in `shared/`.
- Plugins live in `~/.config/opencode/opencode.json` (caveman, ponytail). No plugins in this repo.
- Documentation for local installation and model routing in `docs/`.
- Do not edit `~/.config/opencode` while maturing changes here unless the user explicitly asks to install or activate them.

## Context Map (Monorepo)

This repo is a monorepo for OpenCode profile-based agent workflow. Key directories:

| Path | Purpose |
|------|---------|
| `profiles/` | 4 specialized agent profiles |
| `profiles/orchestrator/` | User's right hand, manages other profiles via Herdr |
| `profiles/planning/` | Requirements, specs, design thinking |
| `profiles/engineering/` | Code execution, frontend/backend/platform |
| `profiles/validation/` | Quality assurance, security review |
| `shared/` | Shared config (providers, plugins, openviking) |
| `docs/` | Documentation (architecture, install) |
| `.scratch/spec/` | hierarchical-team-design.md |
| `install.sh` | Creates symlinks + shell aliases |

## Profile Structure

Each profile is self-contained:
```
profiles/<name>/
├── opencode.json      ← Agents, model routing, MCP, skills paths
├── agents/            ← Agent .md files (no models in frontmatter)
├── skills/            ← Profile-specific skills
└── rules/agents.md    ← Profile conventions
```

## Agent Delegation

```
orchestrator (user's right hand)
├── planning-lead → product-manager, ux-researcher
├── engineering-lead → frontend-dev, backend-dev
└── validation-lead → qa-engineer, security-reviewer
```

Orchestrator delegates to other profiles via Herdr pane communication.

## Model Routing

- **Planning/Validation**: `opencode/hy3-free` (cheap, fast)
- **Engineering**: `deepseek/deepseek-v4-flash` (code execution)

Providers configured in `shared/opencode.json`. Model routing per profile.

## MCP Per Profile

Token cost optimization — each profile loads only what it needs:
- **Orchestrator**: openviking (memory)
- **Planning**: exa (research), openviking (memory)
- **Engineering**: chrome-devtools (browser QA), openviking (memory)
- **Validation**: chrome-devtools (browser QA), openviking (memory)

## Installation

```bash
./install.sh
source ~/.zshrc
```

Creates shell aliases:
- `oc-orchestrator`
- `oc-planning`
- `oc-engineering`
- `oc-validation`

Or use Herdr:
```bash
herdr new-session --name orchestrator -- cmd oc-orchestrator
herdr new-session --name planning -- cmd oc-planning
herdr new-session --name engineering -- cmd oc-engineering
herdr new-session --name validation -- cmd oc-validation
```

## OpenCode Compatibility

- Prefer OpenCode paths: `~/.config/opencode-profiles/` for profiles.
- Keep install scripts non-destructive.
- OpenCode loads config, agents, and skills at startup; restart required after activation.
- Do not store secrets or provider keys in this repo.

## Config Merging

OpenCode configs **merge**, not replace. Precedence order:
1. Global config (`~/.config/opencode/opencode.json`) — providers, plugins
2. Profile config (`OPENCODE_CONFIG_DIR`) — agents, skills, MCP, model routing

Profile configs override global on conflicts. Non-conflicting settings preserved.

## Herdr Communication

Orchestrator communicates with other profiles via Herdr:
- `herdr pane send-text <id> <text>` — send work
- `herdr pane read <id>` — read results
- `herdr wait output <id> --match <text>` — wait for completion

See `.scratch/spec/hierarchical-team-design.md` for full spec.
