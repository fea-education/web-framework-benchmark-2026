---
title: "PRD: Web Framework Benchmark — E-Commerce Comparison Suite"
---

## Problem Statement

Existing web framework performance comparisons are either too narrow (CSR-only microbenchmarks), too broad (CrUX field data across all sites including unoptimised ones), or rely on synthetic workloads that don't reflect real e-commerce usage patterns.

Developers and engineering managers making framework decisions for e-commerce and content-heavy applications cannot currently compare **optimally-implemented** versions of the leading frameworks side-by-side, across all three rendering modes (SSG, SSR, CSR), under controlled and variable backend latency conditions.

The research report `web-framework-performance-complexity-2026.md` identifies specific gaps: no controlled ISR comparison, no real-world SolidStart production data, no framework comparison for AI-workload or streaming latency profiles, and no benchmark that measures a complete user journey (listing → detail → filter → cart) rather than a single isolated page.

The result is that framework decisions are made on incomplete, potentially biased, or outdated evidence — leading teams to either overpay a performance tax (choosing Next.js for its ecosystem despite 25–27% real-world CWV pass rates) or miss out on hiring-friendly frameworks without understanding the true cost.

## Solution

Build a monorepo benchmark suite (`web-framework-benchmark`) containing **eight optimally-implemented e-commerce applications** — one per framework variant — all serving data from a **single shared API** with controllable latency, all styled with the **same Tailwind v4 CSS**, and all measured by an **automated Playwright + Lighthouse benchmark runner** that produces structured, reproducible results.

Each application implements the same four-page e-commerce journey (product listing, product detail, category/filter, cart) using its framework's idiomatic best practices and optimal rendering strategy per page, with the chosen strategy documented in a per-app `STRATEGY.md`.

The benchmark runner executes under three latency presets (0ms / 500ms / 1500ms) and two device profiles (mobile simulated 4G and desktop), producing a JSON artefact and a Markdown summary table per run. All applications run in Docker containers for reproducibility across machines.

**Framework variants:**
1. `astro-vanilla` — Astro with zero client-side framework (Web Components / vanilla JS for interactive islands)
2. `astro-solid` — Astro with SolidJS islands for interactive components
3. `sveltekit` — SvelteKit
4. `nuxt` — Nuxt 3
5. `nextjs-app` — Next.js App Router + React Server Components
6. `nextjs-pages` — Next.js Pages Router
7. `qwik` — QwikCity with resumability
8. `solidstart` — SolidStart (SolidJS meta-framework)

## User Stories

