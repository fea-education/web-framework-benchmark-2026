# `sveltekit` — SvelteKit, all four pages

**Type:** AFK
**Blocked by:** Slices 02, 03, 04

---

## What to build

Implement the `sveltekit` framework application: SvelteKit using idiomatic rendering strategies per page.

Specifically:

- `packages/sveltekit/` as a pnpm workspace package
- All four e-commerce pages:
  - **Product listing** — SSG via `export const prerender = true` in the route's `+page.ts`
  - **Product detail** (`/products/[id]`) — SSR via SvelteKit `load` function in `+page.server.ts`
  - **Category/filter** (`/filter`) — CSR; Svelte stores for filter state; client-side filtering by category, price range, and rating
  - **Cart** (`/cart`) — CSR; Svelte writable store for cart state; add, remove, and quantity update
- `@sveltejs/enhanced-img` or equivalent for image optimisation
- Tailwind v4 installed and extending the shared root config
- All pages fetch from the shared API
- `STRATEGY.md` documenting the rendering strategy per page
- Best-practices checklist for SvelteKit satisfied (no unnecessary client-side hydration, `load` used for SSR/SSG data, stores scoped correctly)
- `Dockerfile` (multi-stage production build) replacing the stub service in `docker-compose.yml`

## Acceptance criteria

- All four pages render correctly against the running shared API
- Product listing is statically prerendered at build time
- Product detail is server-rendered; TTFB reflects API latency
- Category/filter page supports client-side filtering by category, price range, and rating
- Cart supports add, remove, and quantity update without a page reload
- Image optimisation component is used for product images
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
