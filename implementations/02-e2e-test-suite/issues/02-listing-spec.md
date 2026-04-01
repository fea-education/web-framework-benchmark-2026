# listing.spec.ts — product listing page assertions (L1–L8)

**Type:** AFK
**Blocked by:** Slice 01

---

## What to build

Implement `packages/e2e/tests/listing.spec.ts` — the shared spec for the product listing page (`/`). All 8 Playwright projects run this file; failures are reported per project.

Use **ARIA/role selectors only** (`getByRole`, `getByText`, `locator('[role="..."]')`). No `data-testid`, no CSS class selectors.

### Assertions to implement

| ID | Description | Selector / method |
|----|-------------|-------------------|
| L1 | `GET /` returns HTTP 200 | `page.goto('/')` response status |
| L2 | At least 1 product card is visible | `locator('[role="article"], [role="listitem"]').first()` to be visible |
| L3 | Each visible card contains a heading (product name) | heading within each card |
| L4 | Each visible card contains a price string matching `/\$[\d,.]+/` | `getByText(/\$[\d,.]+/)` within card |
| L5 | Each card has a link whose `href` contains `/products/` | `getByRole('link')` with matching href |
| L6 | Navigation contains a link matching `/cart/i` | `getByRole('link', { name: /cart/i })` |
| L7 | The page does NOT show empty-cart text (`/your cart is empty/i`) | `expect(page.getByText(...)).not.toBeVisible()` |
| L8 | Clicking the first product card link navigates to a `/products/` URL | URL assertion after click |

### Notes

- L2 is the key assertion for the **Nuxt API loading bug** — if zero cards are visible, the test fails.
- L7 catches the **SvelteKit page-mixing bug** — cart empty-state text must not appear on the listing page.
- L8 catches the **Astro Solid routing bug** — the URL must change after clicking a product link.
- For L3–L5, test against the first 3 visible cards only (avoid timeouts on slow apps with 100 products).
- All assertions must have a meaningful `{ name: '...' }` or `test.step` label for legible HTML report output.

## Acceptance criteria

- `listing.spec.ts` contains all 8 assertions (L1–L8)
- Every assertion uses only ARIA/role/text selectors — no CSS classes, no `data-testid`
- `pnpm --filter @benchmark/e2e typecheck` passes with no TypeScript errors
- Running `playwright test --project=nextjs-app listing` against a live `nextjs-app` instance passes all 8 assertions

## Blocked by

- Slice 01 (`packages/e2e` scaffold)

## User stories addressed

- User story 2 (regression detection across all apps)
- User story 3 (SvelteKit cart-on-listing bug)
- User story 4 (Nuxt products-not-loading bug)
- User story 6 (Astro Solid routing bug)
- User story 10 (shared assertions across all 8 apps)
