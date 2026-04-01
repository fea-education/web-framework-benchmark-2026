# Web Framework Benchmark 2026 — Monorepo Conventions

## What this project is

A pnpm workspaces monorepo containing eight optimally-implemented e-commerce applications (one per framework variant), a shared Hono API, a shared data package, and an automated Playwright + Lighthouse benchmark runner. The goal is reproducible, side-by-side performance comparison across SSG, SSR, and CSR rendering modes under controlled latency conditions.

## Implementations

Per-implementation specs, slice state, and agent instructions live under `implementations/<NN-slug>/`. Directories are prefixed with a two-digit number to make the history order explicit:

```
implementations/
  01-web-framework-benchmark-2026/
    CLAUDE.md       <- agent resume protocol for this implementation
    prd.md          <- full product spec
    prd.json        <- slice state tracker (passes: true/false/"aborted")
    progress.txt    <- append-only learnings log
    issues/         <- per-slice spec files
    errors/         <- abort logs (runtime-generated)
  02-next-implementation/
    ...
```

To run an implementation with Ralph:
```bash
./scripts/ralph/ralph.sh --impl 01-web-framework-benchmark-2026
./scripts/ralph/ralph.sh --impl 01-web-framework-benchmark-2026 --tool claude 20
```

## Environment requirements

- Node.js 20+
- pnpm 9+
- Docker and Docker Compose v2 (`docker compose` not `docker-compose`)
- `jq` (for inspecting `prd.json` state if needed)

Check versions before starting:
```
node --version
pnpm --version
docker compose version
```

## Quality checks (must pass before marking a slice done)

```
# From repo root:
pnpm typecheck        # TypeScript — no errors
pnpm test             # Run all tests in the affected package(s)
pnpm build            # Production build of the affected package(s)
```

For framework app slices (06–13), also verify:
```
docker compose up <service-name> --build -d
curl http://localhost:<port>/health   # or the app's root route
docker compose down
```

A slice is only `passes: true` when ALL checks above are green. Do not mark passes if tests are skipped or if the build produces TypeScript errors.

## Monorepo conventions

- Package manager: pnpm. Never use npm or yarn.
- All packages live under `packages/`. Each framework app is also a package.
- Root `tsconfig.json` in strict mode; every package extends it with `"extends": "../../tsconfig.json"`.
- Test runner: vitest (preferred) or the framework's native test tooling where vitest is impractical.
- Tailwind v4: shared config at repo root; each package extends it. No CSS-in-JS, no runtime style overhead.
- All TypeScript types for product data come from `packages/data`. Never duplicate them.
- `packages/api` is the single source of product data for all framework apps. No per-app mock data.

## Framework app conventions (slices 06–13)

Each app package must contain:
- `STRATEGY.md` — documents the rendering mode chosen per page (listing, detail, filter, cart) and the rationale
- `Dockerfile` — multi-stage production build (not dev server)
- A registered service in `docker-compose.yml` replacing the stub placeholder from slice 04
- All four pages: product listing, product detail (`/products/[id]`), category/filter (`/filter`), cart (`/cart`)
- Native image optimisation component (next/image, astro:assets, @nuxt/image, etc.)
- Tailwind v4 extending the shared root config
- TypeScript with no errors

Rendering strategy per page (each framework chooses its idiomatic optimal approach):
- Product listing: SSG or equivalent
- Product detail: SSR or streaming
- Category/filter: CSR (client-side filtering by category, price range, and rating)
- Cart: CSR state management (add, remove, quantity update)

## API and latency

- Shared API runs at `http://api:3000` inside the Docker network (service name `api`)
- For local development outside Docker: `http://localhost:3000`
- `LATENCY_MS` env var controls delay on data endpoints. Default: `0`
- Latency presets for benchmark: `0`, `500`, `1500` ms
- `/health` endpoint never has latency applied

## Docker conventions

- All containers run production builds
- All services on the same Docker network (`benchmark-net` or equivalent)
- Framework apps reference the API by service name (`api`), not by IP or localhost
- `LATENCY_MS` is passed to the `api` service; the benchmark runner overrides it per preset batch

## What NOT to do

- Do not install Prisma, any ORM, or any database — data is a static JSON fixture in `packages/data`
- Do not add authentication, checkout flows, or payment handling — out of scope
- Do not implement ISR, AI workloads, or cloud deployment — out of scope
- Do not add Angular, Remix, or any framework not in the PRD's framework variants list
- Do not run dev servers in Docker — production builds only
- Do not duplicate `Product`, `Category`, `CartItem`, or `ApiResponse<T>` types — import from `packages/data`
- Do not add visual regression tests or accessibility auditing — out of scope


