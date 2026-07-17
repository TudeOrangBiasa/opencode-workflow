# Vite Patterns — Reference

> Full patterns and examples. See SKILL.md for when-to-use.

## Config Structure

Basic config with defineConfig, conditional config with mode/command, key options table (root, base, envPrefix, build.outDir, build.minify, build.sourcemap).

## Plugins

Essential plugin table: @vitejs/plugin-react-swc, @vitejs/plugin-vue, vite-plugin-checker, vite-tsconfig-paths, vite-plugin-dts, etc.

Custom plugins: inline in vite.config.ts, key hooks (transform, resolveId, load, configureServer, hotUpdate).

## HMR API

import.meta.hot: data persistence, dispose cleanup, accept. Tree-shaken in production.

## Environment Variables

Loading order: .env → .env.local → .env.[mode] → .env.[mode].local. Client access via import.meta.env.VITE_*.

## Security

VITE_ prefix is NOT a security boundary (inlined into client bundle). loadEnv('') trap exposes all env vars. Source maps in production.

## Server Proxy

server.proxy for API routing, WebSocket support with ws: true.

## Build Optimization

manualChunks (object form for grouping, function form for heuristic). Rollup/Rolldown options.

## Performance

Avoid barrel files (#1 slowdown), explicit import extensions (saves filesystem checks), server.warmup.clientFiles, vite --profile for slow dev server.

## Library Mode

build.lib with formats, externalized peer deps, vite-plugin-dts for types.

## SSR

ssr.external and ssr.noExternal for dependency handling.

## Dependency Pre-Bundling

optimizeDeps.include/.exclude/.force for CJS/ESM interop.

## Common Pitfalls

Dev does not match build (esbuild vs Rolldown), stale chunks after deployment, Docker binding (host: true), monorepo file access (server.fs.allow).

## Anti-Patterns

envPrefix: '', require() in ESM, one chunk per package (too many files), not externalizing peers in library mode, deprecated esbuild minifier, vite preview as prod server, expecting type-check from vite build.
