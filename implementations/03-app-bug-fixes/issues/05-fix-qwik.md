# Slice 05 — Fix Qwik

**App:** `packages/qwik/`
**Profile:** `e2e-qwik`
**E2E project:** `qwik`

## Failing assertions (baseline)

Run before starting:
```bash
docker compose --profile e2e-qwik build
docker compose --profile e2e-qwik run --rm -e E2E_PROJECT=qwik e2e
```

Expected failures (confirm with actual test output):
- **D5** — URL may change if clicking the button triggers a navigation (unlikely but check).
- **D6** — No visible feedback text and no nav cart count after clicking "Add to Cart".
- **D7** — Nav cart count never shows (no count in nav).
- **C4–C8** — No items appear in cart page after adding via detail page.

## Root cause

`src/routes/products/[id]/index.tsx` has an "Add to Cart" button but it has no `onClick$` handler. Clicking the button does nothing — no state is updated, no feedback is shown.

`src/routes/layout.tsx` has a nav with a "Cart" link but no cart count displayed.

There is no shared cart store or signal in the app.

## Fix instructions

### Step 1 — Run e2e tests and document failures

Always run before changing code.

### Step 2 — Read all affected files

Before editing, read:
- `src/routes/products/[id]/index.tsx`
- `src/routes/layout.tsx`
- `src/routes/cart/index.tsx`

### Step 3 — Create a shared cart context/store

In Qwik, the idiomatic way to share state across routes is via a context provided in the root layout. Create a cart context:

1. Create `src/context/cart.ts` (or inline in `layout.tsx`) that defines:
   - `CartItem` type (re-use from `@benchmark/data`).
   - `CartContext` using `createContextId<QRL<...>>` or a `useStore`-based approach.

2. In `src/routes/layout.tsx`, use `useStore` for cart state and `useContextProvider` to expose it. Use `useVisibleTask$` (or `useTask$` with `isServer` guard) to hydrate from `localStorage` on the client.

3. The cart store shape:
   ```ts
   interface CartStore {
     items: CartItem[];
   }
   ```

4. In the layout nav, render the total cart count (sum of `item.quantity`) when > 0:
   ```tsx
   {cartStore.items.length > 0 && (
     <span>{cartStore.items.reduce((s, i) => s + i.quantity, 0)}</span>
   )}
   ```
   This text must match `/^[1-9]\d*$/` and be inside the `<nav>` element.

### Step 4 — Fix the detail page

In `src/routes/products/[id]/index.tsx`:
1. Use `useContext` to get the cart store from the layout context.
2. Add a `useSignal<boolean>(false)` for showing the "Added to cart!" feedback.
3. Add `onClick$` to the "Add to Cart" button:
   ```tsx
   onClick$={() => {
     // Add to cart store
     const existing = cartStore.items.find(i => i.product.id === p.id);
     if (existing) {
       existing.quantity++;
     } else {
       cartStore.items.push({ product: p, quantity: 1 });
     }
     // Show feedback
     added.value = true;
     setTimeout(() => { added.value = false; }, 2000);
   }}
   ```
4. Render feedback text when `added.value` is true:
   ```tsx
   {added.value && <p>Added to cart!</p>}
   ```
   The text must match `/added to cart/i` (D6).
5. The nav count (from the context store) will update reactively (D7).

**Note on localStorage persistence:** Qwik's `useStore` is serialised on the server and re-used on the client within the same page. For cross-page persistence (the test navigates to `/cart` via `page.goto('/cart')`), you need `localStorage`. In `layout.tsx`:
- On client mount (`useVisibleTask$`), hydrate `cartStore.items` from `localStorage`.
- Use a `useTask$` that tracks `cartStore.items` and writes to `localStorage` on change.

### Step 5 — Fix the cart page

Read `src/routes/cart/index.tsx`. It should use `useContext` to get the cart store. Verify:
- Items are rendered in a list where each item has `role="article"` (or add it).
- Product name is visible (C4).
- Quantity control: use `<input type="number">` or increment buttons with accessible names.
- Remove button has accessible name matching `/remove|delete/i`.
- Empty cart message shown when `cartStore.items.length === 0`.

If the cart page does not use the shared context yet, update it to do so.

## Acceptance criteria

All of the following pass with `E2E_PROJECT=qwik`:
- L1–L8 (listing page)
- D1–D7 (detail page)
- F1–F6 (filter page)
- C1–C8 (cart page)

Plus:
- `pnpm typecheck` passes in `packages/qwik/`
- `docker compose --profile e2e-qwik build` succeeds

## Notes

- Qwik uses `onClick$` (with `$` suffix) for event handlers — not `onClick`.
- `useVisibleTask$` runs only on the client — safe for `localStorage` access.
- Qwik context is provided at the layout level and consumed via `useContext` in child routes.
- Do not use `import.meta.env` for runtime values in client-side components — use the `VITE_API_URL` env var at build time (already configured in `docker-compose.yml`).
- Do not change `vite.config.ts` or the adapter configuration.
