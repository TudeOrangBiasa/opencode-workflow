import type { Plugin } from "@opencode-ai/plugin"
import {
  repairNullDrop,
  repairJsonString,
  repairMarkdownString,
  repairSingleObjectWrap,
  isHarnessEnabled,
  getStat,
  toolStats,
} from "./internal/repair-harness-helpers"

/** Intercepts malformed tool args. 4 patterns: null drop, JSON parse, markdown strip, array wrap. */

const THRESHOLD_RATE = 0.02   // auto-disable if repair rate below 2%
const THRESHOLD_MIN_CALLS = 100  // minimum calls before considering disable

// Tools that write content to disk — skip pattern 3 to preserve code
const DISK_WRITE_TOOLS = new Set([
  "write", "edit", "create", "replace", "patch", "applyDiff",
  "writeFile", "write_file", "fs_write", "put_file",
])

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
      } catch (err) {
        console.error("[repair-harness " + shortId + "] before-hook error:", err)
      }
    },
  }
}

export default plugin
