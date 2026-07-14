# Workflow Audit — Reference

> Full audit workflow. See SKILL.md for when-to-use.

## 1. OpenCode Config Audit

Read ~/.config/opencode/opencode.json. Report default agent, active agents, models, skill triggers, MCP servers, plugins.

List symlinks in ~/.config/opencode/agents/ and ~/.config/opencode/skills/. Flag broken symlinks, non-symlinks, paths outside repo.

## 2. Repo Sync Audit

git log --oneline -10, git status --short, git log origin/main..HEAD --oneline.

Report: last commit, unpushed count, uncommitted files, branch name.

## 3. Skill/Agent Match Check

Cross-reference agents in opencode.json ↔ agents/*.md; skills symlinks ↔ link-skills.sh ACTIVE_SKILLS; ACTIVE_SKILLS ↔ skills/**/SKILL.md. Flag mismatches.

## 4. Recent Session Activity

Query opencode.db for last 5 paid sessions. Report date, project, agent, cost, tokens.

Look for: OpenViking usage, stuck loops (8+ same-tool calls), skill invocation gaps.

## 5. Output Format

Structured markdown with sections: OpenCode Config, Symlink Health, Repo Sync, Match Check, Recent Sessions, Issues/Recommendations.

## Rules

Read-only, use live state, be specific (files/line numbers), actionable, lead with user's specific question.
