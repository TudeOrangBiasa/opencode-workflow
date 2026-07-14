# Install

This repo is the source of truth for local OpenCode workflow agents and selected skills.

Do not run these steps while still maturing the repo. Activation writes symlinks into `~/.config/opencode`; keep development repo-only until ready.

## Link Agents

```bash
./scripts/link-agents.sh
```

Links `agents/*.md` into `~/.config/opencode/agents`.

## Link Skills

```bash
./scripts/link-skills.sh
```

Links only the active workflow skills into `~/.config/opencode/skills`.

The script is non-destructive. If a target skill already exists as a real directory, the script stops instead of deleting it. Keep existing global skill dirs when they contain local customizations.

Active repo skills span `engineering/`, `productivity/`, and `misc/` buckets. Run `ls skills/*/*/SKILL.md` for current list.

Global-only skills such as `design` stay in `~/.config/opencode/skills`.

## OpenCode Restart

OpenCode loads config, agents, skills, and plugins at startup. Quit and restart OpenCode after linking or editing these files.

## Config Template

Use [`docs/templates/opencode.primitive-agents.jsonc`](./templates/opencode.primitive-agents.jsonc) as the canonical config template for `~/.config/opencode/opencode.json`. It includes:

- Model assignments per agent (planner, builder, reviewer, advisor, scout, etc.)
- Permission rules (planner can spawn subagents, reviewer has chrome-devtools access, etc.)
- Skill triggers (auto-load keywords for ponytail, design, etc.)
- Disabled built-ins (`general`, `plan`, `build`)
- MCP examples (exa, chrome-devtools, openviking)

To activate:

```bash
# Option A: copy the template (replaces any existing config)
cp docs/templates/opencode.primitive-agents.jsonc ~/.config/opencode/opencode.json

# Option B: merge into your existing config
# Manually copy the agent, permission, skill_triggers, and MCP sections
```

After copying, replace `REPLACE_WITH_YOUR_KEY` with your actual provider API key, and update model IDs with exact values from `opencode models`.

**This template IS the source of truth for the local config.** When you change a model assignment, permission, or skill trigger in `~/.config/opencode/opencode.json`, also update the template in the repo so it stays in sync. The repo can then be re-cloned or shared and the workflow will work the same way.

**Note**: The actual `opencode.json` is local-only and never committed (it may contain API keys). Only the template is versioned.

See [`docs/models.md`](./models.md) for model tier guidance.

## Secret Safety

Do not commit `~/.config/opencode/opencode.json`. It can contain provider API keys.
