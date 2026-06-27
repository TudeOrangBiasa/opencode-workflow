import { describe, it, expect } from "bun:test"
import {
  repairNullDrop,
  repairJsonString,
  repairMarkdownString,
  repairSingleObjectWrap,
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
    expect(args.config).toEqual({ key: "val" })
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
    expect(args.items[0]).toEqual({ id: 1 })
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
