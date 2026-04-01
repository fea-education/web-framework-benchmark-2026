---
title: "PRD: App Bug Fixes — E2E Test Compliance Across All Framework Apps"
---

## Problem Statement

Six of the eight benchmark framework apps contain functional bugs or UX inconsistencies that cause the `packages/e2e` Playwright test suite to fail. The e2e tests define the authoritative contract for HTML structure, user journeys, and UX behaviour across all apps. Apps that fail this contract produce meaningless benchmark results: performance numbers for a broken app cannot be fairly compared to a working one.

The known regressions per app are:

- **SvelteKit** — The `/cart` page renders product listing content (an "Add Products" grid of `<article>` elements), causing `C3` to fail because `[role="article"]` elements are present on an otherwise-empty cart page.
- **Nuxt** — The listing page (`/`) fails to load products from the shared API, showing zero product cards. `L2` fails because no `[role="article"]` or `[role="listitem"]` element is visible.
- **Astro Vanilla** — The "Add to Cart" button on the detail page (`/products/[id]`) is implemented as an anchor tag (`<a href="/cart">`) rather than an interactive `<button>`. Clicking it navigates to `/cart` (violating `D5`), and the button's accessible role is `link` not `button` (violating `D4`).
- **Astro Solid** — The detail page uses a plain `<a href="/cart">Add to Cart</a>` anchor instead of a `<button>` with cart state logic, so `D4` fails (no button). Navigation links also break client-side routing.
- **Qwik** — The "Add to Cart" button on the detail page has no `onClick$` handler. No cart state is updated, no feedback text appears, and the nav cart count never increments. `D6` and `D7` fail.
- **SolidStart** — The product detail page (`/products/[id]`) has no "Add to Cart" `<button>` element at all. `D4` fails immediately.

Each of these bugs must be fixed in isolation, and independently of the other apps. Every fix must be verified by running the e2e suite for that single app via `make test:e2e-<app>` (or equivalent Docker-based invocation).

## Solution

For each of the six broken apps, diagnose the specific failing e2e assertions, fix the minimum amount of code required to make all assertions pass, and verify the fix end-to-end inside Docker.

The e2e test suite (`packages/e2e`) is treated as the single source of truth for:
- HTML structure (which ARIA roles, elements, and attributes are required)
- User journey flows (listing → detail → add to cart → cart)
- UX behaviour (what text must appear, what must not appear, what URL transitions are allowed)

No changes to `packages/e2e` are permitted unless a test contains a genuine defect (misfire against a correct implementation). Changes are confined to the six app packages.

Because each app's fix is independent of the others — different framework, different file structure, different root cause — all six fixes can be developed and verified in parallel.

## User Stories

