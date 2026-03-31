FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json ./
COPY packages/data/package.json packages/data/
COPY packages/astro-solid/package.json packages/astro-solid/
RUN pnpm install --frozen-lockfile
COPY packages/data packages/data
COPY packages/astro-solid packages/astro-solid
ARG API_URL=http://api:3000
ENV API_URL=$API_URL
RUN pnpm --filter @benchmark/data build
RUN pnpm --filter @benchmark/astro-solid build

FROM base AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/packages/astro-solid/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
