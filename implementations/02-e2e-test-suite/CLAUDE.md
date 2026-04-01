# E2E Functional Test Suite — Implementation Instructions

## What this implementation is

A `@playwright/test`-based functional correctness suite (`packages/e2e`) that tests all four user-facing pages across all eight framework apps against a shared set of behavioural assertions. The suite enforces UX consistency and documents functional regressions without modifying the apps.

Full spec: `implementations/02-e2e-test-suite/prd.md`

For monorepo conventions, Docker setup, and quality checks, read the root `CLAUDE.md` first.

## How to resume after a context reset

1. Read `implementations/02-e2e-test-suite/prd.json` — it tracks which slices are `passes: true`, `passes: false`, or `"aborted"`
2. Read `implementations/02-e2e-test-suite/progress.txt` (if it exists) — append-only learnings from previous iterations
3. Identify the next eligible slice: `passes: false` AND all `blockedBy` IDs are `passes: true` (aborted blockers count as resolved — see below)
4. Read the corresponding `implementations/02-e2e-test-suite/issues/<id>-*.md` file for the full spec of that slice
5. Implement it using the retry protocol (see below), run quality checks, commit, then mark it `passes: true` in `implementations/02-e2e-test-suite/prd.json`
6. Append any learnings to `implementations/02-e2e-test-suite/progress.txt`
7. Repeat from step 3

When all slices are either `passes: true` or `"aborted"`, output `<promise>COMPLETE</promise>` and stop.

## Quality checks for this implementation

A slice passes when ALL of the following are green:

```bash
# TypeScript — no errors in packages/e2e
pnpm --filter @benchmark/e2e typecheck

# Playwright test list resolves without errors (zero tests is OK for the scaffold slice)
pnpm --filter @benchmark/e2e exec playwright test --list
```

For slices 06–08 (Docker/Compose/Makefile), also verify:

```bash
# Docker build succeeds
docker build -f packages/e2e/Dockerfile . --tag benchmark-e2e-test

# Compose config is valid for the relevant profile
docker compose --profile e2e config
docker compose --profile e2e-sveltekit config
docker compose --profile apps config
```

Do NOT attempt to run `make test:e2e` or `docker compose run e2e` as part of slice quality checks — the apps are not guaranteed to be running in the CI/build environment. The test suite is validated structurally (typecheck + list + build), not by executing tests end-to-end.

## Retry and abort protocol

The goal is to complete as many slices as possible. A failing slice must never block the whole run — it gets retried, and if still failing, aborted and skipped so unblocked siblings can proceed.

**Per-slice retry loop:**

1. Attempt to implement the slice and pass all quality checks
2. If any check fails, diagnose the error and try a different approach
3. Repeat up to **5 attempts total**
4. If the slice has not passed after 5 attempts:
   a. Write an error log to `implementations/02-e2e-test-suite/errors/<id>-error.md` (format below)
   b. Commit the error log: `chore: abort slice <id> — error log`
   c. Set `"passes": "aborted"` in `implementations/02-e2e-test-suite/prd.json` for that slice
   d. Do NOT leave broken code committed — revert any partial implementation for that slice before moving on
   e. Continue to the next eligible slice

**What counts as a new attempt:**
Each attempt must try a meaningfully different approach (different dependency version, different API usage, different implementation strategy). Simply re-running the same failing command does not count as a new attempt.

**Handling aborted blockers:**
If a slice's blocker is `"aborted"`, treat the blocker as resolved for the purpose of unblocking dependents. The dependent slice should note in its implementation that the blocker is absent and adapt accordingly.

**Error log format — `implementations/02-e2e-test-suite/errors/<id>-error.md`:**

```markdown
# Slice <id> — Abort Log

**Slice:** <id> — <title>
**Date:** <ISO date>
**Attempts:** 5

## Attempts summary

### Attempt 1
**Approach:** <brief description of what was tried>
**Command(s) run:** <exact commands>
**Error output:**
\`\`\`
<exact error text>
\`\`\`

### Attempt 2
...

## Root cause hypothesis

<Best diagnosis of why the slice could not be completed>

## Suggested next steps for a human

<What a human would need to do to unblock this slice>
```

