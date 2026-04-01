---
title: "PRD: E2E Functional Test Suite — Web Framework Benchmark"
---

## Problem Statement

All 14 slices of the benchmark suite are marked `passes: true`, yet the applications contain real functional regressions that no existing test catches:

- **SvelteKit** renders the product listing inside the cart page, mixing page concerns.
- **Nuxt** fails to load products from the API on the listing page.
- **Astro Vanilla** adds a product to the cart from the listing page and redirects to `/cart`, instead of staying on the listing.
- **Astro Solid** has broken client-side routing — links between pages do not navigate correctly.
- **Qwik** gives no visible feedback to the user after a product is added to the cart.
- **SolidStart** has no "Add to Cart" button on the product detail page.

The existing benchmark runner (`packages/benchmark`) measures Lighthouse performance metrics only. It does not verify that any app actually works correctly. There is no mechanism to detect functional regressions across the 8 framework apps.

As a result:
- Benchmark performance numbers are meaningless for apps that are functionally broken.
- UX inconsistency between apps makes the benchmark comparison unfair — some apps offer incomplete user journeys.
- There is no automated way to confirm that a fix to one app didn't break another.

## Solution

Build a **`packages/e2e` package** — a `@playwright/test`-based functional correctness suite that tests all four user-facing pages across all eight framework apps against a shared set of behavioural assertions. The suite enforces **UX consistency**: every app must implement the same user journeys in the same way. Failing assertions document exactly what is broken, without modifying the apps.

The suite runs via Docker Compose alongside the existing apps and benchmark service, integrated into the project's Makefile.

### Docker Compose Execution Modes

Four distinct execution modes are supported via Docker Compose profiles:

| Makefile target | Profile | What starts |
|---|---|---|
| `make apps` | `apps` | `api` + all 8 framework apps (for manual exploration) |
| `make test:e2e` | `e2e` | `api` + all 8 apps + `e2e` container (all projects, parallel) |
| `make test:e2e-<app>` | `e2e-<appname>` | `api` + that one app + `e2e` container (`E2E_PROJECT=<app>`) |
| `make benchmark` | `benchmark` | `api` + all 8 apps + `benchmark` container (sequential) |

The `e2e` container image installs Playwright and Chromium; `depends_on` service health checks enforce startup order, matching the pattern of the existing `benchmark` service.

## User Stories

1. As a developer fixing a bug in SvelteKit, I want to run `make test:e2e-sveltekit` and see only SvelteKit's tests, so that I can iterate quickly without waiting for 7 other apps to build.
2. As a developer reviewing a PR, I want to run `make test:e2e` and see a pass/fail summary for all 8 apps in parallel, so that I can confirm no regressions were introduced.
3. As a developer, I want a test to fail if the cart page shows product listing content, so that the SvelteKit page-mixing bug is caught automatically.
4. As a developer, I want a test to fail if the product listing page shows zero product cards, so that the Nuxt API loading bug is caught automatically.
5. As a developer, I want a test to fail if clicking "Add to Cart" on the listing page redirects to `/cart`, so that the Astro Vanilla UX bug is caught automatically.
6. As a developer, I want a test to fail if navigating between pages results in a 404 or blank page, so that the Astro Solid routing bug is caught automatically.
7. As a developer, I want a test to fail if no visible feedback appears after adding to cart, so that the Qwik UX omission is caught automatically.
8. As a developer, I want a test to fail if the product detail page has no "Add to Cart" button, so that the SolidStart missing-feature bug is caught automatically.
9. As a developer, I want an HTML report with screenshots attached to every failing test, so that I can diagnose visual regressions without re-running tests.
10. As a researcher, I want all 8 apps tested against the same assertions, so that I can confirm functional parity before trusting the benchmark performance numbers.

## Implementation Decisions

### Package

- **Name:** `@benchmark/e2e`
- **Location:** `packages/e2e/`
- **Test runner:** `@playwright/test` (not programmatic Playwright — full `playwright.config.ts` with `test()`/`expect()` API)
- **Browser:** Chromium headless only (consistent with `packages/benchmark`)
- **TypeScript:** strict, extends root `tsconfig.json`

