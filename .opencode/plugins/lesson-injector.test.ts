import { describe, it, expect, beforeEach } from "bun:test"
import { SessionCache, buildQuery, formatLessons, injectLessons, fetchAndInjectLessons } from "./lesson-injector.ts"

// ─── SessionCache ────────────────────────────────────────────────────

describe("SessionCache", () => {
  const TTL = 60_000 // 1min for testing

  beforeEach(() => {
    SessionCache.clear()
  })

  it("miss on unknown session", () => {
    expect(SessionCache.get("sess-1", TTL)).toBeUndefined()
  })

  it("hit after set", () => {
    SessionCache.set("sess-1", ["lesson a", "lesson b"])
    const got = SessionCache.get("sess-1", TTL)
    expect(got).toEqual(["lesson a", "lesson b"])
  })

  it("miss on stale entry", () => {
    SessionCache.set("sess-1", ["old lesson"])
    // TTL = 0 → any entry is stale
    expect(SessionCache.get("sess-1", 0)).toBeUndefined()
  })

  it("hit on fresh entry within TTL", () => {
    SessionCache.set("sess-1", ["fresh lesson"])
    // TTL very large → entry is still fresh
    expect(SessionCache.get("sess-1", 999_999_999)).toEqual(["fresh lesson"])
  })

  it("multiple sessions isolated", () => {
    SessionCache.set("sess-1", ["a"])
    SessionCache.set("sess-2", ["b"])
    expect(SessionCache.get("sess-1", 999_999_999)).toEqual(["a"])
    expect(SessionCache.get("sess-2", 999_999_999)).toEqual(["b"])
  })

  it("overwrite existing session", () => {
    SessionCache.set("sess-1", ["old"])
    SessionCache.set("sess-1", ["new"])
    expect(SessionCache.get("sess-1", 999_999_999)).toEqual(["new"])
  })
})

// ─── Query building ─────────────────────────────────────────────────

describe("buildQuery", () => {
  it("builds generic project query", () => {
    expect(buildQuery("my-project")).toBe("lessons for my-project")
  })

  it("builds agent-specific query", () => {
    expect(buildQuery("my-project", "builder")).toBe("builder lessons for my-project")
  })
})

// ─── Format lessons ─────────────────────────────────────────────────

describe("formatLessons", () => {
  it("formats multiple lessons as markdown list", () => {
    const result = formatLessons(["use pnpm", "prefer vitest", "named exports"])
    expect(result).toContain("## Past Lessons")
    expect(result).toContain("- use pnpm")
    expect(result).toContain("- prefer vitest")
    expect(result).toContain("- named exports")
  })

  it("returns empty string for empty array", () => {
    expect(formatLessons([])).toBe("")
  })

  it("handles single lesson", () => {
    const result = formatLessons(["use strict mode"])
    expect(result).toContain("## Past Lessons")
    expect(result).toContain("- use strict mode")
  })
})

// ─── Inject lessons ─────────────────────────────────────────────────

describe("injectLessons", () => {
  it("appends formatted lessons to system[0]", () => {
    const system = ["You are a helpful assistant."]
    const expected = system[0] + "\n\n## Past Lessons\n- test lesson"
    injectLessons(system, "## Past Lessons\n- test lesson")
    expect(system).toEqual([expected])
  })

  it("does NOT increase array length", () => {
    const system = ["You are a helpful assistant."]
    injectLessons(system, "## Past Lessons\n- x")
    expect(system.length).toBe(1)
  })

  it("handles empty formatted string (no-op)", () => {
    const system = ["original"]
    injectLessons(system, "")
    expect(system).toEqual(["original"])
  })
})

// ─── fetchAndInjectLessons (full pipeline) ──────────────────────────

describe("fetchAndInjectLessons", () => {
  beforeEach(() => {
    SessionCache.clear()
  })

  it("fetches on cache miss and injects into system", async () => {
    const system = ["base prompt"]
    const mockFetch = async (_q: string) => ["use pnpm", "prefer vitest"]

    const injected = await fetchAndInjectLessons("sess-1", "my-app", SessionCache, system, mockFetch)

    expect(injected).toBe(true)
    expect(system[0]).toContain("use pnpm")
    expect(system[0]).toContain("## Past Lessons")
  })

  it("uses cache on second call (no fetch)", async () => {
    const system = ["base"]
    const mockFetch = async (_q: string) => ["real lesson"]

    await fetchAndInjectLessons("sess-cache", "my-app", SessionCache, system, mockFetch)

    // Track calls
    let callCount = 0
    const trackingFetch = async (_q: string) => { callCount++; return ["should not be called"] }
    system[0] = "base prompt"

    await fetchAndInjectLessons("sess-cache", "my-app", SessionCache, system, trackingFetch)

    expect(system[0]).toContain("real lesson")
    expect(system[0]).not.toContain("should not be called")
    expect(callCount).toBe(0)
  })

  it("returns false on fetch error, system unchanged", async () => {
    const system = ["base prompt"]
    const failFetch = async (_q: string) => { throw new Error("ov find timeout") }

    const injected = await fetchAndInjectLessons("sess-err", "my-app", SessionCache, system, failFetch)

    expect(injected).toBe(false)
    expect(system[0]).toBe("base prompt")
  })

  it("returns false when fetch returns empty array", async () => {
    const system = ["base"]
    const emptyFetch = async (_q: string) => []

    const injected = await fetchAndInjectLessons("sess-empty", "my-app", SessionCache, system, emptyFetch)

    expect(injected).toBe(false)
    expect(system).toEqual(["base"])
  })

  it("builds correct query with project name", async () => {
    const system = ["base"]
    let capturedQuery = ""
    const captureFetch = async (q: string) => { capturedQuery = q; return ["lesson"] }

    await fetchAndInjectLessons("sess-q", "my-project", SessionCache, system, captureFetch)

    expect(capturedQuery).toBe("lessons for my-project")
  })
})
