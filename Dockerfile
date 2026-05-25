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
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code (.dockerignore excludes node_modules, .git, .env.development)
COPY . .

# Build the Vite app — picks up ENV vars above (overrides .env.production values)
RUN yarn build

# Production stage - lightweight nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from dist folder (Vite default output)
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
