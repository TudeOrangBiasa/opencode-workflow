// Helper functions for taste plugin — exported for testing
import { ovFindJson } from "./ov-helper"

// Types

export interface Preference {
  text: string
  category: string
  confidence: number
  lastObserved: number
  observationCount: number
}

// Category keywords

const CATEGORY_KEYWORDS: [string, string][] = [
  ["typescript", "TypeScript"],
  ["typescript strict", "TypeScript"],
  ["export", "Exports"],
  ["import", "Imports"],
  ["error handling", "Error Handling"],
  ["exception", "Error Handling"],
  ["testing", "Testing"],
  ["jest", "Testing"],
  ["pnpm", "Package Manager"],
  ["npm", "Package Manager"],
  ["yarn", "Package Manager"],
  ["folder", "File Structure"],
  ["directory", "File Structure"],
  ["architecture", "Architecture"],
  ["component", "Architecture"],
  ["pattern", "Architecture"],
]

// Extraction patterns

interface Pattern {
  regex: RegExp
  confidence: number
}

const PATTERNS: Pattern[] = [
  { regex: /(?:^|\s)always\s+(?:use\s+)?(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.85 },
  { regex: /convention\s+(?:is|here)\s+(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$)/im, confidence: 0.90 },
  { regex: /(?:^|\s)we\s+(?:use|prefer|do|like)\s+(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.75 },
  { regex: /(?:^|\s)prefer(?:s|red)?\s+(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.80 },
  { regex: /(?:^|\s)(?:don'?t|do not|avoid|never)\s+(?:use\s+)?(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.60 },
  { regex: /(?:^|\s)(?:use|using)\s+(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.70 },
]

const GENERIC_PREFIXES = new Set([
  "the", "a", "an", "this", "that", "these", "those", "it", "its", "my", "your", "our",
  "some", "each", "every", "all", "both", "few", "many", "much", "several",
])

function isFalsePositive(text: string): boolean {
  const firstWord = text.toLowerCase().split(/\s+/)[0]
  return GENERIC_PREFIXES.has(firstWord)
}

// KL divergence filter

const COMMON_CONVENTIONS = new Set([
  "strict mode", "type imports", "named exports",
  "async/await", "arrow functions", "const over let",
  "template literals", "destructuring", "optional chaining",
  "nullish coalescing", "functional components", "explicit return types",
  "immutable state", "early return", "guard clause", "error boundaries",
])

/** Infer a category from preference text. */
export function inferCategory(text: string): string {
  const lower = text.toLowerCase()
  for (const [kw, cat] of CATEGORY_KEYWORDS) {
    if (lower.includes(kw)) return cat
  }
  return "General"
}

/** Extract preferences from a user message. */
export function extractPreferences(text: string): Preference[] {
  const seen = new Set<string>()
  const results: Preference[] = []

  for (const { regex, confidence } of PATTERNS) {
    const match = text.match(regex)
    if (!match?.groups?.pref) continue

    let raw = match.groups.pref.trim()
    raw = raw.replace(/\s+(and|or|in|for|with|by|at|on|to)\s+.*$/i, "").trim()
    if (raw.length < 3 || raw.length > 60) continue
    if (isFalsePositive(raw)) continue

    const key = raw.toLowerCase().replace(/\s+/g, " ")
    if (seen.has(key)) continue
    seen.add(key)

    results.push({
      text: raw,
      category: inferCategory(raw),
      confidence,
      lastObserved: Date.now(),
      observationCount: 1,
    })
  }

  return results
}

/** Merge a new observation into the store. */
const DECAY_MS = 7 * 24 * 60 * 60 * 1000

export function mergePreference(
  store: Map<string, Preference>,
  pref: Preference,
): void {
  const key = pref.text.toLowerCase().replace(/\s+/g, " ")
  const existing = store.get(key)

  if (existing) {
    const age = Date.now() - existing.lastObserved
    const recencyBoost = Math.max(0, 1 - age / DECAY_MS)
    existing.confidence = Math.min(1, existing.confidence * 0.6 + pref.confidence * 0.3 + recencyBoost * 0.1)
    existing.lastObserved = Date.now()
    existing.observationCount++
  } else {
    store.set(key, { ...pref, text: pref.text.trim() })
  }
}

/** KL divergence filter: skip common conventions unless high confidence. */
export function applyKLFilter(prefs: Preference[], threshold = 0.85): Preference[] {
  return prefs.filter((p) => {
    const normalized = p.text.toLowerCase().replace(/\s+/g, " ").replace(/^use\s+/, "").trim()
    if (COMMON_CONVENTIONS.has(normalized) || COMMON_CONVENTIONS.has(p.text.toLowerCase())) {
      return p.confidence >= threshold
    }
    return true
  })
}

/** Format preferences for system prompt injection. */
export function formatPreferences(prefs: Preference[]): string {
  const filtered = applyKLFilter(prefs)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8)

  if (filtered.length === 0) return ""

  const items = filtered
    .map((p) => `- ${p.text} (${p.category}, confidence: ${(p.confidence * 100).toFixed(0)}%)`)
    .join("\n")

  return `## Learned Preferences\n${items}\n\n*Preferences auto-learned from your instructions.*`
}

// OpenViking persistence

interface OvFindResult {
  ok: boolean
  result: {
    memories: { score: number; abstract: string }[]
    resources: { score: number; abstract: string }[]
  }
}

/** Parse stored memory back into Preference. */
export function parsePreferenceMemory(abstract: string): Preference | null {
  const m = abstract.match(
    /\[taste:[^\]]+\]\s+(\w[\w\s]+?)\s*[—–-]\s*(.+?)\s*\(confidence:\s*([\d.]+)\)/,
  )
  if (!m) return null
  return {
    category: m[1].trim(),
    text: m[2].trim(),
    confidence: parseFloat(m[3]),
    lastObserved: Date.now(),
    observationCount: 1,
  }
}

/** Fetch stored preferences from OpenViking. */
export async function fetchTastesViaOpenViking(project: string): Promise<Preference[]> {
  const query = String.fromCharCode(96) + "taste:" + project + " coding preference" + String.fromCharCode(96)
  const parsed = await ovFindJson(["ov", "find", query, "-n", "10", "-o", "json"])
  if (!parsed || !parsed.ok) return []

  return parsed.result.memories
    .filter((m) => m.score >= 0.45)
    .map((m) => parsePreferenceMemory(m.abstract))
    .filter((p): p is Preference => p !== null)
}

/** Persist single preference to OpenViking. */
export async function persistPreference(project: string, pref: Preference): Promise<boolean> {
  const tag = "[taste:" + project + "]"
  const content = tag + " " + pref.category + " — " + pref.text + " (confidence: " + pref.confidence.toFixed(2) + ")"
  const proc = Bun.spawn(["ov", "add-memory", content])
  const exitCode = await proc.exited
  return exitCode === 0
}
