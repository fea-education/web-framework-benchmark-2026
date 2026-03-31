# Rendering Strategy — astro-solid

## Overview

This application uses **Astro** as the framework with **SolidJS** as the island runtime for interactive components. Astro's islands architecture ensures maximum static delivery with minimal JavaScript — only the interactive components ship JS to the browser.

## Per-page Strategy

### Product Listing (`/`)
**Mode: SSG (Static Site Generation)**

- Fetches all 100 products from the shared API at **build time** using `fetch()` in the Astro frontmatter
- Generates a fully static HTML page — zero JavaScript for the listing grid
- Uses `astro:assets` `<Image>` component for optimised, responsive images with automatic `width`/`height` inference
- Rationale: Product listings are read-heavy and benefit from near-instant TTFB; SSG is optimal here

### Product Detail (`/products/[id]`)
**Mode: SSG with `getStaticPaths()`**

- Fetches all products at build time and generates one static page per product
- `getStaticPaths()` produces 100 routes from the API response
- Uses `astro:assets` `<Image>` for the product hero image
- No client-side JS — fully static HTML
- Rationale: Product pages are SEO-critical; pre-rendering all 100 pages is feasible at this scale

### Category/Filter (`/filter`)
**Mode: CSR via SolidJS island (`client:load`)**

- The Astro shell is static; products are fetched at build time and passed as props to the island
- The SolidJS `FilterPage` component runs entirely in the browser using reactive signals and memos
- Filters: category select, price range (min/max sliders), minimum rating slider, text search
- SolidJS `createSignal`, `createMemo`, `For`, `Show` are used — no virtual DOM diffing; fine-grained reactivity
- Rationale: Filtering requires immediate client-side reactivity. SolidJS islands avoid shipping a full framework bundle — only the island code hydrates

### Cart (`/cart`)
**Mode: CSR via SolidJS island (`client:load`)**

- The Astro shell is static; sample products (from API at build time) are passed as props
- The SolidJS `CartPage` component manages cart state with `createStore` + `produce` for immutable updates
- Operations: add product, remove product, update quantity, clear cart
- Reactive totals computed via `createMemo`
- Rationale: Cart is inherently client-only state. SolidJS stores provide efficient fine-grained reactivity without prop drilling or context overhead

## Why SolidJS for Islands?

1. **Bundle size**: SolidJS compiles to direct DOM operations (~7KB min+gzip) — smaller than React (~45KB) and comparable to Preact
2. **No virtual DOM**: Fine-grained reactivity means only the exact DOM nodes that change are updated — ideal for filter/cart interactions
3. **Astro compatibility**: `@astrojs/solid-js` integration is first-class; islands hydrate correctly with `client:load`
4. **TypeScript**: Full TSX support with strict typing
5. **Benchmark comparison**: This app is the direct counterpart to `astro-vanilla` (vanilla JS islands) and one side of the `astro-solid` vs `solidstart` comparison — isolating the island vs full-framework overhead