### Playwright Projects

One Playwright project per framework app. Each project sets its own `baseURL` via env var with a `localhost` default:

| Project name | Env var | Default (local) | Docker service URL |
|---|---|---|---|
| `nextjs-app` | `APP_BASE_NEXTJS_APP` | `http://localhost:3001` | `http://nextjs-app:3000` |
| `nextjs-pages` | `APP_BASE_NEXTJS_PAGES` | `http://localhost:3002` | `http://nextjs-pages:3000` |
| `sveltekit` | `APP_BASE_SVELTEKIT` | `http://localhost:3003` | `http://sveltekit:3000` |
| `nuxt` | `APP_BASE_NUXT` | `http://localhost:3004` | `http://nuxt:3000` |
| `astro-vanilla` | `APP_BASE_ASTRO_VANILLA` | `http://localhost:3005` | `http://astro-vanilla:3000` |
| `astro-solid` | `APP_BASE_ASTRO_SOLID` | `http://localhost:3006` | `http://astro-solid:3000` |
| `qwik` | `APP_BASE_QWIK` | `http://localhost:3007` | `http://qwik:3000` |
| `solidstart` | `APP_BASE_SOLIDSTART` | `http://localhost:3008` | `http://solidstart:3000` |

When `E2E_PROJECT` env var is set, only that project runs (`playwright test --project=$E2E_PROJECT`).

### Spec Files

Four shared spec files — one per page — under `packages/e2e/tests/`:

```
tests/
  listing.spec.ts     → / (product listing page)
  detail.spec.ts      → /products/:id (product detail page)
  filter.spec.ts      → /filter (category/filter page)
  cart.spec.ts        → /cart (cart page)
```

All 8 Playwright projects run all 4 spec files. Failures are reported per project, making it immediately clear which app fails which flow.

### Selector Strategy

**ARIA/role selectors only** — no `data-testid`, no CSS classes. This enforces UX consistency: if an app cannot be selected by role or accessible text, it must be fixed to use semantic HTML. Selectors used across all specs:

| Element | Selector |
|---|---|
| Product card (listing) | `[role="article"]` or `[role="listitem"]` within a product grid |
| Product name on card | heading within the card |
| "Add to Cart" button | `getByRole('button', { name: /add to cart/i })` |
| Nav cart link | `getByRole('link', { name: /cart/i })` |
| Cart count in nav | element adjacent to the cart link containing a number |
| Empty cart message | `getByText(/your cart is empty/i)` |
| Category filter control | `getByRole('combobox')` or `getByRole('listbox')` |
| Price range input | `getByRole('slider')` or `input[type="range"]` |
| Toast / success feedback | `getByRole('status')` or `getByText(/added to cart/i)` |

Apps that currently use non-semantic markup will fail the relevant assertions — this is intentional and documents what needs fixing.

### Assertion Specifications

#### `listing.spec.ts` — Product Listing Page (`/`)

| # | Assertion | Catches |
|---|---|---|
| L1 | Page returns HTTP 200 | All |
| L2 | At least 1 product card is visible | Nuxt API loading bug |
| L3 | Each visible card contains a product name (heading) | All |
| L4 | Each visible card contains a price (text matching `/\$[\d.]+/`) | All |
| L5 | Each card contains a link to `/products/` | All |
| L6 | Nav contains a link with text matching `/cart/i` | All |
| L7 | The page does NOT contain an element matching the empty-cart text | SvelteKit page-mixing bug |
| L8 | Clicking a product card navigates to `/products/[id]` (URL changes) | Astro Solid routing bug |

#### `detail.spec.ts` — Product Detail Page (`/products/:id`)

Navigate to the detail page of the first product found on the listing. Then:

