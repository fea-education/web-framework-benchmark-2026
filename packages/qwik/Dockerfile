# Stage 1: builder
FROM node:20-alpine AS builder

RUN npm install -g pnpm@9

WORKDIR /app

# Use hoisted node_modules for Docker compatibility
RUN echo "shamefully-hoist=true" > .npmrc

# Copy workspace manifests (all packages needed for lockfile resolution)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/astro-solid/package.json ./packages/astro-solid/
COPY packages/astro-vanilla/package.json ./packages/astro-vanilla/
COPY packages/benchmark/package.json ./packages/benchmark/
COPY packages/data/package.json ./packages/data/
COPY packages/nextjs-app/package.json ./packages/nextjs-app/
COPY packages/nextjs-pages/package.json ./packages/nextjs-pages/
COPY packages/nuxt/package.json ./packages/nuxt/
COPY packages/qwik/package.json ./packages/qwik/
COPY packages/solidstart/package.json ./packages/solidstart/
COPY packages/sveltekit/package.json ./packages/sveltekit/
COPY packages/ui-reference/package.json ./packages/ui-reference/

# Install all dependencies (hoisted for Vite compatibility)
RUN pnpm install --frozen-lockfile

# Copy source for data and qwik
COPY packages/data/ ./packages/data/
COPY packages/qwik/ ./packages/qwik/
COPY tsconfig.json ./

# Build data package first
RUN pnpm --filter @benchmark/data build

# Build qwik (client + server)
ENV VITE_API_URL=http://api:3000
RUN pnpm --filter @benchmark/qwik build

# Stage 2: runner
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the built server and client artifacts
COPY --from=builder /app/packages/qwik/dist ./packages/qwik/dist
COPY --from=builder /app/packages/qwik/server ./packages/qwik/server
# Copy hoisted node_modules (shamefully-hoist puts everything at root)
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT=3000

WORKDIR /app/packages/qwik

CMD ["node", "server/entry.express.js"]
