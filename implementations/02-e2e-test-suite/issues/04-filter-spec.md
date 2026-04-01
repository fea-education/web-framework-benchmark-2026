# filter.spec.ts — filter page assertions (F1–F6)

**Type:** AFK
**Blocked by:** Slice 01

---

## What to build

Implement `packages/e2e/tests/filter.spec.ts` — the shared spec for the category/filter page (`/filter`). All 8 Playwright projects run this file.

Use **ARIA/role selectors only**. No `data-testid`, no CSS class selectors.

### Assertions to implement

| ID | Description | Selector / method |
|----|-------------|-------------------|
| F1 | `GET /filter` returns HTTP 200 | Response status |
| F2 | At least 1 product card is visible on initial load (before any filter interaction) | `locator('[role="article"], [role="listitem"]').first()` to be visible |
| F3 | A category filter control is present | `getByRole('combobox')` or `getByRole('listbox')` or `getByRole('radiogroup')` — at least one present |
| F4 | Selecting a specific category reduces the visible product count compared to the initial count | Count before select vs count after select |
| F5 | A price range input is present | `locator('input[type="range"]')` or `getByRole('slider')` |
| F6 | Setting the price range to its minimum value hides products that were previously visible | Count before vs count after range interaction |

### Notes

- For F4: record `initialCount = await cards.count()` before interaction, then select a category, wait for the list to update, assert `filteredCount < initialCount && filteredCount >= 1`. Do not assert an exact count — product fixture distribution may vary.
- For F6: use `.fill('0')` or `.dispatchEvent('input', {target: {value: 0}})` on the range input, or drag to minimum. Then assert that the resulting card count is less than the initial count (some products must be hidden).
- For F3: try `combobox` first; if not found, fall back to checking for `listbox` or `radiogroup`. Use whichever role is present to avoid hard-coding one framework's approach.
- All filter interactions are CSR — wait for the DOM to stabilise after each interaction before counting.

## Acceptance criteria

- `filter.spec.ts` contains all 6 assertions (F1–F6)
- F4 and F6 use dynamic count comparison, not hard-coded expected counts
- Every assertion uses only ARIA/role selectors
- `pnpm --filter @benchmark/e2e typecheck` passes with no TypeScript errors
- Running `playwright test --project=nextjs-app filter` against a live `nextjs-app` instance passes all 6 assertions

## Blocked by

- Slice 01 (`packages/e2e` scaffold)

## User stories addressed

- User story 2 (regression detection across all apps)
- User story 10 (shared assertions across all 8 apps)
