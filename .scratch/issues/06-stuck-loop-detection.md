# Issue 6: Stuck-loop detection mechanism — HITL

## What to build

Build a real mechanism (not just a prompt rule) to detect when the agent is stuck in a loop:
- Same tool called 8+ times consecutively with same arguments
- Bash returning same output 3+ times
- Agent repeating same reasoning pattern

This addresses the 271-repeat grep loop in the linkbook UI/UX session ($19.21 cost).

Current state: prompt rule "stop after 5x" — but models don't reliably follow this. Need a mechanism OUTSIDE the model.

**HITL** because: needs architectural decision on where to add this — OpenCode extension? Wrapper? External tool?

## Acceptance criteria

- [ ] Mechanism detects 8+ consecutive same-tool calls
- [ ] Mechanism detects bash returning same output 3+ times
- [ ] On detection: pause agent, force check-in (not just a prompt)
- [ ] Mechanism can be configured (threshold, on/off)
- [ ] Document where the mechanism lives (config option, plugin, etc.)

## Blocked by

None — can start immediately (this is a design discussion first).

## Notes

The linkbook $19.21 session had 271 identical bash calls = ~$1.86 in pure waste. Even a 50% reduction in loop waste would save the user $1 per loop-prone session. Hard mechanism required, not prompt rule.
