# Build outside the small VPS; deploy an audited immutable image.
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG SITE_ORIGIN
RUN test -n "$SITE_ORIGIN"
ENV NEXT_PUBLIC_SITE_URL=$SITE_ORIGIN
ENV NEXT_PUBLIC_ATHENA_AUTH_ENABLED=false
ENV NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED=false
ENV ATHENA_VPS_STANDALONE_BUILD=true
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd -g 1001 athena && useradd -r -u 1001 -g athena athena
COPY --from=builder --chown=athena:athena /app/.next/standalone ./
COPY --from=builder --chown=athena:athena /app/.next/static ./.next/static
COPY --from=builder --chown=athena:athena /app/public ./public
COPY --chown=athena:athena deploy/vps/healthcheck.cjs ./healthcheck.cjs
COPY --chown=athena:athena scripts/phase8c5-benchmark*.mjs ./scripts/
RUN mkdir -p /app/.next/cache && chown -R athena:athena /app/.next
USER athena
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=7s --start-period=30s --retries=3 \
  CMD ["node","/app/healthcheck.cjs"]
CMD ["node","server.js"]
