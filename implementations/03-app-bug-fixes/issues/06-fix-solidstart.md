# Slice 06 — Fix SolidStart

**App:** `packages/solidstart/`
**Profile:** `e2e-solidstart`
**E2E project:** `solidstart`

## Failing assertions (baseline)

Run before starting:
```bash
docker compose --profile e2e-solidstart build
docker compose --profile e2e-solidstart run --rm -e E2E_PROJECT=solidstart e2e
```

Expected failures (confirm with actual test output):
- **D4** — `getByRole("button", { name: /add to cart/i })` not found — no "Add to Cart" button on the detail page.
- **D5** — (depends on D4; if no button, test fails at D4 before reaching D5)
- **D6** — No feedback visible.
- **D7** — Nav cart count not shown.
- **C4–C8** — Cart page does not show items added from detail page.

## Root cause

`src/routes/products/[id].tsx` renders a complete product detail page with name, price, description, tags, and stock — but has no "Add to Cart" `<button>`. The button was simply never added.

`src/routes/cart.tsx` exists and renders a full cart UI, but it initialises an empty `cartStore` on every mount (no `localStorage` hydration), so items added on the detail page are lost on navigation.

The app's root (`src/app.tsx`) likely has a nav that does not show a cart count.

## Fix instructions

### Step 1 — Run e2e tests and document failures

Always run before changing code.

### Step 2 — Read all affected files

Before editing, read:
- `src/routes/products/[id].tsx`
- `src/routes/cart.tsx`
- `src/app.tsx`
- `src/entry-client.tsx`
- `src/entry-server.tsx`

### Step 3 — Create a shared cart store module

Create `src/stores/cart.ts` with a module-level SolidJS store that persists to `localStorage`:

```ts
import { createStore, produce } from "solid-js/store";
import type { Product, CartItem } from "@benchmark/data";

// Module-level store (shared across all route components in the same SPA session)
const [cartStore, setCartStore] = createStore<{ items: CartItem[] }>({ items: [] });

// Hydrate from localStorage (call this from onMount in a component, not at module level)
export function hydrateCart(): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("cart");
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as CartItem[];
      setCartStore({ items: parsed });
    } catch { /* ignore */ }
  }
}

// Persist to localStorage
function persist(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cartStore.items));
  }
}

export function addToCart(product: Product): void {
  setCartStore(produce(state => {
    const existing = state.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.items.push({ product, quantity: 1 });
    }
  }));
  persist();
}

export function removeFromCart(productId: number): void {
  setCartStore(produce(state => {
    state.items = state.items.filter(i => i.product.id !== productId);
  }));
  persist();
}

export function updateQuantity(productId: number, quantity: number): void {
  if (quantity <= 0) { removeFromCart(productId); return; }
  setCartStore(produce(state => {
    const item = state.items.find(i => i.product.id === productId);
    if (item) item.quantity = quantity;
  }));
  persist();
}

export { cartStore };
```

### Step 4 — Fix the detail page

In `src/routes/products/[id].tsx`:
1. Import `addToCart`, `cartStore`, `hydrateCart` from the shared store.
2. Add `onMount(() => hydrateCart())` to hydrate state on page load.
3. Add a `createSignal<boolean>(false)` for feedback visibility.
4. Add an "Add to Cart" `<button>` inside the product info section:
   ```tsx
   <button
     disabled={p().stock === 0}
     onClick={() => {
       addToCart(p());
       setAdded(true);
       setTimeout(() => setAdded(false), 2000);
     }}
   >
     {p().stock > 0 ? "Add to Cart" : "Out of Stock"}
   </button>
   ```
5. Render feedback text:
   ```tsx
   <Show when={added()}>
     <p>Added to cart!</p>
   </Show>
   ```

### Step 5 — Fix the cart page

`src/routes/cart.tsx` currently uses a local `createStore` that resets on every page load. Replace it to use the shared cart store from `src/stores/cart.ts`:
1. Remove the local `createStore` for cart state.
2. Import `cartStore`, `removeFromCart`, `updateQuantity`, `hydrateCart` from the shared store.
3. Add `onMount(() => hydrateCart())`.
4. Verify cart items are rendered in elements with `role="article"`:
   ```tsx
   <For each={cartStore.items}>
     {(item) => (
       <article> {/* role="article" */}
         ...
       </article>
     )}
   </For>
   ```
5. Verify quantity controls have accessible names:
   - Use `<input type="number" aria-label="Quantity" value={item.quantity}>` (role `spinbutton`) — the test tries `spinbutton` first.
   - Or `<button aria-label="Increase quantity">+</button>` — the test falls back to this.
6. Remove button: `<button onClick={() => removeFromCart(item.product.id)}>Remove</button>`.
7. Empty message: `<p>Your cart is empty</p>` (case-insensitive match for `/your cart is empty/i`).

The existing `cart.tsx` already has `removeFromCart` and `updateQuantity` — adapt those to use the shared store instead of the local one.

### Step 6 — Fix the app nav cart count

`src/app.tsx` contains the root layout with the nav. Add a reactive cart count:
1. Import `cartStore`, `hydrateCart`.
2. Add `onMount(() => hydrateCart())` to the root `App` component.
3. In the nav, add:
   ```tsx
   <Show when={cartStore.items.reduce((s, i) => s + i.quantity, 0) > 0}>
     <span>
       {cartStore.items.reduce((s, i) => s + i.quantity, 0)}
     </span>
   </Show>
   ```
   This must be inside the `<nav>` element (D7 uses `page.getByRole("navigation").getByText(/^[1-9]\d*$/)`).

## Acceptance criteria

All of the following pass with `E2E_PROJECT=solidstart`:
- L1–L8 (listing page)
- D1–D7 (detail page)
- F1–F6 (filter page)
- C1–C8 (cart page)

Plus:
- `pnpm typecheck` passes in `packages/solidstart/`
- `docker compose --profile e2e-solidstart build` succeeds

## Notes

- SolidStart uses file-system routing under `src/routes/`. Do not add new route files.
- The module-level store pattern (not context API) is safe in a SPA where all routes are loaded in the same JS bundle. The store reference is stable across route transitions.
- `localStorage` is only available in the browser (`typeof window !== "undefined"` guard required in SSR-rendered modules).
- `onMount` only runs on the client — safe to call `hydrateCart()` there.
- Do not use `import.meta.env` in client components for runtime URL values — use `VITE_API_URL` at build time.
- The `"use server"` directive in `getProduct` (in `[id].tsx`) means that function runs server-side. The `addToCart` function must be client-side only — do not put `"use server"` on it.
