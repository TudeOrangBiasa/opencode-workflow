import { describe, it, expect, spyOn, afterEach } from "bun:test"
import { ovFindJson } from "./ov-helper.ts"

function makeSpawn(overrides: Partial<{
  exitCode: number
  stdout: string
  stderr: string
}>): any {
  const { exitCode = 0, stdout = "", stderr = "" } = overrides
  return {
    exited: Promise.resolve(exitCode),
    stdout: new ReadableStream({
      start(controller) {
        if (stdout) controller.enqueue(new TextEncoder().encode(stdout))
        controller.close()
      },
    }),
    stderr: new ReadableStream({
      start(controller) {
        if (stderr) controller.enqueue(new TextEncoder().encode(stderr))
        controller.close()
      },
    }),
  }
}

describe("ovFindJson", () => {
  let warn: ReturnType<typeof spyOn>

  afterEach(() => {
    warn?.mockRestore()
  })

  it("returns parsed result on success", async () => {
    const spy = spyOn(Bun, "spawn").mockImplementation(() =>
      makeSpawn({
        stdout: JSON.stringify({ ok: true, result: { memories: [], resources: [] } }),
      })
    )
    const result = await ovFindJson(["ov", "find", "test"])
    expect(result).not.toBeNull()
    expect(result!.ok).toBe(true)
    spy.mockRestore()
  })

  it("returns null on non-zero exit and logs warning", async () => {
    const spy = spyOn(Bun, "spawn").mockImplementation(() =>
      makeSpawn({ exitCode: 1, stderr: "connection refused" })
    )
    warn = spyOn(console, "warn").mockImplementation(() => {})

    const result = await ovFindJson(["ov", "find", "bad-query"])
    expect(result).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain("failed (exit 1)")
    expect(warn.mock.calls[0][0]).toContain("connection refused")
    spy.mockRestore()
  })

  it("returns null on invalid JSON and logs warning", async () => {
    const spy = spyOn(Bun, "spawn").mockImplementation(() =>
      makeSpawn({ stdout: "{not: json}" })
    )
    warn = spyOn(console, "warn").mockImplementation(() => {})

    const result = await ovFindJson(["ov", "find", "bad-json"])
    expect(result).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain("invalid JSON")
    spy.mockRestore()
  })

  it("returns null on empty stdout and logs warning", async () => {
    const spy = spyOn(Bun, "spawn").mockImplementation(() =>
      makeSpawn({ stdout: "" })
    )
    warn = spyOn(console, "warn").mockImplementation(() => {})

    const result = await ovFindJson(["ov", "find", "empty"])
    expect(result).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain("invalid JSON")
    spy.mockRestore()
  })
})
