import type { Plugin, PluginInput } from "@opencode-ai/plugin"

// ─── SessionCache — per-session with TTL ────────────────────────────

interface CacheEntry {
  lessons: string[]
  ts: number
}

const store = new Map<string, CacheEntry>()

export const SessionCache = {
  get(sessionID: string, ttlMs: number): string[] | undefined {
    const entry = store.get(sessionID)
    if (!entry) return undefined
    if (Date.now() - entry.ts >= ttlMs) {
      store.delete(sessionID)
      return undefined
    }
    return entry.lessons
  },

  set(sessionID: string, lessons: string[]): void {
    store.set(sessionID, { lessons, ts: Date.now() })
  },

  clear(): void {
    store.clear()
  },
}

// ─── Query building ─────────────────────────────────────────────────

export function buildQuery(project: string, agent?: string): string {
  const prefix = agent ? `${agent} lessons` : "lessons"
  return `${prefix} for ${project}`
}

// ─── Format lessons ─────────────────────────────────────────────────

const MAX_LESSONS = 5

export function formatLessons(lessons: string[]): string {
  if (lessons.length === 0) return ""
  const items = lessons.slice(0, MAX_LESSONS).map((l) => `- ${l}`).join("\n")
  return `## Past Lessons\n${items}`
}

// ─── Inject lessons into system prompt (single message) ────────────

export function injectLessons(system: string[], formatted: string): void {
  if (!formatted) return
  if (!system[0]) system[0] = ""
  system[0] += "\n\n" + formatted
}

// ─── fetchAndInject — full pipeline with cache + error handling ─────

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

export async function fetchAndInjectLessons(
  sessionID: string,
  project: string,
  cache: typeof SessionCache,
  system: string[],
  fetchLessons: (query: string) => Promise<string[]>,
): Promise<boolean> {
  // 1. Check cache
  const cached = cache.get(sessionID, CACHE_TTL_MS)
  if (cached) {
    const formatted = formatLessons(cached)
    injectLessons(system, formatted)
    return true
  }

  // 2. Fetch fresh
  const query = buildQuery(project)
  let lessons: string[]
  try {
    lessons = await fetchLessons(query)
  } catch {
    console.warn(`[lesson-injector] fetch failed for "${query}" — skipping`)
    return false
  }

  if (lessons.length === 0) return false

  // 3. Cache + inject
  cache.set(sessionID, lessons)
  const formatted = formatLessons(lessons)
  injectLessons(system, formatted)
  return true
}

// ─── Production lesson finder via OpenViking CLI ────────────────────

interface OvFindResult {
  ok: boolean
  result: {
    memories: { score: number; abstract: string }[]
    resources: { score: number; abstract: string }[]
  }
}

export async function findLessonsViaOpenViking(query: string): Promise<string[]> {
  const { stdout, exitCode } = Bun.spawnSync(["ov", "find", query, "-n", "5", "-o", "json"])
  if (exitCode !== 0) {
    console.warn(`[lesson-injector] ov find exited with code ${exitCode}`)
    return []
  }

  let parsed: OvFindResult
  try {
    parsed = JSON.parse(stdout.toString())
  } catch {
    console.warn("[lesson-injector] failed to parse ov find output")
    return []
  }

  if (!parsed.ok) return []

  const items = [...parsed.result.memories, ...parsed.result.resources]
  const lessons = items
    .filter((i) => i.score >= 0.5)
    .map((i) => i.abstract.trim())
    .filter(Boolean)
    .slice(0, 5)

  return lessons
}

// ─── Plugin hook ────────────────────────────────────────────────────

const plugin: Plugin = async (input: PluginInput) => {
  const project = input.directory.split("/").pop() || "unknown"

  return {
    "experimental.chat.system.transform": async (_input, output) => {
      await fetchAndInjectLessons(
        _input.sessionID || "global",
        project,
        SessionCache,
        output.system,
        findLessonsViaOpenViking,
      )
    },
  }
}

export default plugin
