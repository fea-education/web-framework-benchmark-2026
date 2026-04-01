# `astro-solid` — Astro with SolidJS islands, all four pages

**Type:** AFK
**Blocked by:** Slices 02, 03, 04

---

## What to build

Implement the `astro-solid` framework application: Astro with SolidJS as the island runtime for all interactive components. This app is the direct counterpart to `astro-vanilla` (slice 10) — the only difference is replacing vanilla JS islands with SolidJS components — and one side of the `astro-solid` vs `solidstart` comparison.

Specifically:

- `packages/astro-solid/` as a pnpm workspace package
- All four e-commerce pages:
  - **Product listing** — SSG (Astro static output); data fetched at build time
  - **Product detail** (`/products/[id]`) — SSG with `getStaticPaths`
  - **Category/filter** (`/filter`) — SolidJS island (`client:load` or `client:visible`); reactive filtering by category, price range, and rating using Solid signals/stores
  - **Cart** (`/cart`) — SolidJS island; add, remove, and quantity update using Solid reactive state
- `@astrojs/solid-js` integration
- `astro:assets` `<Image>` component for all product images
- Tailwind v4 extending the shared root config
- All pages fetch from the shared API
- `STRATEGY.md` documenting the rendering strategy per page and the rationale for SolidJS as the island choice
- Best-practices checklist for Astro + SolidJS satisfied (island hydration directives used correctly, no over-hydration of static content)
- `Dockerfile` (multi-stage production build) replacing the stub service in `docker-compose.yml`

See PRD user stories 17 and 29 for the comparison rationale.

## Acceptance criteria

- All four pages render correctly against the running shared API
- Product listing and detail are statically generated
- Category/filter page uses SolidJS reactive signals for client-side filtering
- Cart uses SolidJS reactive state; supports add, remove, and quantity update
- `astro:assets` `<Image>` is used for all product images
- `STRATEGY.md` is present and documents the SolidJS island approach
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
- User story 17
- User story 18
- User story 29
