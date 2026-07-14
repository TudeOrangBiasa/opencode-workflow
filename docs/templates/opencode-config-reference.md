# OpenCode Config Reference

Reference copy of `~/.config/opencode/opencode.json`. Hardcoded paths and secrets removed — replace with your own values.

Actual config: `~/.config/opencode/opencode.json` (source of truth).

## Top-level keys

| Key | Value | Description |
|-----|-------|-------------|
| `$schema` | `https://opencode.ai/config.json` | Schema |
| `default_agent` | `planner` | Entry agent |
| `model` | Provider-prefixed model ID | Default conversation model |
| `small_model` | Free/cheap model ID | Bounded execution + exploration |

## Plugin

```jsonc
[
  // npm global plugins path
  "<npm-global>/opencode-caveman/.opencode/plugins/opencode-caveman.js",
  "<npm-global>/opencode-ponytail/.opencode/plugins/ponytail.mjs"
]
```

## Provider

```jsonc
{
  "9router": {
    "npm": "@ai-sdk/openai-compatible",
    "options": {
      "baseURL": "http://127.0.0.1:20128/v1", // local 9Router instance
      "apiKey": "{env:NINE_ROUTER_API_KEY}"
    },
    "models": {
      "oc/deepseek-v4-flash-free": { "name": "oc/deepseek-v4-flash-free" },
      "oc/hy3-free": { "name": "oc/hy3-free" },
      "ds/deepseek-v4-flash": { "name": "ds/deepseek-v4-flash" }
    }
  }
}
```

## Skills paths

OpenCode scans 1 level deep per path. Each leaf bucket gets its own path:

```jsonc
[
  ".opencode/skills",
  "~/.config/opencode/skills",
  // external repos
  "~/path/to/obsidian-management/.opencode/skills",
  // npm plugin skills
  "<npm-global>/opencode-ponytail/skills",
  "<npm-global>/opencode-caveman/skills",
  // 16 leaf bucket paths
  "~/.config/opencode/skills/engineering/design",
  "~/.config/opencode/skills/engineering/planning",
  "~/.config/opencode/skills/engineering/quality",
  "~/.config/opencode/skills/engineering/workflow",
  "~/.config/opencode/skills/misc/backend",
  "~/.config/opencode/skills/misc/data",
  "~/.config/opencode/skills/misc/devops",
  "~/.config/opencode/skills/misc/frontend",
  "~/.config/opencode/skills/misc/languages",
  "~/.config/opencode/skills/misc/ml",
  "~/.config/opencode/skills/misc/mobile",
  "~/.config/opencode/skills/misc/security",
  "~/.config/opencode/skills/personal/tools",
  "~/.config/opencode/skills/personal/workflow",
  "~/.config/opencode/skills/productivity"
]
```

## Agents

### planner (primary)

| Key | Value |
|-----|-------|
| mode | `primary` |
| model | Strong reasoning model |
| task subagents | builder, reviewer, advisor, explore, scout |

Skill triggers:

| Trigger | Keywords |
|---------|----------|
| `herdr` | herdr, multiplexer, pane, terminal pane, background agent, parallel agent |
| `ponytail` | review, audit, yagni, over-engineer, simple, minimal, refactor |
| `ponytail-gain` | ponytail gain, ponytail scoreboard, /ponytail-gain |
| `diagnosing-bugs` | bug, broken, error, crash, slow, regression |
| `tdd` | implement, feature, test-first, red-green |
| `verify-evidence` | ship, done, finish, merge, deploy, release, /ship, /yeet |
| `openviking` | memory, remember, openviking, store, retrieve, find |
| `design` | ui, frontend, layout, polish, visual, ux, motion, animation, easing, gesture |
| `design-system` | design system, design tokens, style guide |
| `ui-to-vue` | vue, convert to vue, vue component |
| `review-animations` | review motion, review animation |
| `php-review` | php, laravel, blade, eloquent |
| `security-review` | auth, secret, password, credential, vulnerability |
| `memory-dreaming` | consolidate, dream, clean up lessons |
| `youtube-transcript` | youtube, video transcript, summarize video |
| `modular-monolith-decisions` | modular monolith, architecture evolution |
| `vault` | vault, obsidian, daily note, kanban, sync |
| `eval` | eval session, session audit, post-mortem |
| `workflow-audit` | workflow status, lint workflow |
| `dev-workflow` | add skill to opencode-workflow, sync from upstream |
| `handoff` | hand off, transfer context, context compaction |
| `prototype` | prototype this, mock up, let me play with it |
| `architecture-decision-records` | adr, record this decision |
| `skill-author` | validate skill, audit skill structure |
| `codebase-onboarding` | onboarding guide, new project analysis |
| `9router` | 9router, ai gateway, vlm, vision model |
| `triage` | triage issue, classify issue |
| `to-spec` | write spec, buat spec |
| `to-tickets` | break tickets, buat ticket |
| `improve-codebase-architecture` | architecture review, deepening |
| `code-review` | review this, code review, review since |
| `team-handoff-quality` | handoff, release notes, changelog, version bump |
| `production-audit` | prod readiness, launch check |

### builder (subagent)

| Key | Value |
|-----|-------|
| mode | `subagent` |
| model | Cheap free model |

### reviewer (subagent)

| Key | Value |
|-----|-------|
| mode | `subagent` |
| model | Mid-range free model |
| permissions | all allow, edit deny |

### advisor (subagent)

| Key | Value |
|-----|-------|
| mode | `subagent` |
| model | Strong reasoning model |
| permissions | edit deny, task deny |

### explore (built-in subagent)

| Key | Value |
|-----|-------|
| mode | `subagent` |
| model | Free model |
| permissions | edit deny |

### scout (built-in subagent)

| Key | Value |
|-----|-------|
| mode | `subagent` |
| model | Free model |
| permissions | edit deny |

### compaction

```jsonc
{ "temperature": 0.1 }
```

### Disabled built-ins

```jsonc
"general": { "disable": true },
"plan": { "disable": true },
"build": { "disable": true },
"orchestrator": { "disable": true },
"validator": { "disable": true }
```

## MCP servers

| Server | Type | URL / Command |
|--------|------|---------------|
| exa | remote | `https://mcp.exa.ai/mcp` |
| chrome-devtools | local | `npx -y chrome-devtools-mcp@latest` |
| openviking | remote | `http://localhost:1933/mcp` |
