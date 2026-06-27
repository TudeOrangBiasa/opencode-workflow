import { describe, it, expect, beforeEach } from "bun:test"
import {
  extractPreferences,
  mergePreference,
  inferCategory,
  applyKLFilter,
  formatPreferences,
  parsePreferenceMemory,
  buildTasteQuery,
} from "./taste.ts"
import type { Preference } from "./taste.ts"

// ─── inferCategory ───────────────────────────────────────────────────

describe("inferCategory", () => {
  it("detects TypeScript", () => {
    expect(inferCategory("use strict TypeScript")).toBe("TypeScript")
  })
  it("detects Testing", () => {
    expect(inferCategory("prefer vitest for testing")).toBe("Testing")
  })
  it("detects Package Manager", () => {
    expect(inferCategory("we use pnpm")).toBe("Package Manager")
  })
  it("detects Exports", () => {
    expect(inferCategory("named exports only")).toBe("Exports")
  })
  it("falls back to General", () => {
    expect(inferCategory("something random")).toBe("General")
  })
})

// ─── extractPreferences ──────────────────────────────────────────────

describe("extractPreferences", () => {
  it("extracts 'use named exports'", () => {
    const result = extractPreferences("use named exports")
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].text.toLowerCase()).toContain("named exports")
    expect(result[0].confidence).toBeGreaterThan(0)
  })

  it("extracts 'prefer pnpm'", () => {
    const result = extractPreferences("prefer pnpm")
    expect(result.length).toBe(1)
    expect(result[0].text.toLowerCase()).toContain("pnpm")
    expect(result[0].category).toBe("Package Manager")
  })

  it("extracts 'we use strict mode'", () => {
    const result = extractPreferences("we use strict mode")
    expect(result.length).toBeGreaterThanOrEqual(1)
    const strict = result.find((p) => p.text.toLowerCase().includes("strict mode"))
    expect(strict).toBeDefined()
  })

  it("extracts negative preference 'avoid default exports'", () => {
    const result = extractPreferences("avoid default exports")
    expect(result.length).toBe(1)
    expect(result[0].text.toLowerCase()).toContain("default exports")
    expect(result[0].confidence).toBe(0.6) // negative patterns have lower base
  })

  it("handles 'always use async/await'", () => {
    const result = extractPreferences("always use async/await")
    expect(result.length).toBeGreaterThanOrEqual(1)
    const pref = result.find((p) => p.text.toLowerCase().includes("async"))
    expect(pref).toBeDefined()
    expect(pref!.confidence).toBe(0.85) // "always" is high confidence
  })

  it("handles 'convention is named exports'", () => {
    const result = extractPreferences("convention is named exports")
    expect(result.length).toBe(1)
    expect(result[0].confidence).toBe(0.9)
  })

  it("extracts 'don't use any'", () => {
    const result = extractPreferences("don't use any")
    expect(result.length).toBe(1)
    expect(result[0].text.toLowerCase()).toContain("any")
  })

  it("deduplicates same preference from different patterns", () => {
    const result = extractPreferences("use named exports. we prefer named exports")
    expect(result.length).toBe(1) // deduped
  })

  it("returns empty for message without preferences", () => {
    const result = extractPreferences("how do I create a component?")
    expect(result.length).toBe(0)
  })

  it("returns empty for very short text", () => {
    const result = extractPreferences("ok")
    expect(result.length).toBe(0)
  })

  it("strips trailing clause: 'use X in Y' keeps 'X'", () => {
    const result = extractPreferences("use pnpm in this project")
    expect(result.length).toBe(1)
    expect(result[0].text.toLowerCase()).not.toContain("in this project")
    expect(result[0].text.toLowerCase()).toContain("pnpm")
  })
})

// ─── mergePreference ─────────────────────────────────────────────────

describe("mergePreference", () => {
  it("adds new preference to empty store", () => {
    const store = new Map<string, Preference>()
    mergePreference(store, { text: "named exports", category: "Exports", confidence: 0.8, lastObserved: Date.now(), observationCount: 1 })
    expect(store.size).toBe(1)
    expect(store.get("named exports")!.confidence).toBe(0.8)
  })

  it("boosts confidence on repeat observation", () => {
    const store = new Map<string, Preference>()
    const pref: Preference = { text: "pnpm", category: "Package Manager", confidence: 0.7, lastObserved: Date.now(), observationCount: 1 }
    mergePreference(store, pref)
    const initial = store.get("pnpm")!.confidence
    mergePreference(store, { ...pref, confidence: 0.9 })
    expect(store.get("pnpm")!.confidence).toBeGreaterThan(initial)
    expect(store.get("pnpm")!.observationCount).toBe(2)
  })

  it("merges case-insensitively", () => {
    const store = new Map<string, Preference>()
    mergePreference(store, { text: "NAMED EXPORTS", category: "Exports", confidence: 0.7, lastObserved: Date.now(), observationCount: 1 })
    mergePreference(store, { text: "named Exports", category: "Exports", confidence: 0.7, lastObserved: Date.now(), observationCount: 1 })
    expect(store.size).toBe(1)
    expect(store.get("named exports")!.observationCount).toBe(2)
  })

  it("decays confidence with age", () => {
    const store = new Map<string, Preference>()
    const oldTime = Date.now() - 20 * 24 * 60 * 60 * 1000 // 20 days ago (decayMs = 7 days)
    mergePreference(store, { text: "strict mode", category: "TypeScript", confidence: 0.8, lastObserved: oldTime, observationCount: 1 })
    const stale = store.get("strict mode")!
    // Re-observe with higher confidence
    mergePreference(store, { text: "strict mode", category: "TypeScript", confidence: 0.9, lastObserved: Date.now(), observationCount: 1 })
    // Should be higher than old but not max confidence
    expect(store.get("strict mode")!.confidence).toBeGreaterThan(0.3)
    expect(store.get("strict mode")!.observationCount).toBe(2)
  })
})

