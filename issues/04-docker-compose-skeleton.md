# Docker Compose orchestration skeleton

**Type:** AFK
**Blocked by:** Slice 02

---

## What to build

Create the root `docker-compose.yml` that will ultimately orchestrate all containers. This slice wires the API service and defines placeholder services for all eight framework apps. The goal is a working compose stack where `docker compose up` starts the API and all health checks pass — framework app containers are stubs at this stage.

Specifically:

- `docker-compose.yml` at repo root with:
  - `api` service: builds `packages/api`, exposes port, accepts `LATENCY_MS` env var (default `0`)
  - One stub service per framework app (`astro-vanilla`, `astro-solid`, `sveltekit`, `nuxt`, `nextjs-app`, `nextjs-pages`, `qwik`, `solidstart`) — can use a minimal `node:alpine` image returning a health-check response until the real app is built
  - A shared Docker network so all services can reference `api` by service name
  - `benchmark` service placeholder (no-op until slice 14)
- `Dockerfile` for `packages/api` (multi-stage: build TypeScript, run dist)
- `.env.example` documenting `LATENCY_MS` and any other compose-level variables
- `README.md` at repo root with single-command instructions: `docker compose up`

See PRD §"Docker Compose" for full spec.

## Acceptance criteria

- `docker compose up` completes without errors
- `GET http://localhost:<api-port>/health` returns `{ status: "ok" }` from within the compose network
- All eight framework app placeholder services start and pass their stub health checks
- `LATENCY_MS` is correctly passed to the `api` service
- The `benchmark` runner placeholder service starts without error
- Production build (not dev server) pattern is established in the API Dockerfile

## Blocked by

- Blocked by slice 02 (shared API server with latency simulation)

## User stories addressed

- User story 13
- User story 25
