# Rendering Strategy — Next.js App Router

## Page-by-page decisions

### Product Listing (`/`)
**Mode:** Static Site Generation (SSG)

**Rationale:**
The product catalogue does not change at runtime during benchmarking. Generating the listing page at build time (`export const dynamic = "force-static"`) means the HTML is pre-rendered once, served immediately from the Node.js standalone server with zero per-request compute. This produces the lowest possible TTFB and is idiomatic Next.js App Router behaviour for static data.

### Product Detail (`/products/[id]`)
**Mode:** Server-Side Rendering (SSR) with React Streaming

**Rationale:**
Product detail pages must reflect the current `LATENCY_MS` setting to exercise the benchmark's latency presets. Using `export const dynamic = "force-dynamic"` with an RSC async component means every request hits the API server and streams HTML back to the client as soon as the shell is ready (via React `<Suspense>`). The TTFB therefore accurately mirrors the API latency, which is exactly what the benchmark measures.

### Category / Filter (`/filter`)
**Mode:** Client-Side Rendering (CSR)

**Rationale:**
Filtering by category, price range, and rating requires immediate, interactive feedback without round-trips to the server. The page uses `"use client"` to load all products once on mount (`useEffect + fetch`) and then filters/sorts entirely in the browser. This produces zero re-fetches during interaction and is the correct pattern for a faceted-search experience. The initial data load is observable in the benchmark as a hydration+fetch latency cost.

### Cart (`/cart`)
**Mode:** Client-Side Rendering (CSR) with local React state

**Rationale:**
Cart state (add, remove, quantity update) is ephemeral per-session and requires zero server interaction. Using `"use client"` with `useState` is the minimal correct solution: it avoids a database, avoids a context provider, and keeps the benchmark focused on rendering performance rather than state-management overhead. The cart page fetches individual products from the API when adding by ID, which tests a single-product API call.

## Key Next.js App Router patterns used

- RSC for data fetching (listing and detail pages)
- `"use client"` boundary only for interactive pages (filter, cart)
- `next/image` for all product images (automatic optimisation, lazy loading)
- `Suspense` + streaming for the product detail page
- `output: "standalone"` for minimal Docker image
- Tailwind v4 via `@tailwindcss/postcss` (CSS-first, no JS config)
