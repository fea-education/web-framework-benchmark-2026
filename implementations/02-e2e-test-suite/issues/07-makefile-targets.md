# Makefile targets for all execution modes

**Type:** AFK
**Blocked by:** Slice 06

---

## What to build

Extend the root `Makefile` with all four execution modes and all per-app e2e targets. Also add the `"test:e2e"` convenience script to root `package.json`.

### Current `Makefile` state

The Makefile currently contains only:

```makefile
.PHONY: implement

implement:
	./scripts/ralph/ralph.sh --tool opencode 50
```

### Targets to add

Add the following targets. Preserve the existing `implement` target unchanged.

```makefile
.PHONY: apps test\:e2e benchmark \
	test\:e2e-nextjs-app test\:e2e-nextjs-pages \
	test\:e2e-sveltekit test\:e2e-nuxt \
	test\:e2e-astro-vanilla test\:e2e-astro-solid \
	test\:e2e-qwik test\:e2e-solidstart

## Start all apps for manual exploration (detached)
apps:
	docker compose --profile apps up --build -d

## Run the full e2e suite against all 8 apps in parallel
test:e2e:
	docker compose --profile e2e run --rm e2e

## Run e2e for a single app (only that app + api starts)
test:e2e-nextjs-app:
	docker compose --profile e2e-nextjs-app run --rm e2e-nextjs-app

test:e2e-nextjs-pages:
	docker compose --profile e2e-nextjs-pages run --rm e2e-nextjs-pages

test:e2e-sveltekit:
	docker compose --profile e2e-sveltekit run --rm e2e-sveltekit

test:e2e-nuxt:
	docker compose --profile e2e-nuxt run --rm e2e-nuxt

test:e2e-astro-vanilla:
	docker compose --profile e2e-astro-vanilla run --rm e2e-astro-vanilla

test:e2e-astro-solid:
	docker compose --profile e2e-astro-solid run --rm e2e-astro-solid

test:e2e-qwik:
	docker compose --profile e2e-qwik run --rm e2e-qwik

test:e2e-solidstart:
	docker compose --profile e2e-solidstart run --rm e2e-solidstart

## Run the Lighthouse benchmark suite (sequential, all apps)
benchmark:
	docker compose --profile benchmark run --rm benchmark
```

### Root `package.json` script

Add to the `"scripts"` block:

```json
"test:e2e": "pnpm --filter @benchmark/e2e test"
```

This allows running e2e locally (outside Docker) when apps are already up via `make apps`.

## Acceptance criteria

- `make apps` starts `api` + all 8 framework app containers in detached mode (build if needed)
- `make test:e2e` triggers the full Playwright suite via Docker (blocks until done, exits with test exit code)
- `make test:e2e-sveltekit` starts only `api` + `sveltekit` + `e2e-sveltekit` and runs only the `sveltekit` Playwright project
- `make benchmark` triggers the Lighthouse benchmark runner via Docker
- `pnpm test:e2e` (root script) invokes `pnpm --filter @benchmark/e2e test` correctly
- `make --dry-run test:e2e` prints the expected `docker compose` command without error

## Blocked by

- Slice 06 (Dockerfile + compose service + profiles must exist before Makefile targets reference them)

## User stories addressed

- User story 1 (`make test:e2e-<app>` single-app iteration)
- User story 2 (`make test:e2e` full parallel suite)
