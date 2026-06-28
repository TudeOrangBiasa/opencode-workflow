import { describe, it, expect, spyOn } from "bun:test"
import plugin, {
  repairNullDrop,
  repairJsonString,
  repairMarkdownString,
  repairSingleObjectWrap,
  isHarnessEnabled,
  getStat,
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
  it("parses JSON array string (whitelisted key)", () => {
    const args = { data: '["/a", "/b"]' }
    expect(repairJsonString(args)).toBe(true)
    expect(Array.isArray(args.data)).toBe(true)
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

describe("Pattern 2 — key whitelist (Issue 21)", () => {
  const nonJsonKeys = ["content", "oldString", "newString", "command", "pattern", "url", "text", "description"]
  const jsonStr = JSON.stringify({ foo: "bar" })
  for (const key of nonJsonKeys) {
    it("does NOT parse " + key + " param", () => {
      const args: Record<string, unknown> = {}
      args[key] = jsonStr
      expect(repairJsonString(args)).toBe(false)
      expect(typeof args[key]).toBe("string")
    })
  }

  const jsonKeys = ["config", "data", "payload", "body", "params", "input", "metadata", "spec", "schema", "json", "args_object"]
  for (const key of jsonKeys) {
    it("parses " + key + " param", () => {
      const args: Record<string, unknown> = {}
      args[key] = JSON.stringify({ key: "val" })
      expect(repairJsonString(args)).toBe(true)
      expect((args[key] as { key: string }).key).toBe("val")
    })
  }
})

describe("Pattern 2 — size guard (Issue 21)", () => {
  it("skips strings > 10KB", () => {
    const big = '{"a":1,"x":"' + "y".repeat(11_000) + '"}'
    const args = { config: big }
    expect(repairJsonString(args)).toBe(false)
    expect(typeof args.config).toBe("string")
  })
})

describe("Pattern 2 — strict type (Issue 21)", () => {
  it("does not assign primitive result", () => {
    const args = { config: "42" }
    expect(repairJsonString(args)).toBe(false)
    expect(args.config).toBe("42")
  })

  it("does not assign null result", () => {
    const args = { config: "null" }
    expect(repairJsonString(args)).toBe(false)
    expect(args.config).toBe("null")
  })

  it("parses object result", () => {
    const args: Record<string, unknown> = { config: '{"a":1}' }
    expect(repairJsonString(args)).toBe(true)
    expect(args.config as unknown as { a: number }).toEqual({ a: 1 })
  })

  it("parses array result", () => {
    const args: Record<string, unknown> = { data: "[1,2,3]" }
    expect(repairJsonString(args)).toBe(true)
    expect(args.data as unknown as number[]).toEqual([1, 2, 3])
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

describe("Pattern 4 — ARRAY_HINT tightening", () => {
  it("does NOT wrap args (singular string)", () => {
    const args = { args: "--debug" }
    expect(repairSingleObjectWrap(args)).toBe(false)
    expect(typeof args.args).toBe("string")
    expect(Array.isArray(args.args)).toBe(false)
  })
  it("does NOT wrap args (object)", () => {
    const args = { args: { key: "val" } }
    expect(repairSingleObjectWrap(args)).toBe(false)
    expect(typeof args.args).toBe("object")
    expect(Array.isArray(args.args)).toBe(false)
  })
  it("does NOT wrap options", () => {
    const args = { options: { verbose: true } }
    expect(repairSingleObjectWrap(args)).toBe(false)
    expect(Array.isArray(args.options)).toBe(false)
  })
  it("does NOT wrap flags", () => {
    const args = { flags: "-rf" }
    expect(repairSingleObjectWrap(args)).toBe(false)
  })
  it("does NOT wrap list (paginated record)", () => {
    const args = { list: { page: 1 } }
    expect(repairSingleObjectWrap(args)).toBe(false)
  })
  it("does NOT wrap keys", () => {
    const args = { keys: "id" }
    expect(repairSingleObjectWrap(args)).toBe(false)
  })
  it("does NOT wrap values", () => {
    const args = { values: "42" }
    expect(repairSingleObjectWrap(args)).toBe(false)
  })
  it("DOES wrap urls", () => {
    const args = { urls: "https://x.com" }
    expect(repairSingleObjectWrap(args)).toBe(true)
  })
  it("DOES wrap include", () => {
    const args = { include: "*.ts" }
    expect(repairSingleObjectWrap(args)).toBe(true)
  })
  it("DOES wrap exclude", () => {
    const args = { exclude: "node_modules" }
    expect(repairSingleObjectWrap(args)).toBe(true)
  })
  it("DOES wrap patterns", () => {
    const args = { patterns: "TODO" }
    expect(repairSingleObjectWrap(args)).toBe(true)
  })
  it("DOES wrap globs", () => {
    const args = { globs: "*.md" }
    expect(repairSingleObjectWrap(args)).toBe(true)
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

// ═══ Issue 20: Pattern 3 opt-in via tool whitelist ════════════════════

// Bootstrap trap: avoid hooks[hookName pattern. Use intermediate
// variable to separate bracket access from function call.

describe("Issue 20 - Pattern 3 tool whitelist", () => {
  var BT = String.fromCharCode(96)
  var diskWriteTools = ["write", "edit", "create", "replace", "patch", "applyDiff"]
  for (var di = 0; di < diskWriteTools.length; di++) {
    ;(function (toolName) {
      it("skips " + toolName + " tool", async () => {
        var hooks = await (plugin as any)({})
        var input = { tool: toolName, sessionID: "i20-test", callID: "i20-call" }
        var contentArg = "use " + BT + "foo" + BT
        var output = { args: { content: contentArg } }
        var hookName = "tool.execute.before"
        var fn = hooks[hookName]
        await fn(input, output)
        expect(output.args.content).toBe(contentArg)
      })
    })(diskWriteTools[di])
  }

  var safeTools = ["chat", "ask", "webfetch"]
  for (var si = 0; si < safeTools.length; si++) {
    ;(function (toolName) {
      it("runs for " + toolName + " tool", async () => {
        var hooks = await (plugin as any)({})
        var input = { tool: toolName, sessionID: "i20-test", callID: "i20-call" }
        var contentArg = "use " + BT + "foo" + BT
        var output = { args: { content: contentArg } }
        var hookName = "tool.execute.before"
        var fn = hooks[hookName]
        await fn(input, output)
        expect(output.args.content).toBe("use foo")
      })
    })(safeTools[si])
  }
})

describe("Issue 20 - Triple backtick protection", () => {
  it("does not corrupt triple backtick code fence", () => {
    var BT = String.fromCharCode(96)
    var fence = BT + BT + BT + "\nts\nconst x = 1\n" + BT + BT + BT
    var args = { content: fence }
    expect(repairMarkdownString(args)).toBe(false)
    expect(args.content).toBe(fence)
  })

  it("still strips single backtick pairs", () => {
    var BT = String.fromCharCode(96)
    var input = "use " + BT + "foo" + BT
    var expected = "use foo"
    var args = { content: input }
    expect(repairMarkdownString(args)).toBe(true)
    expect(args.content).toBe(expected)
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

// ─── Issue 23: Session isolation for toolStats ────────────────────────

describe("Session isolation", () => {
  it("session A and B have independent stats", () => {
    const statA = getStat("sessionA", "grep")
    for (let i = 0; i < 100; i++) {
      statA.totalCalls++
      statA.repairCount++
    }
    const statB = getStat("sessionB", "grep")
    expect(statB.totalCalls).toBe(0)
    expect(statB.repairCount).toBe(0)
    expect(statB.disabled).toBe(false)
    expect(statB.firstRepairLogged).toBe(false)
  })

  it("tool disabled in A is not disabled in B", () => {
    const statA = getStat("sessionA2", "grep")
    statA.totalCalls = 100
    statA.repairCount = 1
    statA.disabled = true
    const statB = getStat("sessionB2", "grep")
    expect(statB.disabled).toBe(false)
  })

  it("firstRepairLogged resets per session", () => {
    const statA = getStat("sessionA3", "grep")
    statA.firstRepairLogged = true
    const statB = getStat("sessionB3", "grep")
    expect(statB.firstRepairLogged).toBe(false)
  })

  it("hook passes sessionID correctly", async () => {
    const hooks = await (plugin as any)({})
    const input = { tool: "grep", sessionID: "sessionX", callID: "test-call" }
    await hooks["tool.execute.before"](input, { args: { path: null } })
    const stat = getStat("sessionX", "grep")
    expect(stat.totalCalls).toBe(1)
    expect(stat.repairCount).toBe(1)
  })

  it("hook falls back to _no_session when sessionID missing", async () => {
    const hooks = await (plugin as any)({})
    const input = { tool: "grep", sessionID: "", callID: "test-call" }
    await hooks["tool.execute.before"](input, { args: { path: null } })
    const stat = getStat("_no_session", "grep")
    expect(stat.totalCalls).toBe(1)
    expect(stat.repairCount).toBe(1)
  })
})

// ═══ Issue 26: toolStats memory bound ──────────────────────────────────

describe("Issue 26 — toolStats memory bound", () => {
  it("evicts oldest when at MAX_SESSIONS", () => {
    const PREFIX = "i26a-"
    for (let i = 0; i < 100; i++) {
      getStat(PREFIX + i, "t").totalCalls = i + 1
    }
    getStat(PREFIX + "overflow", "t")
    const check = getStat(PREFIX + "0", "t")
    expect(check.totalCalls).toBe(0)
  })

  it("does NOT evict when re-accessing existing session", () => {
    const PREFIX = "i26b-"
    for (let i = 0; i < 100; i++) {
      getStat(PREFIX + i, "t").totalCalls = i + 1
    }
    const check = getStat(PREFIX + "0", "t")
    expect(check.totalCalls).toBe(1)
  })
})
