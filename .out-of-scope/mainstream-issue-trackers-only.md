# Issue Tracker Integration Boundaries

## Boundary

Do not add first-class issue-tracker integrations for niche, experimental, or single-vendor tools unless they are clearly worth the long-term maintenance cost.

Default path stays:

- local markdown issues for this repo
- mainstream trackers when a target project already uses one
- custom/other instructions for teams that want to wire their own tracker

## Why

Every issue-tracker backend hard-codes a CLI shape into the skills (commands, flags, output parsing). Each new backend is permanent maintenance surface — it has to keep working as the tool's CLI evolves, and it has to keep being tested against `/to-prd`, `/to-issues`, `/triage`, and friends. That cost is only worth paying for trackers a meaningful fraction of users actually have.

"Mainstream" is a judgment call, not a numeric bar:

- GitHub/GitLab-style hosted trackers and local markdown are acceptable patterns.
- A brand-new agent-focused tool with a few hundred GitHub stars is not, no matter how interesting the design.

Stars, age, and download counts are useful signals when making the call but none of them is the rule. The rule is: would a typical engineer recognise this tool and have plausibly chosen it for their team?

The escape hatches for non-mainstream trackers already exist:

- `local markdown` for lightweight in-repo tracking.
- `other/custom` for users who want to wire something up themselves.

Neither requires the core skills to know about the specific tool.

## Prior requests

- #99 — "Add dex as an issue tracker backend" (dex was ~3 months old and ~300 stars at the time of the request)
