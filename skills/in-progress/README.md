# In Progress

Drafts not yet ready to ship. Promote to a stable bucket when reviewed and reliable.

## When to use

You are reviewing, testing, or iterating on a draft skill before it reaches production quality. Do not rely on in-progress skills for production work.

## Boundary with sibling buckets

**In Progress** holds skill drafts that are unstable, incomplete, or unreviewed. Once a draft passes review and has been used in a real session, promote it to **Productivity** (non-code tools), **Engineering** (code pipeline), or **Misc** (specialist domain). Skills here are not covered by the `check-skill-structure.sh` compliance audit.

## Structure

Standalone skill drafts, organized by readiness. No sub-directories.

### Active drafts

- **claude-handoff** — Skill for handoff between Claude Code sessions (upstream in-progress).
- **youtube-transcript** — YouTube transcript extraction (yt-dlp wrapper + skill). Promote to productivity/ when reviewed.
