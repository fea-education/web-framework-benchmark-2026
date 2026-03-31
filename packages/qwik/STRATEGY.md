# Qwik (QwikCity) — Rendering Strategy

## Framework

QwikCity (Qwik's meta-framework for routing/SSR/SSG), with the `@builder.io/qwik-city/middleware/node` adapter for Express-based production serving.

## Page-by-page rendering decisions

| Page | Route | Rendering Mode | Rationale |
|------|-------|---------------|-----------|
| Product Listing | `/` | SSR via `routeLoader$` | Data is fetched server-side on every request using `routeLoader$`. In a benchmark context this gives accurate SSR metrics. Could be statically pre-rendered but SSR gives more realistic latency data under the LATENCY_MS sim. |
| Product Detail | `/products/[id]` | SSR via `routeLoader$` | Product data is fetched on the server per request (dynamic route). 404 handled server-side with `status(404)`. |
| Category/Filter | `/filter` | SSR load + CSR filter | All products are fetched once via `routeLoader$` (SSR). Client-side filtering is performed via Qwik `useSignal`/`useComputed$` — no additional network calls needed. Category, max price, and min rating filters are reactive. |
| Cart | `/cart` | CSR only | Cart state is managed entirely on the client via `useStore`. No server persistence. Users can add/remove/update quantities with instant UI response using Qwik's fine-grained reactivity. |

## Key technical choices

- **Resumability**: Qwik's core differentiator — components resume on the client without re-hydration, shipping near-zero JS to the browser by default.
- **`routeLoader$`**: Colocated server-side data loading that serialises data into the HTML stream — no separate API call on the client for SSR pages.
- **`useSignal` / `useComputed$`**: Qwik's signal-based reactivity for CSR state — fine-grained updates with no virtual DOM diffing.
- **`useStore`**: Mutable store for the cart, enabling add/remove/quantity mutations with minimal re-renders.
- **Tailwind v4**: Integrated via `@tailwindcss/vite` plugin — zero runtime CSS-in-JS overhead.
- **Standard `<img>` tags**: Used with explicit `width`/`height` attributes and `loading="lazy"` for the product grid.
- **Production server**: Express.js via `@builder.io/qwik-city/middleware/node`'s `createQwikCity` handler.

## Environment variables

- `VITE_API_URL`: API base URL (defaults to `http://localhost:3000` for local dev, set to `http://api:3000` in Docker via `--build-arg` or `ENV`).
- `PORT`: Server port (defaults to `3000`, mapped to `3007` in docker-compose).
