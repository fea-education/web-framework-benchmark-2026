# Slice 01 — Fix SvelteKit

**App:** `packages/sveltekit/`
**Profile:** `e2e-sveltekit`
**E2E project:** `sveltekit`

## Failing assertions (baseline)

Run before starting:
```bash
docker compose --profile e2e-sveltekit build
docker compose --profile e2e-sveltekit run --rm -e E2E_PROJECT=sveltekit e2e
```

Expected failures:
- **C3** — `[role="article"]` count should be 0 on empty cart, but the "Add Products" section on the cart page renders product cards with `role="article"` (or the cart items themselves use that role when loaded from the API).
- **C4–C8** — Cart items added on the detail page are not visible when navigating to `/cart` (in-memory store resets on navigation; no localStorage persistence).

## Root cause

`src/routes/cart/+page.svelte` contains an "Add Products" section that:
1. Fetches all products from the API on `onMount`.
2. Renders them in a grid. If those product buttons render with `role="article"`, C3 fails.
3. Cart state is a module-level Svelte `writable` store. It resets between page navigations because SvelteKit's CSR store lives only for the current module instance in the current page load.

`src/routes/products/[id]/+page.svelte` likely has no "Add to Cart" button that interacts with the shared cart store or localStorage — the test's C4–C8 setup flow navigates listing → detail → "Add to Cart" → `/cart`.

## Fix instructions

### Step 1 — Read current state of all affected files

Before editing, read:
- `src/routes/cart/+page.svelte`
- `src/routes/products/[id]/+page.svelte`
- `src/routes/products/[id]/+page.server.ts`
- `src/routes/+layout.svelte`

### Step 2 — Fix the cart page

1. **Remove the "Add Products" section** entirely from `cart/+page.svelte`. The cart page should only display items that were added elsewhere (detail page), not be a product browsing surface.
2. **Add localStorage hydration**: in `onMount`, read `localStorage.getItem('cart')`, parse the JSON, and initialise the `cartItems` store. On every store change, write back to `localStorage`.
3. **Use `role="article"` on cart item wrappers** — each `{#each $cartItems as item}` wrapper div should have `role="article"` so C4–C7 can locate it.
4. **Ensure quantity buttons have accessible names** matching `/increase|increment|\+/i` (use `aria-label="Increase quantity"` or `aria-label="+"`) and `/remove|delete/i` (use `aria-label="Remove"` or text "Remove").

### Step 3 — Fix the detail page

Read `src/routes/products/[id]/+page.svelte`. If it does not have an "Add to Cart" button that writes to localStorage:
1. Add a `<button>` with text "Add to Cart".
2. On click: read localStorage cart, upsert the product, write back, show feedback text "Added to cart!" for 2 seconds.
3. Update the nav cart count (read from localStorage, display in `+layout.svelte` nav).

### Step 4 — Fix the layout nav cart count

In `src/routes/+layout.svelte`, add a reactive cart count to the nav's Cart link by reading from localStorage on mount. The nav must show a count matching `/^[1-9]\d*$/` after adding an item (D7).

## Acceptance criteria

All of the following pass with `E2E_PROJECT=sveltekit`:
- L1–L8 (listing page)
- D1–D7 (detail page)
- F1–F6 (filter page)
- C1–C8 (cart page)

Plus:
- `pnpm typecheck` passes in `packages/sveltekit/`
- `docker compose --profile e2e-sveltekit build` succeeds
