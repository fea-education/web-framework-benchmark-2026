# Astro Vanilla — Rendering Strategy

## Overview

This Astro application uses **zero client-side framework JS**. All interactivity is implemented using plain vanilla JavaScript `<script>` tags and the browser's native APIs. This is the "zero framework" baseline in the benchmark, designed to measure Astro's performance ceiling when no framework runtime is shipped to the client.

## Page-by-page Strategy

### Product Listing (`/`) — SSG

- **Mode:** Static Site Generation (Astro default)
- **Rationale:** Product data changes infrequently; SSG pre-renders 100 product cards at build time, resulting in zero TTFB overhead and maximum CDN cacheability.
- **Data fetching:** `fetch()` in frontmatter at build time against `http://api:3000/products?limit=100`
- **Images:** `astro:assets` `<Image>` component with `inferSize={false}` to optimise external picsum images
- **Client JS shipped:** None — fully static HTML

### Product Detail (`/products/[id]`) — SSG with `getStaticPaths()`

- **Mode:** Static Site Generation with `getStaticPaths()`
- **Rationale:** All 100 product pages are pre-rendered at build time, eliminating per-request server latency. The benchmark's `LATENCY_MS` variable affects the build time (a one-time cost) but not user-facing TTFB.
- **Data fetching:** `getStaticPaths()` fetches all products once and maps each to a static page. Props are passed directly — no second fetch per page.
- **Images:** `astro:assets` `<Image>` component
- **Client JS shipped:** Only a small inline `<script>` for "Add to Cart" localStorage interaction (~200 bytes, no framework runtime)

### Category / Filter (`/filter`) — CSR (Embedded JSON + Vanilla JS)

- **Mode:** Static shell with client-side filtering
- **Rationale:** Filtering must be interactive (category, price range, rating) but doesn't require a framework. Product data is embedded as a JSON blob in the static HTML at build time, so no client fetch is needed. The filtering logic runs entirely in a `<script>` tag.
- **Data fetching:** Build-time fetch in frontmatter; data is serialised to a JS variable via `define:vars`
- **Client JS shipped:** Inline `<script>` with filtering/rendering logic (~2 KB minified). No framework runtime.
- **Approach:** Products are embedded via `define:vars` and re-rendered into the DOM on each filter change using `innerHTML`. This avoids any virtual DOM overhead.

### Cart (`/cart`) — CSR (localStorage + Vanilla JS)

- **Mode:** Static shell with client-side state management
- **Rationale:** Cart state is inherently client-side (per-user, ephemeral). `localStorage` provides simple persistence without a backend. The cart UI renders from stored JSON on page load and re-renders on every mutation.
- **Client JS shipped:** Inline `<script>` with cart logic (~2 KB minified). No framework runtime.
- **Approach:** Cart reads/writes to `localStorage` under the key `cart`. Add-to-cart is triggered from the product detail page's inline script. The cart page renders items using `innerHTML` for maximum simplicity.

## Zero-Framework Island Approach

Astro's island architecture allows selective hydration. In this app:

- **Static pages (listing, detail):** No islands whatsoever — pure HTML/CSS served from a CDN
- **Interactive pages (filter, cart):** Single `<script>` tags that run once on page load; no hydration directives (`client:*`) needed because there are no framework components

This approach ships the absolute minimum JavaScript to the browser. The `<Image>` component from `astro:assets` handles image optimisation at build time (width/height attributes, lazy loading, format negotiation), requiring zero client-side JavaScript.

## Docker

The production build uses `output: 'static'` (Astro's default) and serves the `dist/` directory with the `serve` static file server on port 3000. No server-side runtime is required.

## Tailwind v4

Tailwind is integrated via `@tailwindcss/vite` as a Vite plugin. The global CSS imports `../../../../tailwind.css` (the shared root config) which provides the shared design tokens used across all benchmark apps.
