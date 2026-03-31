# Nuxt 3 — Rendering Strategy

## Overview

This Nuxt 3 application uses idiomatic per-page rendering strategies to optimise for performance and user experience in each context.

## Page-by-page strategy

### Product Listing (`/`)
**Strategy: SSG (Static Site Generation / Prerendering)**

- Uses `definePageMeta({ prerender: true })` combined with `routeRules: { '/': { prerender: true } }` in `nuxt.config.ts`
- `useFetch` fetches data from the shared API at build time
- The page is pre-rendered to static HTML — zero server-side work per request at runtime
- **Rationale:** 100 products that rarely change. SSG delivers the fastest possible TTFB (served from CDN/file system) and best Lighthouse scores.

### Product Detail (`/products/[id]`)
**Strategy: SSR (Server-Side Rendering)**

- Uses `useFetch` in a standard server-rendered Nuxt page
- Each product detail page is rendered on-demand by the Nuxt server
- Full API latency is reflected in TTFB, matching the benchmark's intent to measure SSR performance under latency
- **Rationale:** 100 unique dynamic routes with content that can vary; SSR ensures always-fresh data and correct HTTP caching semantics.

### Category/Filter (`/filter`)
**Strategy: CSR (Client-Side Rendering)**

- Uses `definePageMeta({ ssr: false })` to opt out of server rendering
- Pinia store (`stores/filter.ts`) holds all filter state: selected category, price range (min/max), and rating threshold
- Filtering is computed client-side via a Pinia getter — no network round-trips per filter interaction
- Data is fetched once on mount via `$fetch`
- **Rationale:** Interactive filtering requires instant feedback. CSR with Pinia eliminates SSR hydration overhead and allows direct DOM event handling.

### Cart (`/cart`)
**Strategy: CSR (Client-Side Rendering)**

- Uses `definePageMeta({ ssr: false })` to opt out of server rendering
- Pinia store (`stores/cart.ts`) manages cart state: items, quantities, add/remove/update operations
- All mutations are synchronous and reactive — no network calls required for cart operations
- **Rationale:** Cart state is inherently client-local per session. Pinia provides reactive, type-safe state with no server round-trips.

## Image optimisation

`<NuxtImg>` from `@nuxt/image` is used on all product image displays. This provides:
- Automatic lazy loading
- Responsive `srcset` generation
- Width/height hints to reduce layout shift (CLS)
- Integration with Nuxt's image optimisation pipeline

## Tailwind v4

Configured via `@tailwindcss/vite` Vite plugin. The app's CSS entry point (`assets/css/main.css`) imports the shared root `tailwind.css` which contains all design tokens and the `@import "tailwindcss"` directive. No separate JS config file is needed.

## State management

Pinia is used for all client state (filter parameters and cart). No Vuex. Stores are typed with TypeScript interfaces.
