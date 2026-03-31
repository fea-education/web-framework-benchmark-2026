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
