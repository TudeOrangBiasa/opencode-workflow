# Click-Path Audit — Reference

## The Problem This Solves

Traditional debugging checks: function exists? does it crash? right return type?

But does NOT check:
- Does the final UI state match what the button label promises?
- Does function B silently undo function A?
- Does shared state have side effects that cancel the intended action?

Real example: "New Email" → `setComposeMode(true)` then `selectThread(null)`. Both worked. But `selectThread` resets `composeMode: false`. Button did nothing.

## How It Works

For EVERY interactive touchpoint:
1. **Identify** handler (onClick, onSubmit, etc.)
2. **Trace** every function call in order
3. For each call: what state does it READ? WRITE? Any SIDE EFFECTS?
4. Check: any later call UNDO an earlier call?
5. Check: is FINAL state what user expects?
6. Check: race conditions?

## Execution Steps

### Step 1: Map State Stores

Build side-effect map of every store action:

```
For each Zustand store / React context in scope:
  For each action:
    - What fields does it set?
    - Does it RESET other fields as side effect?
    - Document: actionName → {sets: [...], resets: [...]}
```

### Step 2: Audit Each Touchpoint

```
TOUCHPOINT: [Label] in [file:line]
  HANDLER: onClick → { call1: functionA() → sets {X: true}, call2: functionB() → RESETS {X: false} }
  EXPECTED: What user expects
  ACTUAL: X is false because functionB reset it
  VERDICT: BUG
```

### Bug Patterns

**Pattern 1 — Sequential Undo**: call 1 sets X=true, call 2 resets X=false
**Pattern 2 — Async Race**: `fetchA().then(setLoading(false)); fetchB().then(setLoading(true))`
**Pattern 3 — Stale Closure**: `setCount(count + 1); setCount(count + 1)` with stale count
**Pattern 4 — Missing Transition**: button says "Save" but handler only validates
**Pattern 5 — Conditional Dead Path**: guard condition always false, actual code never reached
**Pattern 6 — useEffect Interference**: button sets state, useEffect watches it and resets it

### Step 3: Report

```
CLICK-PATH-NNN: [severity]
  Touchpoint: [file:line]
  Pattern: [type]
  Trace: 1. [call] → sets {field} 2. [call] → RESETS {field}
  Expected: ... Actual: ... Fix: ...
```

## Scope Control

- **Full app audit**: after major refactor, launch parallel agents per page
- **Single page**: after building new page or user reports broken button
- **Store-focused**: after modifying Zustand store actions

### Agent split for full app
1. Map ALL state stores (shared context)
2-8. Per-page audit agents

## When to Use / Not Use

**Use**: after "no bugs" found but UI broken; after Zustand store changes; before release on critical flows; when button "does nothing"

**Not for**: API-level bugs, styling issues, performance profiling

## The Example That Inspired This

```
onClick={() => {
  useEmailStore.getState().setComposeMode(true)   // sets composeMode = true
  useEmailStore.getState().selectThread(null)      // RESETS composeMode = false
}}
```

Store: `selectThread` sets composeMode: false as a side effect. Button did nothing.
