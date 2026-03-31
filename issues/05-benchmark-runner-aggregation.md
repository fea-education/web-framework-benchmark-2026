# Benchmark runner — aggregation, median logic, and Markdown output

**Type:** AFK
**Blocked by:** Slice 01

---

## What to build

Implement the pure-logic layer of `packages/benchmark`: median calculation, result aggregation, and Markdown summary table generation. No Playwright or Lighthouse wiring in this slice — that is slice 14. This layer must be fully tested in isolation against fixture data.

Write tests first, then implement: all unit tests must be written before the implementation is considered done.

Specifically:

- `packages/benchmark/` TypeScript package scaffolded in the monorepo
- Core modules:
  - `median.ts` — calculates the median of a numeric array (handles odd and even lengths)
  - `aggregator.ts` — groups raw Lighthouse run results by `(app × page × latency × device)` and computes the median for each metric (LCP, FCP, TBT, INP, CLS, TTFB, Lighthouse performance score, JS bundle size)
  - `markdown.ts` — generates a `results.md` Markdown summary table from aggregated results; includes a "Mode used" column (populated from each app's `STRATEGY.md` at runtime)
- Output types: one JSON file per run (raw), one `results.md` (aggregated)
- Unit tests:
  - `median` returns correct value for an odd-length array
  - `median` returns correct value for an even-length array (average of two middle values)
  - `aggregator` correctly groups a fixture input by `(app × page × latency × device)`
  - `aggregator` computes correct medians for each metric group
  - `markdown` produces valid Markdown (parseable table) from a known fixture input
  - `markdown` includes the "Mode used" column

See PRD §"Benchmark Runner (`packages/benchmark`)" and §"Testing Decisions" for full spec.

## Acceptance criteria

- All unit tests pass
- `median` handles arrays of length 1, 2, 3, and even/odd larger arrays correctly
- Aggregation correctly handles the full matrix: 8 apps × 4 pages × 3 latency presets × 2 device profiles
- Generated Markdown table is valid CommonMark
- "Mode used" column is present in the table output
- No Playwright or Lighthouse dependency in this slice

## Blocked by

- Blocked by slice 01 (monorepo scaffold + shared data package)

## User stories addressed

- User story 10
- User story 23
- User story 24
- User story 27
