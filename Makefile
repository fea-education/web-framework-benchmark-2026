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

## Start all apps for manual exploration (detached)
apps:
	docker compose --profile apps up --build -d

## Run the full e2e suite against all 8 apps in parallel
test\:e2e:
	docker compose --profile e2e run --rm e2e

## Run e2e for a single app (only that app + api starts)
test\:e2e-nextjs-app:
	docker compose --profile e2e-nextjs-app run --rm e2e-nextjs-app

test\:e2e-nextjs-pages:
	docker compose --profile e2e-nextjs-pages run --rm e2e-nextjs-pages

test\:e2e-sveltekit:
	docker compose --profile e2e-sveltekit run --rm e2e-sveltekit

test\:e2e-nuxt:
	docker compose --profile e2e-nuxt run --rm e2e-nuxt

test\:e2e-astro-vanilla:
	docker compose --profile e2e-astro-vanilla run --rm e2e-astro-vanilla

test\:e2e-astro-solid:
	docker compose --profile e2e-astro-solid run --rm e2e-astro-solid

test\:e2e-qwik:
	docker compose --profile e2e-qwik run --rm e2e-qwik

test\:e2e-solidstart:
	docker compose --profile e2e-solidstart run --rm e2e-solidstart

## Run the Lighthouse benchmark suite (sequential, all apps)
benchmark:
	docker compose --profile benchmark run --rm benchmark
