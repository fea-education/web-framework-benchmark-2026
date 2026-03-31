FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/data/package.json packages/data/
COPY packages/astro-vanilla/package.json packages/astro-vanilla/
RUN pnpm install --frozen-lockfile
COPY packages/data packages/data
COPY packages/astro-vanilla packages/astro-vanilla
ARG API_URL=http://localhost:3000
ENV API_URL=$API_URL
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/astro-vanilla build

FROM base AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/packages/astro-vanilla/dist ./dist
EXPOSE 3000
CMD ["serve", "dist", "-l", "3000"]
