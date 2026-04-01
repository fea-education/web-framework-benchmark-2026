# Slice 02 — Fix Nuxt

**App:** `packages/nuxt/`
**Profile:** `e2e-nuxt`
**E2E project:** `nuxt`

## Failing assertions (baseline)

Run before starting:
```bash
docker compose --profile e2e-nuxt build
docker compose --profile e2e-nuxt run --rm -e E2E_PROJECT=nuxt e2e
```

Expected failures:
- **L2** — Zero product cards visible on the listing page (`/`). The API call returns no data or fails silently.

## Root cause

The Docker Compose service for Nuxt passes the environment variable:
```yaml
NUXT_PUBLIC_API_BASE: http://api:3000
```

Nuxt's auto-env-mapping converts `NUXT_PUBLIC_<KEY>` to `runtimeConfig.public.<camelCasedKey>`. So `NUXT_PUBLIC_API_BASE` maps to `runtimeConfig.public.apiBase`.

However, `nuxt.config.ts` defines the key as `apiUrl`:
```ts
runtimeConfig: {
  public: {
    apiUrl: process.env['API_URL'] ?? 'http://localhost:3000',
  },
}
```

And `pages/index.vue` reads `config.public.apiUrl`.

Result: `config.public.apiUrl` is never overridden by the Docker env var — it stays as `'http://localhost:3000'` (the fallback), which is unreachable inside the Docker container network.

## Fix instructions

### Option A (recommended — minimum blast radius)

Update `docker-compose.yml` to change the Nuxt service env var from:
```yaml
NUXT_PUBLIC_API_BASE: http://api:3000
```
to:
```yaml
NUXT_PUBLIC_API_URL: http://api:3000
```

This correctly maps to `runtimeConfig.public.apiUrl` via Nuxt's auto-env mechanism. No app code changes needed.

### Option B (app code change)

Change `nuxt.config.ts` to rename the key to `apiBase`:
```ts
runtimeConfig: {
  public: {
    apiBase: process.env['API_URL'] ?? 'http://localhost:3000',
  },
}
```
Then update all consumers (`pages/index.vue`, `pages/products/[id].vue`, `pages/filter.vue`) to use `config.public.apiBase`.

**Use Option A** — it is a single-line change to `docker-compose.yml` with zero risk of introducing TypeScript errors in the app.

### Step 1 — Verify the hypothesis

Before changing anything, confirm by reading:
- `docker-compose.yml` (Nuxt service env vars)
- `packages/nuxt/nuxt.config.ts` (runtimeConfig definition)
- `packages/nuxt/pages/index.vue` (where the key is consumed)

### Step 2 — Apply the fix

Change `NUXT_PUBLIC_API_BASE` to `NUXT_PUBLIC_API_URL` in the Nuxt service definition in `docker-compose.yml`.

### Step 3 — Verify cart and detail pages also use the correct key

Check `pages/products/[id].vue` and `pages/cart.vue` and `pages/filter.vue` — they may also call `useFetch` with `config.public.apiUrl`. If the env var fix is applied consistently they should work too.

Also check `stores/cart.ts` and `stores/filter.ts` for any API URL references.

## Acceptance criteria

All of the following pass with `E2E_PROJECT=nuxt`:
- L1–L8 (listing page)
- D1–D7 (detail page)
- F1–F6 (filter page)
- C1–C8 (cart page)

Plus:
- `pnpm typecheck` passes in `packages/nuxt/`
- `docker compose --profile e2e-nuxt build` succeeds
