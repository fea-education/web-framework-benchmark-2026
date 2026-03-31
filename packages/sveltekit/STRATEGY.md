# SvelteKit Rendering Strategy

## Package: @benchmark/sveltekit

This SvelteKit application implements four pages using the optimal rendering strategy for each use case.

## Page Rendering Strategies

### 1. Product Listing (`/`) — SSG (Static Site Generation)
- **File:** `src/routes/+page.ts` + `src/routes/+page.svelte`
- **Strategy:** `export const prerender = true` in the load file
- **Rationale:** The product catalogue is static fixture data that doesn't change at runtime. Pre-rendering at build time produces zero-latency HTML delivery from the CDN/edge, with no per-request server work. SvelteKit's prerender flag runs the `load` function at build time and bakes the result into static HTML.

### 2. Product Detail (`/products/[id]`) — SSR (Server-Side Rendering)
- **File:** `src/routes/products/[id]/+page.server.ts` + `+page.svelte`
- **Strategy:** `+page.server.ts` with a `load` function that fetches from the API on every request
- **Rationale:** Dynamic routes with unique IDs benefit from SSR to return fully-rendered HTML with correct OG meta tags and product data for each URL. The server load function uses `process.env.API_URL` to reach the shared API, enabling proper latency simulation.

### 3. Category/Filter (`/filter`) — CSR (Client-Side Rendering)
- **File:** `src/routes/filter/+page.svelte`
- **Strategy:** Full CSR using Svelte `writable` stores for filter state and `onMount` for data fetching
- **Rationale:** Filtering requires instant UI responsiveness as the user adjusts sliders and dropdowns. Loading all products once on the client and filtering in-memory gives sub-millisecond filter latency with no round-trips. Svelte stores (`writable`, `derived`) are the idiomatic reactive primitives for this pattern.
- **Filters:** Category (dropdown), min/max price (range sliders), minimum rating (range slider)

### 4. Cart (`/cart`) — CSR (Client-Side State)
- **File:** `src/routes/cart/+page.svelte`
- **Strategy:** Full CSR using a Svelte `writable` store for cart items
- **Rationale:** Cart state is inherently client-side (no persistence layer in this benchmark). Svelte stores provide reactive, synchronous state updates with no server round-trips — add, remove, and quantity changes are instant. The store pattern also makes cart state shareable across components if needed.
- **Operations:** Add to cart, remove item, increment/decrement quantity, order total calculation

## Image Optimisation

Standard `<img>` elements with explicit `width` and `height` attributes are used to prevent layout shift (CLS). Images are served from `picsum.photos` with appropriate dimensions. The `loading="lazy"` attribute is applied to below-fold images for improved initial page load.

## Tailwind v4

- Uses `@tailwindcss/vite` plugin — no PostCSS config required
- `src/app.css` imports `tailwindcss` directly
- Root layout imports `app.css` once; Tailwind styles cascade to all routes

## API Configuration

- Docker: `API_URL` environment variable (defaults to `http://api:3000`)
- Local dev: Falls back to `http://localhost:3000`
- Server-side pages use `process.env.API_URL`
- Client-side pages use `import.meta.env.VITE_API_URL`