1. As a developer, I want the SvelteKit `/cart` page to show no `[role="article"]` elements when the cart is empty, so that `C3` passes and the page does not mix listing concerns into the cart view.
2. As a developer, I want the SvelteKit cart to persist added items across page navigations using `localStorage`, so that `C4`–`C8` pass and the cart behaves consistently with the other apps.
3. As a developer, I want the Nuxt listing page to successfully fetch and render products from the shared API, so that `L2`–`L5`, `L8` pass and at least one product card is visible on load.
4. As a developer, I want the Nuxt runtime config to correctly expose the API URL inside Docker, so that the `useFetch` call in `index.vue` resolves to `http://api:3000` in production.
5. As a developer, I want the Astro Vanilla detail page to have an `<button>` element labelled "Add to Cart" that stores items in `localStorage` without redirecting, so that `D4` and `D5` pass.
6. As a developer, I want the Astro Vanilla detail page to show visible feedback text matching `/added to cart/i` after clicking "Add to Cart", so that `D6` passes.
7. As a developer, I want the Astro Vanilla detail page to display a nav cart count that increments after adding to cart, so that `D7` passes.
8. As a developer, I want the Astro Vanilla `/cart` page to read from `localStorage` and render cart items so that `C4`–`C8` pass.
9. As a developer, I want the Astro Solid detail page to have a `<button>` element labelled "Add to Cart" that updates a SolidJS cart store and shows feedback, so that `D4`–`D7` pass.
10. As a developer, I want the Astro Solid nav to display a reactive cart count that increments when an item is added, so that `D7` passes.
11. As a developer, I want the Astro Solid listing and detail page links to navigate correctly between routes without breaking client-side routing, so that `L8` passes.
12. As a developer, I want the Qwik detail page to have an `onClick$` handler on the "Add to Cart" button that stores the item in a reactive cart signal, so that `D5` (no redirect), `D6` (feedback visible), and `D7` (nav count increments) pass.
13. As a developer, I want the Qwik nav layout to display the current cart item count when it is greater than zero, so that `D6` and `D7` pass.
14. As a developer, I want the Qwik cart page to read from the shared cart signal and display items correctly, so that `C4`–`C8` pass.
15. As a developer, I want the SolidStart detail page to have an "Add to Cart" `<button>` that adds the product to a cart store and shows feedback, so that `D4`–`D7` pass.
16. As a developer, I want the SolidStart nav to display a reactive cart item count, so that `D7` passes.
17. As a developer, I want the SolidStart `/cart` page to read cart state from the shared store and render items with quantity controls and a remove button, so that `C4`–`C8` pass.
18. As a developer, I want each fixed app to pass all `L1`–`L8`, `D1`–`D7`, `F1`–`F6`, and `C1`–`C8` assertions in the e2e suite, so that the benchmark results for that app are trustworthy.
19. As a developer, I want each app to build successfully in Docker (production build) with no TypeScript errors, so that the fix does not introduce build regressions.
20. As a developer, I want each app's fix to be verifiable in isolation via `make test:e2e-<app>`, so that fixes can be developed and reviewed in parallel without coordination.
21. As a developer, I want the cart state for browser-side apps (Astro Vanilla, Astro Solid) to persist across page navigations within the same browser session using `localStorage`, so that adding to cart on the detail page is reflected when the user navigates to `/cart`.
22. As a developer, I want the cart state for SSR apps (Qwik, SolidStart, SvelteKit) to persist in client-side reactive stores or signals that survive route transitions within the same SPA session, so that items added on the detail page appear in the cart page.
23. As a developer, I want all quantity controls on the `/cart` page to use `<input type="number">` (role `spinbutton`) or `<button>` elements with accessible names matching `/increase|increment|\+/i`, so that `C5`–`C6` pass with the selectors used by the test suite.
24. As a developer, I want all remove buttons on the `/cart` page to have accessible names matching `/remove|delete/i`, so that `C7` passes.
25. As a developer, I want the empty-cart message on each app's `/cart` page to match the text `/your cart is empty/i`, so that `C2` and `C8` pass.
26. As a developer, I want each app's product cards on the listing and filter pages to use `role="article"` or `role="listitem"` as their outermost element, so that `L2`, `L3`, `L4`, `L5`, `F2`, `F4`, and cart tests can locate them correctly.

## Implementation Decisions

### Scope and Parallelism

Six apps are fixed, each independently:

| App | Root cause | Key tests fixed |
|---|---|---|
| SvelteKit | Cart page mixes listing content; no localStorage persistence | C3, C4–C8 |
| Nuxt | `runtimeConfig` key mismatch — Docker passes `NUXT_PUBLIC_API_BASE` but code reads `config.public.apiUrl` | L2–L5, L8 |
| Astro Vanilla | "Add to Cart" is an `<a>` tag, not a `<button>`; no cart state | D4, D5, D6, D7, C4–C8 |
| Astro Solid | "Add to Cart" is an `<a>` tag; no reactive cart store or feedback | D4, D5, D6, D7, C4–C8 |
| Qwik | Button has no `onClick$`; no cart store; no nav count | D5, D6, D7, C4–C8 |
| SolidStart | No "Add to Cart" button at all on detail page | D4, D5, D6, D7, C4–C8 |

