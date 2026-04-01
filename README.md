# Web Framework Benchmark 2026

A reproducible, side-by-side performance comparison of eight modern web framework variants (SSG, SSR, and CSR rendering modes) under controlled latency conditions.

## Frameworks compared

| Service | Framework | Port |
|---------|-----------|------|
| `nextjs-app` | Next.js (App Router) | 3001 |
| `nextjs-pages` | Next.js (Pages Router) | 3002 |
| `sveltekit` | SvelteKit | 3003 |
| `nuxt` | Nuxt 3 | 3004 |
| `astro-vanilla` | Astro + Vanilla JS | 3005 |
| `astro-solid` | Astro + SolidJS | 3006 |
| `qwik` | Qwik City | 3007 |
| `solidstart` | SolidStart | 3008 |

All apps share a single Hono API (`packages/api`) running on port 3000.

## Quick start

```bash
docker compose up
```

This builds the API and starts all framework apps. The API will be available at `http://localhost:3000`.

## Running the benchmark suite

To run the full Lighthouse benchmark matrix (8 apps × 4 pages × 3 latency presets × 2 device profiles × 3 runs = 576 measurements):

```bash
docker compose run benchmark
```

Results are written to:
- `results/run-<timestamp>-<app>-<page>-<latency>-<device>-<run>.json` — raw per-run data
- `results/results.md` — aggregated Markdown summary table with median metrics per combination

The benchmark runner:
1. Starts all framework apps and the API (via `depends_on`)
2. Iterates over latency presets (0, 500, 1500 ms), setting `LATENCY_MS` on the API container between batches
3. Runs Lighthouse 3 times per (app × page × latency × device) combination
4. Computes median LCP, FCP, TBT, INP, CLS, TTFB, performance score, and JS bundle size
5. Outputs a Markdown summary table including the rendering mode per page (from each app's `STRATEGY.md`)

## API endpoints

- `GET /health` — health check (no latency)
- `GET /products` — list all products
- `GET /products/:id` — single product detail
- `GET /categories` — list all categories

## Simulating network latency

Use the `LATENCY_MS` environment variable to add artificial latency to data endpoints (products, categories):

```bash
# 500ms latency
LATENCY_MS=500 docker compose up

# 1500ms latency
LATENCY_MS=1500 docker compose up
```

Copy `.env.example` to `.env` to set a persistent default:

```bash
cp .env.example .env
```

## Running a single service

```bash
# Start only the API
docker compose up api

# Start only a specific framework app (and the API it depends on)
docker compose up nextjs-app api
```

## Development

```bash
# Install dependencies
pnpm install

# Type check all packages
pnpm typecheck

# Run all tests
pnpm test

# Build all packages
pnpm build
```
