# Shared Tailwind v4 base config + page layout reference

**Type:** AFK
**Blocked by:** None

---

## What to build

Establish the shared Tailwind v4 configuration at the repo root and produce a canonical HTML/markup reference for the four page layouts that all framework apps must match visually. This slice has no backend dependency — it can be executed in parallel with slices 01 and 02.

Specifically:

- Root-level `tailwind.config.ts` (or equivalent v4 CSS config entry) defining the shared colour system, typography scale, and spacing tokens
- A `packages/ui-reference/` folder (or equivalent) containing static HTML files (or a minimal Astro/Vite project) rendering all four page layouts:
  - Product listing page (grid of product cards, pagination or infinite scroll placeholder)
  - Product detail page (image, title, price, description, add-to-cart button)
  - Category/filter page (sidebar filters: category, price range, rating; product grid)
  - Cart page (line items, quantity controls, remove button, subtotal)
- All layouts use only Tailwind v4 utility classes from the shared config; no custom CSS, no CSS-in-JS
- The reference renders correctly in a browser with no build errors
- Each framework app will install Tailwind and extend this shared config (documented in a brief `CONTRIBUTING.md` note or inline comment)

Standard Tailwind v4 defaults are acceptable — no custom design sign-off required.

See PRD §"Shared Styling" and §"Framework Apps" for context.

## Acceptance criteria

- `tailwind.config.ts` (or CSS entrypoint) exists at repo root and is importable by framework apps
- All four page layouts are rendered in the reference with no broken classes or layout errors
- Visual output is consistent across a Chromium browser check
- No runtime CSS-in-JS dependencies introduced
- Framework apps can extend the shared config with a one-line import/extend

## Blocked by

None – can start immediately

## User stories addressed

- User story 7
