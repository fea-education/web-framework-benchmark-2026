.PHONY: implement apps test\:e2e benchmark \
	test\:e2e-nextjs-app test\:e2e-nextjs-pages \
	test\:e2e-sveltekit test\:e2e-nuxt \
	test\:e2e-astro-vanilla test\:e2e-astro-solid \
	test\:e2e-qwik test\:e2e-solidstart

implement:
ifndef IMPL
	$(error IMPL is required. Usage: make implement IMPL=01-web-framework-benchmark-2026)
endif
	./scripts/ralph/ralph.sh --impl $(IMPL) --tool opencode 50

## Start all apps for manual exploration (detached).
## Always rebuilds images, recreates changed containers, removes orphans,
## and prunes dangling images left behind by the rebuild.
apps:
	docker compose --profile apps up --build --remove-orphans -d
	docker image prune -f

## Run the full e2e suite against all 8 apps in parallel
test\:e2e:
	docker compose --profile e2e run --build --rm e2e
	docker image prune -f

## Run e2e for a single app (only that app + api starts)
test\:e2e-nextjs-app:
	docker compose --profile e2e-nextjs-app run --build --rm e2e-nextjs-app
	docker image prune -f

test\:e2e-nextjs-pages:
	docker compose --profile e2e-nextjs-pages run --build --rm e2e-nextjs-pages
	docker image prune -f

test\:e2e-sveltekit:
	docker compose --profile e2e-sveltekit run --build --rm e2e-sveltekit
	docker image prune -f

test\:e2e-nuxt:
	docker compose --profile e2e-nuxt run --build --rm e2e-nuxt
	docker image prune -f

test\:e2e-astro-vanilla:
	docker compose --profile e2e-astro-vanilla run --build --rm e2e-astro-vanilla
	docker image prune -f

test\:e2e-astro-solid:
	docker compose --profile e2e-astro-solid run --build --rm e2e-astro-solid
	docker image prune -f

test\:e2e-qwik:
	docker compose --profile e2e-qwik run --build --rm e2e-qwik
	docker image prune -f

test\:e2e-solidstart:
	docker compose --profile e2e-solidstart run --build --rm e2e-solidstart
	docker image prune -f

## Run the Lighthouse benchmark suite (sequential, all apps)
benchmark:
	docker compose --profile benchmark run --build --rm benchmark
	docker image prune -f
