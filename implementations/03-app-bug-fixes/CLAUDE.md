# Implementation 03 — App Bug Fixes: Agent Resume Protocol

## What this implementation does

Fixes functional bugs in six of the eight benchmark framework apps so that all apps pass the `packages/e2e` Playwright test suite. The e2e tests are the source of truth for HTML structure, user journeys, and UX behaviour.

## Apps to fix (6 total, all independent)

| Slice | App | Root cause summary |
|---|---|---|
| 01 | sveltekit | Cart page mixes listing content; no cross-page cart persistence |
| 02 | nuxt | API URL env var name mismatch — products never load |
| 03 | astro-vanilla | Add to Cart uses `<a>` not `<button>`; verify D5 doesn't redirect |
| 04 | astro-solid | Add to Cart uses `<a>` not `<button>`; no cart state |
| 05 | qwik | Add to Cart button has no onClick$ handler; no feedback |
| 06 | solidstart | No Add to Cart button at all on detail page |

## How to run a single app's e2e tests

```bash
# Build and run tests for one app only
docker compose --profile e2e-<app> build
docker compose --profile e2e-<app> run --rm -e E2E_PROJECT=<app> e2e
```

Replace `<app>` with: `sveltekit`, `nuxt`, `astro-vanilla`, `astro-solid`, `qwik`, or `solidstart`.

## Agent protocol

1. Read the slice file for your assigned app (e.g. `issues/01-fix-sveltekit.md`).
2. Read ALL relevant source files for the app before making any changes.
3. Run the e2e tests for that app to confirm the baseline failures.
4. Make the minimum changes needed to make all tests pass.
5. Run `pnpm typecheck` in the app package to confirm no TS errors.
6. Re-run the e2e tests to confirm all pass.
7. Mark the slice `passes: true` in `prd.json`.
8. Append learnings to `progress.txt`.

## Rules

- Do NOT modify `packages/e2e` (tests are frozen as source of truth).
- Do NOT use npm or yarn — only pnpm.
- Do NOT add new dependencies unless strictly necessary.
- All Docker services run production builds, not dev servers.
- TypeScript must compile with no errors.
- A slice is only `passes: true` when ALL e2e tests for that project pass with exit code 0.
