// ─── Shared ov CLI helper ───────────────────────────────────────────

/** Standard return shape from ov find -o json. */
export interface OvFindResult {
  uri: string
  abstract: string
  score: number
}

/** Raw response from ov find includes a status wrapper. */
interface OvFindResponse {
  ok: boolean
  result: {
    memories: OvFindResult[]
    resources: OvFindResult[]
  }
}

/** Run ov find asynchronously and parse JSON output.
 * Returns empty array on non-zero exit, parse failure, or !ok response.
 */
export async function ovFindJson(args: string[]): Promise<OvFindResponse | null> {
  const proc = Bun.spawn(args)
  const exitCode = await proc.exited
  if (exitCode !== 0) return null
  const stdout = await new Response(proc.stdout).text()
  try {
    return JSON.parse(stdout) as OvFindResponse
  } catch {
    return null
  }
}
