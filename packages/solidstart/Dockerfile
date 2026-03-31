FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/data/package.json packages/data/
COPY packages/solidstart/package.json packages/solidstart/
RUN pnpm install --frozen-lockfile
COPY packages/data packages/data
COPY packages/solidstart packages/solidstart
ENV VITE_API_URL=http://api:3000
ENV API_URL=http://api:3000
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/solidstart build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/solidstart/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
