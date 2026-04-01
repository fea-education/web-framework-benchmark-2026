# Web Framework Benchmark 2026 — Implementation Instructions

## What this implementation is

Eight optimally-implemented e-commerce applications (one per framework variant), a shared Hono API, a shared data package, and an automated Playwright + Lighthouse benchmark runner. The goal is reproducible, side-by-side performance comparison across SSG, SSR, and CSR rendering modes under controlled latency conditions.

Full spec: `implementations/web-framework-benchmark-2026/prd.md`

For monorepo conventions, Docker setup, quality checks, and framework app conventions, read the root `CLAUDE.md` first.

## How to resume after a context reset

1. Read `implementations/web-framework-benchmark-2026/prd.json` — it tracks which slices are `passes: true`, `passes: false`, or `"aborted"`
2. Read `implementations/web-framework-benchmark-2026/progress.txt` (if it exists) — append-only learnings from previous iterations
3. Identify the next eligible slice: `passes: false` AND all `blockedBy` IDs are `passes: true` (aborted blockers count as skip — see below)
4. Read the corresponding `implementations/web-framework-benchmark-2026/issues/<id>-*.md` file for the full spec of that slice
5. Implement it using the retry protocol (see below), run quality checks, commit, then mark it `passes: true` in `implementations/web-framework-benchmark-2026/prd.json`
6. Append any learnings to `implementations/web-framework-benchmark-2026/progress.txt`
7. Repeat from step 3

When all stories are either `passes: true` or `"aborted"`, output `<promise>COMPLETE</promise>` and stop.

## Retry and abort protocol

The goal is to complete as many slices as possible. A failing slice must never block the whole run — it gets retried, and if still failing, aborted and skipped so unblocked siblings can proceed.

**Per-slice retry loop:**

1. Attempt to implement the slice and pass all quality checks
2. If any check fails, diagnose the error and try a different approach
3. Repeat up to **5 attempts total**
4. If the slice has not passed after 5 attempts:
   a. Write an error log to `implementations/web-framework-benchmark-2026/errors/<id>-error.md` (format below)
   b. Commit the error log: `chore: abort slice <id> — error log`
   c. Set `"passes": "aborted"` in `implementations/web-framework-benchmark-2026/prd.json` for that slice
   d. Do NOT leave broken code committed — revert any partial implementation for that slice before moving on
   e. Continue to the next eligible slice

**What counts as a new attempt:**
Each attempt must try a meaningfully different approach (different dependency version, different API usage, different implementation strategy). Simply re-running the same failing command does not count as a new attempt.

**Handling aborted blockers:**
If a slice's blocker is `"aborted"`, treat the blocker as resolved for the purpose of unblocking dependents. The dependent slice should note in its implementation that the blocker is absent and adapt accordingly (e.g. if `packages/data` failed, a dependent slice cannot proceed — abort it immediately with attempt count 1 and reference the blocker's error log).

**Error log format — `implementations/web-framework-benchmark-2026/errors/<id>-error.md`:**

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

Where multiple slices are eligible at the same time (no unresolved blockers), launch them as parallel sub-agents rather than implementing them sequentially. This is the primary way to reduce total wall-clock time on this project.

**How to parallelise:**

1. Identify all slices where `passes: false` AND every ID in `blockedBy` is `passes: true`
2. For each eligible slice, spawn a sub-agent with this instruction:
   > "Read root `CLAUDE.md` for project conventions. Read `implementations/web-framework-benchmark-2026/CLAUDE.md` for the implementation resume protocol. Read `implementations/web-framework-benchmark-2026/issues/<id>-<title>.md` for the full spec. Implement the slice. If quality checks fail, retry up to 5 attempts using different approaches before aborting. On SUCCESS: commit with message `feat: slice <id> — <title>` and report SUCCESS. On ABORT after 5 attempts: write `implementations/web-framework-benchmark-2026/errors/<id>-error.md`, commit it, and report ABORTED with the error log path."
3. Wait for all sub-agents to complete before updating `implementations/web-framework-benchmark-2026/prd.json` — mark each slice `passes: true` on SUCCESS, `"aborted"` on ABORTED
4. If a sub-agent reports FAILURE without having exhausted retries, that is a sub-agent error — relaunch it once before treating the slice as aborted

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
- Sub-agents must NOT modify `implementations/web-framework-benchmark-2026/prd.json` — the orchestrating agent does that after receiving results
- Sub-agents must NOT modify other packages' files
- If two sub-agents need to edit the same file (e.g. `docker-compose.yml`), the orchestrator merges the changes after both complete rather than letting agents write concurrently

## Dependency order

Slices 01 and 03 can start immediately (no blockers).
Slice 02 requires 01. Slice 04 requires 02. Slice 05 requires 01.
Slices 06–13 (framework apps) all require 02, 03, and 04 — launch all eight in parallel once those are done.
Slice 14 requires all of 05–13.

## progress.txt format

Append a new entry after each completed slice in this format:

```
--- Slice <id> completed: <title> ---
<date>
<Key learnings, gotchas, or patterns discovered>
---
```

Keep entries factual and brief. Future iterations (and human reviewers) depend on this file.
