FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/data/package.json packages/data/
COPY packages/nuxt/package.json packages/nuxt/
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY packages/data packages/data
COPY packages/nuxt packages/nuxt
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/nuxt build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/nuxt/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
