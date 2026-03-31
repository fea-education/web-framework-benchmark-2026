# `qwik` — QwikCity, all four pages

**Type:** AFK
**Blocked by:** Slices 02, 03, 04

---

## What to build

Implement the `qwik` framework application: QwikCity with Qwik's resumability model for optimal Time-to-Interactive.

Specifically:

- `packages/qwik/` as a pnpm workspace package
- All four e-commerce pages:
  - **Product listing** — SSG via QwikCity static generation (`staticGenerate`)
  - **Product detail** (`/products/[id]`) — SSR via QwikCity `routeLoader$`
  - **Category/filter** (`/filter`) — CSR-equivalent using Qwik resumability; `useSignal` / `useStore` for filter state (category, price range, rating); no full JS bundle download — Qwik's lazy-loading model applies
  - **Cart** (`/cart`) — CSR-equivalent using `useStore` for cart state; add, remove, and quantity update
- Qwik's built-in image optimisation (`<Image>` from `@unpic/qwik` or Qwik's native image component)
- Tailwind v4 extending the shared root config
- All pages fetch from the shared API
- `STRATEGY.md` documenting the rendering strategy per page and explaining the resumability model and how it differs from traditional hydration
- Best-practices checklist for QwikCity satisfied (loaders used for server data, no unnecessary eagerly-loaded code, resumability boundary documented)
- `Dockerfile` (multi-stage production build) replacing the stub service in `docker-compose.yml`

## Acceptance criteria

- All four pages render correctly against the running shared API
- Product listing is statically generated
- Product detail is server-rendered; TTFB reflects API latency
- Category/filter page supports filtering by category, price range, and rating using Qwik reactive primitives
- Cart supports add, remove, and quantity update
- Image optimisation component is used for all product images
- `STRATEGY.md` is present and explains the resumability approach
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
