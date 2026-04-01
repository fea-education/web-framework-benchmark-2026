# packages/e2e Dockerfile + docker-compose.yml e2e service + per-app profiles

**Type:** AFK
**Blocked by:** Slice 01

---

## What to build

Add the `e2e` Docker service to the project, following the exact same multi-stage pattern as `packages/benchmark/Dockerfile`. Also add Docker Compose profiles to all existing services so all four execution modes work correctly.

### 1. `packages/e2e/Dockerfile`

Multi-stage build:

**Stage 1 — builder** (`node:20-slim`):
- `corepack enable && corepack prepare pnpm@latest --activate`
- Copy `pnpm-workspace.yaml`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`
- Copy `packages/e2e/package.json` (and `packages/data/package.json` if needed for workspace resolution)
- `pnpm install --frozen-lockfile`
- Copy `packages/e2e/` source
- Run `pnpm --filter @benchmark/e2e typecheck` (validation only — Playwright tests are not compiled, they are run from source)

**Stage 2 — runner** (`node:20-slim`):
- Install Chromium system deps via `npx playwright install --with-deps chromium`
- Copy workspace node_modules and `packages/e2e/` from builder
- Set `WORKDIR /app`
- Entrypoint: `["sh", "-c", "npx playwright test ${E2E_PROJECT:+--project=$E2E_PROJECT}"]`

The entrypoint expands `E2E_PROJECT` if set, otherwise runs all projects.

### 2. `docker-compose.yml` — new `e2e` service

Add the following service. It must be the last service defined (after all framework apps):

```yaml
e2e:
  build:
    context: .
    dockerfile: packages/e2e/Dockerfile
  profiles: [e2e]
  depends_on:
    api:          { condition: service_healthy }
    nextjs-app:   { condition: service_healthy }
    nextjs-pages: { condition: service_healthy }
    sveltekit:    { condition: service_healthy }
    nuxt:         { condition: service_healthy }
    astro-vanilla: { condition: service_healthy }
    astro-solid:  { condition: service_healthy }
    qwik:         { condition: service_healthy }
    solidstart:   { condition: service_healthy }
  environment:
    APP_BASE_NEXTJS_APP:    http://nextjs-app:3000
    APP_BASE_NEXTJS_PAGES:  http://nextjs-pages:3000
    APP_BASE_SVELTEKIT:     http://sveltekit:3000
    APP_BASE_NUXT:          http://nuxt:3000
    APP_BASE_ASTRO_VANILLA: http://astro-vanilla:3000
    APP_BASE_ASTRO_SOLID:   http://astro-solid:3000
    APP_BASE_QWIK:          http://qwik:3000
    APP_BASE_SOLIDSTART:    http://solidstart:3000
    E2E_PROJECT: ""
  volumes:
    - ./packages/e2e/playwright-report:/app/packages/e2e/playwright-report
  networks:
    - benchmark-net
```

### 3. `docker-compose.yml` — per-app e2e services

Add 8 additional service definitions, one per app, for targeted single-app runs. Each service is identical to `e2e` except:
- `profiles: [e2e-<appname>]`
- `depends_on` includes only `api` + that one app (not all 8)
- `E2E_PROJECT: <appname>` set in environment

Example for `sveltekit`:

```yaml
e2e-sveltekit:
  build:
    context: .
    dockerfile: packages/e2e/Dockerfile
  profiles: [e2e-sveltekit]
  depends_on:
    api:       { condition: service_healthy }
    sveltekit: { condition: service_healthy }
  environment:
    APP_BASE_NEXTJS_APP:    http://nextjs-app:3000
    APP_BASE_NEXTJS_PAGES:  http://nextjs-pages:3000
    APP_BASE_SVELTEKIT:     http://sveltekit:3000
    APP_BASE_NUXT:          http://nuxt:3000
    APP_BASE_ASTRO_VANILLA: http://astro-vanilla:3000
    APP_BASE_ASTRO_SOLID:   http://astro-solid:3000
    APP_BASE_QWIK:          http://qwik:3000
    APP_BASE_SOLIDSTART:    http://solidstart:3000
    E2E_PROJECT: sveltekit
  volumes:
    - ./packages/e2e/playwright-report:/app/packages/e2e/playwright-report
  networks:
    - benchmark-net
```

Repeat for all 8 apps: `nextjs-app`, `nextjs-pages`, `sveltekit`, `nuxt`, `astro-vanilla`, `astro-solid`, `qwik`, `solidstart`.

### 4. `docker-compose.yml` — `apps` profile on existing services

Add `profiles: [apps, e2e, e2e-<appname>, benchmark]` to the `api` service.

For each framework app service (e.g. `sveltekit`), add:
```yaml
profiles: [apps, e2e, e2e-sveltekit, benchmark]
```

Each app's profile list includes `apps` (manual exploration), `e2e` (full suite), `e2e-<its own name>` (single-app targeted run), and `benchmark` (Lighthouse runner). Each app does NOT include the other apps' `e2e-*` profiles.

Also add `profiles: [benchmark]` to the existing `benchmark` service if not already present.

## Acceptance criteria

- `docker build -f packages/e2e/Dockerfile .` succeeds from repo root
- `docker compose --profile e2e config` shows `e2e` service with all 9 `depends_on` entries
- `docker compose --profile e2e-sveltekit config` shows `e2e-sveltekit` service depending only on `api` and `sveltekit`
- `docker compose --profile apps config` lists `api` + all 8 framework app services (and no e2e or benchmark services)
- `docker compose --profile benchmark config` lists `api` + all 8 apps + `benchmark` (no e2e service)
- `pnpm typecheck` passes (no TypeScript errors introduced in compose/Dockerfile changes)

## Blocked by

- Slice 01 (`packages/e2e` scaffold — Dockerfile needs the package to exist)

## User stories addressed

- User story 1 (single-app `make test:e2e-<app>`)
- User story 2 (all-apps parallel `make test:e2e`)
- User story 9 (HTML report output volume)
