// Helper functions for lesson-injector plugin — exported for testing
import { ovFindJson } from "./ov-helper"

// SessionCache with TTL

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

// Query building

export function buildQuery(project: string): string {
  return "lessons for " + project
}

// Format lessons

const MAX_LESSONS = 5

export function formatLessons(lessons: string[]): string {
  if (lessons.length === 0) return ""
  const items = lessons.slice(0, MAX_LESSONS).map((l) => `- ${l}`).join("\n")
  return `## Past Lessons\n${items}`
}

// Inject into system prompt

export function injectLessons(system: string[], formatted: string): void {
  if (!formatted) return
  if (!system[0]) system[0] = ""
  system[0] += "\n\n" + formatted
}

// fetchAndInject

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

// Lesson finder via OpenViking

export async function findLessonsViaOpenViking(query: string): Promise<string[]> {
  const parsed = await ovFindJson(["ov", "find", query, "-n", "5", "-o", "json"])
  if (!parsed || !parsed.ok) return []

  const items = [...parsed.result.memories, ...parsed.result.resources]
  const lessons = items
    .filter((i) => i.score >= 0.5)
    .map((i) => i.abstract.trim())
    .filter(Boolean)
    .slice(0, 5)

  return lessons
}