Each fix is one implementation slice (one issue file). All six slices have no blocking dependencies on each other and can be executed in parallel.

### Cart State Architecture per App

Each framework has its idiomatic state persistence mechanism. The e2e tests navigate from the detail page to `/cart` via `page.goto('/cart')` (a full navigation), so state must survive a full page reload or cross-page navigation:

| App | Cart state mechanism |
|---|---|
| SvelteKit | `localStorage` on `onMount`; sync back on changes (or use a Svelte store that hydrates from `localStorage`) |
| Astro Vanilla | `localStorage` (already partially implemented in `[id].astro`; needs `/cart` page to read it) |
| Astro Solid | SolidJS `createStore` in a shared module, hydrated from and persisted to `localStorage`; island reads on mount |
| Qwik | `useStore` with `useVisibleTask$` to hydrate from `localStorage`; or `noSerialize` signal |
| SolidStart | `createStore` in a shared context or module-level signal, persisted to `localStorage` on change and hydrated on mount |

### SvelteKit — Specific Fix

The `/cart` page (`src/routes/cart/+page.svelte`) currently:
1. Fetches all products from the API on `onMount` and renders them as a grid of buttons (the "Add Products" section). These buttons render inside `<article>` elements... wait — they do not. They are `<button>` elements with no ARIA role override. However C3 checks `[role="article"]` count = 0. The actual issue is that the "Add Products" section renders product cards that DO use `role="article"` in some implementations, or the test was written for a different rendering.

Actually re-reading `cart/+page.svelte`: the "Add Products" section renders `<button>` elements — no `role="article"`. So C3 would pass. The real issue is C4–C8: the cart state is a writable store that resets on navigation (in-memory only). When the test navigates away from the detail page (which doesn't exist in SvelteKit's cart page anyway — you can only add from the cart page itself) and then to `/cart`, the store is empty.

The fix for SvelteKit:
1. **Remove the "Add Products" section** from the cart page — the test navigates from the listing page to the detail page, adds there, then goes to `/cart`. The cart page should not be the primary "add to cart" surface.
2. **Add an "Add to Cart" button to the product detail page** (`src/routes/products/[id]/+page.svelte`) that writes to `localStorage`.
3. **Hydrate the cart store from `localStorage`** in the cart page's `onMount`.
4. Ensure `[role="article"]` or `[role="listitem"]` is present on each cart item rendered by the cart page, or absent from the empty state — as C3 checks count = 0 when cart is empty, and C4–C7 need to locate the cart item.

Wait — checking the existing SvelteKit detail page (`src/routes/products/[id]/+page.svelte`) — it was not listed in the files explored. This needs to be read. The fix agent must read that file before modifying.

The "Add Products" grid in the cart page renders `<button>` elements without role overrides. C3 passes as-is. The fix needed:
- Add localStorage-backed cart state hydration so items added on the detail page appear in the cart.
- Ensure cart items use `role="article"` or `role="listitem"`.
- Ensure the quantity increment button is accessible via `getByRole("button", { name: /increase|increment|\+/i })` — current buttons use `-` and `+` text, which matches `\+` in the regex.
- Remove button must have accessible name matching `/remove|delete/i` — current text is "Remove" which matches.

### Nuxt — Specific Fix

The `docker-compose.yml` passes `NUXT_PUBLIC_API_BASE: http://api:3000` to the Nuxt container. However, `nuxt.config.ts` defines the runtime config key as `apiUrl`:

```ts
runtimeConfig: {
  public: {
    apiUrl: process.env['API_URL'] ?? 'http://localhost:3000',
  },
}
```

And `pages/index.vue` reads `config.public.apiUrl`.

The environment variable that Nuxt auto-maps for `public.apiUrl` would be `NUXT_PUBLIC_API_URL`, not `NUXT_PUBLIC_API_BASE`. The Docker Compose service sets `NUXT_PUBLIC_API_BASE` which maps to `public.apiBase`, a key not defined in `runtimeConfig`.

