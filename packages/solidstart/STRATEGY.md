# SolidStart Rendering Strategy

## Framework: SolidStart v1 (with Vinxi)

## Page Rendering Decisions

### `/` — Product Listing
**Mode:** SSR with server-side data preloading via `createAsync` + `cache`

SolidStart v1 uses `createAsync` + `cache` for idiomatic data fetching. The `route.preload` hook is used to trigger the data fetch during navigation, and `"use server"` ensures the fetch runs server-side only. This gives fast initial HTML with all 100 products rendered on the server.

### `/products/[id]` — Product Detail
**Mode:** SSR via `createAsync` + `cache` (server-side fetch with `"use server"`)

Each product detail page fetches the individual product server-side, streaming the response. The `route.preload` hook preloads during navigation.

### `/filter` — Category/Filter Page
**Mode:** CSR using Solid `createSignal` + `createMemo`

Products are fetched client-side on `onMount`. Filter state (category checkboxes, price range sliders, rating slider, sort key) is managed with `createSignal`. Computed filtered+sorted list is a `createMemo` for efficient reactive updates without redundant recomputation.

### `/cart` — Shopping Cart
**Mode:** CSR using Solid `createStore` (from `solid-js/store`)

Cart state uses `createStore` with `produce` for granular, immutable-style mutations. Product list is fetched client-side to populate the "Add Products" section. Cart supports add, quantity increment/decrement, and remove.

## Image Optimisation
Standard `<img>` tags with explicit `width` and `height` attributes and `loading="lazy"` for below-fold images. The SolidStart ecosystem doesn't bundle a native image optimisation component comparable to Next.js `Image`; `@unpic/solid` was considered but standard img with explicit dimensions achieves the same layout-shift prevention.

## Tailwind v4
Integrated via `@tailwindcss/vite` plugin in `app.config.ts`. CSS imported via `@import "tailwindcss"` in `src/global.css`, which is imported in `src/app.tsx`.
