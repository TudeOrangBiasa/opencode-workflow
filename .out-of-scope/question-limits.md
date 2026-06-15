# Grilling Question Limits

## Boundary

Do not add hard numeric question limits to `/grill-me`, `/grill-with-docs`, or grilling behavior inside other skills.

## Why

Grilling is intentionally open-ended. The point is to keep digging until each branch of the decision tree is resolved — some plans need three questions, some need fifty. A fixed cap would either cut off useful exploration on hard problems or feel arbitrary on easy ones.

If a session feels too long, the right escape hatches already exist:

- The user can stop the session at any time and accept the current state of the plan.
- The user can tell the model to wrap up, summarise, and move on — natural-language steering is the intended control surface, not a numeric limit.

Adding a hard cap would also conflate two different failure modes: a model that asks too many questions because the plan is genuinely under-specified (working as intended) vs. a model that asks redundant or low-value questions (a prompt-quality issue, not a quantity issue). The fix for the latter belongs in the skill prompt, not in a counter.

## Allowed Instead

- User can say “wrap up”, “summarize”, “stop grilling”, or set a natural-language constraint.
- Skill prompts can be tightened if questions become repetitive or low-value.
- Handoff summaries can capture unresolved questions without forcing a numeric cap.

## Prior requests

- #44 — "Codex just asked me 200 questions"
