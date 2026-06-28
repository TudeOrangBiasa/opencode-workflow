import type { Plugin } from "@opencode-ai/plugin"

/** Intercepts malformed tool args. 4 patterns: null drop, JSON parse, markdown strip, array wrap. */

// Per-tool session stats
interface ToolStat {
  totalCalls: number
  repairCount: number
  disabled: boolean
}

const toolStats = new Map<string, Map<string, ToolStat>>()
const MAX_SESSIONS = 100

const THRESHOLD_RATE = 0.02   // auto-disable if repair rate below 2%
const THRESHOLD_MIN_CALLS = 100  // minimum calls before considering disable

function getStat(sessionID: string, tool: string): ToolStat {
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
function isHarnessEnabled(): boolean {
  return !["off", "disable", "0", "false"].includes(
    (process.env.REPAIR_HARNESS || "").toLowerCase()
  )
}

// Exported for testing
export { repairNullDrop, repairJsonString, repairMarkdownString, repairSingleObjectWrap, isHarnessEnabled, getStat }

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

// Tools that write content to disk — skip pattern 3 to preserve code
const DISK_WRITE_TOOLS = new Set([
  "write", "edit", "create", "replace", "patch", "applyDiff",
  "writeFile", "write_file", "fs_write", "put_file",
])

// Pattern 2 whitelist
const JSON_LIKELY_KEYS = new Set([
  "config", "data", "payload", "body", "params", "input",
  "metadata", "spec", "schema", "json", "args_object",
])

const MAX_JSON_PARSE_LENGTH = 10_000

// ─── Repair patterns ────────────────────────────────────────────────

/** Pattern 1 — Strip null, undefined, or bare {}. */
function repairNullDrop(args: Record<string, unknown>): boolean {
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
function repairJsonString(args: Record<string, unknown>): boolean {
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
function repairMarkdownString(args: Record<string, unknown>): boolean {
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
function repairSingleObjectWrap(args: Record<string, unknown>): boolean {
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

// Session ID helper
function shortSessionId(input: { sessionID?: string }): string {
  return input.sessionID ? input.sessionID.slice(0, 8) : "no_session"
}

// Plugin hooks

const plugin: Plugin = async () => {
  // Reset stats per session (module is cached, but this runs once per start)
  toolStats.clear()

  return {
    "tool.execute.before": async (input, output) => {
      const shortId = shortSessionId(input)
      try {
        if (!isHarnessEnabled()) return
        const tool = input.tool
        const args = output.args as Record<string, unknown>
        if (!args || typeof args !== "object" || Array.isArray(args)) return

        const stat = getStat(input.sessionID || "_no_session", tool)

        // Skip repair if auto-disabled (stable tool)
        if (stat.disabled) return

        let didRepair = false

        // Run all repairs (each must fire independently — no short-circuit)
        if (repairNullDrop(args)) didRepair = true
        if (repairJsonString(args)) didRepair = true
        // Skip pattern 3 for disk-write tools (bootstrap trap guard)
        if (!DISK_WRITE_TOOLS.has(tool)) {
          if (repairMarkdownString(args)) didRepair = true
        }
        if (repairSingleObjectWrap(args)) didRepair = true

        stat.totalCalls++
        if (didRepair) {
          stat.repairCount++
        }

        if (
          !stat.disabled &&
          stat.totalCalls >= THRESHOLD_MIN_CALLS &&
          stat.repairCount / stat.totalCalls < THRESHOLD_RATE
        ) {
          stat.disabled = true
          console.log(
            `[repair-harness ${shortId}] auto-disabled for "${tool}" ` +
              `(repair rate ${((stat.repairCount / stat.totalCalls) * 100).toFixed(1)}% ` +
              `< ${THRESHOLD_RATE * 100}% over ${stat.totalCalls} calls)`
          )
        }

        if (didRepair) {
          console.log(
            `[repair-harness ${shortId}] repaired "${tool}" call ` +
              `(total repairs for this tool: ${stat.repairCount}/${stat.totalCalls})`
          )
        }
      } catch (err) {
        console.error("[repair-harness " + shortId + "] before-hook error:", err)
      }
    },
  }
}

export default plugin
