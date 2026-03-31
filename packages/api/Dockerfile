# Stage 1: builder
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy package manifests for the packages we need to build
COPY packages/data/package.json ./packages/data/
COPY packages/api/package.json ./packages/api/

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy source code for the packages we need
COPY packages/data/src ./packages/data/src
COPY packages/data/tsconfig.json ./packages/data/
COPY packages/api/src ./packages/api/src
COPY packages/api/tsconfig.json ./packages/api/
COPY tsconfig.json ./

# Build packages/data first (packages/api depends on it)
RUN pnpm --filter @benchmark/data build

# Build packages/api
RUN pnpm --filter @benchmark/api build

# Stage 2: runner
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy package manifests
COPY packages/data/package.json ./packages/data/
COPY packages/api/package.json ./packages/api/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built dist files from builder stage
COPY --from=builder /app/packages/data/dist ./packages/data/dist
COPY --from=builder /app/packages/api/dist ./packages/api/dist

# Set working directory to the api package
WORKDIR /app/packages/api

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
