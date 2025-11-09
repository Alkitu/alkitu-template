# Testing Strategy and Frameworks Convention

This document defines which testing frameworks to use for each layer of testing in the Alkitu Template project, and when to use each framework.

## Purpose

Establishing clear testing framework guidelines ensures:
- **Efficiency**: Use the right tool for each job
- **Performance**: Fast test execution with appropriate frameworks
- **Consistency**: Same patterns across the entire codebase
- **Cost-effectiveness**: Avoid unnecessary tool overlap
- **Team alignment**: Everyone knows which framework to use when

## Testing Framework Stack

### Backend (packages/api/)

| Testing Layer | Framework | Status | When to Use |
|--------------|-----------|---------|-------------|
| **Unit Tests** | Jest | ✅ Maintain | Service methods, utility functions |
| **Mutation Testing** | Stryker | ✅ Maintain | Validate test quality (85%+ score) |
| **API Testing** | Supertest | ✅ Maintain | REST/GraphQL/tRPC endpoints |
| **DB Testing** | MongoDB Memory Server | ✅ Maintain | Repository tests, data layer |
| **Mocking** | jest-mock-extended | ✅ Maintain | Service dependencies |

### Frontend (packages/web/)

| Testing Layer | Framework | Status | When to Use |
|--------------|-----------|---------|-------------|
| **Unit Tests** | Vitest | ✅ Maintain | Components, hooks, utilities |
| **Component Testing** | Testing Library | ✅ Maintain | React component behavior |
| **E2E Tests** | Playwright | 🆕 Add | User flows, critical paths |
| **Visual Regression** | Chromatic | ✅ Maintain | UI changes, theme variations |
| **Accessibility** | jest-axe | ✅ Maintain | A11y compliance |
| **Stories** | Storybook | ✅ Maintain | Component documentation |

## Framework Decision Matrix

### When to Use Each Frontend Framework

```
┌─────────────────────────────────────────────────────────┐
│                    TESTING PYRAMID                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    🔺 Playwright                        │
│                   (E2E - 5% of tests)                   │
│                  Full user workflows                    │
│                                                         │
│               🔺🔺 Chromatic                            │
│              (Visual - Auto on Storybook)               │
│             Theme changes, visual regressions           │
│                                                         │
│          🔺🔺🔺 Vitest + Testing Library                │
│         (Unit/Integration - 90% of tests)               │
│        Components, hooks, utilities                     │
│                                                         │
│      🔺🔺🔺🔺 jest-axe                                  │
│     (Accessibility - Embedded in unit tests)            │
│    ARIA, keyboard nav, color contrast                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Decision Tree: Which Framework?

```
START: Need to test something?
│
├─ Is it a UI component?
│  │
│  ├─ YES: Testing isolated component behavior?
│  │  │
│  │  ├─ YES → Use **Vitest + Testing Library**
│  │  │         - Props, state, events
│  │  │         - Rendering logic
│  │  │         - User interactions
│  │  │
│  │  └─ NO: Testing complete user flow across pages?
│  │     └─ YES → Use **Playwright**
│  │               - Auth flows
│  │               - Multi-step processes
│  │               - Navigation
│  │
│  └─ Is it visual appearance?
│     └─ YES → Use **Storybook + Chromatic**
│               - Theme variations
│               - Component states
│               - Responsive design
│
├─ Is it backend logic?
│  └─ YES → Use **Jest**
│            - Services
│            - Controllers
│            - Repositories
│
└─ Is it API endpoint?
   └─ YES → Use **Supertest**
            - REST endpoints
            - GraphQL queries
            - tRPC procedures
```

## Detailed Framework Guidelines

### 1. Vitest (Frontend Unit Tests)

**Use for:**
- ✅ Component unit tests (atoms, molecules, organisms)
- ✅ React hooks testing
- ✅ Utility function testing
- ✅ State management (Zustand stores)
- ✅ Client-side validation

**Do NOT use for:**
- ❌ E2E flows across multiple pages
- ❌ Full browser testing (use Playwright)
- ❌ Visual regression (use Chromatic)
- ❌ Backend testing (use Jest)

**Example:**
```typescript
// Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

