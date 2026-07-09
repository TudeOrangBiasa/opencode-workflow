---
name: ponytail-gain
description: >
  Show ponytail's measured impact as a compact scoreboard: less code,
  less cost, more speed, from benchmark medians. Use when user says
  /ponytail-gain, "ponytail gain", "what does ponytail save", "show
  ponytail impact", "ponytail scoreboard". One-shot display, not a
  persistent mode.
---

# Ponytail Gain

One-shot scoreboard. Edits nothing, changes no mode.

Figures: published benchmark medians (5 everyday tasks × 3 models). Not per-repo.

```
  ponytail gain                     benchmark median · 5 tasks · 3 models

  Lines of code   no-skill  ████████████████████  100%
                  ponytail  ██▌·················    6–20%   ▼ 80–94%
  Cost            no-skill  ████████████████████  100%
                  ponytail  █████▌··············   23–53%  ▼ 47–77%
  Speed           ponytail  ▸ 3–6× faster

  Companion:  ponytail-review  (over-engineering review)
              ponytail-audit   (what's still cuttable)
              ponytail-debt    (shortcuts you deferred)
```

## Honesty boundary

Benchmark medians, not this repo. Never print per-repo savings: the
unbuilt version was never written, so no real baseline to subtract from.
Per-repo figures come from ponytail-debt only.

## Boundaries

One-shot display. Edits nothing, changes no mode.
`stop ponytail` / `normal mode`: revert.
