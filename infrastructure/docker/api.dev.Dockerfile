FROM node:18-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/api/package*.json ./packages/api/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN cd packages/api && npx prisma generate

EXPOSE 3001

# Run in development mode
CMD ["npm", "run", "dev:api"]