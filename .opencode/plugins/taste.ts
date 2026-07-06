import type { Plugin, PluginInput } from "@opencode-ai/plugin"
import type { Preference } from "./internal/taste-helpers"
import {
  extractPreferences,
  mergePreference,
  formatPreferences,
  applyKLFilter,
  persistPreference,
} from "./internal/taste-helpers"

// Session state

interface SessionState {
  prefs: Map<string, Preference>
  project: string
  /** Skip redundant ov add-memory */
  persistedKeys: Set<string>
  lastFlush: number
}

// Per-session store

const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24h
const MAX_SESSIONS = 50
const PERSIST_INTERVAL_MS = 60_000

const sessionStore = new Map<string, SessionState>()

function getOrCreateSession(sessionID: string, project: string): SessionState {
  let state = sessionStore.get(sessionID)
  if (!state) {
    // Evict oldest session if at capacity
    if (sessionStore.size >= MAX_SESSIONS) {
      const oldest = sessionStore.keys().next().value
      if (oldest) sessionStore.delete(oldest)
    }
    state = { prefs: new Map(), project, persistedKeys: new Set(), lastFlush: 0 }
    sessionStore.set(sessionID, state)
  }
  return state
}

/** Flush new preferences to OpenViking (skips already-persisted). */
async function flushPending(sessionID: string): Promise<void> {
  const state = sessionStore.get(sessionID)
  if (!state || state.prefs.size === 0) return

  const sorted = [...state.prefs.values()].sort((a, b) => b.confidence - a.confidence)
  const filtered = applyKLFilter(sorted)

  let persistedCount = 0
  for (const pref of filtered) {
    const key = pref.text.toLowerCase().replace(/\s+/g, " ")
    // Skip if already persisted (dedup)
    if (state.persistedKeys.has(key)) continue
    const ok = await persistPreference(state.project, pref)
    if (ok) {
      state.persistedKeys.add(key)
      persistedCount++
    }
  }

  state.lastFlush = Date.now()

  if (persistedCount > 0) {
    console.log("[taste] persisted " + persistedCount + " new preference(s) for " + sessionID)
  }
}

/** Remove stale sessions (older than TTL). */
function evictStaleSessions(): void {
  const cutoff = Date.now() - SESSION_TTL_MS
  for (const [sid, state] of sessionStore.entries()) {
    if (state.lastFlush > 0 && state.lastFlush < cutoff) {
      sessionStore.delete(sid)
    }
  }
}

// Module-level flush timer

let flushTimer: ReturnType<typeof setInterval> | null = null

// Plugin

const plugin: Plugin = async (_input: PluginInput) => {
  const project = (_input.directory || "").split("/").pop() || "unknown"

  // Start periodic flush + eviction timer
  if (!flushTimer) {
    flushTimer = setInterval(() => {
      evictStaleSessions()
      for (const [sid] of sessionStore.entries()) {
        void flushPending(sid)
      }
    }, PERSIST_INTERVAL_MS)
  }

  return {
    "chat.message": async (
      msgInput: Record<string, unknown>,
      output: { message: { role?: string; content?: string }; parts: unknown[] },
    ) => {
      const message = output.message
      if (!message || message.role !== "user") return
      const text = message.content || ""
      if (text.length < 10) return

      const sessionID = (msgInput.sessionID as string) || "default"
      const state = getOrCreateSession(sessionID, project)

      const extracted = extractPreferences(text)
      for (const pref of extracted) {
        mergePreference(state.prefs, pref)
      }
    },

    "experimental.chat.system.transform": async (
      _input: Record<string, unknown>,
      output: { system: string[] },
    ) => {
      const sessionID = (_input.sessionID as string) || "default"
      const state = sessionStore.get(sessionID)
      if (!state || state.prefs.size === 0) return

      const formatted = formatPreferences([...state.prefs.values()])
      if (!formatted) return

      if (!output.system[0]) output.system[0] = ""
      output.system[0] += "\n\n" + formatted
    },
  }
}

export default plugin
