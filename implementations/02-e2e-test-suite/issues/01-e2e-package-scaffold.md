# packages/e2e scaffold — package.json, tsconfig.json, playwright.config.ts

**Type:** AFK
**Blocked by:** None

---

## What to build

Create the `packages/e2e` package from scratch: the workspace manifest, TypeScript config, and the Playwright configuration file that defines all 8 projects. No spec files yet — those come in slices 02–05. This slice establishes the foundation every spec file depends on.

Specifically:

- `packages/e2e/package.json`:
  - `name: "@benchmark/e2e"`
  - `devDependencies`: `@playwright/test` (latest), `typescript`
  - `scripts.test`: `playwright test`
  - `scripts.typecheck`: `tsc --noEmit`

- `packages/e2e/tsconfig.json`:
  - Extends root `../../tsconfig.json`
  - `include`: `["playwright.config.ts", "tests/**/*.ts"]`

- `packages/e2e/playwright.config.ts`:
  - `fullyParallel: true`
  - `reporter: [['html', { outputFolder: 'playwright-report' }], ['list']]`
  - `screenshot: 'only-on-failure'`
  - `video: 'off'`
  - `trace: 'on-first-retry'`
  - 8 projects — one per framework app. Each reads its `baseURL` from an env var with a `localhost` default:

    | Project name    | Env var                  | Default                  |
    |-----------------|--------------------------|--------------------------|
    | `nextjs-app`    | `APP_BASE_NEXTJS_APP`    | `http://localhost:3001`  |
    | `nextjs-pages`  | `APP_BASE_NEXTJS_PAGES`  | `http://localhost:3002`  |
    | `sveltekit`     | `APP_BASE_SVELTEKIT`     | `http://localhost:3003`  |
    | `nuxt`          | `APP_BASE_NUXT`          | `http://localhost:3004`  |
    | `astro-vanilla` | `APP_BASE_ASTRO_VANILLA` | `http://localhost:3005`  |
    | `astro-solid`   | `APP_BASE_ASTRO_SOLID`   | `http://localhost:3006`  |
    | `qwik`          | `APP_BASE_QWIK`          | `http://localhost:3007`  |
    | `solidstart`    | `APP_BASE_SOLIDSTART`    | `http://localhost:3008`  |

  - When `E2E_PROJECT` env var is set, the `testDir` and project list should still be full — the env var is used in the Makefile/Docker entrypoint to pass `--project=$E2E_PROJECT` to the CLI, not filtered here.
  - `testDir: './tests'`
  - `use.headless: true` (Chromium headless)
  - No `globalSetup` / `globalTeardown`

- `packages/e2e/tests/` directory — empty placeholder (`.gitkeep` or just the directory ready for spec files)

Do NOT create any spec files in this slice.

## Acceptance criteria

- `packages/e2e` is picked up by the pnpm workspace (`packages/*` glob)
- `pnpm --filter @benchmark/e2e typecheck` passes with no errors
- `playwright.config.ts` defines exactly 8 projects with the correct env-var baseURL pattern
- `pnpm --filter @benchmark/e2e test --list` exits without crashing (zero tests is acceptable at this stage)

## Blocked by

None — can start immediately.

## User stories addressed

- User story 1 (per-app `--project` flag)
- User story 2 (all-apps parallel run)
- User story 10 (shared assertions across all 8 apps)