| # | Assertion | Catches |
|---|---|---|
| D1 | Page returns HTTP 200 | All |
| D2 | Product name (h1) is visible | All |
| D3 | Price text matching `/\$[\d.]+/` is visible | All |
| D4 | An "Add to Cart" button is present and enabled | SolidStart missing button |
| D5 | Clicking "Add to Cart" does NOT change the URL (no redirect) | Astro Vanilla redirect bug |
| D6 | After clicking "Add to Cart", visible feedback appears: element matching `/added to cart/i` is visible OR the nav cart count is greater than 0 | Qwik no-feedback bug |
| D7 | After clicking "Add to Cart", nav cart count increments (from 0 to ≥1) | All |

#### `filter.spec.ts` — Filter Page (`/filter`)

| # | Assertion | Catches |
|---|---|---|
| F1 | Page returns HTTP 200 | All |
| F2 | At least 1 product card is visible on load | All |
| F3 | A category filter control is present | All |
| F4 | Selecting a specific category reduces the visible product count | All |
| F5 | A price range input is present | All |
| F6 | Setting the price range to a low maximum hides higher-priced products | All |

#### `cart.spec.ts` — Cart Page (`/cart`)

Test 1 — Empty cart:

| # | Assertion | Catches |
|---|---|---|
| C1 | Page returns HTTP 200 | All |
| C2 | Empty cart message (`/your cart is empty/i`) is visible | All |
| C3 | No product cards (`[role="article"]`) are visible on the empty cart page | SvelteKit page-mixing bug |

Test 2 — Cart after adding a product (navigates from detail page, adds item, then navigates to `/cart`):

| # | Assertion | Catches |
|---|---|---|
| C4 | The added product's name is visible in the cart | All |
| C5 | A quantity control (input or button) is present for the cart item | All |
| C6 | Incrementing quantity updates the displayed quantity | All |
| C7 | Clicking remove/delete removes the item from the cart | All |
| C8 | After removing the only item, the empty cart message reappears | All |

### Parallelism

`fullyParallel: true` in `playwright.config.ts`. All 8 projects and all tests within them run concurrently. Since each project targets a different base URL (different container/port), there are no shared resources and no conflicts.

### Reporting

- **Reporters:** `['html', 'list']`
- **Output dir:** `packages/e2e/playwright-report/`
- **Screenshots:** `'only-on-failure'`
- **Video:** off
- **Trace:** `'on-first-retry'`

### Docker Service

New `e2e` service in `docker-compose.yml`:

```yaml
e2e:
  build:
    context: .
    dockerfile: packages/e2e/Dockerfile
  profiles: [e2e]
  depends_on:
    api:        { condition: service_healthy }
    nextjs-app: { condition: service_healthy }
    nextjs-pages: { condition: service_healthy }
    sveltekit:  { condition: service_healthy }
    nuxt:       { condition: service_healthy }
    astro-vanilla: { condition: service_healthy }
    astro-solid: { condition: service_healthy }
    qwik:       { condition: service_healthy }
    solidstart: { condition: service_healthy }
  environment:
    APP_BASE_NEXTJS_APP: http://nextjs-app:3000
    APP_BASE_NEXTJS_PAGES: http://nextjs-pages:3000
    APP_BASE_SVELTEKIT: http://sveltekit:3000
    APP_BASE_NUXT: http://nuxt:3000
    APP_BASE_ASTRO_VANILLA: http://astro-vanilla:3000
    APP_BASE_ASTRO_SOLID: http://astro-solid:3000
    APP_BASE_QWIK: http://qwik:3000
    APP_BASE_SOLIDSTART: http://solidstart:3000
    E2E_PROJECT: ""
  volumes:
    - ./packages/e2e/playwright-report:/app/packages/e2e/playwright-report
  networks:
    - benchmark-net
```

Per-app profiles (`e2e-sveltekit`, etc.) are separate service definitions or overrides that set `E2E_PROJECT` and reduce `depends_on` to `api` + that specific app.

### Dockerfile (`packages/e2e/Dockerfile`)

Multi-stage build mirroring `packages/benchmark/Dockerfile`:

1. **builder** stage — installs pnpm, copies workspace manifests, runs `pnpm install --frozen-lockfile`, builds `packages/data` and `packages/e2e`
2. **runner** stage — `node:20-slim`, installs Chromium via `npx playwright install --with-deps chromium`, copies built artefacts, runs `playwright test` as entrypoint