1. As a developer evaluating frameworks, I want to see LCP, FCP, TBT, INP, CLS, and TTFB for each framework on a product listing page, so that I can understand SSG performance differences under identical conditions.
2. As a developer evaluating frameworks, I want to see how each framework handles SSR product detail pages under 0ms, 500ms, and 1500ms backend latency, so that I can understand how TTFB and perceived load time degrade under real-world slow API conditions.
3. As a developer evaluating frameworks, I want to see client-side interactivity performance (INP, TBT) on a category filter page, so that I can compare how each framework's reactivity model affects interaction responsiveness.
4. As a developer evaluating frameworks, I want to see cart interaction performance (INP, TBT), so that I can compare client-side state management approaches at the component level.
5. As a developer evaluating frameworks, I want to see bundle sizes per page per framework, so that I can understand the JS payload each framework ships to the browser.
6. As a developer evaluating frameworks, I want all apps to use the same product data, so that visual and data complexity differences don't confound performance measurements.
7. As a developer evaluating frameworks, I want all apps to use the same Tailwind v4 CSS, so that styling strategy differences don't affect rendering performance metrics.
8. As a developer evaluating frameworks, I want each app to use its framework's native image optimisation solution (next/image, astro:assets, @nuxt/image, etc.), so that image handling performance is part of the "optimal implementation" result.
9. As a developer evaluating frameworks, I want to see performance on both simulated mobile (Moto G4, 4G) and desktop Lighthouse profiles, so that I can understand both the performance inequality gap and the ceiling performance of each framework.
10. As a developer evaluating frameworks, I want benchmark results stored as JSON and a Markdown summary table, so that I can version-control results and compare across runs over time.
11. As a developer evaluating frameworks, I want each app's rendering strategy documented in a `STRATEGY.md`, so that I can understand what architectural choices produced each performance result.
12. As a developer evaluating frameworks, I want to run the full benchmark suite with a single command, so that reproducing results on any machine requires minimal setup.
13. As a developer evaluating frameworks, I want all apps to run in Docker containers, so that CPU, memory, and network conditions are consistent across benchmark runs regardless of host machine.
14. As a developer evaluating frameworks, I want the API latency to be controlled by an environment variable (`LATENCY_MS`), so that no framework app can influence or omit the latency delay.
15. As a developer evaluating frameworks, I want the latency delay to apply only to data endpoints (products, categories), not to static assets or health checks, so that the simulation mirrors a real-world slow database or upstream API scenario.
16. As a developer evaluating frameworks, I want to compare Next.js App Router and Pages Router implementations side-by-side, so that I can understand the performance impact of migrating from Pages Router to App Router + RSC.
17. As a developer evaluating frameworks, I want to compare `astro-vanilla` and `astro-solid` side-by-side, so that I can isolate the cost and benefit of adding SolidJS as an island framework on top of Astro's static shell.
18. As a developer evaluating frameworks, I want each framework app to be implemented to its community's best-practice standard (verified against a per-framework checklist), so that no framework is unfairly handicapped by a poor implementation.
19. As a developer evaluating frameworks, I want product images sourced from `picsum.photos` with deterministic seeds, so that image content is consistent across all framework apps without requiring a local asset pipeline.
20. As a developer evaluating frameworks, I want the product catalogue to include 100 products across 8 categories with realistic fields (id, name, description, price, category, stock, rating, image_url, tags), so that filtering and listing UIs have enough data to be representative.
21. As a developer evaluating frameworks, I want the category/filter page to support client-side filtering by category, price range, and rating, so that the CSR interactivity benchmark reflects a real-world filtering pattern.
22. As a developer evaluating frameworks, I want the cart to support add, remove, and quantity update operations, so that the CSR state management benchmark reflects a realistic cart interaction pattern.
23. As a developer evaluating frameworks, I want the benchmark runner to execute 3 Lighthouse runs per page/app/latency combination and report the median, so that single-run outliers don't distort results.
24. As a developer evaluating frameworks, I want the benchmark results table to include a "Mode used" column alongside metrics, so that readers understand what rendering strategy produced each result.
25. As a researcher publishing results, I want the benchmark suite to be fully reproducible from a single `docker compose up` command, so that results can be independently verified by others.
26. As a researcher publishing results, I want all TypeScript types for product data shared from a single `packages/data` package, so that all API responses and framework app data contracts are consistent and type-safe.
27. As a researcher publishing results, I want the benchmark runner to produce a single Markdown summary across all apps, pages, latency presets, and device profiles, so that comparisons can be made in a single document.
28. As a developer evaluating frameworks, I want to see SolidStart's SSR and SSG performance alongside SolidJS's CSR benchmark results, so that I can understand whether SolidJS's fine-grained reactivity advantage translates to real-world meta-framework performance.
29. As a developer evaluating frameworks, I want to compare `astro-solid` and `solidstart` side-by-side, so that I can understand the trade-off between using SolidJS as an island within Astro versus using SolidStart as a full meta-framework.

## Implementation Decisions

### Monorepo Structure

- pnpm workspaces monorepo
- `packages/api` — shared API server
- `packages/data` — shared TypeScript types and seed data fixture
- `packages/benchmark` — automated benchmark runner
- One package per framework app (8 total): `astro-vanilla`, `astro-solid`, `sveltekit`, `nuxt`, `nextjs-app`, `nextjs-pages`, `qwik`, `solidstart`
- `docker-compose.yml` at root orchestrates all containers