**Why Vitest over Jest for Frontend:**
- ⚡ 10-20x faster than Jest (HMR in watch mode)
- ✅ Native ESM support (no transformers needed)
- ✅ Better Vite/Next.js integration
- ✅ Same API as Jest (easy migration)
- ✅ Built-in UI mode for debugging

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
});
```

---

### 2. Playwright (Frontend E2E Tests)

**Use for:**
- ✅ Complete user workflows (login → dashboard → logout)
- ✅ Multi-page navigation flows
- ✅ Critical path testing (registration, checkout)
- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Visual screenshots for key pages
- ✅ Network mocking for tRPC/API calls
- ✅ Performance testing (page load times)

**Do NOT use for:**
- ❌ Unit testing individual components (use Vitest)
- ❌ Testing component props/state in isolation
- ❌ Quick feedback loop development (too slow)

**Example:**
```typescript
// tests/e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test('Complete registration flow', async ({ page }) => {
  await page.goto('/auth/register');

  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('SecurePass123!');
  await page.getByRole('button', { name: /sign up/i }).click();

  await expect(page).toHaveURL('/auth/new-verification');
  await expect(page.getByText(/check your email/i)).toBeVisible();
});
```

**Why Playwright over Cypress:**
- ✅ **Multi-browser**: Native Chrome, Firefox, Safari, Edge
- ✅ **Faster**: Better parallelization, no server dependency
- ✅ **MCP Integration**: Works with Claude Code MCP
- ✅ **API Testing**: Can test tRPC endpoints directly
- ✅ **Free**: No cost for parallel execution
- ✅ **TypeScript**: First-class TypeScript support
- ❌ Cypress: Better debugging UI, but limited to Chrome/Firefox

**Configuration:**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

### 3. Jest (Backend Unit Tests)

**Use for:**
- ✅ NestJS service testing
- ✅ Controller testing
- ✅ Repository testing
- ✅ Utility functions
- ✅ Middleware testing
- ✅ Guard/interceptor testing

**Do NOT use for:**
- ❌ Frontend component testing (use Vitest)
- ❌ Browser-based testing

**Example:**
```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: createMock<UserRepository>() },
      ],
    }).compile();

    service = module.get(UserService);
    repository = module.get(UserRepository);
  });

  it('creates user successfully', async () => {
    const userData = { email: 'test@test.com', password: 'pass123' };
    repository.create.mockResolvedValue({ id: '1', ...userData });

    const result = await service.createUser(userData);
    expect(result.id).toBe('1');
  });
});
```

**Why Jest for Backend:**
- ✅ **NestJS Integration**: Official testing module
- ✅ **Mature Ecosystem**: Well-established patterns
- ✅ **Mocking**: Excellent mock support
- ✅ **Coverage**: Built-in coverage tools
- ✅ **Stryker Integration**: Mutation testing support

---

### 4. Stryker (Mutation Testing)

**Use for:**
- ✅ Validating test quality (not just coverage)
- ✅ Critical services (auth, payment, user management)
- ✅ CI/CD quality gates
- ✅ Ensuring tests catch actual bugs

**Do NOT use for:**
- ❌ Every test run (too slow)
- ❌ Development TDD cycle (use Jest/Vitest)
- ❌ Simple utility functions

**Example:**
```javascript
// stryker.conf.mjs
export default {
  mutate: ['src/**/*.ts', '!src/**/*.spec.ts'],
  testRunner: 'jest',
  thresholds: { high: 85, low: 70, break: 60 },
  reporters: ['html', 'progress'],
};
```

**When to Run:**
- ✅ Before merging to main
- ✅ Weekly quality reports
- ✅ After major refactors
- ✅ On critical path code

---

### 5. Storybook + Chromatic (Visual Regression)

**Use for:**
- ✅ Component visual documentation
- ✅ Detecting unintended UI changes
- ✅ Theme variation testing
- ✅ Responsive design validation
- ✅ Design system showcase

**Do NOT use for:**
- ❌ Functional testing (use Vitest)
- ❌ E2E flows (use Playwright)
- ❌ Unit test replacement

**Example:**
```typescript
// Button.stories.tsx
export default {
  component: Button,
  parameters: {
    chromatic: {
      viewports: [320, 768, 1200],
      diffThreshold: 0.2,
    },
  },
} satisfies Meta<typeof Button>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
```

**Why Chromatic:**
- ✅ **Storybook Integration**: Seamless workflow
- ✅ **UI Review**: Visual approval process
- ✅ **Cross-browser**: Tests multiple browsers
- ✅ **Free Tier**: 5,000 snapshots/month

---

## Testing Workflow by Task

### Task: "Create a new Button component"

1. **Create component structure**
   ```
   atoms/button/
   ├── Button.tsx
   ├── Button.types.ts
   ├── Button.test.tsx         # Step 2
   ├── Button.stories.tsx       # Step 3
   └── index.ts
   ```

2. **Write unit tests (Vitest)**
   - 8-10 test cases
   - Rendering, variants, sizes, interactions
   - Accessibility

3. **Write Storybook stories**
   - Default, all variants, sizes
   - Dark theme, loading states
   - Chromatic snapshots

4. **Optional: E2E test if critical**
   - Only if button is part of critical flow
   - Example: Submit button in payment form

### Task: "Implement user registration flow"

1. **Backend (Jest)**
   - `auth.service.spec.ts`: Registration logic
   - `user.repository.spec.ts`: Database operations
   - `auth.controller.spec.ts`: API endpoint

2. **Frontend Unit (Vitest)**
   - `RegisterFormOrganism.test.tsx`: Form behavior
   - `useAuthRedirect.test.ts`: Hook logic

3. **E2E (Playwright)**
   - `registration-flow.spec.ts`: Complete flow
   - Fill form → Submit → Email verification → Login

4. **Visual (Chromatic)**
   - `RegisterFormOrganism.stories.tsx`: Form variants

### Task: "Add theme customization feature"

1. **Unit tests (Vitest)**
   - Theme editor logic
   - Color picker components
   - Save/load functionality

2. **Visual tests (Chromatic - PRIMARY)**
   - Theme variations
   - Color changes
   - Before/after comparisons

3. **E2E (Playwright)**
   - Change theme → Save → Reload → Verify persistence
   - Screenshot comparisons

## Anti-Patterns

### ❌ DON'T: Mix frameworks incorrectly

```typescript
// Button.test.tsx
import { test, expect } from '@playwright/test';  // ❌ WRONG

