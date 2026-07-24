---
name: skill-spector
description: Scan AI agent skill files for security vulnerabilities before installing. Use when adding third-party skills from npm, GitHub, or marketplace.
---

# SkillSpector

NVIDIA SkillSpector scans AI agent skills (Claude Code, Codex, Gemini, OpenCode) for security risks before installation.

## Usage

```bash
# Install
pip install skillspector

# Scan a skill directory or file
skillspector scan ./path/to/skill/

# Scan a URL (GitHub repo)
skillspector scan https://github.com/owner/repo

# JSON output for agent parsing
skillspector scan ./skill --format json
```

## What It Detects

68 vulnerability patterns across 17 categories: prompt injection, data exfiltration, privilege escalation, supply chain, MCP tool poisoning, etc.

## When to Use

- Before installing any third-party skill from untrusted source
- On PR that adds new skill files to `.opencode/skills/` or `.config/opencode/skills/`
- During security review of workflow changes

## Output Integration

Include findings in handoff evidence. Critical findings → block merge.
