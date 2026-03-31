FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/data/package.json packages/data/
COPY packages/nextjs-pages/package.json packages/nextjs-pages/
RUN pnpm install --frozen-lockfile
COPY packages/data packages/data
COPY packages/nextjs-pages packages/nextjs-pages
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/nextjs-pages build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/nextjs-pages/.next/standalone ./
COPY --from=builder /app/packages/nextjs-pages/.next/static ./packages/nextjs-pages/.next/static
COPY --from=builder /app/packages/nextjs-pages/public ./packages/nextjs-pages/public
EXPOSE 3000
CMD ["node", "packages/nextjs-pages/server.js"]
