// Shared ov CLI helper

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

/** Run ov find and parse JSON output. Returns null on failure. */
export async function ovFindJson(args: string[]): Promise<OvFindResponse | null> {
  const proc = Bun.spawn(args)
  const [exitCode, stdout, stderr] = await Promise.all([
    proc.exited,
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ])
  if (exitCode !== 0) {
    const label = `"${args.slice(0, 3).join(" ")}${args.length > 3 ? " …" : ""}"`
    const msg = stderr.trim() || "(no stderr)"
    console.warn(`[ov-helper] ${label} failed (exit ${exitCode}): ${msg}`)
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
