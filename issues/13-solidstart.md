# `solidstart` — SolidStart, all four pages

**Type:** AFK
**Blocked by:** Slices 02, 03, 04

---

## What to build

Implement the `solidstart` framework application: SolidStart (SolidJS meta-framework) using fine-grained reactivity for CSR and SolidStart's SSR/SSG primitives for server-rendered pages. This app enables the SolidJS island (astro-solid) vs full meta-framework (solidstart) comparison and provides the first controlled lab data for SolidStart's SSR/SSG performance.

Specifically:

- `packages/solidstart/` as a pnpm workspace package
- All four e-commerce pages:
  - **Product listing** — SSG via SolidStart's `prerender` / static generation config
  - **Product detail** (`/products/[id]`) — SSR via SolidStart's `createServerData$` or `cache` + `createAsync` (whichever is idiomatic in the current stable release)
  - **Category/filter** (`/filter`) — CSR; Solid signals and stores for reactive client-side filtering by category, price range, and rating
  - **Cart** (`/cart`) — CSR; Solid store for cart state; add, remove, and quantity update
- Image optimisation via `@unpic/solid` or the idiomatic SolidStart image solution
- Tailwind v4 extending the shared root config
- All pages fetch from the shared API
- `STRATEGY.md` documenting the rendering strategy per page and the rationale for choosing SolidStart's server primitives
- Best-practices checklist for SolidStart satisfied (server data primitives used for SSR/SSG, fine-grained reactivity for CSR, no unnecessary re-renders)
- `Dockerfile` (multi-stage production build) replacing the stub service in `docker-compose.yml`

See PRD user stories 28 and 29 for the comparison rationale. Note from PRD: SolidStart has no real-world CrUX data — this benchmark begins to fill that gap with controlled lab data.

## Acceptance criteria

- All four pages render correctly against the running shared API
- Product listing is statically generated
- Product detail is server-rendered; TTFB reflects API latency
- Category/filter page supports client-side filtering by category, price range, and rating using Solid reactive primitives
- Cart supports add, remove, and quantity update without a page reload
- Image optimisation component is used for all product images
- `STRATEGY.md` is present and explains the fine-grained reactivity and SSR/SSG approach
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
- User story 28
- User story 29
