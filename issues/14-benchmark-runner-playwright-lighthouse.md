# Benchmark runner — Playwright + Lighthouse wiring and full suite execution

**Type:** AFK
**Blocked by:** Slices 05, 06, 07, 08, 09, 10, 11, 12, 13

---

## What to build

Wire Playwright and the Lighthouse Node.js API into `packages/benchmark` to execute the full benchmark matrix against the running Docker Compose stack. This slice builds on the pure-logic layer from slice 05 (aggregation, median, Markdown output) and adds the orchestration that drives actual measurements.

Specifically:

- Extend `packages/benchmark/` with:
  - `runner.ts` — orchestrates the full benchmark matrix:
    - For each latency preset (`0`, `500`, `1500` ms): sets `LATENCY_MS` on the API container via Docker SDK or `docker compose` CLI call, then runs all app × page × device combinations
    - For each combination: launches a headless Chromium instance via Playwright, runs Lighthouse 3 times using the Lighthouse Node.js API in the context of Playwright's page, collects raw results
    - Metrics captured per run: LCP, FCP, TBT, INP, CLS, TTFB, Lighthouse performance score, JS bundle size (from Lighthouse network requests)
    - Two device profiles: mobile (Moto G4 emulation, simulated 4G) and desktop Lighthouse config
  - `devices.ts` — Lighthouse config objects for the mobile and desktop profiles
  - `matrix.ts` — defines the full app × page × latency × device matrix; reads `STRATEGY.md` from each app package to populate the "Mode used" field
- Calls the aggregator and Markdown generator from slice 05 to produce final outputs:
  - One JSON file per run (raw, in `results/` at repo root)
  - One `results/results.md` Markdown summary table (aggregated across all runs)
- The `benchmark` Docker service in `docker-compose.yml` is updated from a placeholder to the real runner image; executing `docker compose run benchmark` triggers the full suite
- Root `README.md` updated to document the single `docker compose run benchmark` command

See PRD §"Benchmark Runner (`packages/benchmark`)" and §"Docker Compose" for full spec.

## Acceptance criteria

- `docker compose run benchmark` executes the full matrix without manual intervention
- 3 Lighthouse runs are performed per (app × page × latency × device) combination — 8 apps × 4 pages × 3 latency presets × 2 device profiles × 3 runs = 576 total Lighthouse runs
- Median is computed and reported for each metric in each combination cell
- `LATENCY_MS` is correctly set on the API container before each latency preset batch
- `GET /health` confirms the API is ready before each batch begins
- Raw JSON output is written per run; aggregated `results.md` is written on completion
- "Mode used" column in `results.md` is populated from each app's `STRATEGY.md`
- Results are reproducible: running the suite twice on the same machine produces results within normal Lighthouse variance
- Mobile profile uses Moto G4 emulation with simulated 4G throttling
- Desktop profile uses Lighthouse's standard desktop config

## Blocked by

- Blocked by slice 05 (benchmark runner — aggregation and median logic)
- Blocked by slice 06 (`nextjs-app`)
- Blocked by slice 07 (`nextjs-pages`)
- Blocked by slice 08 (`sveltekit`)
- Blocked by slice 09 (`nuxt`)
- Blocked by slice 10 (`astro-vanilla`)
- Blocked by slice 11 (`astro-solid`)
- Blocked by slice 12 (`qwik`)
- Blocked by slice 13 (`solidstart`)

## User stories addressed

- User story 1
- User story 2
- User story 3
- User story 4
- User story 5
- User story 9
- User story 10
- User story 12
- User story 23
- User story 24
- User story 27
