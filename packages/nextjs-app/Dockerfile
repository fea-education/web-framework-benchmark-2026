FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/data/package.json packages/data/
COPY packages/nextjs-app/package.json packages/nextjs-app/
RUN pnpm install --frozen-lockfile
COPY packages/data packages/data
COPY packages/nextjs-app packages/nextjs-app
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/nextjs-app build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/nextjs-app/.next/standalone ./
COPY --from=builder /app/packages/nextjs-app/.next/static ./packages/nextjs-app/.next/static
COPY --from=builder /app/packages/nextjs-app/public ./packages/nextjs-app/public
EXPOSE 3000
CMD ["node", "packages/nextjs-app/server.js"]