// ─── applyKLFilter ───────────────────────────────────────────────────

describe("applyKLFilter", () => {
  it("filters common convention at low confidence", () => {
    const prefs = [{
      text: "strict mode", category: "TypeScript", confidence: 0.5, lastObserved: Date.now(), observationCount: 1,
    }]
    expect(applyKLFilter(prefs).length).toBe(0)
  })

  it("keeps common convention at high confidence", () => {
    const prefs = [{
      text: "strict mode", category: "TypeScript", confidence: 0.9, lastObserved: Date.now(), observationCount: 1,
    }]
    expect(applyKLFilter(prefs).length).toBe(1)
  })

  it("keeps uncommon preference regardless of confidence", () => {
    const prefs = [{
      text: "vercel postgres", category: "Architecture", confidence: 0.5, lastObserved: Date.now(), observationCount: 1,
    }]
    expect(applyKLFilter(prefs).length).toBe(1)
  })

  it("handles 'use X' normalized form", () => {
    const prefs = [{
      text: "use strict mode", category: "TypeScript", confidence: 0.5, lastObserved: Date.now(), observationCount: 1,
    }]
    // "use strict mode" → normalized to "strict mode" → common convention
    expect(applyKLFilter(prefs).length).toBe(0)
  })
})

// ─── formatPreferences ───────────────────────────────────────────────

describe("formatPreferences", () => {
  it("returns empty string for empty input", () => {
    expect(formatPreferences([])).toBe("")
  })

  it("formats one preference", () => {
    const result = formatPreferences([{
      text: "pnpm", category: "Package Manager", confidence: 0.85, lastObserved: Date.now(), observationCount: 2,
    }])
    expect(result).toContain("## Learned Preferences")
    expect(result).toContain("pnpm")
    expect(result).toContain("Package Manager")
    expect(result).toContain("85%")
  })

  it("sorts by confidence descending", () => {
    const result = formatPreferences([
      { text: "low", category: "General", confidence: 0.4, lastObserved: Date.now(), observationCount: 1 },
      { text: "high", category: "General", confidence: 0.9, lastObserved: Date.now(), observationCount: 1 },
    ])
    const highIdx = result.indexOf("high")
    const lowIdx = result.indexOf("low")
    expect(highIdx).toBeLessThan(lowIdx) // high appears first
  })

  it("limits to 8 preferences", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      text: `pref-${i}`, category: "General", confidence: 0.5 + (i * 0.02), lastObserved: Date.now(), observationCount: 1,
    }))
    const result = formatPreferences(many)
    const matches = result.match(/- /g)
    expect(matches?.length).toBeLessThanOrEqual(8)
  })

  it("filters common conventions below threshold", () => {
    const result = formatPreferences([{
      text: "strict mode", category: "TypeScript", confidence: 0.5, lastObserved: Date.now(), observationCount: 1,
    }])
    // "strict mode" is common convention, filtered by KL at 0.85 threshold
    expect(result).toBe("")
  })

  it("passes strict mode at high confidence", () => {
    const result = formatPreferences([{
      text: "strict mode", category: "TypeScript", confidence: 0.9, lastObserved: Date.now(), observationCount: 1,
    }])
    expect(result).toContain("strict mode")
  })
})

// ─── parsePreferenceMemory ───────────────────────────────────────────

describe("parsePreferenceMemory", () => {
  it("parses valid memory format", () => {
    const result = parsePreferenceMemory("[taste:my-app] TypeScript — strict mode (confidence: 0.85)")
    expect(result).not.toBeNull()
    expect(result!.text).toBe("strict mode")
    expect(result!.category).toBe("TypeScript")
    expect(result!.confidence).toBe(0.85)
  })

  it("parses with em dash", () => {
    const result = parsePreferenceMemory("[taste:x] Exports — named exports (confidence: 0.90)")
    expect(result).not.toBeNull()
    expect(result!.text).toBe("named exports")
    expect(result!.confidence).toBe(0.9)
  })

  it("returns null for malformed input", () => {
    expect(parsePreferenceMemory("random text")).toBeNull()
  })

  it("returns null for empty string", () => {
    expect(parsePreferenceMemory("")).toBeNull()
  })
})

// ─── buildTasteQuery ─────────────────────────────────────────────────

describe("buildTasteQuery", () => {
  it("builds query with project name", () => {
    expect(buildTasteQuery("my-app")).toBe("taste:my-app coding preference")
  })

  it("handles project with special chars", () => {
    expect(buildTasteQuery("my-app-2")).toBe("taste:my-app-2 coding preference")
  })
})
