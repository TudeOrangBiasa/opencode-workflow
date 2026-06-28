import type { Plugin } from "@opencode-ai/plugin"

// ─── Per-tool session stats ─────────────────────────────────────────
interface ToolStat {
  totalCalls: number
  repairCount: number
  disabled: boolean
  /** Flag set by before-hook, read by after-hook */
  lastCallRepaired: boolean
  /** Tracks per-session first-repair log state */
  firstRepairLogged: boolean
}

const toolStats = new Map<string, Map<string, ToolStat>>()

const THRESHOLD_RATE = 0.02   // auto-disable if repair rate below 2%
const THRESHOLD_MIN_CALLS = 100  // minimum calls before considering disable

function getStat(sessionID: string, tool: string): ToolStat {
  let sessionMap = toolStats.get(sessionID)
  if (!sessionMap) {
    sessionMap = new Map()
    toolStats.set(sessionID, sessionMap)
  }
  let s = sessionMap.get(tool)
  if (!s) {
    s = { totalCalls: 0, repairCount: 0, disabled: false, lastCallRepaired: false, firstRepairLogged: false }
    sessionMap.set(tool, s)
  }
  return s
}

// ─── Kill switch — env var disables all repair logic ─────────────────
function isHarnessEnabled(): boolean {
  return !["off", "disable", "0", "false"].includes(
    (process.env.REPAIR_HARNESS || "").toLowerCase()
  )
}

// ─── Exported for testing ───────────────────────────────────────────
export { repairNullDrop, repairJsonString, repairMarkdownString, repairSingleObjectWrap, isHarnessEnabled, getStat }

// ─── Module-level regex (hoisted — don't recreate per call) ────────
const ARRAY_HINT = /^(urls|paths|files|items|ids|include|exclude|patterns|globs|sources|targets)$/i

// Bootstrap trap: use char code for backtick.
// Pattern 3 strips BT pairs from markdown. If this file ever gets
// rewritten via write tool, literal backticks in regex source are
// destroyed. String.fromCharCode(96) survives the round-trip.
const BT = String.fromCharCode(96)

// Pattern 3 regex constants (hoisted)
const MD_LINK = /\[([^\]]*)\]\([^)]*\)/g
// Negative lookbehind/lookahead skips triple-backtick fences
const MD_CODE = new RegExp(
  "(?<!" + BT + ")" + BT + "([^" + BT + "]{1,200}?)" + BT + "(?!" + BT + ")",
  "g"
)

// Tools that write content to disk — skip pattern 3 to preserve code
const DISK_WRITE_TOOLS = new Set([
  "write", "edit", "create", "replace", "patch", "applyDiff",
  "writeFile", "write_file", "fs_write", "put_file",
])

// Pattern 2 whitelist — only parse JSON under keys likely to hold JSON payloads
const JSON_LIKELY_KEYS = new Set([
  "config", "data", "payload", "body", "params", "input",
  "metadata", "spec", "schema", "json", "args_object",
])

// Pattern 2 size guard — skip strings above this length to avoid wasted parse
const MAX_JSON_PARSE_LENGTH = 10_000

// ─── Repair patterns ────────────────────────────────────────────────

/**
 * Pattern 1 — Null / empty-object drop.
 * Strips keys whose value is null, undefined, or a bare {}.
 * Safe for optional params; required params will fail downstream anyway.
 */
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

/**
 * Pattern 2 — JSON-string parse.
 * Only parses whitelisted keys, skips large strings, and requires
 * the parsed result to be an object or array (not a primitive).
 */
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

/**
 * Pattern 3 — Bare-string markdown stripping.
 * Removes markdown link / inline-code formatting from string args.
 * Uses hoisted MD_LINK and MD_CODE constants (see bootstrap trap note above).
 */
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

/**
 * Pattern 4 — Single-object wrap.
 * If a singular value (not array) is given for a param whose name
 * suggests it should be an array (pluralised key, "list", "items", "array"),
 * wrap it in an array.
 */
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

// ─── Session ID helper for logging ──────────────────────────────────
function shortSessionId(input: { sessionID?: string }): string {
  return input.sessionID ? input.sessionID.slice(0, 8) : "no_session"
}

// ─── Plugin hooks ───────────────────────────────────────────────────

const plugin: Plugin = async () => {
  // Reset stats per session (module is cached, but this runs once per start)
  toolStats.clear()

  return {
    /**
     * BEFORE tool execution — intercept and repair malformed args.
     */
    "tool.execute.before": async (input, output) => {
      const shortId = shortSessionId(input)
      try {
        if (!isHarnessEnabled()) return
        const tool = input.tool
        const args = output.args as Record<string, unknown>
        if (!args || typeof args !== "object" || Array.isArray(args)) return

        const stat = getStat(input.sessionID || "_no_session", tool)
        // Reset per-call flag (read by after-hook)
        stat.lastCallRepaired = false

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
          stat.lastCallRepaired = true
        }

        // Auto-disable if repair rate is below threshold and enough calls
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

    /**
     * AFTER tool execution — append repair hint so model learns.
     */
    "tool.execute.after": async (input, output) => {
      const shortId = shortSessionId(input)
      try {
        if (!isHarnessEnabled()) return
        const tool = input.tool
        const stat = getStat(input.sessionID || "_no_session", tool)

        // Only add hint if THIS call was repaired (flag set in before-hook).
        if (stat.lastCallRepaired && typeof output.output === "string") {
          const trimmed = output.output.trimStart()
          if (trimmed.startsWith("{") || trimmed.startsWith("[")) return
          // Append a lightweight hint (CommandCode calls this "save them then explain")
          const hint = `\n\n[repair-hint: fixed malformed args for "${tool}" — check tool schema for correct format]`
          output.output += hint
        }
      } catch (err) {
        console.error("[repair-harness " + shortId + "] after-hook error:", err)
      }
    },
  }
}

export default plugin
