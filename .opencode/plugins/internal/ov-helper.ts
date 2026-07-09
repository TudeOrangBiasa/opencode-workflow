// Shared ov CLI helper

import { spawn } from "node:child_process"

/** ov find -o json result shape. */
export interface OvFindResult {
  uri: string
  abstract: string
  score: number
}

/** ov find response with ok wrapper. */
interface OvFindResponse {
  ok: boolean
  result: {
    memories: OvFindResult[]
    resources: OvFindResult[]
  }
}

/** Wrapped spawn for testability. Exported so tests can spyOn it. */
export async function execOv(args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(args[0], args.slice(1))
    let stdout = ""
    let stderr = ""
    child.stdout?.on("data", (chunk: Buffer) => { stdout += chunk.toString() })
    child.stderr?.on("data", (chunk: Buffer) => { stderr += chunk.toString() })
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(`exit ${code}: ${stderr}`))
    })
    child.on("error", reject)
  })
}

/** Run ov find and parse JSON output. Returns null on failure. */
export async function ovFindJson(args: string[]): Promise<OvFindResponse | null> {
  let stdout: string
  let stderr: string
  try {
    const result = await execOv(args)
    stdout = result.stdout
    stderr = result.stderr
  } catch (err: unknown) {
    const label = `"${args.slice(0, 3).join(" ")}${args.length > 3 ? " …" : ""}"`
    const msg = err instanceof Error ? err.message : "(unknown error)"
    console.warn(`[ov-helper] ${label} failed: ${msg}`)
    return null
  }
  try {
    // ov CLI prefixes stdout with a "cmd: ..." informational line; the JSON
    // payload follows on the next line. Locate the first '{' to skip the
    // preamble before parsing.
    const jsonStart = stdout.indexOf("{")
    if (jsonStart < 0) {
      const label = `"${args.slice(0, 3).join(" ")}${args.length > 3 ? " …" : ""}`
      console.warn(`[ov-helper] ${label} no JSON object in stdout`)
      return null
    }
    return JSON.parse(stdout.slice(jsonStart)) as OvFindResponse
  } catch {
    const label = `"${args.slice(0, 3).join(" ")}${args.length > 3 ? " …" : ""}"`
    console.warn(`[ov-helper] ${label} invalid JSON response`)
    return null
  }
}