## Parallel execution with sub-agents

Where multiple slices are eligible at the same time (no unresolved blockers), launch them as parallel sub-agents rather than implementing them sequentially.

**How to parallelise:**

1. Identify all slices where `passes: false` AND every ID in `blockedBy` is `passes: true`
2. For each eligible slice, spawn a sub-agent with this instruction:
   > "Read root `CLAUDE.md` for project conventions. Read `implementations/02-e2e-test-suite/CLAUDE.md` for the implementation resume protocol. Read `implementations/02-e2e-test-suite/issues/<id>-<title>.md` for the full spec. Implement the slice. If quality checks fail, retry up to 5 attempts using different approaches before aborting. On SUCCESS: commit with message `feat: slice <id> — <title>` and report SUCCESS. On ABORT after 5 attempts: write `implementations/02-e2e-test-suite/errors/<id>-error.md`, commit it, and report ABORTED with the error log path."
3. Wait for all sub-agents to complete before updating `implementations/02-e2e-test-suite/prd.json` — mark each slice `passes: true` on SUCCESS, `"aborted"` on ABORTED
4. If a sub-agent reports FAILURE without having exhausted retries, that is a sub-agent error — relaunch it once before treating the slice as aborted

**Sub-agent isolation rules:**
- Slices 02–05 (spec files) each write only to `packages/e2e/tests/<page>.spec.ts` — fully independent, safe to parallelise
- Slice 06 writes to `packages/e2e/Dockerfile` and `docker-compose.yml`
- Slice 07 writes to `Makefile` and root `package.json`
- Slice 08 also writes to `docker-compose.yml` — **do not run slice 07 and slice 08 in parallel** as both modify `docker-compose.yml`
- Sub-agents must NOT modify `implementations/02-e2e-test-suite/prd.json` — the orchestrating agent does that after receiving results

## Parallelisation map

| Wave | Slices | Can run in parallel |
|------|--------|---------------------|
| 1 | 01 | No — foundation, no blockers, must complete alone |
| 2 | 02, 03, 04, 05, 06 | Yes — all blocked only by 01; launch all five in parallel once 01 is done |
| 3 | 07, 08 | **Sequential** — both write to `docker-compose.yml`; run 06 → 07 → 08 in order |

Wave 2 is the primary parallelisation opportunity: slices 02–05 each write to a different spec file (`listing.spec.ts`, `detail.spec.ts`, `filter.spec.ts`, `cart.spec.ts`) with no overlap. Slice 06 writes the Dockerfile and compose service additions — independent of the spec files.

## Dependency order

Slice 01 (scaffold) has no blockers — start immediately.
Slices 02, 03, 04, 05, 06 all require only slice 01 — launch all five in parallel once 01 passes.
Slices 07 and 08 both require slice 06 — run sequentially (07 first, then 08) to avoid concurrent edits to `docker-compose.yml`.

## Key implementation notes

- The suite **does not fix app bugs** — it only documents them. Tests are expected to fail for the 6 known regressions.
- Use `@playwright/test` (the test runner package), not the programmatic `playwright` package.
- All selectors must use ARIA/role/text — never CSS classes or `data-testid`.
- The `E2E_PROJECT` env var is used by the Docker entrypoint (`--project=$E2E_PROJECT`) not filtered inside `playwright.config.ts`.
- Do not add a `globalSetup` / `globalTeardown` — Docker Compose health checks handle startup ordering.
- The Dockerfile pattern mirrors `packages/benchmark/Dockerfile` exactly (two-stage: builder + runner).
- When adding `profiles:` to existing docker-compose services, touch only the `profiles` key — do not modify `healthcheck`, `depends_on`, `environment`, `ports`, or `networks`.

## progress.txt format

Append a new entry after each completed slice in this format:

```
--- Slice <id> completed: <title> ---
<date>
<Key learnings, gotchas, or patterns discovered>
---
```

Keep entries factual and brief. Future iterations (and human reviewers) depend on this file.
