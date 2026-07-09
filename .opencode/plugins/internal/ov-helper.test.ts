import { describe, it, expect, spyOn, afterEach } from "bun:test"
import * as ovHelper from "./ov-helper.ts"

function makeMockExecOv(overrides: Partial<{
  stderr: string
  stdout: string
}>): (...args: string[]) => Promise<{ stdout: string; stderr: string }> {
  const { stdout = "", stderr = "" } = overrides
  return async () => ({ stdout, stderr })
}

function makeMockExecOvThrow(msg: string): (...args: string[]) => Promise<never> {
  return async () => { throw new Error(msg) }
}

describe("ovFindJson", () => {
  let warn: ReturnType<typeof spyOn>

  afterEach(() => {
    warn?.mockRestore()
  })

  it("returns parsed result on success", async () => {
    const spy = spyOn(ovHelper, "execOv").mockImplementation(
      makeMockExecOv({
        stdout: JSON.stringify({ ok: true, result: { memories: [], resources: [] } }),
      })
    )
    const result = await ovHelper.ovFindJson(["ov", "find", "test"])
    expect(result).not.toBeNull()
    expect(result!.ok).toBe(true)
    spy.mockRestore()
  })

  it("returns null on exec error (e.g. non-zero exit) and logs warning", async () => {
    const spy = spyOn(ovHelper, "execOv").mockImplementation(
      makeMockExecOvThrow("exit 1: connection refused")
    )
    warn = spyOn(console, "warn").mockImplementation(() => {})

    const result = await ovHelper.ovFindJson(["ov", "find", "bad-query"])
    expect(result).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain("failed")
    expect(warn.mock.calls[0][0]).toContain("connection refused")
    spy.mockRestore()
  })

  it("returns null on invalid JSON and logs warning", async () => {
    const spy = spyOn(ovHelper, "execOv").mockImplementation(
      makeMockExecOv({ stdout: "{not: json}" })
    )
    warn = spyOn(console, "warn").mockImplementation(() => {})

    const result = await ovHelper.ovFindJson(["ov", "find", "bad-json"])
    expect(result).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain("invalid JSON")
    spy.mockRestore()
  })

  it("returns null on empty stdout and logs warning", async () => {
    const spy = spyOn(ovHelper, "execOv").mockImplementation(
      makeMockExecOv({ stdout: "" })
    )
    warn = spyOn(console, "warn").mockImplementation(() => {})

    const result = await ovHelper.ovFindJson(["ov", "find", "empty"])
    expect(result).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain("no JSON object")
    spy.mockRestore()
  })

  it("strips 'cmd:' preamble line and parses JSON", async () => {
    const json = JSON.stringify({ ok: true, result: { memories: [], resources: [] } })
    const spy = spyOn(ovHelper, "execOv").mockImplementation(
      makeMockExecOv({ stdout: `cmd: ov find --uri= -n 5 "test"\n${json}` })
    )
    const result = await ovHelper.ovFindJson(["ov", "find", "test"])
    expect(result).not.toBeNull()
    expect(result!.ok).toBe(true)
    spy.mockRestore()
  })

  it("returns null when stdout has no JSON object", async () => {
    const spy = spyOn(ovHelper, "execOv").mockImplementation(
      makeMockExecOv({ stdout: "cmd: ov find\n" })
    )
    warn = spyOn(console, "warn").mockImplementation(() => {})

    const result = await ovHelper.ovFindJson(["ov", "find", "no-json"])
    expect(result).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain("no JSON object")
    spy.mockRestore()
  })
})
