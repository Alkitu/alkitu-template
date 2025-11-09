# Testing Decision Tree: When to Use What

Quick decision guide for choosing the right testing framework.

---

## Decision Flowchart

```
What are you testing?
│
├─ Frontend Component?
│  │
│  ├─ Is it a single component in isolation?
│  │  └─ YES → Use Vitest + Testing Library
│  │     Files: Component.test.tsx
│  │     Coverage: 90-95%
│  │
│  ├─ Is it a complete user flow (login, checkout)?
│  │  └─ YES → Use Playwright
│  │     Files: tests/e2e/flow-name.spec.ts
│  │     Browsers: Chromium, Firefox, WebKit
│  │
│  └─ Do you need to test visual appearance?
│     └─ YES → Use Storybook + Chromatic
│        Files: Component.stories.tsx
│        Purpose: Visual regression
│
├─ Backend Component?
│  │
│  ├─ Is it a service/repository/controller?
│  │  └─ YES → Use Jest
│  │     Files: component.spec.ts
│  │     Coverage: 90-95%
│  │     Mutation: 85-90%
│  │
│  ├─ Is it an interface implementation?
│  │  └─ YES → Use Jest (Contract Tests)
│  │     Files: service.contract.spec.ts
│  │     Coverage: 100% of interface methods
│  │
│  └─ Is it a complete API flow?
│     └─ YES → Use Jest + Supertest (E2E)
│        Files: test/e2e/feature.e2e-spec.ts
│        Purpose: Full API integration
│
└─ Is it accessibility testing?
   └─ YES → Use jest-axe (embedded in unit tests)
      Purpose: WCAG 2.1 compliance
```

---

## Quick Reference Table

| What to Test | Framework | Location | When to Use |
|-------------|-----------|----------|-------------|
| **Frontend atom/molecule** | Vitest | `Component.test.tsx` | Always |
| **Frontend organism** | Vitest | `Component.test.tsx` | Always |
| **User authentication flow** | Playwright | `tests/e2e/auth.spec.ts` | Critical flow |
| **Checkout/payment flow** | Playwright | `tests/e2e/checkout.spec.ts` | Critical flow |
| **Component visual appearance** | Storybook | `Component.stories.tsx` | Shared components |
| **Visual regression** | Chromatic | (Storybook) | Design system |
| **Accessibility** | jest-axe | (in unit tests) | All components |
| **Backend service** | Jest | `service.spec.ts` | Always |
| **Backend repository** | Jest | `repository.spec.ts` | Always |
| **Backend controller** | Jest | `controller.spec.ts` | Always |
| **Interface compliance** | Jest | `service.contract.spec.ts` | All interfaces |
| **API endpoints** | Supertest | `feature.e2e-spec.ts` | Integration |
| **Mutation testing** | Stryker | (runs on existing tests) | Quality validation |

---

## Frontend Testing Strategy

### Use Vitest When:
- ✅ Testing single component behavior
- ✅ Testing component props and variants
- ✅ Testing user interactions (click, type, submit)
- ✅ Testing state management
- ✅ Testing validation logic
- ✅ Need fast feedback (< 1 second per test)

### Use Playwright When:
- ✅ Testing complete user journeys
- ✅ Testing across multiple pages
- ✅ Testing authentication flows
- ✅ Testing payment/checkout flows
- ✅ Testing multi-step wizards
- ✅ Need multi-browser support

### Use Storybook + Chromatic When:
- ✅ Testing visual appearance
- ✅ Documenting component API
- ✅ Creating component library
- ✅ Detecting visual regressions
- ✅ Testing all variant combinations
- ✅ Sharing components with design team

### Use jest-axe When:
- ✅ Testing accessibility (always)
- ✅ Verifying WCAG compliance
- ✅ Checking ARIA attributes
- ✅ Testing keyboard navigation

---

## Backend Testing Strategy

