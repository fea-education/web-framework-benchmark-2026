# Monorepo scaffold + shared data package

**Type:** AFK
**Blocked by:** None

---

## What to build

Bootstrap the pnpm workspaces monorepo and the `packages/data` shared package. This is the foundation every other slice depends on.

Write tests first, then implement: unit tests for the seed fixture must pass before the package is considered done.

Specifically:

- Root `package.json` with `pnpm` workspaces config listing all packages
- Root `tsconfig.json` (TypeScript 5.x, strict mode); each package will extend it
- `packages/data/`:
  - TypeScript types: `Product`, `Category`, `CartItem`, `ApiResponse<T>`
  - Seed JSON fixture: 100 products across 8 categories with fields `id`, `name`, `description`, `price`, `category`, `stock`, `rating`, `image_url` (picsum.photos with deterministic seed per product), `tags`
  - Exports the fixture as a typed constant
  - No runtime dependency — pure types and data
  - Unit tests (vitest or similar):
    - Fixture contains exactly 100 products
    - All products conform to the `Product` type (all required fields present and correctly typed)
    - All 8 categories are referenced by at least one product
    - All `image_url` values match the expected `picsum.photos` URL pattern

See PRD §"Shared Data (`packages/data`)" and §"TypeScript" for full spec.

## Acceptance criteria

- `pnpm install` succeeds from repo root
- `packages/data` builds with no TypeScript errors
- All unit tests pass
- Fixture exports exactly 100 products typed as `Product[]`
- All 8 categories are present in the fixture
- All `image_url` fields use deterministic `picsum.photos` URLs
- No runtime dependencies in `packages/data`

## Blocked by

None – can start immediately

## User stories addressed

- User story 6
- User story 20
- User story 26
