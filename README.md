# Web Framework Benchmark 2026

A reproducible, side-by-side performance comparison of eight modern web framework variants (SSG, SSR, and CSR rendering modes) under controlled latency conditions.

## Table of contents

- [Frameworks compared](#frameworks-compared)
- [Quick start](#quick-start)
- [Running the benchmark suite](#running-the-benchmark-suite)
- [Running the E2E functional test suite](#running-the-e2e-functional-test-suite)
- [API endpoints](#api-endpoints)
- [Simulating network latency](#simulating-network-latency)
- [Running a single service](#running-a-single-service)
- [Development](#development)
- [Agentic implementation with Ralph](#agentic-implementation-with-ralph)

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

## Running the E2E functional test suite

The `packages/e2e` package (`@benchmark/e2e`) is a Playwright-based functional correctness suite. It tests all four pages across all eight framework apps against a shared set of behavioural assertions, catching regressions that Lighthouse metrics cannot detect.

### Run all apps against all assertions (parallel)

```bash
make test:e2e
```

Starts the API, all 8 framework apps, and the `e2e` container. All 8 Playwright projects run in parallel. An HTML report with failure screenshots is written to `packages/e2e/playwright-report/`.

### Run tests for a single app

```bash
make test:e2e-sveltekit
make test:e2e-nextjs-app
make test:e2e-nextjs-pages
make test:e2e-nuxt
make test:e2e-astro-vanilla
make test:e2e-astro-solid
make test:e2e-qwik
make test:e2e-solidstart
```

Only the selected app and the API start. Useful for iterating on a fix without waiting for all 8 apps to build.

### Start all apps without running tests

```bash
make apps
```

Brings up the API and all 8 framework apps for manual exploration. No test container is started.

### Run tests locally (without Docker)

With all apps already running on their default ports:

```bash
pnpm --filter @benchmark/e2e exec playwright test
```

To run only one project:

```bash
pnpm --filter @benchmark/e2e exec playwright test --project=sveltekit
```

Override a base URL via environment variable if an app runs on a non-default port:

```bash
APP_BASE_SVELTEKIT=http://localhost:9003 pnpm --filter @benchmark/e2e exec playwright test --project=sveltekit
```

| Project | Env var | Default |
|---------|---------|---------|
| `nextjs-app` | `APP_BASE_NEXTJS_APP` | `http://localhost:3001` |
| `nextjs-pages` | `APP_BASE_NEXTJS_PAGES` | `http://localhost:3002` |
| `sveltekit` | `APP_BASE_SVELTEKIT` | `http://localhost:3003` |
| `nuxt` | `APP_BASE_NUXT` | `http://localhost:3004` |
| `astro-vanilla` | `APP_BASE_ASTRO_VANILLA` | `http://localhost:3005` |
| `astro-solid` | `APP_BASE_ASTRO_SOLID` | `http://localhost:3006` |
| `qwik` | `APP_BASE_QWIK` | `http://localhost:3007` |
| `solidstart` | `APP_BASE_SOLIDSTART` | `http://localhost:3008` |

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

## Agentic implementation with Ralph

Ralph is a long-running AI agent loop that autonomously implements a PRD slice by slice. Each implementation lives under `implementations/<NN-slug>/` with its own spec, state tracker, and learnings log. The two-digit prefix makes the iteration history visible at a glance.

### Folder structure of an implementation

```
implementations/
  01-web-framework-benchmark-2026/   ← first implementation
    CLAUDE.md       ← agent resume protocol (retry/abort/parallelisation rules)
    prd.md          ← full product spec
    prd.json        ← slice state tracker (passes: true / false / "aborted")
    progress.txt    ← append-only learnings log
    issues/         ← one .md file per slice with the full acceptance criteria
    errors/         ← abort logs written by the agent (runtime-generated)
  02-my-next-idea/                   ← future implementation
    ...
```

### Planning a new implementation

#### Step 1 — Write the PRD (`prd.md`)

Use the **`write-a-prd`** skill in your AI assistant to produce a structured PRD through an interview-driven process. The result should include user stories, implementation decisions, and an out-of-scope section.

Save the output as `implementations/<NN-slug>/prd.md`.

#### Step 2 — Break the PRD into issues (`issues/`)

Use the **`prd-to-issues`** skill to decompose the PRD into independently-deliverable slices using tracer-bullet vertical slices. Each slice becomes one file in `issues/<id>-<slug>.md` with full acceptance criteria and implementation notes.

#### Step 3 — Bootstrap the implementation scaffold

Create the directory and paste the following prompt into your AI assistant to generate `prd.json`, `progress.txt`, and `CLAUDE.md` in one shot:

```
I have a new Ralph implementation at implementations/<NN-slug>/ (replace with the actual path).
It already contains prd.md and an issues/ directory with numbered slice files.

Please create the following three files:

1. implementations/<NN-slug>/prd.json
   - Read prd.md and the issues/ files to determine the slices
   - Set "branchName" to "<slug>" (without the NN- prefix)
   - Each entry needs: id (two-digit string), title, file (relative path to the issues file),
     type ("AFK"), blockedBy (array of id strings), passes (false)
   - Infer blockedBy from logical dependencies between slices
   - Format must match implementations/01-web-framework-benchmark-2026/prd.json exactly

2. implementations/<NN-slug>/progress.txt
   - Exactly these three lines:
     # Ralph Progress Log
     Started: (not yet run)
     ---

3. implementations/<NN-slug>/CLAUDE.md
   - Copy implementations/01-web-framework-benchmark-2026/CLAUDE.md
   - Replace every occurrence of "01-web-framework-benchmark-2026" with "<NN-slug>"
   - Update the "What this implementation is" section to describe this implementation
   - Update the parallelisation map table if the wave/dependency structure differs from the original
```

#### Step 4 — Commit the scaffold

```bash
git add implementations/<NN-slug>/
git commit -m "chore: scaffold implementation <NN-slug>"
```

The `scripts/ralph/.last-branch-<NN-slug>` tracking file is written and committed automatically by ralph.sh on the first run — no manual step needed.

### Running an implementation

```bash
# Via Make (recommended)
make implement IMPL=01-web-framework-benchmark-2026

# Directly via ralph.sh
./scripts/ralph/ralph.sh --impl 01-web-framework-benchmark-2026

# Choose a specific AI tool (opencode is the default)
./scripts/ralph/ralph.sh --impl 01-web-framework-benchmark-2026 --tool claude 20
```

Ralph loops until every slice in `prd.json` is either `passes: true` or `"aborted"`, or until the iteration limit is reached. It resumes cleanly from wherever it left off — re-running the same command is safe.

The `scripts/ralph/.last-branch-<NN-slug>` file records the last-seen `branchName` from `prd.json`. Ralph writes and commits it automatically on startup, so the implementation state is always resumable on any machine.