### Use Jest (Unit) When:
- ✅ Testing service business logic
- ✅ Testing repository data access
- ✅ Testing controller request handling
- ✅ Testing utilities and helpers
- ✅ Testing guards, pipes, filters
- ✅ Need fast isolated tests

### Use Jest (Contract) When:
- ✅ Testing interface implementations
- ✅ Verifying SOLID compliance (Liskov)
- ✅ Ensuring implementation matches contract
- ✅ Testing all interface methods
- ✅ Validating exception handling

### Use Supertest (E2E) When:
- ✅ Testing complete API flows
- ✅ Testing authentication + authorization
- ✅ Testing database transactions
- ✅ Testing real HTTP requests
- ✅ Integration testing multiple modules

### Use Stryker (Mutation) When:
- ✅ Validating test quality
- ✅ Finding weak tests
- ✅ Ensuring edge cases covered
- ✅ Meeting quality gates (85%+ score)

---

## Common Scenarios

### Scenario 1: New Button Component
```
1. Create: Button.tsx
2. Test with: Vitest (Button.test.tsx) - 8-10 tests
3. Document with: Storybook (Button.stories.tsx) - all variants
4. Verify a11y: jest-axe (in Button.test.tsx)
5. Visual regression: Chromatic (automatically from stories)
❌ DON'T: Create Playwright test (not a flow)
```

### Scenario 2: Login Form Organism
```
1. Create: LoginFormOrganism.tsx
2. Test with: Vitest (LoginFormOrganism.test.tsx) - 10-15 tests
3. Test flow with: Playwright (tests/e2e/login.spec.ts)
4. Document with: Storybook (LoginFormOrganism.stories.tsx)
5. Verify a11y: jest-axe (in unit tests)
```

### Scenario 3: User Service (Backend)
```
1. Create: user.service.ts
2. Create interface: IUserService
3. Write contract test: user.service.contract.spec.ts (100% interface)
4. Write unit tests: user.service.spec.ts (95%+ coverage)
5. Run TDD workflow: RED → GREEN → REFACTOR → VALIDATE
6. Validate quality: Stryker mutation (90%+ score)
```

### Scenario 4: Checkout Flow (Critical)
```
1. Create organisms: CartOrganism, CheckoutFormOrganism, PaymentOrganism
2. Unit test each: Vitest (10-15 tests per organism)
3. E2E test flow: Playwright (tests/e2e/checkout.spec.ts)
   - Add to cart → View cart → Checkout → Payment → Confirmation
4. Test on browsers: Chromium, Firefox, WebKit
```

---

## What NOT to Test With

### ❌ DON'T Use Playwright For:
- Single component unit tests (use Vitest)
- Visual appearance (use Storybook)
- Backend APIs (use Supertest)
- Fast iteration (too slow)

### ❌ DON'T Use Vitest For:
- Multi-page user flows (use Playwright)
- Visual regression (use Chromatic)
- Backend code (use Jest)

### ❌ DON'T Use Storybook For:
- Functional testing (use Vitest/Playwright)
- Backend testing (N/A)
- E2E flows (use Playwright)

### ❌ DON'T Use Cypress:
- Project uses Playwright instead
- Better MCP integration with Playwright
- Better multi-browser support with Playwright

---

## Testing Pyramid

```
           /\
          /  \    5% - Playwright E2E
         /    \        (slow, expensive, comprehensive)
        /------\
       /        \  15% - Integration (Supertest, Vitest integration)
      /          \      (moderate speed, moderate cost)
     /------------\
    /              \ 80% - Unit Tests (Vitest, Jest)
   /________________\    (fast, cheap, isolated)
```

---

## Summary Rules

1. **Always start with unit tests** (Vitest for frontend, Jest for backend)
2. **Add E2E only for critical flows** (Playwright)
3. **Use Storybook for shared components** (design system)
4. **Always test accessibility** (jest-axe in unit tests)
5. **Validate test quality with mutation** (Stryker for backend)

---

**Last Updated**: 2025-01-09
