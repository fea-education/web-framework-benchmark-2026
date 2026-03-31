# Web Framework Benchmark 2026 — Agent Instructions

## What this project is

A pnpm workspaces monorepo containing eight optimally-implemented e-commerce applications (one per framework variant), a shared Hono API, a shared data package, and an automated Playwright + Lighthouse benchmark runner. The goal is reproducible, side-by-side performance comparison across SSG, SSR, and CSR rendering modes under controlled latency conditions.

Full spec: `docs/01-prd.md`

## How to resume after a context reset

1. Read `prd.json` — it tracks which slices are `passes: true` and which are `passes: false`
2. Read `progress.txt` (if it exists) — append-only learnings from previous iterations
3. Identify the next eligible slice: `passes: false` AND all `blockedBy` IDs are `passes: true`
4. Read the corresponding `issues/<id>-*.md` file for the full spec of that slice
5. Implement it, run quality checks (see below), commit, then mark it `passes: true` in `prd.json`
6. Append any learnings to `progress.txt`
7. Repeat from step 3

When all stories have `passes: true`, output `<promise>COMPLETE</promise>` and stop.

## Parallel execution with sub-agents

Where multiple slices are eligible at the same time (no unresolved blockers), launch them as parallel sub-agents rather than implementing them sequentially. This is the primary way to reduce total wall-clock time on this project.

**How to parallelise:**

1. Identify all slices where `passes: false` AND every ID in `blockedBy` is `passes: true`
2. For each eligible slice, spawn a sub-agent with this instruction:
   > "Read `CLAUDE.md` for project conventions. Read `issues/<id>-<title>.md` for the full spec. Implement the slice, run quality checks, commit with message `feat: slice <id> — <title>`, then report back with either SUCCESS or FAILURE and a summary."
3. Wait for all sub-agents to complete before updating `prd.json` — mark each slice `passes: true` only on SUCCESS
4. If a sub-agent reports FAILURE, do not mark it done; treat it as still `passes: false` and retry or escalate

**Parallelisation map for this project:**

| Wave | Slices | Can run in parallel |
|------|--------|---------------------|
| 1 | 01, 03 | Yes — no blockers |
| 2 | 02, 05 | Yes — both need only 01; launch together once 01 is done |
| 3 | 04 | After 02 |
| 4 | 06, 07, 08, 09, 10, 11, 12, 13 | Yes — all eight framework apps unblock simultaneously after 02+03+04; launch all eight in parallel |
| 5 | 14 | After all of 05–13 |

Wave 4 is the largest parallelisation opportunity: eight independent framework app implementations that share no files with each other (each writes only to its own `packages/<name>/` directory and its own service entry in `docker-compose.yml`).

**Sub-agent isolation rules:**
- Each sub-agent works only in its own package directory (`packages/<name>/`) and appends its service to `docker-compose.yml`
- Sub-agents must NOT modify `prd.json` — the orchestrating agent does that after receiving results
- Sub-agents must NOT modify other packages' files
- If two sub-agents need to edit the same file (e.g. `docker-compose.yml`), the orchestrator merges the changes after both complete rather than letting agents write concurrently

## Dependency order

Slices 01 and 03 can start immediately (no blockers).
Slice 02 requires 01. Slice 04 requires 02. Slice 05 requires 01.
Slices 06–13 (framework apps) all require 02, 03, and 04 — launch all eight in parallel once those are done.
Slice 14 requires all of 05–13.

## Environment requirements

- Node.js 20+
- pnpm 9+
- Docker and Docker Compose v2 (`docker compose` not `docker-compose`)
- `jq` (for inspecting `prd.json` state if needed)

Check versions before starting:
```
node --version
pnpm --version
docker compose version
```

## Quality checks (must pass before marking a slice done)

```
# From repo root:
pnpm typecheck        # TypeScript — no errors
pnpm test             # Run all tests in the affected package(s)
pnpm build            # Production build of the affected package(s)
```

For framework app slices (06–13), also verify:
```
docker compose up <service-name> --build -d
curl http://localhost:<port>/health   # or the app's root route
docker compose down
```

A slice is only `passes: true` when ALL checks above are green. Do not mark passes if tests are skipped or if the build produces TypeScript errors.

## Monorepo conventions

- Package manager: pnpm. Never use npm or yarn.
- All packages live under `packages/`. Each framework app is also a package.
- Root `tsconfig.json` in strict mode; every package extends it with `"extends": "../../tsconfig.json"`.
- Test runner: vitest (preferred) or the framework's native test tooling where vitest is impractical.
- Tailwind v4: shared config at repo root; each package extends it. No CSS-in-JS, no runtime style overhead.
- All TypeScript types for product data come from `packages/data`. Never duplicate them.
- `packages/api` is the single source of product data for all framework apps. No per-app mock data.

## Framework app conventions (slices 06–13)

Each app package must contain:
- `STRATEGY.md` — documents the rendering mode chosen per page (listing, detail, filter, cart) and the rationale
- `Dockerfile` — multi-stage production build (not dev server)
- A registered service in `docker-compose.yml` replacing the stub placeholder from slice 04
- All four pages: product listing, product detail (`/products/[id]`), category/filter (`/filter`), cart (`/cart`)
- Native image optimisation component (next/image, astro:assets, @nuxt/image, etc.)
- Tailwind v4 extending the shared root config
- TypeScript with no errors

Rendering strategy per page (each framework chooses its idiomatic optimal approach):
- Product listing: SSG or equivalent
- Product detail: SSR or streaming
- Category/filter: CSR (client-side filtering by category, price range, and rating)
- Cart: CSR state management (add, remove, quantity update)

## API and latency

- Shared API runs at `http://api:3000` inside the Docker network (service name `api`)
- For local development outside Docker: `http://localhost:3000`
- `LATENCY_MS` env var controls delay on data endpoints. Default: `0`
- Latency presets for benchmark: `0`, `500`, `1500` ms
- `/health` endpoint never has latency applied

## Docker conventions

- All containers run production builds
- All services on the same Docker network (`benchmark-net` or equivalent)
- Framework apps reference the API by service name (`api`), not by IP or localhost
- `LATENCY_MS` is passed to the `api` service; the benchmark runner overrides it per preset batch

## What NOT to do

- Do not install Prisma, any ORM, or any database — data is a static JSON fixture in `packages/data`
- Do not add authentication, checkout flows, or payment handling — out of scope
- Do not implement ISR, AI workloads, or cloud deployment — out of scope
- Do not add Angular, Remix, or any framework not in the PRD's framework variants list
- Do not run dev servers in Docker — production builds only
- Do not duplicate `Product`, `Category`, `CartItem`, or `ApiResponse<T>` types — import from `packages/data`
- Do not add visual regression tests or accessibility auditing — out of scope

## progress.txt format

Append a new entry after each completed slice in this format:

```
--- Slice <id> completed: <title> ---
<date>
<Key learnings, gotchas, or patterns discovered>
---
```

Keep entries factual and brief. Future iterations (and human reviewers) depend on this file.
