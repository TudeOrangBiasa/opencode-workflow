---
name: context-budget
description: Use when audit OpenCode context overhead across agents, skills, MCP servers, and repo instructions. Use only for workflow/context bloat decisions, not normal implementation.
---

# Context Budget

Adapted from ECC's `context-budget` skill (MIT).

Analyze token overhead across every loaded component in a OpenCode session and surface actionable optimizations to reclaim context space.

## When to Use

- Session performance feels sluggish or output quality is degrading
- You've recently added many skills, agents, or MCP servers
- You want to know how much context headroom you actually have
- Planning to add more components and need to know if there's room
- Running `/context-budget` command (this skill backs it)

## How It Works

See [REFERENCE.md](REFERENCE.md) for full phase details, report format, and examples.

### Phases Summary

1. **Inventory** — scan agents, skills, rules, MCP servers, AGENTS.md
2. **Classify** — sort each component into Always/Sometimes/Rarely needed
3. **Detect Issues** — bloat, redundancy, MCP over-subscription
4. **Report** — produce context budget report with ranked optimizations

## Quick Tips

- **Token estimation**: `words × 1.3` for prose, `chars / 4` for code
- **MCP is the biggest lever**: each tool schema costs ~500 tokens
- **Agent descriptions load always** — even if agent is never invoked
