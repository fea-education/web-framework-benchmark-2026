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

# Install Chromium system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests and lockfile
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/e2e/package.json ./packages/e2e/package.json
COPY packages/data/package.json ./packages/data/package.json

# Install workspace dependencies (includes @playwright/test CLI)
RUN pnpm install --frozen-lockfile

# Install Playwright Chromium browser
RUN pnpm --filter @benchmark/e2e exec playwright install chromium

# Copy e2e source from builder
COPY --from=builder /app/packages/e2e/ ./packages/e2e/

ENV NODE_ENV=production

ENTRYPOINT ["sh", "-c", "pnpm --filter @benchmark/e2e exec playwright test ${E2E_PROJECT:+--project=$E2E_PROJECT}"]
