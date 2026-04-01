# Slice 04 — Fix Astro Solid

**App:** `packages/astro-solid/`
**Profile:** `e2e-astro-solid`
**E2E project:** `astro-solid`

## Failing assertions (baseline)

Run before starting:
```bash
docker compose --profile e2e-astro-solid build
docker compose --profile e2e-astro-solid run --rm -e E2E_PROJECT=astro-solid e2e
```

Expected failures (confirm with actual test output):
- **D4** — `getByRole("button", { name: /add to cart/i })` not found — the detail page uses `<a href="/cart">Add to Cart</a>` instead of a `<button>`.
- **D5** — URL changes to `/cart` after clicking (anchor navigates).
- **D6** — No feedback visible.
- **D7** — Nav cart count not shown.
- **C4–C8** — Cart state not persisted; no cart items visible on `/cart`.
- **L8** — May also be failing if client-side routing is broken.

## Root cause

`src/pages/products/[id].astro` renders:
```html
<a href="/cart" class="...">Add to Cart</a>
```

This is an anchor tag. It has role `link`, not `button`. `D4` fails because `getByRole("button", ...)` finds nothing. Clicking it navigates away (D5 fails).

There is no cart state management in the app at all — the `CartPage.tsx` SolidJS island exists in `src/components/` but the detail page does not connect to it.

## Fix instructions

### Step 1 — Run e2e tests and document failures

Always run the tests before any code change to confirm the exact failures.

### Step 2 — Read all affected files

Before editing, read:
- `src/pages/products/[id].astro`
- `src/pages/cart.astro`
- `src/layouts/Layout.astro`
- `src/components/CartPage.tsx`
- `src/components/FilterPage.tsx`
- `astro.config.mjs`

### Step 3 — Create a shared cart store

Create `src/stores/cart.ts` — a SolidJS module exporting a `createStore`-backed cart with `localStorage` persistence:
- `cartItems: CartItem[]` — the current items
- `addToCart(product: Product): void`
- `removeFromCart(productId: number): void`
- `updateQuantity(productId: number, qty: number): void`
- `cartCount: Accessor<number>` — derived total item count
- On store changes, write to `localStorage`. On first import in client context, hydrate from `localStorage`.

**Important:** Do NOT use `import.meta.env` values in this store — it will be bundled as an island. Do NOT accept env vars as props to `client:load` islands.

### Step 4 — Fix the detail page

In `src/pages/products/[id].astro`:
1. Remove the `<a href="/cart">Add to Cart</a>` element.
2. Import and render a new SolidJS island component: `<AddToCartButton client:load product={product} />`.
3. Create `src/components/AddToCartButton.tsx` — a SolidJS component that:
   - Accepts `product: Product` as a prop.
   - Renders a `<button>` with text "Add to Cart" (and `disabled` if stock = 0 / shows "Out of Stock").
   - On click: calls `addToCart(product)` from the shared cart store, shows feedback text "Added to cart!" for 2 seconds.
   - The component should also display/update the nav cart count (via the shared store).

**Alternative** (simpler, fewer SolidJS islands): implement as a vanilla JS `<script>` block in the Astro page (same approach as astro-vanilla) using `localStorage` directly, avoiding the island complexity. This is acceptable since it achieves the same test behaviour.

### Step 5 — Fix the nav cart count

`src/layouts/Layout.astro` must show a cart count badge in the nav. Options:
- Add a `<CartCount client:load />` SolidJS island that reads from the shared cart store.
- Or use a vanilla `<script>` block that reads from `localStorage` on page load.

The nav count element must contain text matching `/^[1-9]\d*$/` after adding to cart (D7).

### Step 6 — Fix the cart page

`src/pages/cart.astro` must mount the `CartPage.tsx` island. Verify `CartPage.tsx` already reads from the shared cart store on mount and renders items with:
- `role="article"` on each item wrapper.
- Product name visible.
- Quantity controls with accessible names matching `/increase|increment|\+/i`.
- Remove button with accessible name matching `/remove|delete/i`.
- Empty cart message matching `/your cart is empty/i` when items = 0.

### Step 7 — Fix routing (if L8 is failing)

If `L8` (clicking a product card link navigates to `/products/` URL) is failing, investigate whether Astro's static output mode (`output: 'static'`) causes routing issues. This may be an Astro client-side navigation problem. Potential fix: ensure all links in `index.astro` use plain `<a href>` tags (which they already do based on code inspection).

## Acceptance criteria

All of the following pass with `E2E_PROJECT=astro-solid`:
- L1–L8 (listing page)
- D1–D7 (detail page)
- F1–F6 (filter page)
- C1–C8 (cart page)

Plus:
- `pnpm typecheck` passes in `packages/astro-solid/`
- `docker compose --profile e2e-astro-solid build` succeeds

## Notes

- Do NOT pass `import.meta.env` values as props to `client:load` islands — this causes esbuild errors in Docker builds.
- `passthroughImageService()` must remain in `astro.config.mjs`.
- The root `tsconfig.json` must be copied in the Dockerfile (already should be).
- SolidJS stores imported in `client:load` islands are hydrated on the client only — server-side `getStaticPaths` data must be passed as serialisable props (primitives, plain objects).
