FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/api/package.json packages/api/
COPY packages/astro-solid/package.json packages/astro-solid/
COPY packages/astro-vanilla/package.json packages/astro-vanilla/
COPY packages/benchmark/package.json packages/benchmark/
COPY packages/data/package.json packages/data/
COPY packages/e2e/package.json packages/e2e/
COPY packages/nextjs-app/package.json packages/nextjs-app/
COPY packages/nextjs-pages/package.json packages/nextjs-pages/
COPY packages/nuxt/package.json packages/nuxt/
COPY packages/qwik/package.json packages/qwik/
COPY packages/solidstart/package.json packages/solidstart/
COPY packages/sveltekit/package.json packages/sveltekit/
COPY packages/ui-reference/package.json packages/ui-reference/
RUN pnpm install --frozen-lockfile
COPY packages/data packages/data
COPY packages/nextjs-app packages/nextjs-app
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/nextjs-app build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/packages/nextjs-app/.next/standalone ./
COPY --from=builder /app/packages/nextjs-app/.next/static ./packages/nextjs-app/.next/static
COPY --from=builder /app/packages/nextjs-app/public ./packages/nextjs-app/public
EXPOSE 3000
CMD ["node", "packages/nextjs-app/server.js"]
