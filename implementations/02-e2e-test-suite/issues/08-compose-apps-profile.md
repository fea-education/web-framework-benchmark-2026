# Docker Compose `apps` profile — apply to all 8 framework app services

**Type:** AFK
**Blocked by:** Slice 06

---

## What to build

Slice 06 adds `profiles` to the `e2e`, `e2e-*`, and `benchmark` services, and outlines the profile assignments for existing services. This slice ensures that every framework app service and the `api` service have the correct `profiles` list applied, so that `make apps` starts exactly the right set of containers.

> **Note:** Slice 06 and Slice 08 both modify `docker-compose.yml`. Implement them sequentially (or ensure the implementor applies both changes in a single edit) to avoid merge conflicts.

### Profile assignments for existing services

Apply the following `profiles` field to each existing service in `docker-compose.yml`:

| Service | Profiles |
|---|---|
| `api` | `[apps, e2e, e2e-nextjs-app, e2e-nextjs-pages, e2e-sveltekit, e2e-nuxt, e2e-astro-vanilla, e2e-astro-solid, e2e-qwik, e2e-solidstart, benchmark]` |
| `nextjs-app` | `[apps, e2e, e2e-nextjs-app, benchmark]` |
| `nextjs-pages` | `[apps, e2e, e2e-nextjs-pages, benchmark]` |
| `sveltekit` | `[apps, e2e, e2e-sveltekit, benchmark]` |
| `nuxt` | `[apps, e2e, e2e-nuxt, benchmark]` |
| `astro-vanilla` | `[apps, e2e, e2e-astro-vanilla, benchmark]` |
| `astro-solid` | `[apps, e2e, e2e-astro-solid, benchmark]` |
| `qwik` | `[apps, e2e, e2e-qwik, benchmark]` |
| `solidstart` | `[apps, e2e, e2e-solidstart, benchmark]` |
| `benchmark` (existing) | `[benchmark]` |

### Why this slice is separate from Slice 06

Slice 06 adds new services (`e2e`, `e2e-*`). This slice modifies existing services. Keeping them separate avoids a single oversized diff and makes it easier for the agent to apply changes incrementally without breaking existing service configurations.

### Important: services without a profile

Before this slice, all existing services have **no profile**, meaning `docker compose up` starts them all. After this slice, every service has at least one profile. This means `docker compose up` (with no `--profile` flag) will start **nothing** — which is intentional. All execution must go through a named profile or a Makefile target.

Verify this is acceptable for the project before merging.

## Acceptance criteria

- `docker compose --profile apps up --dry-run` shows `api` + all 8 framework app services starting, and no `e2e` or `benchmark` services
- `docker compose --profile benchmark up --dry-run` shows `api` + all 8 apps + `benchmark`, no `e2e` services
- `docker compose up` (no profile) starts zero services (all services now require a profile)
- `docker compose --profile apps config` does not include `e2e`, `e2e-*`, or `benchmark` services
- No existing service `healthcheck`, `depends_on`, `environment`, `ports`, or `networks` values are modified — only `profiles` is added

## Blocked by

- Slice 06 (must know the full profile name list before applying them to existing services)

## User stories addressed

- User story 1 (per-app targeted runs)
- User story 2 (full suite run)
