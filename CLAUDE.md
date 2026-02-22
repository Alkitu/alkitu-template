# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL DEVELOPMENT RULES - MUST FOLLOW

⚠️ **IMPORTANT**: These rules MUST be followed for EVERY code change:

1. **NEVER DELETE**: Do not delete ANY code until you are 100% certain it is not essential or being used elsewhere
2. **NEVER CREATE**: Do not create ANY new component/file until you verify a similar one doesn't already exist
3. **ALWAYS REUSE**: Always try to reuse existing code and update it when possible
4. **MAINTAIN COMPATIBILITY**: Any updates MUST be backward compatible - never break existing functionality
5. **COMMUNICATE FIRST**: Always explain what you're going to do BEFORE making any changes
6. **NO EXTERNAL DEPENDENCIES**: Do NOT install any external dependencies unless EXTREMELY necessary
7. **DOCUMENT CONVENTIONS**: When solving a problem that establishes a new pattern or convention, ALWAYS create documentation in `/docs/00-conventions/` with a descriptive filename

### Documentation Convention Rules:

- 📝 **ALWAYS** create convention documentation in `/docs/00-conventions/` when establishing new patterns
- 📄 **USE** descriptive, kebab-case filenames (e.g., `api-design-patterns.md`)
- ✅ **INCLUDE** clear rules, examples, and anti-patterns in documentation
- 🔗 **REFERENCE** important conventions from this CLAUDE.md file
- 📚 See `/docs/00-conventions/documentation-guidelines.md` for complete documentation standards

### Dependency Management Rules:

- 🚫 **NEVER** install new packages without checking existing dependencies first
- 📦 **ALWAYS** review `package.json` files (root and all workspaces) before suggesting new dependencies
- ✅ **VERIFY** if functionality can be achieved with existing packages
- 🔍 **CHECK** all these locations before installing anything:
  - `/package.json` (root)
  - `/packages/api/package.json`
  - `/packages/web/package.json`
  - `/packages/mobile/package.json`
  - `/packages/shared/package.json`
- ⚠️ Only install new dependencies when absolutely no alternative exists

### Before Making ANY Changes:

- ✅ Check if the component/function already exists
- ✅ Verify the code is not being used elsewhere
- ✅ Ensure changes are backward compatible
- ✅ Review existing dependencies before suggesting new ones
- ✅ Explain the planned changes to the user first
- ✅ Get confirmation before proceeding with significant changes

### Atomic Design Architecture Rules:

- 🏗️ **FOLLOW ATOMIC DESIGN**: All UI components MUST follow Atomic Design methodology (Atoms → Molecules → Organisms → Templates → Pages)
- 📁 **USE CORRECT STRUCTURE**: Place components in `/packages/web/src/components/` with proper hierarchy
- 📝 **INCLUDE TYPE FILES**: Every component MUST have `.tsx`, `.types.ts`, and `index.ts` files
- 🌍 **TRANSLATIONS IN PAGES**: Pages MUST use `useTranslations()` hook and pass translated props to organisms
- ❌ **NO UI IN PAGES**: Page components should ONLY handle configuration and composition, NOT UI implementation
- 🔗 **REFERENCE GUIDE**: See `/docs/00-conventions/atomic-design-architecture.md` for complete guidelines

### Component Testing Rules:

- ✅ **CO-LOCATE TESTS**: Place `Component.test.tsx` NEXT TO `Component.tsx` (NOT in `__tests__/` folders)
- 📊 **COVERAGE REQUIREMENTS**: Atoms (95%+), Molecules (90%+), Organisms (95%+)
- 🧪 **UNIT TESTS**: Use Vitest + Testing Library for component testing
- 🎭 **E2E TESTS**: Use Playwright ONLY for complete user flows (auth, checkout)
- 📸 **VISUAL TESTS**: Use Storybook + Chromatic for visual regression
- 🔗 **REFERENCE GUIDES**:
  - Component structure: `/docs/00-conventions/component-structure-and-testing.md`
  - Testing frameworks: `/docs/00-conventions/testing-strategy-and-frameworks.md`
  - Frontend testing: `/docs/05-testing/frontend-testing-guide.md`
  - Backend testing: `/docs/05-testing/backend-testing-guide.md`

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

# Backend testing (Jest + Stryker)
cd packages/api
npm run test:cov        # Coverage reports (95%+ required)
npm run test:mutation   # Mutation testing (85%+ score required)
npm run test:solid      # SOLID principles validation
npm run test:tdd        # TDD watch mode
npm run test:e2e        # End-to-end tests
npm run quality:gates   # All quality checks

# Frontend unit testing (Vitest)
cd packages/web
npm run test            # Run all tests once
npm run test:watch      # Watch mode
npm run test:ui         # Vitest UI mode
npm run test:coverage   # Coverage report

# Frontend E2E testing (Playwright)
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Interactive UI mode
npm run test:e2e:debug  # Debug mode
npm run test:e2e:codegen  # Generate tests with codegen

# Visual regression (Storybook + Chromatic)
npm run storybook       # Dev mode (port 6006)
npm run build-storybook # Build for production
npm run test:visual     # Run Chromatic
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

### Faster CLI Commands

For improved performance and developer experience, use these modern alternatives:

