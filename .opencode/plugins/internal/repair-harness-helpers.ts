// Helper functions for repair-harness plugin — exported for testing

// Per-tool session stats
export interface ToolStat {
  totalCalls: number
  repairCount: number
  disabled: boolean
}

export const toolStats = new Map<string, Map<string, ToolStat>>()
export const MAX_SESSIONS = 100

export function getStat(sessionID: string, tool: string): ToolStat {
  if (toolStats.size >= MAX_SESSIONS && !toolStats.has(sessionID)) {
    const oldest = toolStats.keys().next().value
    if (oldest) toolStats.delete(oldest)
  }
  let sessionMap = toolStats.get(sessionID)
  if (!sessionMap) {
    sessionMap = new Map()
    toolStats.set(sessionID, sessionMap)
  }
  let s = sessionMap.get(tool)
  if (!s) {
    s = { totalCalls: 0, repairCount: 0, disabled: false }
    sessionMap.set(tool, s)
  }
  return s
}

// Kill switch

/** Kill switch: REPAIR_HARNESS=off|disable|0|false disables all repair. */
export function isHarnessEnabled(): boolean {
  return !["off", "disable", "0", "false"].includes(
    (process.env.REPAIR_HARNESS || "").toLowerCase()
  )
}

// Module-level regex (hoisted)
const ARRAY_HINT = /^(urls|paths|files|items|ids|include|exclude|patterns|globs|sources|targets)$/i

// Bootstrap trap: String.fromCharCode(96) avoids backtick destruction
// when pattern 3 rewrites this file via write tool.
const BT = String.fromCharCode(96)

const MD_LINK = /\[([^\]]*)\]\([^)]*\)/g
// Skip triple-backtick fences
const MD_CODE = new RegExp(
  "(?<!" + BT + ")" + BT + "([^" + BT + "]{1,200}?)" + BT + "(?!" + BT + ")",
  "g"
)

// Pattern 2 whitelist
const JSON_LIKELY_KEYS = new Set([
  "config", "data", "payload", "body", "params", "input",
  "metadata", "spec", "schema", "json", "args_object",
])

const MAX_JSON_PARSE_LENGTH = 10_000

// ─── Repair patterns ────────────────────────────────────────────────

/** Pattern 1 — Strip null, undefined, or bare {}. */
export function repairNullDrop(args: Record<string, unknown>): boolean {
  let repaired = false
  for (const [k, v] of Object.entries(args)) {
    if (
      v === null ||
      v === undefined ||
      (typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0)
    ) {
      delete args[k]
      repaired = true
    }
  }
  return repaired
}

/** Pattern 2 — Parse JSON strings under whitelisted keys. */
export function repairJsonString(args: Record<string, unknown>): boolean {
  let repaired = false
  for (const [k, v] of Object.entries(args)) {
    if (typeof v !== "string") continue
    if (v.length > MAX_JSON_PARSE_LENGTH) continue
    if (!JSON_LIKELY_KEYS.has(k)) continue
    const t = v.trim()
    if (
      (t.startsWith("{") && t.endsWith("}")) ||
      (t.startsWith("[") && t.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(t)
        if (typeof parsed !== "object" || parsed === null) continue
        args[k] = parsed
        repaired = true
      } catch {
        // not valid JSON — leave as-is
      }
    }
  }
  return repaired
}

/** Pattern 3 — Strip markdown link/code formatting from strings. */
export function repairMarkdownString(args: Record<string, unknown>): boolean {
  let repaired = false
  for (const [k, v] of Object.entries(args)) {
    if (typeof v !== "string") continue
    let s = v
    const before = s
    s = s.replace(MD_LINK, "$1")
    s = s.replace(MD_CODE, "$1")
    if (s !== before) {
      args[k] = s
      repaired = true
    }
  }
  return repaired
}

/** Pattern 4 — Wrap singular values in array for plural-hinted keys. */
export function repairSingleObjectWrap(args: Record<string, unknown>): boolean {
  let repaired = false
  for (const [k, v] of Object.entries(args)) {
    if (v === null || v === undefined) continue
    if (!Array.isArray(v) && ARRAY_HINT.test(k)) {
      args[k] = [v]
      repaired = true
    }
  }
  return repaired
}
