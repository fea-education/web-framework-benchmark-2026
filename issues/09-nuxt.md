# `nuxt` — Nuxt 3, all four pages

**Type:** AFK
**Blocked by:** Slices 02, 03, 04

---

## What to build

Implement the `nuxt` framework application: Nuxt 3 using idiomatic rendering strategies per page.

Specifically:

- `packages/nuxt/` as a pnpm workspace package
- All four e-commerce pages:
  - **Product listing** — SSG via `routeRules` prerender or `definePageMeta({ prerender: true })`
  - **Product detail** (`/products/[id]`) — SSR via `useFetch` in a server-rendered page component
  - **Category/filter** (`/filter`) — CSR; Pinia store for filter state; client-side filtering by category, price range, and rating
  - **Cart** (`/cart`) — CSR; Pinia store for cart state; add, remove, and quantity update
- `@nuxt/image` for image optimisation (`<NuxtImg>` component)
- Tailwind v4 installed and extending the shared root config (via `@nuxtjs/tailwindcss` or direct PostCSS integration)
- All pages fetch from the shared API
- `STRATEGY.md` documenting the rendering strategy per page
- Best-practices checklist for Nuxt 3 satisfied (`useFetch` for SSR data, Pinia for client state, no Vuex, no unnecessary SSR on CSR pages)
- `Dockerfile` (multi-stage production build) replacing the stub service in `docker-compose.yml`

## Acceptance criteria

- All four pages render correctly against the running shared API
- Product listing is statically prerendered at build time
- Product detail is server-rendered; TTFB reflects API latency
- Category/filter page supports client-side filtering by category, price range, and rating using Pinia
- Cart supports add, remove, and quantity update without a page reload using Pinia
- `<NuxtImg>` is used for all product images
- `STRATEGY.md` is present
- `docker compose up` starts the app from a production build
- Tailwind v4 styles match the reference layouts from slice 03
- TypeScript builds with no errors

## Blocked by

- Blocked by slice 02 (shared API server)
- Blocked by slice 03 (shared Tailwind base config)
- Blocked by slice 04 (Docker Compose skeleton)

## User stories addressed

- User story 1
- User story 2
- User story 3
- User story 4
- User story 5
- User story 8
- User story 11
- User story 18
