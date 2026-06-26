---
name: vite-patterns
description: Use only when configuring Vite builds: plugin setup, environment handling, SSR, code splitting, proxy configuration, and production optimization.
---

# Vite Patterns

Adapted from ECC's `vite-patterns` skill (MIT).

Build tool and dev server patterns for Vite 8+ projects. Covers configuration, environment variables, proxy setup, library mode, dependency pre-bundling, and common production pitfalls.

## When to Use

- Configuring `vite.config.ts` or `vite.config.js`
- Setting up environment variables or `.env` files
- Configuring dev server proxy for API backends
- Optimizing build output (chunks, minification, assets)
- Publishing libraries with `build.lib`
- Troubleshooting dependency pre-bundling or CJS/ESM interop
- Debugging HMR, dev server, or build errors
- Choosing or ordering Vite plugins

For full patterns, examples, and anti-patterns, see [REFERENCE.md](REFERENCE.md).

## When to Use

- Configuring `vite.config.ts` or `vite.config.js`
- Setting up environment variables or `.env` files
- Configuring dev server proxy for API backends
- Optimizing build output (chunks, minification, assets)
- Publishing libraries with `build.lib`
- Troubleshooting dependency pre-bundling or CJS/ESM interop
- Debugging HMR, dev server, or build errors
- Choosing or ordering Vite plugins

## How It Works

Dev mode serves source files as native ESM. Build mode uses Rolldown (v7+) or Rollup (v5–v6). Deps are pre-bundled via esbuild.

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Config](REFERENCE.md#config-structure) | Basic/conditional config, key options |
| [Plugins](REFERENCE.md#plugins) | Essential plugin table, authoring custom |
| [HMR API](REFERENCE.md#hmr-api) | import.meta.hot patterns |
| [Env Vars](REFERENCE.md#environment-variables) | Loading order, client access |
| [Security](REFERENCE.md#security) | VITE_ prefix limits, loadEnv trap, sourcemaps |
| [Server Proxy](REFERENCE.md#server-proxy) | Proxy configuration, WebSocket |
| [Build Optimization](REFERENCE.md#build-optimization) | manualChunks, library mode |
| [Performance](REFERENCE.md#performance) | Barrel files, warmup, profiling |
| [SSR & Deps](REFERENCE.md#ssr-externals) | SSR config, pre-bundling |
| [Pitfalls](REFERENCE.md#common-pitfalls) | Dev/build mismatch, Docker, monorepo |
| [Anti-Patterns](REFERENCE.md#anti-patterns) | Code + process anti-patterns |
| [Quick Reference](REFERENCE.md#quick-reference) | Pattern table |
