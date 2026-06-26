---
name: nuxt4-patterns (reference)
description: Code examples for Nuxt 4 data fetching, route rules, and lazy loading.
---

# Nuxt 4 Patterns — Reference

## Data Fetching Example

```ts
const route = useRoute()

const { data: article, status, error, refresh } = await useAsyncData(
  () => `article:${route.params.slug}`,
  () => $fetch(`/api/articles/${route.params.slug}`),
)

const { data: comments } = await useFetch(`/api/articles/${route.params.slug}/comments`, {
  lazy: true,
  server: false,
})
```

## Route Rules

Prefer `routeRules` in `nuxt.config.ts` for rendering and caching strategy:

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/products/**': { swr: 3600 },
    '/blog/**': { isr: true },
    '/admin/**': { ssr: false },
    '/api/**': { cache: { maxAge: 60 * 60 } },
  },
})
```

- `prerender`: static HTML at build time
- `swr`: serve cached content and revalidate in the background
- `isr`: incremental static regeneration on supported platforms
- `ssr: false`: client-rendered route
- `cache` or `redirect`: Nitro-level response behavior

Pick route rules per route group, not globally. Marketing pages, catalogs, dashboards,
and APIs usually need different strategies.

## Lazy Loading

```vue
<template>
  <LazyRecommendations v-if="showRecommendations" />
  <LazyProductGallery hydrate-on-visible />
</template>
```

- Nuxt already code-splits pages by route. Keep route boundaries meaningful before
  micro-optimizing component splits.
- Use the `Lazy` prefix to dynamically import non-critical components.
- Conditionally render lazy components with `v-if` so the chunk is not loaded until
  the UI actually needs it.
- Use lazy hydration for below-the-fold or non-critical interactive UI.
- For custom strategies, use `defineLazyHydrationComponent()` with a visibility or
  idle strategy.
- Nuxt lazy hydration works on single-file components. Passing new props to a lazily
  hydrated component will trigger hydration immediately.
- Use `NuxtLink` for internal navigation so Nuxt can prefetch route components and
  generated payloads.
