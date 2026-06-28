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
  const exitCode = await proc.exited
  if (exitCode !== 0) return null
  const stdout = await new Response(proc.stdout).text()
  try {
    return JSON.parse(stdout) as OvFindResponse
  } catch {
    return null
  }
}
