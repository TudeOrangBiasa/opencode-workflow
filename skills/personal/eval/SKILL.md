---
name: eval
description: Use when evaluate a session for AI mistakes, user frustration, repeated errors, or scope drift. Use when user says eval session, what went wrong, diagnose session, session audit, post-mortem. Creates report in opencode-workflow/.scratch/evals/. Report only — never fix directly.
---
# Eval

Analyze the current session for agent failures, user frustration, and repeated mistakes. Create an eval report in the opencode-workflow repo. Report only — never fix directly. After report, use `grill-with-docs` or `grill-me` to plan fixes before implementing.

## When to Activate

- User says "eval session", "what went wrong", "diagnose session"
- User expresses frustration ("wasting token", "kok gini", "kenapa", "lagi", "sudah gw bilang")
- Session has repeated tool failures or scope creep
- User wants to capture lessons learned

See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
