# ============================================
# Multi-stage Dockerfile for NestJS Backend
# Optimized for production deployment
# ============================================

# Stage 1: Build Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production --workspace=@alkitu/api --workspace=@alkitu/shared

# Stage 2: Build Application
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/shared/package*.json ./packages/shared/

# Install all dependencies (including dev dependencies for build)
RUN npm ci --workspace=@alkitu/api --workspace=@alkitu/shared

# Copy source code
COPY packages/api ./packages/api
COPY packages/shared ./packages/shared

# Generate Prisma Client
WORKDIR /app/packages/api
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 3: Production Runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Install production runtime dependencies
RUN apk add --no-cache dumb-init curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy dependencies from deps stage
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nestjs:nodejs /app/packages/api/node_modules ./packages/api/node_modules
COPY --from=deps --chown=nestjs:nodejs /app/packages/shared ./packages/shared

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/packages/api/dist ./packages/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/api/prisma ./packages/api/prisma
COPY --from=builder --chown=nestjs:nodejs /app/packages/api/package*.json ./packages/api/

# Copy Prisma generated client
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Set working directory to api
WORKDIR /app/packages/api

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main"]
