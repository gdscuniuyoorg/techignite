# syntax=docker/dockerfile:1

# ── Base ──────────────────────────────────────────────────────────────────
# Node 24 (matches CI). pnpm is pinned via packageManager in package.json;
# corepack activates exactly that version. The download prompt is disabled
# so the image builds non-interactively.
FROM node:24-alpine AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# ── Dependencies ──────────────────────────────────────────────────────────
# Install from the committed lockfile only — reproducible installs.
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────
# Produces the Nitro server bundle in .output/ (server + public assets).
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# routeTree.gen.ts is committed, but regenerate defensively so a build can
# never ship with a stale route tree.
RUN pnpm run routes:generate
RUN pnpm run build

# ── Runner ────────────────────────────────────────────────────────────────
# Runtime needs only the compiled Nitro output — no node_modules, no source.
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
COPY --from=build /app/.output ./.output
USER node
CMD ["node", ".output/server/index.mjs"]