### Makefile Targets

Extend the existing `Makefile`:

```makefile
apps:
	docker compose --profile apps up --build -d

test:e2e:
	docker compose --profile e2e run --rm e2e

test:e2e-nextjs-app:
	docker compose --profile e2e-nextjs-app run --rm -e E2E_PROJECT=nextjs-app e2e

test:e2e-nextjs-pages:
	docker compose --profile e2e-nextjs-pages run --rm -e E2E_PROJECT=nextjs-pages e2e

test:e2e-sveltekit:
	docker compose --profile e2e-sveltekit run --rm -e E2E_PROJECT=sveltekit e2e

test:e2e-nuxt:
	docker compose --profile e2e-nuxt run --rm -e E2E_PROJECT=nuxt e2e

test:e2e-astro-vanilla:
	docker compose --profile e2e-astro-vanilla run --rm -e E2E_PROJECT=astro-vanilla e2e

test:e2e-astro-solid:
	docker compose --profile e2e-astro-solid run --rm -e E2E_PROJECT=astro-solid e2e

test:e2e-qwik:
	docker compose --profile e2e-qwik run --rm -e E2E_PROJECT=qwik e2e

test:e2e-solidstart:
	docker compose --profile e2e-solidstart run --rm -e E2E_PROJECT=solidstart e2e

benchmark:
	docker compose --profile benchmark run --rm benchmark
```

### Root `package.json`

Add convenience script: `"test:e2e": "pnpm --filter @benchmark/e2e test"`

### No globalSetup

No `globalSetup` / `globalTeardown` hooks. Docker Compose's `depends_on: condition: service_healthy` guarantees all apps are ready before the e2e container starts. When running locally outside Docker (development), the developer starts apps manually or via `make apps`.

## Acceptance Criteria

1. `packages/e2e` is a valid pnpm workspace package (`package.json` with `name: "@benchmark/e2e"`)
2. `playwright.config.ts` defines exactly 8 projects, one per framework app, with env-var base URLs defaulting to `localhost:300x`
3. Four spec files exist: `listing.spec.ts`, `detail.spec.ts`, `filter.spec.ts`, `cart.spec.ts`
4. All assertions from the spec table above are implemented
5. `packages/e2e/Dockerfile` builds successfully and produces a working Playwright runner image
6. `docker-compose.yml` contains the `e2e` service and per-app `e2e-<name>` profile entries
7. `Makefile` contains `make test:e2e` and `make test:e2e-<appname>` for all 8 apps
8. Running `make test:e2e` produces an HTML report in `packages/e2e/playwright-report/`
9. The 6 known bugs cause specific named test assertions to fail (not error/crash), with screenshots attached in the report
10. The 2 currently-correct apps (nextjs-app, nextjs-pages) pass all assertions
11. `pnpm typecheck` passes with no errors in `packages/e2e`

## Out of Scope

- Fixing the 6 identified bugs in the app packages — the test suite documents failures, not resolves them
- Visual regression testing (pixel-level screenshot comparison)
- Accessibility auditing
- Cross-browser testing (Firefox, WebKit)
- Performance assertions (these belong in `packages/benchmark`)
- Authentication, checkout, or payment flows
- CI/CD pipeline configuration

## Slice Breakdown

| ID | Title | Blocked by |
|---|---|---|
| 01 | `packages/e2e` scaffold — `package.json`, `tsconfig.json`, `playwright.config.ts` with 8 projects | — |
| 02 | `listing.spec.ts` — all L1–L8 assertions | 01 |
| 03 | `detail.spec.ts` — all D1–D7 assertions | 01 |
| 04 | `filter.spec.ts` — all F1–F6 assertions | 01 |
| 05 | `cart.spec.ts` — all C1–C8 assertions | 01 |
| 06 | `packages/e2e/Dockerfile` + `docker-compose.yml` e2e service + per-app profiles | 01 |
| 07 | `Makefile` targets for all execution modes | 06 |
| 08 | Docker Compose `apps` profile applied to all 8 framework app services | 06 |
