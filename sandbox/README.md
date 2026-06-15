# Sandbox

Temporary workspace for developing and testing rules, skills, agents, and scripts before promoting to `agents/`, `skills/`, or `AGENTS.md`.

## Purpose

- Prototype new agent rules
- Test skill behavior in isolation
- Develop scripts before integration
- Experiment with workflow changes

## Rules

- Sandbox files are **temporary**. Once decisions are promoted, delete the sandbox files.
- Do not treat sandbox findings as active policy until promoted.
- Do not commit sandbox contents to main branch — use `.gitignore` if needed.
- Reference clones (e.g. external repos for skill mining) go here temporarily, then delete after handpicking.

## Lifecycle

1. Create sandbox folder for experiment
2. Develop and test
3. Promote decisions to `agents/`, `skills/`, `docs/`, or `AGENTS.md`
4. Delete sandbox folder
