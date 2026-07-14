# Explicit `/agent-config` pointer only for hard dependencies

Engineering skills depend on per-repo config (issue tracker, triage label vocabulary, domain doc layout, workspace skill symlinks) seeded by `/agent-config`. Some skills cannot meaningfully function without that config — they have to publish to a specific issue tracker or apply a specific label string. Others only use it to sharpen output (vocabulary, ADR awareness) and degrade gracefully without it.

We split these into **hard-dependency** and **soft-dependency** skills:

- **Hard dependency** (`to-tickets`, `to-spec`, `triage`) — include an explicit one-liner: _"… should have been provided to you — run `/agent-config` if not."_ Without the mapping, output is wrong, not just fuzzy.
- **Soft dependency** (`diagnosing-bugs`, `tdd`, `improve-codebase-architecture`, `zoom-out`) — reference "the project's domain glossary" and "ADRs in the area you're touching" in vague prose only. If the docs aren't there, the skill still works; output is just less sharp.

> Note: Originally named `setup-matt-pocock-skills`. Renamed 2026-07-14 to `agent-config` after removing Matt Pocock branding and adding workspace skill symlink feature.

The split keeps soft-dependency skills token-light and avoids cargo-culting the setup pointer into places where it isn't load-bearing.
