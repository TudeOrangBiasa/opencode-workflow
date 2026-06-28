import { describe, it, expect, spyOn } from "bun:test"
import plugin, {
  repairNullDrop,
  repairJsonString,
  repairMarkdownString,
  repairSingleObjectWrap,
  isHarnessEnabled,
} from "./repair-harness.ts"
describe("Pattern 1 — Null drop", () => {
  it("drops null value", () => {
    const args: Record<string, unknown> = { path: "/foo/bar", mode: null, depth: 5 }
    expect(repairNullDrop(args)).toBe(true)
    expect("mode" in args).toBe(false)
    expect(args.path).toBe("/foo/bar")
  })

  it("drops undefined", () => {
    const args: Record<string, unknown> = { path: "/x", extra: undefined }
    expect(repairNullDrop(args)).toBe(true)
    expect("extra" in args).toBe(false)
  })

  it("drops empty object", () => {
    const args = { path: "/x", options: {} }
    expect(repairNullDrop(args)).toBe(true)
    expect("options" in args).toBe(false)
  })

  it("keeps non-empty object", () => {
    const args = { path: "/x", options: { key: "val" } }
    expect(repairNullDrop(args)).toBe(false)
    expect(args.options).toEqual({ key: "val" })
  })

  it("keeps arrays", () => {
    const args = { items: [1, 2, 3] }
    expect(repairNullDrop(args)).toBe(false)
    expect(args.items).toEqual([1, 2, 3])
  })

  it("no repair for clean args", () => {
    const args = { path: "/x", depth: 3 }
    expect(repairNullDrop(args)).toBe(false)
  })
})

describe("Pattern 2 — JSON-string parse", () => {
  it("parses JSON array string", () => {
    const args = { urls: '["/a", "/b"]' }
    expect(repairJsonString(args)).toBe(true)
    expect(Array.isArray(args.urls)).toBe(true)
  })

  it("parses JSON object string", () => {
    const args = { config: '{"key":"val"}' }
    expect(repairJsonString(args)).toBe(true)
    expect(args.config as unknown as { key: string }).toEqual({ key: "val" })
  })

  it("keeps bare string", () => {
    const args = { path: "hello.txt" }
    expect(repairJsonString(args)).toBe(false)
  })

  it("keeps invalid JSON string", () => {
    const args: Record<string, unknown> = { bad: "{not: json}" }
    expect(repairJsonString(args)).toBe(false)
    expect(args.bad).toBe("{not: json}")
  })

  it("skips non-string", () => {
    const args = { depth: 3 }
    expect(repairJsonString(args)).toBe(false)
  })
})

describe("Pattern 3 — Markdown stripping", () => {
  it("strips markdown link", () => {
    const args = { path: "[link](https://example.com)" }
    expect(repairMarkdownString(args)).toBe(true)
    expect(args.path).toBe("link")
  })

  it("strips inline code", () => {
    const args = { path: "`code block`" }
    expect(repairMarkdownString(args)).toBe(true)
    expect(args.path).toBe("code block")
  })

  it("keeps plain string", () => {
    const args = { path: "hello" }
    expect(repairMarkdownString(args)).toBe(false)
  })

  it("skips non-string", () => {
    const args = { depth: 5 }
    expect(repairMarkdownString(args)).toBe(false)
  })

  it("strips mixed formatting", () => {
    const args = { path: "click [here](https://x.com) for `docs`" }
    expect(repairMarkdownString(args)).toBe(true)
    expect(args.path).toBe("click here for docs")
  })
})

describe("Pattern 4 — Single-object wrap", () => {
  it("wraps string in array", () => {
    const args = { urls: "https://example.com" }
    expect(repairSingleObjectWrap(args)).toBe(true)
    expect(Array.isArray(args.urls)).toBe(true)
    expect(args.urls[0]).toBe("https://example.com")
  })

  it("wraps object in array", () => {
    const args = { items: { id: 1 } }
    expect(repairSingleObjectWrap(args)).toBe(true)
    expect(Array.isArray(args.items)).toBe(true)
    expect((args.items as unknown as Array<{ id: number }>)[0]).toEqual({ id: 1 })
  })

  it("keeps existing array", () => {
    const args = { urls: ["/a", "/b"] }
    expect(repairSingleObjectWrap(args)).toBe(false)
  })

  it("ignores non-array key", () => {
    const args = { path: "hello.txt" }
    expect(repairSingleObjectWrap(args)).toBe(false)
  })

  it("skips null values", () => {
    const args: Record<string, unknown> = { urls: null }
    expect(repairSingleObjectWrap(args)).toBe(false)
  })
})

// ═══ Issue 19: P0 safety ══════════════════════════════════════════════

