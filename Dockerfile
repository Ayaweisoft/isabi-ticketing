# Multi-stage build for Vite React apps
FROM node:22-alpine AS builder

WORKDIR /app

# Declare build-time env vars — CI passes these via --build-arg.
# Defaults match .env.production so local `docker build` also works without args.
ARG VITE_API_PREFIX=https://api.i-sabi.com.ng/api
ARG VITE_PAYSTACK_PUBLIC_KEY=pk_live_75b7957655199a457f85ff985808d2d1dfbaacfd
ENV VITE_API_PREFIX=$VITE_API_PREFIX
ENV VITE_PAYSTACK_PUBLIC_KEY=$VITE_PAYSTACK_PUBLIC_KEY

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Copy source code (.dockerignore excludes node_modules, .git, .env.development)
COPY . .

# Build the Vite app — picks up ENV vars above (overrides .env.production values)
RUN pnpm build

# ── Production stage ──────────────────────────────────────────────────────────
FROM nginx:alpine

# Add Node.js to run the meta-tag server alongside nginx
RUN apk add --no-cache nodejs

# nginx config with bot detection + proxy to meta server
COPY nginx.conf /etc/nginx/nginx.conf

# Meta-tag server (handles og:image for social crawlers)
RUN mkdir -p /app
COPY meta-server.js /app/meta-server.js

# Start script: launches meta server then nginx
COPY docker-start.sh /docker-start.sh
RUN chmod +x /docker-start.sh

# Copy built SPA assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

CMD ["/docker-start.sh"]
