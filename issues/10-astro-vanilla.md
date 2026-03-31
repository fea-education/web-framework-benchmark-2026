# `astro-vanilla` — Astro with zero client-side framework, all four pages

**Type:** AFK
**Blocked by:** Slices 02, 03, 04

---

## What to build

Implement the `astro-vanilla` framework application: Astro with no client-side framework — interactive islands use Web Components and/or vanilla JS only. This is the zero-JS baseline and one half of the Astro vanilla vs Astro+Solid comparison.

Specifically:

- `packages/astro-vanilla/` as a pnpm workspace package
- All four e-commerce pages:
  - **Product listing** — SSG (Astro's default static output); data fetched at build time in frontmatter
  - **Product detail** (`/products/[id]`) — SSG with `getStaticPaths`; if SSR is more appropriate, document in `STRATEGY.md`
  - **Category/filter** (`/filter`) — interactive island using a vanilla JS Web Component or plain `<script>` for client-side filtering by category, price range, and rating; no framework runtime
  - **Cart** (`/cart`) — interactive island using a vanilla JS Web Component or plain `<script>`; add, remove, and quantity update; no framework runtime
- `astro:assets` `<Image>` component for all product images
- Tailwind v4 via `@astrojs/tailwind` (or Astro v4 native CSS integration) extending the shared root config
- All pages fetch from the shared API (build-time fetch for static pages)
- `STRATEGY.md` documenting the rendering strategy per page and the rationale for choosing vanilla JS islands over a framework
- Best-practices checklist for Astro satisfied (zero client JS shipped on non-interactive pages, island isolation, no hydration on static content)
- `Dockerfile` (multi-stage production build) replacing the stub service in `docker-compose.yml`

See PRD user story 17 for the vanilla vs Astro+Solid comparison rationale.

## Acceptance criteria

- All four pages render correctly against the running shared API
- Product listing and detail are statically generated with no client-side framework JS shipped
- Category/filter page supports filtering by category, price range, and rating using only vanilla JS
- Cart supports add, remove, and quantity update using only vanilla JS
- `astro:assets` `<Image>` is used for all product images
- `STRATEGY.md` is present and explains the zero-framework island approach
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
