# Triage — Reference

> Full workflow details. See SKILL.md for quick start.

## Roles

Two category roles: `bug`, `enhancement`.
Five state roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.

Every triaged issue carries exactly one category + one state role.

## State Transitions

Unlabeled → needs-triage → needs-info / ready-for-agent / ready-for-human / wontfix.
needs-info returns to needs-triage when reporter replies.

## Invocation

Maintainer invokes `/triage` with natural language. Examples:
- "Show me anything that needs my attention"
- "Let's look at #42"
- "Move #42 to ready-for-agent"

## Show what needs attention

Query tracker and present three buckets (oldest first): Unlabeled, needs-triage, needs-info with recent activity.

## Triage a specific issue

1. Gather context (full issue, codebase, out-of-scope knowledge base)
2. Recommend category + state
3. Reproduce (bugs only)
4. Grill (if needed)
5. Apply outcome (ready-for-agent → agent brief, needs-info → triage notes, wontfix → close)

## Needs-info Template

```markdown
## Triage Notes

**What we've established so far:**

- point 1
- point 2

**What we still need from you (@reporter):**

- question 1
- question 2
```

Capture everything resolved during grilling under "established so far" so the work isn't lost. Questions must be specific and actionable, not "please provide more info".

## Resuming previous session

Read prior triage notes (if they exist), check whether the reporter has answered any outstanding questions, and present an updated picture before continuing. Don't re-ask resolved questions.
