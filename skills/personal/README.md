# Personal

Skills tied to personal setup and workflow. Not promoted in the top-level active skill reference.

## When to use

You are working on the opencode-workflow repo itself (editing agents, skills, config), evaluating session quality, mining idea fragments, auditing workflow state, or using machine-specific tools (DDEV, OpenViking).

## Boundary with sibling buckets

**Personal** covers skills for maintaining/improving this workflow repo itself (dev-workflow, eval, workflow-audit) and machine-specific tools that are not portable (ddev, openviking). Use **Engineering** for daily code-work pipeline skills. Use **Productivity** for non-code workflow tools (documents, research, handoffs). Personal skills are explicitly not promoted to the top-level reference. They are excluded from the `check-skill-structure.sh` compliance audit by design.

## Structure

2 sub-directories:

- **workflow/** — repo maintenance, session evaluation, idea mining, state auditing
- **tools/** — machine-specific CLI tools

### workflow/

- [dev-workflow](dev-workflow/SKILL.md) — Development workflow for the opencode-workflow repo itself. Adding skills, modifying agents, syncing from upstream, committing.
- [eval](eval/SKILL.md) — Analyze sessions for agent errors, stuck patterns, scope drift, tool misuse. Creates report in .scratch/evals/. Report only.
- [idea-fragments](idea-fragments/SKILL.md) — Mine raw project, hackathon, MVP, and domain-discovery idea fragments before planning or prototyping.
- [workflow-audit](workflow-audit/SKILL.md) — Audit opencode-workflow state — read opencode.json, verify symlinks, check repo sync, analyze recent sessions, surface mismatches.

### tools/

- [ddev](ddev/SKILL.md) — DDEV command workflow for PHP/Laravel projects where PHP is not run baremetal.
- [openviking](openviking/SKILL.md) — Persistent memory for AI agents — store/retrieve context across sessions.

## Notes

Documents/kit workflows moved to [productivity/documents-kit/](../productivity/documents-kit/SKILL.md).
