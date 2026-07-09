import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test"
import plugin from "../lesson-injector.ts"
import { SessionCache, buildQuery, formatLessons, injectLessons, fetchAndInjectLessons } from "../internal/lesson-injector-helpers.ts"
import * as ovHelper from "./ov-helper.ts"

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
    expect(SessionCache.get("sess-1", 0)).toBeUndefined()
  })

  it("hit on fresh entry within TTL", () => {
    SessionCache.set("sess-1", ["fresh lesson"])
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

  it("empty system array does not produce 'undefined' string", () => {
    const system: string[] = []
    injectLessons(system, "## Past Lessons\n- test")
    expect(system[0]).not.toContain("undefined")
    expect(system[0]).toBeDefined()
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

// ─── Plugin factory ──────────────────────────────────────────────────

describe("plugin factory", () => {
  let execSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    execSpy = spyOn(ovHelper, "execOv").mockImplementation(async () => ({
      stdout: JSON.stringify({ ok: true, result: { memories: [], resources: [] } }),
      stderr: "",
    }))
  })

  afterEach(() => {
    execSpy.mockRestore()
  })

  it("captures project from directory", async () => {
    const inst = await plugin({ directory: "/path/to/MyProject" } as any)
    const out = { system: ["base"] }
    await (inst["experimental.chat.system.transform"] as any)({ sessionID: "test" } as any, out)
    expect(execSpy).toHaveBeenCalled()
    const args = execSpy.mock.calls[0][0] as string[]
    expect(args.join(" ")).toContain("MyProject")
  })

  it("different factory calls get different project values", async () => {
    const inst1 = await plugin({ directory: "/path/to/ProjAlpha" } as any)
    const inst2 = await plugin({ directory: "/path/to/ProjBeta" } as any)

    const out1 = { system: ["base"] }
    const out2 = { system: ["base"] }

    await (inst1["experimental.chat.system.transform"] as any)({ sessionID: "s1" } as any, out1)
    await (inst2["experimental.chat.system.transform"] as any)({ sessionID: "s2" } as any, out2)

    const argsList = execSpy.mock.calls.map((c: any) => c[0] as string[])
    expect(argsList[0].join(" ")).toContain("ProjAlpha")
    expect(argsList[1].join(" ")).toContain("ProjBeta")
    expect(argsList[0][2]).not.toBe(argsList[1][2])
  })
})

// ─── Hook-level: spawn, inject, cache ────────────────────────────────

describe("experimental.chat.system.transform hook", () => {
  let execSpy: ReturnType<typeof spyOn>

  function mockOvWithLessons() {
    execSpy = spyOn(ovHelper, "execOv").mockImplementation(async () => ({
      stdout: JSON.stringify({
        ok: true,
        result: {
          memories: [
            { score: 0.9, abstract: "use pnpm for package management" },
            { score: 0.8, abstract: "prefer vitest over jest" },
          ],
          resources: [],
        },
      }),
      stderr: "",
    }))
  }

  beforeEach(() => {
    SessionCache.clear()
    mockOvWithLessons()
  })

  afterEach(() => {
    execSpy.mockRestore()
  })

  it("calls ov find via execOv and injects lessons into output.system", async () => {
    const inst = await plugin({ directory: "/path/MyProject" } as any)
    const output = { system: ["base prompt"] }
    await (inst["experimental.chat.system.transform"] as any)(
      { sessionID: "hook-test-spawn", model: {} } as any,
      output,
    )

    expect(execSpy).toHaveBeenCalledTimes(1)
    const args = execSpy.mock.calls[0][0] as string[]
    expect(args[0]).toBe("ov")
    expect(args[1]).toBe("find")
    expect(args.join(" ")).toContain("MyProject")

    expect(output.system[0]).toContain("## Past Lessons")
    expect(output.system[0]).toContain("use pnpm")
    expect(output.system[0]).toContain("prefer vitest")
  })

  it("uses cache on second call (no additional exec)", async () => {
    const inst = await plugin({ directory: "/path/MyProject" } as any)
    const output1 = { system: ["first"] }
    await (inst["experimental.chat.system.transform"] as any)(
      { sessionID: "hook-test-cache", model: {} } as any,
      output1,
    )
    const firstCallCount = execSpy.mock.calls.length

    const output2 = { system: ["second"] }
    await (inst["experimental.chat.system.transform"] as any)(
      { sessionID: "hook-test-cache", model: {} } as any,
      output2,
    )

    expect(execSpy.mock.calls.length).toBe(firstCallCount) // no new exec
    expect(output2.system[0]).toContain("use pnpm")
  })

  it("handles gracefully when ov find returns no results", async () => {
    execSpy.mockRestore()
    execSpy = spyOn(ovHelper, "execOv").mockImplementation(async () => ({
      stdout: JSON.stringify({ ok: true, result: { memories: [], resources: [] } }),
      stderr: "",
    }))

    const inst = await plugin({ directory: "/path/EmptyProject" } as any)
    const output = { system: ["base prompt"] }
    await (inst["experimental.chat.system.transform"] as any)(
      { sessionID: "hook-test-empty", model: {} } as any,
      output,
    )

    expect(output.system).toEqual(["base prompt"]) // unchanged
  })
})

// ─── Regression: no named exports at module level ────────────────────
// OpenCode v1.17.13's getLegacyPlugins iterates Object.values(mod) and
// calls each export as a Plugin. Named helpers crash the loader.

describe("plugin module exports", () => {
  it("has no named runtime exports (only default)", async () => {
    const mod = await import("../lesson-injector.ts")
    expect(Object.keys(mod)).toEqual(["default"])
  })
})

