FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/web/package*.json ./packages/web/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN cd packages/web && npx prisma generate

EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev:web"]