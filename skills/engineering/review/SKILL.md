---
name: review
description: Review branch, PR, or WIP changes since a fixed point with compact parallel Behavior and Change Health passes. Use when user asks to review since main/commit/branch, review a PR, review WIP, or wants an ambitious code review.
---

# Review

Use `reviewer` directly for small per-slice review. Use this skill for branch/PR/WIP review.

## Process

1. **Pin fixed point** - if missing, ask:

   ```text
   Review against what: main, a branch, a commit, or staged changes?
   ```

   Use `git diff <fixed-point>...HEAD` for branch/tag/commit/`HEAD~N`, or `git diff --staged` for staged changes.

2. **Gather context** - collect:
   - commit list when relevant: `git log <fixed-point>..HEAD --oneline`
   - spec source: issue refs, user-provided path, or matching file under `docs/`, `specs/`, `.scratch/`
   - standards sources: `AGENTS.md`, `CONTEXT.md`, `docs/adr/`, `docs/agents/`, `CONTRIBUTING.md`, style/config files

3. **Run review passes** - for branch/PR/WIP review, spawn up to two read-only fresh-context subagents in parallel:
   - **Behavior**: spec alignment, missing requirements, scope creep, correctness, regressions, verification gaps
   - **Change Health**: maintainability, standards, architecture fit, simplification opportunities
   - For tiny diffs, skip parallelism and run one `reviewer` pass with both lenses.

4. **Aggregate** - dedupe findings, keep only actionable items, and produce one compact report.

## Behavior Pass Prompt

```text
Review this diff for Behavior only.

Inputs:
- Diff command: [command]
- Commits: [commits or none]
- Spec source: [path/content or unknown]

Check: missing/partial requirements, scope creep, behavior contradicting spec, correctness, regressions, verification gaps.

Return under 400 words: Blockers, Notes, Behavior verdict: pass | issues | unknown.
```

## Change Health Pass Prompt

```text
Review this diff for Change Health only.

Inputs:
- Diff command: [command]
- Standards sources: [files]

Be direct, demanding, and specific. Do not be rude. If the diff makes the codebase messier, say so clearly.

Check aggressively for: code-judo simplification, spaghetti growth, wrong layer, weak abstraction, type boundary smell, missing canonical helper reuse, and brittle atomicity/sequencing.

Stay bounded to the diff and touched area. Suggest /improve-codebase-architecture only if the issue is broader than this review.

Return under 400 words: Blockers, Notes, Change Health verdict: pass | issues.
```

## Output Format

```markdown
# Review

Base: [fixed point]
Spec: [source or unknown]
Standards: [sources]

## Verdict
approve | warning | block

## Blockers
- [file:line] issue. Why it matters. Fix direction.

## Notes
- [file:line] issue. Why it matters. Fix direction.

## Coverage
Behavior: pass | issues | unknown
Change Health: pass | issues
Verification reviewed: [commands/evidence]

## Follow-up
- [browser-qa | improve-codebase-architecture | future specialist skill | none]
```

## Rules

- Read-only. Never edit.
- Max 2 review subagents by default; max 3 total if `browser-qa` is needed.
- No nested subagents.
- Do not run browser checks inside this skill. Recommend `browser-qa` for runtime UI/data evidence.
- Do not turn this into a full architecture audit. Recommend `/improve-codebase-architecture` for broad structural friction.
- Verdict: `block` for behavior blockers, security/data-integrity risk, or serious Change Health regression; `warning` for non-blocking issues or missing verification; `approve` only when residual gaps are named.
