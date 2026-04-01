# ── Stage 1: builder ─────────────────────────────────────────────────────────
FROM node:20-slim AS builder

# Install system deps required by Playwright Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests and lockfile
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./

# Copy only the packages needed to build the benchmark runner
COPY packages/benchmark/package.json ./packages/benchmark/package.json
COPY packages/data/package.json ./packages/data/package.json

# Install all workspace dependencies (frozen lockfile)
RUN pnpm install --frozen-lockfile

# Copy source for packages needed at build time
COPY packages/data/ ./packages/data/
COPY packages/benchmark/ ./packages/benchmark/

# Build data package first, then benchmark runner
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/runner build

# ── Stage 2: runner ──────────────────────────────────────────────────────────
FROM node:20-slim AS runner

# Install Chromium and all Playwright system deps
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

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/benchmark/package.json ./packages/benchmark/package.json
COPY packages/data/package.json ./packages/data/package.json

# Install production dependencies only
RUN pnpm install --frozen-lockfile

# Install Playwright Chromium browser
RUN pnpm --filter @benchmark/runner exec playwright install chromium --with-deps

# Copy built artefacts
COPY --from=builder /app/packages/data/dist ./packages/data/dist
COPY --from=builder /app/packages/benchmark/dist ./packages/benchmark/dist

# Copy source for data package (needed by workspace dep resolution)
COPY packages/data/src ./packages/data/src

# Results are written to /results (mounted from host or a named volume)
RUN mkdir -p /results

ENV RESULTS_DIR=/results
ENV NODE_ENV=production

CMD ["node", "packages/benchmark/dist/runner.js"]
