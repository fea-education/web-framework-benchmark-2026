# cart.spec.ts — cart page assertions (C1–C8)

**Type:** AFK
**Blocked by:** Slice 01

---

## What to build

Implement `packages/e2e/tests/cart.spec.ts` — the shared spec for the cart page (`/cart`). All 8 Playwright projects run this file.

Use **ARIA/role selectors only**. No `data-testid`, no CSS class selectors.

### Two test groups

#### Test group 1 — Empty cart (navigate directly to `/cart` with no prior state)

| ID | Description | Selector / method |
|----|-------------|-------------------|
| C1 | `GET /cart` returns HTTP 200 | Response status |
| C2 | Empty cart message is visible: text matching `/your cart is empty/i` | `getByText(/your cart is empty/i)` to be visible |
| C3 | No product cards are visible on the empty cart page | `locator('[role="article"]').count()` equals 0 |

#### Test group 2 — Cart after adding a product

Setup steps (before assertions):

1. Navigate to `/` (listing).
2. Click the first product card link → navigate to `/products/:id`.
3. Record the product name visible in the `<h1>`.
4. Click the "Add to Cart" button (`getByRole('button', { name: /add to cart/i })`).
5. Wait for feedback (visible feedback text or nav cart count > 0 — see detail.spec.ts D6).
6. Navigate to `/cart`.

| ID | Description | Selector / method |
|----|-------------|-------------------|
| C4 | The cart page shows the product name recorded in step 3 | `getByText(productName)` to be visible |
| C5 | A quantity control is visible for the cart item | `getByRole('spinbutton')` or `getByRole('button', { name: /increase\|increment\|\+/i })` |
| C6 | Incrementing quantity updates the displayed quantity value | Click increment; assert the quantity value changes |
| C7 | Clicking remove/delete for the item removes it | `getByRole('button', { name: /remove\|delete/i })` click; item row disappears |
| C8 | After removing the only item, the empty cart message reappears | `getByText(/your cart is empty/i)` to be visible |

### Notes

- C3 is the key assertion for the **SvelteKit page-mixing bug** — product cards (`[role="article"]`) must not appear on the empty cart page.
- For C5: try `spinbutton` (a numeric input) first; if not present, fall back to checking for an increment button with a label like `+` or `Increase quantity`.
- For C6: if the control is a `spinbutton`, use `.fill('2')` and assert the value is `'2'`. If it's increment/decrement buttons, click once and assert the count shown changes from `1` to `2`.
- For C7: the assertion should wait for the item's containing element to detach from the DOM, not just be hidden.
- Each test group should run in an isolated browser context (`test.use({ storageState: undefined })`) to prevent cart state leaking between groups.
- Cart state in all 8 apps uses `localStorage` or component-level state — clearing storage between tests is handled automatically by Playwright's isolated contexts.

## Acceptance criteria

- `cart.spec.ts` contains both test groups and all 8 assertions (C1–C8)
- Test group 2 setup is fully scripted (no manual steps)
- C3 uses `[role="article"]` count assertion, not text-based
- Every assertion uses only ARIA/role selectors
- `pnpm --filter @benchmark/e2e typecheck` passes with no TypeScript errors
- Running `playwright test --project=nextjs-app cart` against a live `nextjs-app` instance passes all 8 assertions

## Blocked by

- Slice 01 (`packages/e2e` scaffold)

## User stories addressed

- User story 3 (SvelteKit cart-on-listing / cart page mixing bug)
- User story 2 (regression detection across all apps)
- User story 9 (HTML report with screenshots on failure)
- User story 10 (shared assertions across all 8 apps)
