# Shared API server with latency simulation

**Type:** AFK
**Blocked by:** Slice 01

---

## What to build

Implement `packages/api`: a Hono server on Node.js that serves the shared product catalogue and simulates backend latency via an environment variable. All eight framework apps will point to this single API instance.

Write tests first, then implement: integration tests against the running server must be written before the implementation is considered complete.

Specifically:

- `packages/api/` with Hono on Node.js, TypeScript throughout
- Imports types and seed data from `packages/data`
- Endpoints:
  - `GET /products` — returns all 100 products as `ApiResponse<Product[]>`
  - `GET /products/:id` — returns a single product as `ApiResponse<Product>` or 404
  - `GET /categories` — returns 8 categories as `ApiResponse<Category[]>`
  - `GET /health` — returns `{ status: "ok" }` with no latency delay
- `LATENCY_MS` environment variable (default `0`): applied as a uniform `setTimeout` on all data endpoint handlers (`/products`, `/products/:id`, `/categories`). Must NOT apply to `/health` or static asset serving.
- Integration tests:
  - `GET /products` returns an array of exactly 100 products conforming to `Product`
  - `GET /products/:id` returns a single product for a valid id
  - `GET /products/:id` returns 404 for an unknown id
  - `GET /categories` returns exactly 8 categories
  - With `LATENCY_MS=500`, response time for data endpoints is ≥ 500 ms
  - With `LATENCY_MS=500`, `GET /health` response time is < 50 ms
  - Response shapes match the `ApiResponse<T>` contract

See PRD §"Shared API (`packages/api`)" and §"Testing Decisions" for full spec.

## Acceptance criteria

- Server starts with `node dist/index.js` (or equivalent)
- All six endpoint behaviours above are implemented and tested
- Setting `LATENCY_MS=500` delays data endpoints by ≥ 500 ms; health check is unaffected
- All integration tests pass
- No database — data loaded from `packages/data` at startup
- TypeScript builds with no errors

## Blocked by

- Blocked by slice 01 (monorepo scaffold + shared data package)

## User stories addressed

- User story 6
- User story 14
- User story 15