Fix: change the Docker Compose env var to `NUXT_PUBLIC_API_URL: http://api:3000` OR change the `runtimeConfig` key to `apiBase` and update all consumers.

The simpler fix with least blast radius: update `docker-compose.yml` to pass `NUXT_PUBLIC_API_URL: http://api:3000` instead of `NUXT_PUBLIC_API_BASE`, which correctly maps to `config.public.apiUrl`. No app code changes needed.

### Astro Vanilla — Specific Fix

The detail page already has the infrastructure: `#add-to-cart-btn` button, `#cart-feedback` paragraph, and `localStorage` write logic. The issue per the PRD was "clicking Add to Cart redirects to `/cart`" — but the current source shows the button does NOT redirect. Re-reading: the PRD documented this bug at the time the apps were built with earlier code. The current state of `[id].astro` looks correct.

However the fix agent must verify by actually running the e2e tests, not by code inspection alone. The agent should:
1. Run the e2e tests for `astro-vanilla` first.
2. Read the specific failing assertion output.
3. Fix only what fails.

### Astro Solid — Specific Fix

The detail page (`src/pages/products/[id].astro`) currently renders:
```html
<a href="/cart" class="...">Add to Cart</a>
```

This is an anchor, not a button. `D4` fails (`getByRole("button", { name: /add to cart/i })` finds nothing). `D5` fails (clicking it navigates to `/cart`).

Fix:
1. Replace the `<a href="/cart">Add to Cart</a>` with a `<button id="add-to-cart-btn">` in the Astro template.
2. Add a `<script>` block that reads `localStorage`, adds the product, writes back, shows feedback text, and updates the nav cart count.
3. The nav in `Layout.astro` must display a reactive cart count. Since this is a static Astro page, the count must be read from `localStorage` on page load via a `<script>` tag.

### Qwik — Specific Fix

The detail page button exists and is correctly labelled "Add to Cart". It is missing an `onClick$` handler. Fix:
1. Add a `useStore` for cart state, hydrated from `localStorage` via `useVisibleTask$`.
2. Add `onClick$` to the button: update store, write to `localStorage`, set a feedback signal.
3. Render feedback text (`"Added to cart!"`) when the signal is true, hidden after a timeout.
4. Update the layout (`src/routes/layout.tsx`) to display the cart count from a shared store or by reading `localStorage` client-side.

### SolidStart — Specific Fix

The detail page has no "Add to Cart" button. Fix:
1. Add a `<button>` labelled "Add to Cart" to `src/routes/products/[id].tsx`.
2. Import or define a cart store (module-level `createStore` or a context) that can be shared between the detail page, layout, and cart page.
3. On click: add item to store, write to `localStorage`, show feedback text.
4. The layout (`src/app.tsx` or equivalent) must render the nav with a cart count badge.
5. The `/cart` page must hydrate from `localStorage` on `onMount` and render items with quantity controls and remove buttons.

### Shared HTML Contract (required by e2e selectors)

All apps must conform to the following structural requirements, as enforced by the test suite:

**Listing page (`/`) and filter page (`/filter`):**
- Each product card outer element must have `role="article"` or `role="listitem"`.
- Inside each card: a heading element, price text matching `/\$[\d,.]+/`, and a link whose `href` contains `/products/`.

**Detail page (`/products/[id]`):**
- A single `<h1>` with the product name.
- Price text matching `/\$[\d,.]+/` visible on page.
- A `<button>` with accessible name matching `/add to cart/i` that is enabled (not disabled) when stock > 0.
- Clicking the button must NOT navigate away from the page.
- After clicking: either text matching `/added to cart/i` must be visible, OR the nav must show a number matching `/^[1-9]\d*$/`.
- The nav `<nav>` element must show a text matching `/^[1-9]\d*$/` after adding to cart.