- **fd** - Faster alternative to `find` command
- **rg** (ripgrep) - Faster alternative to `grep` command
- **tree** - Display directory structures
- **ast-grep** - AST-based code searching and refactoring
- **fzf** - Fuzzy finder for command-line
- **jq** - JSON processor for parsing and manipulating JSON
- **yq** - YAML/JSON processor

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
- **Component Architecture**: Atomic Design methodology (Atoms → Molecules → Organisms → Templates → Pages)
- **State Management**: Zustand + React Query for server state
- **API Integration**: tRPC client with React Query
- **UI Components**: Radix UI primitives + NextUI + custom Atomic Design components
- **Styling**: Tailwind CSS v4 with CSS variables, OKLCH color space
- **Theme System**: Dynamic theming with Culori color library
- **Internationalization**: useTranslations() hook pattern for multi-language support
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

- **Testing Workflow**: DESIGN → TEST → IMPLEMENT → OPTIMIZE → VALIDATE
- **Coverage Requirements**: 95%+ for critical services, 90%+ globally
- **Mutation Testing**: 85%+ mutation score using Stryker
- **Test Categories**: Contract, Unit, Integration, E2E, Performance
- **Quality Gates**: Automated in CI/CD pipeline
- **Testing Frameworks**:
  - **Backend**: Jest (unit) + Stryker (mutation) + Supertest (API)
  - **Frontend Unit**: Vitest + Testing Library
  - **Frontend E2E**: Playwright (multi-browser, MCP integration)
  - **Visual Regression**: Storybook + Chromatic
  - **Accessibility**: jest-axe (embedded in unit tests)

### API Development

- **tRPC**: Primary API layer with type-safe client integration
- **GraphQL**: Available for complex queries
- **REST**: Available for external integrations
- **WebSocket**: Real-time features using Socket.IO
- **Validation**: Zod schemas for all endpoints
- **Documentation**: Swagger/OpenAPI for REST endpoints

### Frontend Development

- **Component Structure**: Atomic design pattern in Base Web Architecture
- **Theme System**: Dynamic themes with OKLCH color space managed by Theme Editor 3.0.
  - *Note on Border Radius*: `css-variables.ts` contains a fallback (`0.625rem`) to prevent UI breakage if the database `themeData.borders.radius` is `null`/`undefined`. Over time, this should be properly migrated and saved directly within the Theme Editor's DB state to avoid relying on hardcoded fallbacks.
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
- **Frontend Component Builder**: Creates Atomic Design components automatically (`.claude/agents/frontend-component-builder.md`)
- **Frontend Testing Expert**: Vitest/Playwright/Storybook test generation (`.claude/agents/frontend-testing-expert.md`)
- **Backend Testing Expert**: Jest/Stryker TDD workflow (`.claude/agents/backend-testing-expert.md`)
- **Component Migration Coordinator**: Orchestrates complete migration workflow (`.claude/agents/component-migration-coordinator.md`)
- **Component Verification Agent**: Automated component migration verification
- **Documentation Agent**: Maintains comprehensive documentation

### Workflows

#### Component Creation Workflow (New Components)

```
User request → frontend-component-builder → frontend-testing-expert → Complete component
```

#### Component Migration Workflow (Existing Components)

```
/migrate-component → component-migration-coordinator
  ├─ Analyzes original component
  ├─ Invokes frontend-component-builder
  ├─ Migrates code logic
  ├─ Verifies quality gates
  └─ Updates tracking document automatically
```

**Quick Start Commands**:

- `/migrate-component` - Start automated migration workflow with tracking
- Invoke `frontend-component-builder` - Create new component from scratch

Refer to `docs/03-ai-agents/` for agent-specific protocols and workflows.

## Key Files and Locations

### Configuration Files

- `package.json` - Root package configuration and workspace scripts
- `docker-compose.dev.yml` - Development environment with MongoDB replica set
- `packages/api/jest.config.mjs` - Comprehensive Jest configuration
- `packages/web/vitest.config.ts` - Vitest configuration for frontend

### Important Directories

- `docs/00-conventions/` - Project conventions and guidelines (START HERE for standards)
  - `documentation-guidelines.md` - How to write documentation
  - `atomic-design-architecture.md` - Component structure rules
  - `component-structure-and-testing.md` - Component file structure and testing conventions
  - `testing-strategy-and-frameworks.md` - Which framework to use when
- `docs/02-components/` - Component templates for creation (used by frontend-component-builder agent)
  - `component-atom-template.md` - Atom component template (buttons, inputs, icons)
  - `component-molecule-template.md` - Molecule component template (form fields, cards)
  - `component-organism-template.md` - Organism component template (forms, complex features)
- `docs/05-testing/` - Testing guides and strategies
  - `frontend-testing-guide.md` - Complete frontend testing guide
  - `backend-testing-guide.md` - TDD workflow for backend
  - `playwright-setup-and-usage.md` - E2E testing with Playwright
  - `testing-cheatsheet.md` - Quick reference for testing
- `.claude/agents/` - AI agent definitions
  - `frontend-component-builder.md` - Frontend component creation agent
  - `frontend-testing-expert.md` - Frontend test generation agent
  - `backend-testing-expert.md` - Backend TDD agent
  - `component-migration-coordinator.md` - Migration orchestration agent
  - `component-verification-agent.md` - Component verification agent
- `.claude/commands/` - Slash commands
  - `migrate-component.md` - Start migration workflow (/migrate-component)
- `infrastructure/docker/` - Docker configurations for all services
- `packages/api/test/` - Testing utilities, factories, and mocks
- `packages/web/src/components/` - Atomic Design components

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
