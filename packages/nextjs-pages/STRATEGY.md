# Next.js Pages Router — Rendering Strategy

## Page: Product Listing (`/`)

**Rendering mode:** SSG (Static Site Generation) via `getStaticProps`

**Rationale:** Product data changes infrequently and is the same for all users. SSG pre-renders the page at build time, resulting in minimal TTFB and zero server load per request. All 100 products are fetched from the shared API once at build time and baked into the HTML.

---

## Page: Product Detail (`/products/[id]`)

**Rendering mode:** SSR (Server-Side Rendering) via `getServerSideProps`

**Rationale:** Product detail pages include stock levels and pricing that may change, and are personalisable. `getServerSideProps` fetches fresh data per request, so TTFB reflects the API latency — this is intentional for the benchmark's latency simulation testing. Using `getStaticPaths` with `fallback: 'blocking'` would be an alternative but `getServerSideProps` keeps the behaviour more predictable and comparable.

---

## Page: Category/Filter (`/filter`)

**Rendering mode:** CSR (Client-Side Rendering) via React state and `useEffect`

**Rationale:** The filter page requires interactive, real-time filtering (category checkboxes, price range slider, minimum rating). Fetching all products client-side and filtering in-browser eliminates round-trips to the server on each filter change. The initial data load happens once after hydration; all subsequent filtering is pure React state with `useMemo`.

**Filters supported:**
- Category (multi-select checkboxes)
- Max price (range slider)
- Min rating (range slider, 0–5 in 0.5 steps)

---

## Page: Cart (`/cart`)

**Rendering mode:** CSR (Client-Side Rendering) via React state

**Rationale:** Cart state is session-local and requires instant updates without server round-trips. React `useState` manages the cart items array; all add/remove/quantity operations are synchronous in-memory updates. Products are fetched client-side to support search-and-add functionality.

**Cart operations:**
- Search products by name or category (live filter, select to add)
- Increment/decrement quantity per item
- Remove individual items
- Clear entire cart
- Subtotal computed via `reduce` on cart state
