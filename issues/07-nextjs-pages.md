# `nextjs-pages` — Next.js Pages Router, all four pages

**Type:** AFK
**Blocked by:** Slices 02, 03, 04

---

## What to build

Implement the `nextjs-pages` framework application: Next.js Pages Router. This app is the direct counterpart to `nextjs-app` (slice 06) and enables the App Router vs Pages Router side-by-side comparison.

Specifically:

- `packages/nextjs-pages/` as a pnpm workspace package
- All four e-commerce pages using idiomatic Pages Router patterns:
  - **Product listing** — SSG via `getStaticProps`
  - **Product detail** (`/products/[id]`) — SSR via `getServerSideProps`
  - **Category/filter** (`/filter`) — CSR; client-side filtering by category, price range, and rating using React state
  - **Cart** (`/cart`) — CSR; add, remove, and quantity update via React state
- `next/image` used for all product images
- Tailwind v4 installed and extending the shared root config
- All pages fetch from the shared API
- `STRATEGY.md` documenting the rendering strategy per page
- Best-practices checklist for Next.js Pages Router satisfied (`getStaticProps` / `getServerSideProps` for data, no mixing of App and Pages Router conventions)
- `Dockerfile` (multi-stage production build) replacing the stub service in `docker-compose.yml`

See PRD §"Framework Apps" and user story 16 for the comparison rationale.

## Acceptance criteria

- All four pages render correctly against the running shared API
- Product listing is statically generated via `getStaticProps`
- Product detail is server-rendered via `getServerSideProps`; TTFB reflects API latency
- Category/filter page supports client-side filtering by category, price range, and rating
- Cart supports add, remove, and quantity update without a page reload
- `next/image` is used for all product image elements
- `STRATEGY.md` is present and documents the rendering mode for each page
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
- User story 16
- User story 18
