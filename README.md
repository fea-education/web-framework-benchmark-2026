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

#### Step 4 — Commit the tracking file

After the scaffold is in place, run ralph once briefly to generate the `.last-branch` file, then commit it:

```bash
git add implementations/<NN-slug>/ scripts/ralph/.last-branch-<NN-slug>
git commit -m "chore: scaffold implementation <NN-slug>"
```

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

The `scripts/ralph/.last-branch-<NN-slug>` file is committed alongside each implementation and records the last-seen `branchName` from `prd.json`. This lets Ralph detect when a new implementation starts on any machine and archive the previous run's state automatically.
