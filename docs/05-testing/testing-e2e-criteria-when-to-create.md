# E2E Testing Criteria: When to Create

Specific criteria for deciding when to create Playwright E2E tests.

---

## ✅ Create E2E Tests For

### 1. Authentication Flows
- **Login** (email/password, magic link, OAuth)
- **Registration** (sign up, email verification)
- **Password reset** (forgot password, reset flow)
- **Logout** (session termination)
- **Session persistence** (remember me, auto-login)

**Example**:
```typescript
// tests/e2e/auth/login.spec.ts
test('user can log in with email and password', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

### 2. Payment/Checkout Flows
- **Add to cart** → **View cart** → **Checkout** → **Payment** → **Confirmation**
- **Stripe/PayPal integration**
- **Subscription management** (upgrade, downgrade, cancel)
- **Invoice generation**

**Why**: Critical business flow, involves money, must work perfectly.

---

### 3. Multi-Step Wizards
- **Onboarding flows** (step 1 → step 2 → step 3 → complete)
- **Setup wizards** (account setup, preferences)
- **Application forms** (multi-page forms with validation)
- **Survey/quiz flows**

**Why**: Complex state management across pages, easy to break.

---

### 4. Critical Business Processes
- **Order placement** (e-commerce)
- **Booking/reservation** (appointments, tickets)
- **Document generation** (contracts, reports)
- **Data import/export** (CSV, Excel)

**Why**: Core business functionality, revenue-generating.

---

### 5. Cross-Page Navigation
- **User journeys** spanning multiple pages
- **Conditional routing** (based on user state)
- **Redirects** (after login, after payment)
- **Deep linking** (shared URLs)

**Why**: Unit tests can't verify multi-page flows.

---

## ❌ DON'T Create E2E Tests For

### 1. Simple Display Components
- Buttons, inputs, labels, icons
- Cards, modals, tooltips
- Layout components

**Why**: Unit tests (Vitest) are faster and sufficient.

---

### 2. Already Covered by Unit Tests
- Component rendering
- Props validation
- Event handlers
- State management (single component)

**Why**: Duplication is wasteful, unit tests are faster.

---

### 3. Single-Component Interactions
- Form validation (single field)
- Toggle switches
- Dropdown menus
- Date pickers

**Why**: Vitest handles these better with faster feedback.

---

### 4. API Testing
- Endpoint validation
- Request/response format
- Error handling

**Why**: Use backend integration tests (Supertest) instead.

---

### 5. Visual Appearance
- Color schemes
- Typography
- Spacing
- Responsive layout

**Why**: Use Storybook + Chromatic for visual regression.

---

## Decision Matrix

| Scenario | Unit Test | E2E Test | Visual Test |
|----------|-----------|----------|-------------|
| **Button renders correctly** | ✅ Vitest | ❌ | ✅ Storybook |
| **Form validation works** | ✅ Vitest | ❌ | ❌ |
| **User logs in** | ⚠️ Organism test | ✅ Playwright | ❌ |
| **User completes checkout** | ⚠️ Organism test | ✅ Playwright | ❌ |
| **Multi-step wizard** | ⚠️ Step components | ✅ Playwright | ❌ |
| **Component looks correct** | ❌ | ❌ | ✅ Chromatic |
| **API returns data** | ❌ Frontend | ✅ Backend E2E | ❌ |
| **Responsive design** | ❌ | ⚠️ If critical | ✅ Chromatic |

---

## Complexity Threshold

Create E2E test if the flow:
- ✅ Spans **2+ pages**
- ✅ Involves **external services** (payment, auth)
- ✅ Is **revenue-critical**
- ✅ Has **complex state** across pages
- ✅ Requires **multi-browser** testing

Don't create E2E test if the flow:
- ❌ Is **single page**
- ❌ Is **already covered** by unit tests
- ❌ Is **simple CRUD**
- ❌ Has **no external dependencies**

---

## Example Evaluation

### ❌ BAD: E2E Test for Button Click
```typescript
// DON'T DO THIS - use Vitest instead
test('button changes color on hover', async ({ page }) => {
  await page.goto('/components/button');
  await page.hover('button');
  await expect(page.locator('button')).toHaveCSS('background-color', 'blue');
});
```

**Why**: This is a unit test concern, not an E2E flow.

---

### ✅ GOOD: E2E Test for Login Flow
```typescript
// DO THIS - complex flow across pages
test('user can log in and access protected content', async ({ page }) => {
  // Try to access protected page
  await page.goto('/dashboard/settings');

  // Should redirect to login
  await expect(page).toHaveURL(/\/login/);

  // Log in
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Should redirect back to intended page
  await expect(page).toHaveURL('/dashboard/settings');

  // Verify logged in state
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});
```

**Why**: Tests complete user journey across multiple pages with redirects.

---

## E2E Test Budget

Aim for **5-15 E2E tests** per project covering critical flows:

### Minimum E2E Tests (5)
1. Login flow
2. Registration flow
3. Main feature flow (checkout/booking/submission)
4. Password reset flow
5. Logout flow

### Extended E2E Tests (15)
1-5. (Minimum tests above)
6. Multi-step onboarding
7. User settings update
8. Payment flow (Stripe)
9. Subscription management
10. Data export
11. Search and filter
12. Notification preferences
13. Mobile responsiveness (critical flow)
14. Error recovery (network failure)
15. Session timeout handling

---

## When in Doubt

Ask yourself:
1. **Would a bug in this flow cost the company money?** → E2E test
2. **Does this flow span multiple pages?** → E2E test
3. **Is this already testable with unit tests?** → Skip E2E
4. **Can I test this faster with Vitest?** → Skip E2E
5. **Is this visual appearance only?** → Use Chromatic

---

## Cost-Benefit Analysis

### E2E Tests
- **Cost**: Slow (minutes), flaky, maintenance overhead
- **Benefit**: Catch integration bugs, test real user flows
- **ROI**: High for critical flows, low for simple components

### Unit Tests
- **Cost**: Fast (seconds), stable, easy to maintain
- **Benefit**: Catch logic bugs, fast feedback
- **ROI**: High for all components

**Rule**: Only create E2E if benefit > cost

---

**Last Updated**: 2025-01-09
