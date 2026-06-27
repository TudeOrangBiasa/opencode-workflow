import type { Plugin, PluginInput } from "@opencode-ai/plugin"

// ─── Types ───────────────────────────────────────────────────────────

export interface Preference {
  text: string
  category: string
  confidence: number
  lastObserved: number
  observationCount: number
}

// ─── Category keywords ───────────────────────────────────────────────

const CATEGORY_KEYWORDS: [string, string][] = [
  ["typescript", "TypeScript"],
  ["type", "TypeScript"],
  ["export", "Exports"],
  ["import", "Imports"],
  ["error", "Error Handling"],
  ["exception", "Error Handling"],
  ["test", "Testing"],
  ["jest", "Testing"],
  ["vitest", "Testing"],
  ["pnpm", "Package Manager"],
  ["npm", "Package Manager"],
  ["yarn", "Package Manager"],
  ["folder", "File Structure"],
  ["directory", "File Structure"],
  ["architect", "Architecture"],
  ["component", "Architecture"],
  ["pattern", "Architecture"],
]

// ─── Preference extraction patterns ──────────────────────────────────

interface PatternDef {
  regex: RegExp
  confidence: number
}

const PATTERNS: PatternDef[] = [
  // More specific patterns first (checked before generic "use")
  { regex: /(?:^|\s)always\s+(?:use\s+)?(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.85 },
  { regex: /convention\s+(?:is|here)\s+(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$)/im, confidence: 0.90 },
  { regex: /(?:^|\s)we\s+(?:use|prefer|do|like)\s+(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.75 },
  { regex: /(?:^|\s)prefer(?:s|red)?\s+(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.80 },
  { regex: /(?:^|\s)(?:don'?t|do not|avoid|never)\s+(?:use\s+)?(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.60 },
  { regex: /(?:^|\s)(?:use|using)\s+(?<pref>[a-zA-Z][\w\s/-]{2,60}?)(?:\.|,|$| and | or )/im, confidence: 0.70 },
]

// ─── Common conventions (KL divergence filter) ───────────────────────

const COMMON_CONVENTIONS = new Set([
  "strict mode", "type imports", "named exports",
  "async/await", "arrow functions", "const over let",
  "template literals", "destructuring", "optional chaining",
  "nullish coalescing", "functional components", "explicit return types",
  "immutable state", "early return", "guard clause", "error boundaries",
])

// ─── Pure functions (testable) ───────────────────────────────────────

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
    // Strip trailing clauses: "use X in Y" → "use X"
    raw = raw.replace(/\s+(and|or|in|for|with|by|at|on|to)\s+.*$/i, "").trim()
    if (raw.length < 3 || raw.length > 60) continue

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
export function mergePreference(
  store: Map<string, Preference>,
  pref: Preference,
  decayMs = 7 * 24 * 60 * 60 * 1000,
): void {
  const key = pref.text.toLowerCase().replace(/\s+/g, " ")
  const existing = store.get(key)

  if (existing) {
    const age = Date.now() - existing.lastObserved
    const recencyBoost = Math.max(0, 1 - age / decayMs)
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

// ─── OpenViking persistence ──────────────────────────────────────────

interface OvFindResult {
  ok: boolean
  result: {
    memories: { score: number; abstract: string }[]
    resources: { score: number; abstract: string }[]
  }
}

export function buildTasteQuery(project: string): string {
  return `taste:${project} coding preference`
}

/** Parse stored memory back into Preference. */
export function parsePreferenceMemory(abstract: string): Preference | null {
  // Format: "[taste:project] Category — text (confidence: 0.85)"
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
  const { stdout, exitCode } = Bun.spawnSync([
    "ov", "find", buildTasteQuery(project), "-n", "10", "-o", "json",
  ])
  if (exitCode !== 0) return []

  let parsed: OvFindResult
  try {
    parsed = JSON.parse(stdout.toString())
  } catch {
    return []
  }
  if (!parsed.ok) return []

  return parsed.result.memories
    .filter((m) => m.score >= 0.45)
    .map((m) => parsePreferenceMemory(m.abstract))
    .filter((p): p is Preference => p !== null)
}

/** Persist a single preference to OpenViking. */
export function persistPreference(project: string, pref: Preference): void {
  const tag = `[taste:${project}]`
  const content = `${tag} ${pref.category} — ${pref.text} (confidence: ${pref.confidence.toFixed(2)})`
  Bun.spawnSync(["ov", "add-memory", content])
}

// ─── Per-session store ───────────────────────────────────────────────

const sessionStore = new Map<string, Map<string, Preference>>()
const PERSIST_INTERVAL_MS = 60_000

function getSessionPrefs(sessionID: string): Map<string, Preference> {
  let s = sessionStore.get(sessionID)
  if (!s) {
    s = new Map()
    sessionStore.set(sessionID, s)
  }
  return s
}

function flushPending(project: string, sessionID: string): void {
  const prefs = sessionStore.get(sessionID)
  if (!prefs || prefs.size === 0) return

  const sorted = [...prefs.values()].sort((a, b) => b.confidence - a.confidence)
  const filtered = applyKLFilter(sorted)
  for (const pref of filtered) {
    persistPreference(project, pref)
  }
}

// ─── Module-level flush timer ────────────────────────────────────────

let flushTimer: ReturnType<typeof setInterval> | null = null

// ─── Plugin ──────────────────────────────────────────────────────────

const plugin: Plugin = async (input: PluginInput) => {
  const project = input.directory.split("/").pop() || "unknown"

  // Start periodic flush to OpenViking
  if (!flushTimer) {
    flushTimer = setInterval(() => {
      for (const [sid, _prefs] of sessionStore.entries()) {
        if (_prefs.size === 0) continue
        flushPending(project, sid)
        console.log(`[taste] flushed ${_prefs.size} preferences for ${sid}`)
      }
    }, PERSIST_INTERVAL_MS)
  }

  return {
    /**
     * Extract explicit preferences from user messages.
     * "use named exports", "prefer pnpm", "we use strict mode", etc.
     */
    "chat.message": async (
      msgInput: Record<string, unknown>,
      _output: Record<string, unknown>,
    ) => {
      const message = msgInput.message as { role?: string; content?: string } | undefined
      if (!message || message.role !== "user") return
      const text = message.content || ""
      if (text.length < 10) return

      const sessionID = (msgInput.sessionID as string) || "default"
      const prefs = getSessionPrefs(sessionID)

      const extracted = extractPreferences(text)
      for (const pref of extracted) {
        mergePreference(prefs, pref)
      }
    },

    /**
     * Inject learned preferences into system prompt before LLM calls.
     */
    "experimental.chat.system.transform": async (
      _input: Record<string, unknown>,
      output: { system: string[] },
    ) => {
      const sessionID = (_input.sessionID as string) || "default"
      const prefs = getSessionPrefs(sessionID)
      if (prefs.size === 0) return

      const formatted = formatPreferences([...prefs.values()])
      if (!formatted) return

      // Inject into system[0] (same pattern as lesson-injector)
      output.system[0] += "\n\n" + formatted
    },
  }
}

export default plugin