describe("Safety: before-hook try/catch", () => {
  it("catches thrown error in before-hook gracefully", async () => {
    const hooks = await (plugin as any)({})
    const input = { tool: "test-tool-1", sessionID: "test-session-1", callID: "test-call-1" }
    // Frozen args makes repairNullDrop throw (delete on non-configurable prop)
    const output = { args: Object.freeze({ path: null }) }
      await hooks["tool.execute.before"](input, output)
    expect(true).toBe(true) // reached => no throw
  })
})

describe("Safety: after-hook try/catch", () => {
  it("catches thrown error in after-hook gracefully", async () => {
    const hooks = await (plugin as any)({})
    const input = { tool: "test-tool-2", sessionID: "test-session-2", callID: "test-call-2", args: {} }
    // First call before-hook to set lastCallRepaired = true
    const beforeOut = { args: { path: null } }
      await hooks["tool.execute.before"](input, beforeOut)
    // After-hook with non-writable output property (output.output += hint throws)
    const afterOutput: any = { title: "", metadata: null }
    Object.defineProperty(afterOutput, "output", {
      value: "some text",
      writable: false,
    })
      await hooks["tool.execute.after"](input, afterOutput)
    expect(true).toBe(true)
  })
})

describe("Safety: type-safe after-hook", () => {
  it("does not append hint to JSON-shaped output", async () => {
    const hooks = await (plugin as any)({})
    const input = { tool: "test-tool-3", sessionID: "test-session-3", callID: "test-call-3", args: {} }
      await hooks["tool.execute.before"](input, { args: { path: null } })
    const afterOutput: any = { output: JSON.stringify({ status: "ok" }), title: "", metadata: null }
      await hooks["tool.execute.after"](input, afterOutput)
    expect(afterOutput.output).toBe(JSON.stringify({ status: "ok" }))
  })

  it("does not crash on non-string output", async () => {
    const hooks = await (plugin as any)({})
    const input = { tool: "test-tool-4", sessionID: "test-session-4", callID: "test-call-4", args: {} }
      await hooks["tool.execute.before"](input, { args: { path: null } })
    const afterOutput: any = { output: undefined, title: "", metadata: null }
      await hooks["tool.execute.after"](input, afterOutput)
    expect(afterOutput.output).toBeUndefined()
  })
})

describe("Safety: kill switch", () => {
  it("returns false when REPAIR_HARNESS=off", () => {
    process.env.REPAIR_HARNESS = "off"
    try {
      expect(isHarnessEnabled()).toBe(false)
    } finally {
      delete process.env.REPAIR_HARNESS
    }
  })

  it("returns false when REPAIR_HARNESS=0", () => {
    process.env.REPAIR_HARNESS = "0"
    try {
      expect(isHarnessEnabled()).toBe(false)
    } finally {
      delete process.env.REPAIR_HARNESS
    }
  })

  it("returns false when REPAIR_HARNESS=false", () => {
    process.env.REPAIR_HARNESS = "false"
    try {
      expect(isHarnessEnabled()).toBe(false)
    } finally {
      delete process.env.REPAIR_HARNESS
    }
  })

  it("returns false when REPAIR_HARNESS=disable", () => {
    process.env.REPAIR_HARNESS = "disable"
    try {
      expect(isHarnessEnabled()).toBe(false)
    } finally {
      delete process.env.REPAIR_HARNESS
    }
  })

  it("returns true when REPAIR_HARNESS is unset", () => {
    delete process.env.REPAIR_HARNESS
    expect(isHarnessEnabled()).toBe(true)
  })

  it("hooks no-op when harness is disabled", async () => {
    process.env.REPAIR_HARNESS = "off"
    try {
      const hooks = await (plugin as any)({})
      const input = { tool: "test-tool-5", sessionID: "test-session-5", callID: "test-call-5" }
      const output = { args: { path: null } }
      await hooks["tool.execute.before"](input, output)
      expect(output.args.path).toBeNull() // args unchanged
    } finally {
      delete process.env.REPAIR_HARNESS
    }
  })
})

describe("Safety: session prefix in logs", () => {
  it("log includes short session ID when sessionID present", async () => {
    const spy = spyOn(console, "log")
    try {
      const hooks = await (plugin as any)({})
      const input = { tool: "test-tool-6", sessionID: "abc12345-deadbeef", callID: "test-call-6" }
      await hooks["tool.execute.before"](input, { args: { path: null } })
      const found = spy.mock.calls.some((call) =>
        typeof call[0] === "string" && call[0].includes("abc12345")
      )
      expect(found).toBe(true)
    } finally {
      spy.mockRestore()
    }
  })
})
