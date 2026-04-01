# Slice 03 — Fix Astro Vanilla

**App:** `packages/astro-vanilla/`
**Profile:** `e2e-astro-vanilla`
**E2E project:** `astro-vanilla`

## Failing assertions (baseline)

Run before starting:
```bash
docker compose --profile e2e-astro-vanilla build
docker compose --profile e2e-astro-vanilla run --rm -e E2E_PROJECT=astro-vanilla e2e
```

Document which specific assertions fail. The PRD for implementation 02 documented this bug as "clicking Add to Cart redirects to `/cart`", but the current source of `[id].astro` may already have the correct `<button>` implementation. Always confirm by running the tests first.

Likely failures (verify against actual test output):
- **D4** — `getByRole("button", { name: /add to cart/i })` not found (if the button is an anchor)
- **D5** — URL changes after clicking Add to Cart (if the anchor navigates)
- **D6** — No feedback text visible and no nav cart count
- **D7** — Nav cart count not visible after add
- **C4–C8** — Cart items not persisted when navigating to `/cart`

## Root cause

Based on code inspection of `src/pages/products/[id].astro`: the file already has a `<button id="add-to-cart-btn">` and a `<script>` block that writes to `localStorage` and shows `#cart-feedback`. This may be **already fixed** in the current codebase.

However, the `/cart` page (`src/pages/cart.astro`) needs to read from `localStorage` and render items so C4–C8 can pass.

The layout nav (`src/layouts/Layout.astro`) needs to display a cart count badge populated from `localStorage` so D7 passes.

## Fix instructions

### Step 1 — Run e2e tests and document failures

Run the tests before any code change. Record exactly which assertions fail.

### Step 2 — Read all affected files

Before editing, read:
- `src/pages/products/[id].astro`
- `src/pages/cart.astro`
- `src/layouts/Layout.astro`
- `src/components/ProductCard.astro`

### Step 3 — Fix the detail page (if needed)

If D4/D5 are failing, the "Add to Cart" must be a `<button>` (not `<a>`). The existing `<button id="add-to-cart-btn">` with `data-product` attribute and `<script>` block writes to localStorage. Verify the button is not `disabled` for in-stock products.

### Step 4 — Fix the cart page

`src/pages/cart.astro` must render a client-side cart powered by `localStorage`. Because this is a static Astro page (no framework), use a `<script>` block that:
1. On `DOMContentLoaded`, reads `localStorage.getItem('cart')` and parses the JSON.
2. Dynamically renders cart items into a container `<div>`.
3. Each rendered item must:
   - Be wrapped in an `<article>` element (for C4–C7 selectors).
   - Show the product name as text (for C4).
   - Have a quantity input: use `<input type="number" value="1" min="1" aria-label="Quantity">` (role `spinbutton`) OR `<button aria-label="Increase quantity">+</button>` buttons.
   - Have a `<button aria-label="Remove">Remove</button>` (for C7).
4. When cart is empty, show `<p>Your cart is empty</p>` (for C2/C8).
5. Quantity changes and removes update localStorage and re-render the UI.

### Step 5 — Fix the nav cart count

`src/layouts/Layout.astro` must include a `<script>` block that:
1. Reads `localStorage.getItem('cart')` on page load.
2. Counts the total number of items.
3. If count > 0, shows a badge adjacent to the Cart nav link with the count as text (matching `/^[1-9]\d*$/`).
4. The badge must be inside or adjacent to the `<nav>` element.

## Acceptance criteria

All of the following pass with `E2E_PROJECT=astro-vanilla`:
- L1–L8 (listing page)
- D1–D7 (detail page)
- F1–F6 (filter page)
- C1–C8 (cart page)

Plus:
- `pnpm typecheck` passes in `packages/astro-vanilla/`
- `docker compose --profile e2e-astro-vanilla build` succeeds

## Notes

- Astro static pages cannot use `import.meta.env` in `<script>` blocks (they are processed by esbuild). Do not attempt to pass server env vars to client scripts.
- The cart page must be fully client-side (static HTML + vanilla JS). Do not add a React/Vue/Solid integration.
- `passthroughImageService()` must remain in `astro.config.mjs` — do not remove it.