**Cart page (`/cart`):**
- When empty: text matching `/your cart is empty/i` must be visible; zero `[role="article"]` elements.
- When populated: the product name must be visible; quantity control must be present (role `spinbutton` OR button with name matching `/increase|increment|\+/i`); remove button with name matching `/remove|delete/i`; empty cart message after removal.

### No Changes to `packages/e2e`

The test suite is frozen as the source of truth. If a test appears to misfire against a correctly-implemented app, that must be raised as a separate issue. Bug fixes must conform to the tests, not the other way around.

### Docker Verification

Each fix is verified by:
1. `docker compose --profile e2e-<app> build`
2. `docker compose --profile e2e-<app> run --rm -e E2E_PROJECT=<app> e2e`
3. All tests in that project pass (exit code 0).
4. `pnpm typecheck` passes in the app package.

## Testing Decisions

### What makes a good test

The e2e suite tests **external, observable behaviour** only: HTTP status codes, visible text, element roles and accessible names, URL transitions, DOM presence/absence. It does not test implementation details like state management library choices, component names, CSS class names, or internal data structures.

### Modules tested

Every fix is tested end-to-end by the existing `packages/e2e` suite — no new tests are written. The e2e suite is the complete test for this implementation. The fix agent runs the suite for the target app before and after the fix to confirm regression → pass.

### Prior art

- `packages/e2e/tests/cart.spec.ts` — C3, C4–C8 are the most demanding tests; they exercise the full add-to-cart → cart page flow.
- `packages/e2e/tests/detail.spec.ts` — D4–D7 cover the Add to Cart interaction comprehensively.
- Both are written with `test.use({ storageState: undefined })` to guarantee a clean browser state for each test.

## Out of Scope

- Fixing `nextjs-app` or `nextjs-pages` — these two apps already pass all e2e assertions.
- Modifying `packages/e2e` test files or `playwright.config.ts`.
- Adding new pages, routes, or features beyond what the test suite exercises.
- Visual design changes — only functional correctness matters.
- ISR, authentication, payment, or checkout flows.
- Performance optimisation — that belongs in the benchmark runner.
- Cross-browser testing (Firefox, WebKit).
- CI/CD pipeline setup.
- Updating `implementations/01-web-framework-benchmark-2026/prd.json` — the original implementation is already marked complete.

## Slice Breakdown

| ID | Title | Blocked by | App |
|---|---|---|---|
| 01 | Fix SvelteKit cart: remove listing content from cart page; add localStorage cart persistence; add Add to Cart button to detail page | — | sveltekit |
| 02 | Fix Nuxt: correct API URL env var mapping so products load on listing page | — | nuxt |
| 03 | Fix Astro Vanilla: replace Add to Cart anchor with button; verify localStorage flow; confirm all D4–D7, C4–C8 pass | — | astro-vanilla |
| 04 | Fix Astro Solid: replace Add to Cart anchor with button + SolidJS cart island; add nav cart count; verify D4–D7, C4–C8 pass | — | astro-solid |
| 05 | Fix Qwik: add onClick$ handler to Add to Cart button; add cart store with localStorage persistence; add nav cart count; verify D5–D7, C4–C8 pass | — | qwik |
| 06 | Fix SolidStart: add Add to Cart button to detail page; add shared cart store with localStorage; add nav cart count; verify D4–D7, C4–C8 pass | — | solidstart |

## Further Notes

- The `ralph.sh` script supports `--impl 03-app-bug-fixes` for running the fix agent on this implementation.
- Each slice should begin by running the e2e tests first (before any code change) to confirm the baseline failure, then fix, then re-run to confirm green.
- The fix agent must read the current state of each app's files before editing — do not assume the files match the state documented in `implementations/02-e2e-test-suite/prd.md`, which was written at a point in time.
- If a bug documented in the PRD turns out to already be fixed in the current codebase, mark that slice `passes: true` after confirming the e2e tests pass without changes.
- The Nuxt runtime config fix may be a `docker-compose.yml` change (env var name), not an app code change. Check carefully before modifying `nuxt.config.ts`.