### Shared API (`packages/api`)

- Runtime: Hono on Node.js
- Data: Static JSON fixture (100 products, 8 categories), loaded at startup — no database
- Latency: `LATENCY_MS` environment variable (default: `0`). Applied as a uniform `setTimeout` delay on all data endpoint handlers (`/products`, `/products/:id`, `/categories`). Does NOT apply to health check (`/health`) or any static asset serving.
- Latency presets for benchmark runs: `0`, `500`, `1500` (ms)
- All framework apps point to the same API instance; no per-app API layer
- TypeScript throughout; types imported from `packages/data`

### Shared Data (`packages/data`)

- Exports TypeScript types: `Product`, `Category`, `CartItem`, `ApiResponse<T>`
- Exports the seed JSON fixture as a typed constant
- Product fields: `id`, `name`, `description`, `price`, `category`, `stock`, `rating`, `image_url` (picsum.photos with seeded id), `tags`
- No runtime dependency — pure types and data, used at build time by API and consumed by framework apps

### Shared Styling

- Tailwind v4 with a shared base config at the repo root
- Each framework app installs Tailwind and extends the shared config
- No CSS-in-JS, no runtime style overhead
- All apps render visually identical UI (same layout, same colour system, same component shapes)

### Framework Apps (all 7)

- TypeScript throughout
- Each app fetches product/category data from the shared API
- Each app implements all four pages: product listing, product detail, category/filter, cart
- Each app uses its framework's native image optimisation component/plugin
- Each app documents its rendering strategy per page in `STRATEGY.md` at the package root
- Each app is validated against a per-framework best-practices checklist before being considered complete
- Rendering strategy per page is "declared" — each framework chooses its optimal approach:
  - Product listing: expected SSG or equivalent (generateStaticParams, prerender, etc.)
  - Product detail: expected SSR or streaming (RSC, useFetch SSR, SvelteKit load, Qwik loaders)
  - Category/filter: expected CSR (client components, Pinia store, Svelte stores, Solid signals, Qwik resumability)
  - Cart: expected CSR state management

### Benchmark Runner (`packages/benchmark`)

- Playwright launches a headless Chromium instance per app
- Lighthouse runs in the context of Playwright's page with the `lighthouse` Node.js API
- Two device profiles per run: mobile (simulated 4G, Moto G4 emulation) and desktop
- Three latency presets: the runner sets `LATENCY_MS` env var on the API container before each preset batch
- 3 Lighthouse runs per (app × page × latency × device) combination; median score reported
- Metrics captured: LCP, FCP, TBT, INP, CLS, TTFB, Lighthouse performance score, JS bundle size (from Lighthouse network requests)
- Output: one JSON file per run (raw), one `results.md` Markdown summary table (aggregated)
- "Mode used" column in results populated from each app's `STRATEGY.md`

### Docker Compose

- One service per framework app, one for the API, one for the benchmark runner
- All services on the same Docker network; apps reference API by service name
- `LATENCY_MS` passed to the API service; benchmark runner overrides it per preset batch
- Framework app containers run production builds (not dev servers)

### TypeScript

- TypeScript 5.x throughout all packages
- Shared `tsconfig.json` at the root; each package extends it
- `packages/data` types imported by both `packages/api` and all framework apps

## Testing Decisions

**What makes a good test in this project:**
Tests should verify externally observable behaviour and data contracts, not internal implementation details. For the API, this means testing response shapes and latency behaviour against the HTTP contract. For the data package, this means testing that the seed fixture conforms to the TypeScript types at runtime. For the benchmark runner, this means testing that the orchestration logic correctly aggregates runs and computes medians — not the Lighthouse internals.

**Modules to test:**

