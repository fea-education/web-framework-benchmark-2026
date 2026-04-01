# `nextjs-app` — Next.js App Router, all four pages

**Type:** AFK
**Blocked by:** Slices 02, 03, 04

---

## What to build

Implement the `nextjs-app` framework application: Next.js App Router with React Server Components. This is the first full end-to-end framework app and serves as the reference implementation pattern for all subsequent apps.

Specifically:

- `packages/nextjs-app/` as a pnpm workspace package
- All four e-commerce pages using idiomatic App Router + RSC patterns:
  - **Product listing** — SSG via `generateStaticParams` / static segment; fetches from shared API at build time
  - **Product detail** (`/products/[id]`) — SSR via RSC fetch (per-request); streams response
  - **Category/filter** (`/filter`) — CSR client component; fetches product list, supports client-side filtering by category, price range, and rating
  - **Cart** (`/cart`) — CSR client component; supports add, remove, and quantity update operations
- `next/image` used for all product images
- Tailwind v4 installed and extending the shared root config (slice 03)
- All pages fetch from the shared API (`packages/api`) using the Docker service name in production
- `STRATEGY.md` at package root documenting the rendering strategy chosen per page and rationale
- Best-practices checklist for Next.js App Router satisfied (RSC for data fetching, client components only where interactivity is required, no unnecessary `"use client"` boundaries)
- `Dockerfile` (multi-stage production build) replacing the stub service in `docker-compose.yml`

See PRD §"Framework Apps" and §"Implementation Decisions" for full spec.

## Acceptance criteria

- All four pages render correctly against the running shared API
- Product listing is statically generated at build time
- Product detail is server-rendered per request; TTFB reflects API latency when `LATENCY_MS` is set
- Category/filter page supports filtering by category, price range, and rating client-side
- Cart supports add, remove, and quantity update without a page reload
- `next/image` is used for all product image elements
- `STRATEGY.md` is present and documents the rendering mode for each page
- `docker compose up` starts the app from a production build (not dev server)
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
- User story 16
- User story 18
