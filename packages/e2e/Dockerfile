# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests and lockfile
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./

# Copy only the package manifests needed for workspace resolution
COPY packages/e2e/package.json ./packages/e2e/package.json
COPY packages/data/package.json ./packages/data/package.json

# Install all workspace dependencies (frozen lockfile)
RUN pnpm install --frozen-lockfile

# Copy e2e source
COPY packages/e2e/ ./packages/e2e/

# Typecheck (validation only — tests run from source)
RUN pnpm --filter @benchmark/e2e typecheck

# ── Stage 2: runner ──────────────────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests and lockfile
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/e2e/package.json ./packages/e2e/package.json
COPY packages/data/package.json ./packages/data/package.json

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Install Chromium and its system dependencies
RUN npx playwright install --with-deps chromium

# Copy e2e source from builder
COPY --from=builder /app/packages/e2e/ ./packages/e2e/

ENV NODE_ENV=production

ENTRYPOINT ["sh", "-c", "npx playwright test ${E2E_PROJECT:+--project=$E2E_PROJECT}"]
