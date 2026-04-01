# detail.spec.ts — product detail page assertions (D1–D7)

**Type:** AFK
**Blocked by:** Slice 01

---

## What to build

Implement `packages/e2e/tests/detail.spec.ts` — the shared spec for the product detail page (`/products/:id`). All 8 Playwright projects run this file.

Use **ARIA/role selectors only**. No `data-testid`, no CSS class selectors.

### Navigation strategy

Do not hard-code a product ID. Instead:

1. Navigate to `/` (the listing page).
2. Find the first product card link (href containing `/products/`).
3. Click it and wait for navigation to settle.
4. All assertions run from this dynamically-resolved detail page URL.

This ensures the test works even for SSG apps that pre-render a fixed set of IDs.

### Assertions to implement

| ID | Description | Selector / method |
|----|-------------|-------------------|
| D1 | HTTP response for the detail page is 200 | Response status from `page.goto(productUrl)` |
| D2 | A visible `<h1>` containing the product name is present | `getByRole('heading', { level: 1 })` to be visible |
| D3 | A price string matching `/\$[\d,.]+/` is visible | `getByText(/\$[\d,.]+/)` |
| D4 | An "Add to Cart" button is present and enabled (not disabled) | `getByRole('button', { name: /add to cart/i })` to be enabled |
| D5 | Clicking "Add to Cart" does NOT change the current URL | URL snapshot before and after click — must be equal |
| D6 | After clicking "Add to Cart", visible feedback appears: text matching `/added to cart/i` is visible, OR the nav cart indicator shows a count > 0 | `getByText(/added to cart/i)` OR nav count assertion |
| D7 | After clicking "Add to Cart", nav cart count increments to ≥ 1 | Nav element adjacent to cart link shows a number ≥ 1 |

### Notes

- D4 is the key assertion for the **SolidStart missing "Add to Cart" button** bug.
- D5 catches the **Astro Vanilla redirect-on-add** bug — the URL must not change to `/cart` after clicking the button.
- D6 catches the **Qwik no-feedback** bug — either a text confirmation OR a cart count update must be visible.
- D7 is a stronger form of D6 and catches all apps that silently fail to update state.
- For D6, use `or()` logic: `expect(feedbackLocator.or(cartCountLocator)).toBeVisible()`.
- Capture a `test.step` around the navigation from listing → detail to improve report readability.

## Acceptance criteria

- `detail.spec.ts` contains all 7 assertions (D1–D7)
- Navigation to the detail page is dynamic (resolved from the listing, not hard-coded)
- Every assertion uses only ARIA/role/text selectors
- `pnpm --filter @benchmark/e2e typecheck` passes with no TypeScript errors
- Running `playwright test --project=nextjs-app detail` against a live `nextjs-app` instance passes all 7 assertions

## Blocked by

- Slice 01 (`packages/e2e` scaffold)

## User stories addressed

- User story 5 (Astro Vanilla redirect bug)
- User story 7 (Qwik no-feedback bug)
- User story 8 (SolidStart missing button bug)
- User story 9 (HTML report with screenshots on failure)
- User story 10 (shared assertions across all 8 apps)
