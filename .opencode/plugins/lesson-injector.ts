import type { Plugin, PluginInput } from "@opencode-ai/plugin"
import { SessionCache, findLessonsViaOpenViking, fetchAndInjectLessons } from "./internal/lesson-injector-helpers"

// Plugin hook

const plugin: Plugin = async (input: PluginInput) => {
  const project = input.directory.split("/").pop() || "unknown"

  return {
    "experimental.chat.system.transform": async (_input, output) => {
      await fetchAndInjectLessons(
        _input.sessionID || "global",
        project,
        SessionCache,
        output.system,
        findLessonsViaOpenViking,
      )
    },
  }
}

export default plugin
