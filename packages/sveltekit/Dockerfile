FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/data/package.json packages/data/
COPY packages/sveltekit/package.json packages/sveltekit/
RUN pnpm install --frozen-lockfile
COPY packages/data packages/data
COPY packages/sveltekit packages/sveltekit
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/sveltekit build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy the full workspace so @benchmark/data workspace dep resolves
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/packages/data/package.json ./packages/data/
COPY --from=builder /app/packages/data/dist ./packages/data/dist
COPY --from=builder /app/packages/sveltekit/package.json ./packages/sveltekit/
COPY --from=builder /app/packages/sveltekit/build ./packages/sveltekit/build
WORKDIR /app/packages/sveltekit
RUN pnpm install --prod --ignore-scripts
EXPOSE 3000
CMD ["node", "build/index.js"]
