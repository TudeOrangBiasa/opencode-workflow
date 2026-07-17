# OpenCode Workflow Kit

> Personal dotfiles + workflow pipeline for profile-based agent teams. Orchestrator manages planning, engineering, and validation profiles via Herdr.

## What This Is

This repo is the **personal AI workflow setup**:

- 4 specialized agent profiles (orchestrator, planning, engineering, validation)
- 10 agents total with hierarchical delegation
- Skills distributed per profile specialization
- Shared config (providers, plugins) that merges with profile configs
- Herdr orchestration for inter-profile communication

## Architecture

```
opencode-workflow/
├── profiles/
│   ├── orchestrator/       ← User's right hand, manages other profiles via Herdr
│   ├── planning/           ← Requirements, specs, design thinking
│   ├── engineering/        ← Code execution, frontend/backend/platform
│   └── validation/         ← Quality assurance, security review
├── shared/
│   ├── opencode.json       ← Providers, plugins
│   ├── skills/             ← openviking (symlinked to profiles)
│   └── rules/agents.md     ← Global conventions
├── install.sh              ← Creates symlinks + shell aliases
├── .scratch/spec/          ← hierarchical-team-design.md
└── AGENTS.md / README.md   ← Entry points
```

## Quick Start

```bash
./install.sh
source ~/.zshrc
```

Then use shell aliases:
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

## Agent Teams

```
orchestrator (user's right hand)
├── planning-lead → product-manager, ux-researcher
├── engineering-lead → frontend-dev, backend-dev
└── validation-lead → qa-engineer, security-reviewer
```

## Model Routing

- **Planning/Validation**: `opencode/hy3-free` (cheap, fast)
- **Engineering**: `deepseek/deepseek-v4-flash` (code execution)

## Documentation

- [Architecture](docs/architecture.md) — profile structure, config merging, Herdr orchestration
- [Install](docs/install.md) — setup instructions
- [Models](docs/models.md) — model routing details
- `.scratch/spec/hierarchical-team-design.md` — full spec

## Adding Skills

1. Determine which profile needs the skill
2. Add skill to `profiles/<profile>/skills/`
3. Update `profiles/<profile>/opencode.json` skill_triggers if needed

## License

MIT