test('button renders', async ({ page }) => {  // ❌ Playwright for unit tests
  await page.goto('/');
  // ...
});
```

**Correct:**
```typescript
// Button.test.tsx
import { describe, it, expect } from 'vitest';  // ✅ CORRECT

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Text</Button>);
    // ...
  });
});
```

### ❌ DON'T: Use Cypress for new tests

```bash
# ❌ WRONG - Don't install Cypress
npm install cypress
```

**Correct:**
```bash
# ✅ CORRECT - Use Playwright
npm install -D @playwright/test
```

### ❌ DON'T: Run E2E tests in watch mode during development

```bash
# ❌ WRONG - Too slow for development
npm run test:e2e:watch
```

**Correct:**
```bash
# ✅ CORRECT - Use unit tests for fast feedback
npm run test:watch  # Vitest watch mode
```

### ❌ DON'T: Skip Storybook for shared components

```typescript
// Button component created without Button.stories.tsx
// ❌ WRONG - All shared components need stories
```

**Correct:**
```typescript
// ✅ CORRECT - Create stories for visual documentation
// Button.stories.tsx
export default { component: Button } satisfies Meta<typeof Button>;
```

## Quality Standards

### Coverage Targets by Framework

| Framework | Target | Enforcement |
|-----------|--------|-------------|
| **Vitest (Frontend)** | 90%+ | Pre-commit hook |
| **Jest (Backend)** | 95%+ | CI/CD gate |
| **Stryker (Backend)** | 85%+ | Weekly report |
| **Playwright (E2E)** | Critical paths | Manual review |
| **jest-axe (A11y)** | 0 violations | CI/CD gate |

### Test Execution Speed

| Framework | Speed | When to Run |
|-----------|-------|-------------|
| **Vitest** | <100ms/test | Every save (watch mode) |
| **Jest** | <200ms/test | Every commit |
| **Playwright** | 5-10s/test | Pre-merge, nightly |
| **Stryker** | 10-20min | Weekly, pre-release |
| **Chromatic** | 2-5min | Every PR |

## Commands Reference

### Frontend

```bash
# Unit tests (Vitest)
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:ui           # UI mode
npm run test:coverage     # With coverage

# E2E tests (Playwright)
npm run test:e2e          # Run all E2E
npm run test:e2e:ui       # Interactive mode
npm run test:e2e:debug    # Debug mode
npm run test:e2e:codegen  # Generate tests

# Visual tests (Chromatic)
npm run test:visual       # Run Chromatic
npm run build-storybook   # Build Storybook
npm run storybook         # Dev mode
```

### Backend

```bash
# Unit tests (Jest)
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:cov          # With coverage
npm run test:debug        # Debug mode

# Mutation tests (Stryker)
npm run test:mutation     # Run mutation testing
npm run test:mutation:watch  # Watch mode

# Quality gates
npm run quality:gates     # All checks
```

## Enforcement

1. **Pre-commit hooks**
   - Run unit tests (Vitest/Jest)
   - Check coverage thresholds
   - Lint test files

2. **CI/CD Pipeline**
   - All unit tests must pass
   - Coverage thresholds enforced
   - E2E tests on staging
   - Chromatic visual review

3. **Code Review**
   - Verify correct framework usage
   - Check test coverage
   - Ensure tests follow patterns

## Migration Guide

### From Jest to Vitest (Frontend)

**Old (Jest):**
```typescript
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

test('renders', () => {
  // ...
});
```

**New (Vitest):**
```typescript
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('renders', () => {
    // Same test code
  });
});
```

**Changes needed:**
1. Update imports: `vitest` instead of `@jest/globals`
2. Config: `vitest.config.ts` instead of `jest.config.js`
3. Setup: Update `setupTests.ts`

### From Cypress to Playwright (E2E)

**Old (Cypress):**
```typescript
cy.visit('/login');
cy.get('[name="email"]').type('test@test.com');
cy.get('button[type="submit"]').click();
```

**New (Playwright):**
```typescript
await page.goto('/login');
await page.getByLabel('Email').fill('test@test.com');
await page.getByRole('button', { name: /sign in/i }).click();
```

## Related Documentation

- [Component Structure and Testing](/docs/00-conventions/component-structure-and-testing.md)
- [Frontend Testing Guide](/docs/05-testing/frontend-testing-guide.md)
- [Backend Testing Guide](/docs/05-testing/backend-testing-guide.md)
- [Playwright Setup and Usage](/docs/05-testing/playwright-setup-and-usage.md)
- [Testing Cheatsheet](/docs/05-testing/testing-cheatsheet.md)

---

**Last Updated:** 2025-01-09
**Maintained By:** Development Team