- `packages/api` — integration tests against the running Hono server:
  - `GET /products` returns an array of 100 products conforming to the `Product` type
  - `GET /products/:id` returns a single product or 404
  - `GET /categories` returns 8 categories
  - With `LATENCY_MS=500`, response time is ≥ 500ms for data endpoints
  - With `LATENCY_MS=500`, `GET /health` response time is < 50ms (latency not applied)
  - Response shapes match the `ApiResponse<T>` contract from `packages/data`

- `packages/data` — unit tests:
  - Seed fixture contains exactly 100 products
  - All products conform to the `Product` type (all required fields present and correctly typed)
  - All 8 categories are referenced by at least one product
  - `image_url` fields follow the expected `picsum.photos` URL pattern

- `packages/benchmark` — unit tests for the aggregation/median logic:
  - Median calculation returns correct value for odd and even numbers of runs
  - Result aggregation correctly groups by (app × page × latency × device)
  - Markdown table generation produces valid Markdown from a known input fixture

**Modules explicitly not tested:**
- Individual framework app implementations (framework-specific behaviour is covered by the benchmark measurements themselves)
- Lighthouse internals
- Docker Compose orchestration (verified by running the suite)

## Out of Scope

- Authentication, user accounts, order history, or checkout payment flows
- Real product images (all images use `picsum.photos` with seeded ids)
- Incremental Static Regeneration (ISR) comparison — no controlled multi-framework ISR benchmark is in scope for this version
- AI-workload-specific performance (LLM streaming responses, Vercel AI SDK)
- Cloud/CDN deployment benchmarks — local Docker only in this version
- Angular, Remix/React Router 7, Vanilla JS, or any framework not listed in the framework variants
- Mobile-native frameworks
- Accessibility auditing (though Lighthouse accessibility scores will be captured as a secondary output)
- Visual regression testing between framework implementations
- Continuous integration / automated scheduled re-runs

## Further Notes

- The research basis for this benchmark is [`web-framework-performance-complexity-2026.md`](https://github.com/Tobias-Belch/brain/blob/f4f4369113dca93ac62ef24bd30d017ef576daf3/docs/tools/web-framework-performance-complexity-2026.md), which identifies the key gaps this project addresses: no controlled ISR comparison, no complete user-journey benchmark, no optimally-implemented multi-framework comparison with latency simulation.
- The "declared strategy" approach (each framework uses its optimal rendering mode, documented in `STRATEGY.md`) is a deliberate methodological choice to avoid handicapping frameworks. This means results are not always directly apples-to-apples, but the `STRATEGY.md` and "Mode used" column in results provide the context needed for fair interpretation.
- The side-by-side comparison of `astro-vanilla` vs `astro-solid` is uniquely valuable: it isolates the cost/benefit of adding SolidJS as an island runtime on Astro's zero-JS static shell, which no existing benchmark addresses.
- The side-by-side comparison of `astro-solid` vs `solidstart` is uniquely valuable: it answers whether SolidJS's fine-grained reactivity advantage is best realised as an island within Astro's zero-JS shell, or as a full meta-framework taking responsibility for SSR and SSG. The research (Section 5.5) identifies SolidStart's lack of real-world CrUX data as a gap — this benchmark begins to fill it with controlled lab data.
- The side-by-side comparison of `nextjs-app` vs `nextjs-pages` documents the real performance impact of the App Router migration — directly addressing the conflict identified in Section 5.1 of the research report between lab Lighthouse scores and real-world CrUX pass rates.
- Results should be re-run after significant framework releases (Svelte 5 Runes, Vue Vapor Mode, Next.js Turbopack stabilisation, post-NuxtLabs/Vercel acquisition releases) per the research report's recommendation to re-run analysis in 6–9 months.
- The P75 global user baseline from Alex Russell's Performance Inequality Gap (simulated 4G, mid-range Android) is the primary device profile because it is where framework differences are most pronounced. Desktop results will show a compressed delta.
