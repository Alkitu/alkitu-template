# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Alkitu Template** - an enterprise-grade TypeScript monorepo for building SaaS applications. It uses npm workspaces and follows SOLID principles with AI-driven development workflows.

### Technology Stack
- **Backend**: NestJS v11 + MongoDB + Prisma + tRPC + GraphQL + WebSocket + JWT Auth
- **Frontend**: Next.js v15 + Radix UI + NextUI + Tailwind CSS v4 + Zustand + React Query
- **Mobile**: Flutter 3.10+ + BLoC + GoRouter + GraphQL
- **Shared**: TypeScript types, Zod schemas, utilities
- **Infrastructure**: Docker + MongoDB replica set + Redis + Nginx

## Common Development Commands

### Development Environment
```bash
# Start full development environment
npm run dev

# Start with Docker
npm run dev:docker

# Start individual services
npm run dev:api      # NestJS backend on :3001
npm run dev:web      # Next.js frontend on :3000
```

### Testing Commands
```bash
# Run all tests across packages
npm run test

# API testing (comprehensive suite)
cd packages/api
npm run test:cov        # Coverage reports (95%+ required)
npm run test:mutation   # Mutation testing (85%+ score required)
npm run test:solid      # SOLID principles validation
npm run test:tdd        # TDD watch mode
npm run test:e2e        # End-to-end tests

# Frontend testing
cd packages/web
npm run test:watch      # Vitest watch mode
npm run test:ui         # Vitest UI
```

### Database Operations
```bash
# Database management
npm run db:migrate      # Prisma migrations
npm run db:push         # Push schema changes
npm run db:studio       # Prisma Studio GUI
npm run db:shell        # MongoDB shell
```

### Quality Assurance
```bash
# Code quality checks
npm run lint            # ESLint across all packages
npm run type-check      # TypeScript compilation check

# Quality gates (used in CI)
cd packages/api
npm run quality:gates   # Coverage + mutation + lint + type-check
```

### Docker Development
```bash
# Docker management
npm run docker:stop     # Stop all containers
npm run docker:logs     # View container logs
npm run docker:restart  # Restart services
```

## Architecture & Code Organization

### Monorepo Structure
```
packages/
├── api/           # NestJS backend (MongoDB + Prisma + tRPC)
├── web/           # Next.js frontend (App Router + Radix + tRPC)  
├── mobile/        # Flutter app (BLoC + GraphQL)
├── shared/        # Common types, schemas, utilities
└── tweakcn/       # Design system package
```

### Backend Architecture (packages/api/)
- **SOLID Principles**: Strictly enforced with dedicated test utilities
- **API Types**: REST + tRPC + GraphQL + WebSocket (comprehensive API layer)
- **Authentication**: JWT + Passport (local & JWT strategies)
- **Database**: MongoDB with Prisma ORM, replica set configuration
- **Validation**: Zod schemas with nestjs-zod integration
- **Real-time**: Socket.IO for WebSocket connections
- **Email**: Resend service integration
- **Testing**: 95%+ coverage, 85%+ mutation score, TDD methodology

### Frontend Architecture (packages/web/)
- **Framework**: Next.js v15 with App Router
- **State Management**: Zustand + React Query for server state
- **API Integration**: tRPC client with React Query
- **UI Components**: Radix UI primitives + NextUI + custom components
- **Styling**: Tailwind CSS v4 with CSS variables, OKLCH color space
- **Theme System**: Dynamic theming with Culori color library
- **Testing**: Vitest + React Testing Library + Storybook

### Shared Package (packages/shared/)
- **Types**: Common TypeScript interfaces and types
- **Schemas**: Zod validation schemas shared between API and frontend
- **Utilities**: Helper functions and constants
- **Export Strategy**: Modular exports for clean imports

## Development Patterns

### SOLID Principles Implementation
The project strictly follows SOLID principles with dedicated testing utilities:
- **Single Responsibility**: Each service has one clear purpose
- **Open/Closed**: Services are extensible without modification
- **Liskov Substitution**: Implementations are fully substitutable
- **Interface Segregation**: Focused, specific interfaces
- **Dependency Inversion**: Dependency injection throughout

Test SOLID compliance with: `npm run test:solid`

### Testing Methodology
- **TDD Workflow**: RED → GREEN → REFACTOR → VALIDATION
- **Coverage Requirements**: 95%+ for critical services, 90%+ globally
- **Mutation Testing**: 85%+ mutation score using Stryker
- **Test Categories**: Unit, Integration, E2E, Performance, Contract
- **Quality Gates**: Automated in CI/CD pipeline

### API Development
- **tRPC**: Primary API layer with type-safe client integration
- **GraphQL**: Available for complex queries
- **REST**: Available for external integrations  
- **WebSocket**: Real-time features using Socket.IO
- **Validation**: Zod schemas for all endpoints
- **Documentation**: Swagger/OpenAPI for REST endpoints

### Frontend Development
- **Component Structure**: Atomic design pattern in Base Web Architecture
- **Theme System**: Dynamic themes with OKLCH color space
- **State Management**: Zustand for client state, React Query for server state
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts integration
- **Performance**: Next.js optimizations + Vercel analytics

## Database Schema

- **Database**: MongoDB with Prisma ORM
- **Connection**: Replica set configuration for transactions
- **Migrations**: Use `npm run db:migrate` for schema changes
- **Development**: MongoDB Memory Server for testing
- **Studio**: `npm run db:studio` for GUI database management

## Environment Configuration

### Required Environment Variables
```bash
# API (packages/api/.env)
DATABASE_URL=mongodb://localhost:27017/alkitu?replicaSet=rs0
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
RESEND_API_KEY=your-resend-key

# Web (packages/web/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development Setup
1. Ensure Node.js >=18.0.0 and npm >=8.0.0
2. Run `npm install` in root directory
3. Copy `.env.example` files and configure
4. Start development with `npm run dev` or `npm run dev:docker`

## AI Agent Integration

This project uses AI-driven development with specialized agents:
- **Architecture Agent**: SOLID principles and system design
- **Backend Agent**: NestJS and API development  
- **Frontend Agent**: Next.js and UI development
- **Testing Agent**: TDD methodology and quality assurance
- **Documentation Agent**: Maintains comprehensive documentation

Refer to `docs/03-ai-agents/` for agent-specific protocols and workflows.

## Key Files and Locations

### Configuration Files
- `package.json` - Root package configuration and workspace scripts
- `docker-compose.dev.yml` - Development environment with MongoDB replica set
- `packages/api/jest.config.mjs` - Comprehensive Jest configuration
- `packages/web/vitest.config.ts` - Vitest configuration for frontend

### Important Directories
- `docs/` - Comprehensive project documentation
- `infrastructure/docker/` - Docker configurations for all services
- `packages/api/test/` - Testing utilities, factories, and mocks
- `packages/web/src/components/ui/` - Reusable UI components

### Health Monitoring
- API health check: `http://localhost:3001/health`
- API documentation: `http://localhost:3001/api/docs`
- Database GUI: `npm run db:studio`
- Storybook: `npm run storybook` (port 6006)

## Quality Standards

- **Code Coverage**: 95%+ for services, 90%+ globally
- **Mutation Score**: 85%+ for critical components
- **Type Safety**: Strict TypeScript configuration
- **Linting**: ESLint with strict rules across all packages
- **Performance**: Jest tests <10s, mutation tests <15min optimized
- **Documentation**: Comprehensive docs for all major components

Use `npm run quality:gates` to verify all quality standards before commits.