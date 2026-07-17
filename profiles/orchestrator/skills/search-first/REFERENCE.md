# Search First — Reference

> Full workflow details. See SKILL.md for quick start.

## Workflow Diagram

```
0. Tool Availability Preflight → 1. Need Analysis → 2. Parallel Search (npm/PyPI, MCP/GitHub, Web) → 3. Evaluate → 4. Decide (Adopt/Extend/Compose/Build) → 5. Implement
```

## Decision Matrix

| Signal | Action |
|---|---|
| Exact match, well-maintained, MIT/Apache | **Adopt** — install and use directly |
| Partial match, good foundation | **Extend** — install + write thin wrapper |
| Multiple weak matches | **Compose** — combine 2-3 small packages |
| Nothing suitable found | **Build** — write custom, informed by research |

## Step 0: Tool Availability Preflight

| Channel | Check | If missing |
|---|---|---|
| Repository search | rg --files + targeted rg queries | State only visible files inspected |
| Package registry | npm version / pip version | Use web/docs search |
| GitHub CLI | gh auth status | Use public web or local git history |
| MCP/docs tools | Available tool list or MCP config | Fall back to official docs/web search |
| Skills directory | ls ~/.config/opencode/skills/ | Say no local skill catalog available |

## Quick Mode

Before writing a utility, check: (1) repo exists? (rg), (2) common problem? (npm/PyPI), (3) MCP available?, (4) skill available?, (5) GitHub template?

## Full Mode (agent)

For non-trivial functionality, launch researcher agent with structured prompt.

## Search Shortcuts by Category

Development tooling (eslint, ruff, prettier, husky), AI/LLM (SDKs, prompt mgmt), Data & APIs (httpx, zod, pydantic), Content & Publishing (remark, sharp).

## Integration Points

With orchestrator: identify available tools before architecture review. With engineering-lead: consult for tech stack decisions.

## Examples

Dead link checking → textlint-rule-no-dead-link (ADOPT). HTTP client wrapper → got/httpx (ADOPT). Config linter → ajv-cli (ADOPT+EXTEND).

## Anti-Patterns

Jumping to code, ignoring MCP, silent skipping, over-customizing, dependency bloat.
