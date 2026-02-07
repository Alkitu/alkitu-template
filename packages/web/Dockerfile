# ============================================
# Multi-stage Dockerfile for Next.js Frontend
# Optimized for production deployment
# ============================================

# Stage 1: Build Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./
COPY packages/web/package*.json ./packages/web/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production --workspace=@alkitu/web --workspace=@alkitu/shared

# Stage 2: Build Application
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./
COPY packages/web/package*.json ./packages/web/
COPY packages/shared/package*.json ./packages/shared/

# Install all dependencies (including dev dependencies for build)
RUN npm ci --workspace=@alkitu/web --workspace=@alkitu/shared

# Copy source code
COPY packages/web ./packages/web
COPY packages/shared ./packages/shared

# Set Next.js telemetry to disabled
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js application
WORKDIR /app/packages/web
RUN npm run build

# Stage 3: Production Runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Install production runtime dependencies
RUN apk add --no-cache dumb-init curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set environment to production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy dependencies from deps stage
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nextjs:nodejs /app/packages/web/node_modules ./packages/web/node_modules
COPY --from=deps --chown=nextjs:nodejs /app/packages/shared ./packages/shared

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next ./packages/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/public ./packages/web/public
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/package*.json ./packages/web/
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/next.config.ts ./packages/web/

# Copy necessary files for runtime
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.env* ./packages/web/ 2>/dev/null || :

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set working directory to web
WORKDIR /app/packages/web

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node_modules/.bin/next", "start"]
