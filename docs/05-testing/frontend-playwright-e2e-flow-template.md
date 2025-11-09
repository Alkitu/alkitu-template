# Frontend Playwright E2E Flow Template

**Purpose**: Template for E2E tests of complete user flows using Playwright
**Use ONLY For**: Critical user journeys (auth, checkout, multi-step forms)
**Location**: `/tests/e2e/feature-name.spec.ts`

---

## When to Create E2E Tests

### ✅ DO create E2E tests for:
- **Authentication flows**: Login, register, password reset, email verification
- **Payment/Checkout flows**: Cart → checkout → payment → confirmation
- **Multi-step wizards**: Onboarding, setup wizards, complex forms
- **Critical business processes**: Order placement, booking, subscription
- **Cross-page navigation**: User journeys spanning multiple pages

### ❌ DON'T create E2E tests for:
- **Simple display components**: Use unit tests instead
- **Already covered by unit tests**: No duplication needed
- **Single-component interactions**: Use Vitest instead
- **API testing**: Use backend integration tests

---

## Complete E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name Flow', () => {
  // Setup - runs before each test
  test.beforeEach(async ({ page }) => {
    // Navigate to starting page
    await page.goto('/feature');

    // Optional: Setup test data, authentication, etc.
    // await page.context().addCookies([{ name: 'token', value: 'test-token', domain: 'localhost', path: '/' }]);
  });

  // Cleanup - runs after each test
  test.afterEach(async ({ page }) => {
    // Optional: Clean up test data
  });

  // Test 1: Happy path - successful flow
  test('user can complete the entire flow successfully', async ({ page }) => {
    // Step 1: Fill first page/section
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByRole('button', { name: /submit/i }).click();

    // Step 2: Verify navigation to next page
    await expect(page).toHaveURL('/dashboard');

    // Step 3: Verify success state
    await expect(page.getByText(/welcome/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  // Test 2: Validation - form validation works
  test('shows validation errors for invalid input', async ({ page }) => {
    // Submit with empty fields
    await page.getByRole('button', { name: /submit/i }).click();

    // Verify error messages
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();

    // Verify URL hasn't changed
    await expect(page).toHaveURL('/feature');
  });

  // Test 3: Error handling - API errors
  test('handles API errors gracefully', async ({ page }) => {
    // Intercept API request to simulate error
    await page.route('/api/feature', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    // Fill form and submit
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: /submit/i }).click();

    // Verify error message is displayed
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();

    // Verify still on same page
    await expect(page).toHaveURL('/feature');
  });

  // Test 4: Loading states
  test('shows loading indicator during submission', async ({ page }) => {
    // Delay API response
    await page.route('/api/feature', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    // Submit form
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /submit/i }).click();

    // Verify loading indicator appears
    await expect(page.getByRole('status')).toBeVisible();

    // Verify button is disabled during loading
    await expect(page.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  // Test 5: Navigation - back button, cancel, etc.
  test('allows user to cancel and return to previous page', async ({ page }) => {
    // Click cancel/back button
    await page.getByRole('button', { name: /cancel/i }).click();

    // Verify navigation to expected page
    await expect(page).toHaveURL('/previous-page');
  });

  // Test 6: Multi-step flow (if applicable)
  test('completes multi-step wizard successfully', async ({ page }) => {
    // Step 1
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByRole('button', { name: /next/i }).click();

    // Verify step 2
    await expect(page.getByText(/step 2/i)).toBeVisible();

    // Step 2
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByRole('button', { name: /next/i }).click();

    // Verify step 3
    await expect(page.getByText(/step 3/i)).toBeVisible();

    // Step 3 - final submission
    await page.getByRole('button', { name: /complete/i }).click();

    // Verify success
    await expect(page).toHaveURL('/success');
    await expect(page.getByText(/completed successfully/i)).toBeVisible();
  });

  // Test 7: Accessibility - keyboard navigation
  test('supports keyboard navigation', async ({ page }) => {
    // Tab to first field
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Email Address')).toBeFocused();

    // Tab to next field
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Password')).toBeFocused();

    // Tab to submit button
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /submit/i })).toBeFocused();

    // Submit with Enter
    await page.keyboard.press('Enter');
  });

  // Test 8: Mobile viewport
  test('works correctly on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Perform flow
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /submit/i }).click();

    // Verify success
    await expect(page).toHaveURL('/dashboard');
  });
});
```

---

## Authentication Flow Example (Complete)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('user can log in successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');

    // Fill credentials
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('SecurePass123!');

    // Submit form
    await page.getByRole('button', { name: /log in/i }).click();

    // Wait for navigation
    await page.waitForURL('/dashboard');

    // Verify logged in state
    await expect(page.getByRole('button', { name: /log out/i })).toBeVisible();
    await expect(page.getByText(/welcome back/i)).toBeVisible();

    // Verify token in localStorage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeTruthy();
  });

  test('redirects to intended page after login', async ({ page }) => {
    // Try to access protected page
    await page.goto('/dashboard/settings');

    // Should redirect to login with returnUrl
    await expect(page).toHaveURL(/\/auth\/login\?returnUrl=/);

    // Login
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();

    // Should redirect back to intended page
    await expect(page).toHaveURL('/dashboard/settings');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL('/auth/login');
  });
});
```

---

## Common E2E Patterns

### 1. API Mocking
```typescript
test('handles slow API responses', async ({ page }) => {
  await page.route('/api/data', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ data: 'success' }),
    });
  });
});
```

### 2. File Upload
```typescript
test('uploads file successfully', async ({ page }) => {
  await page.goto('/upload');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('path/to/test-file.pdf');

  await page.getByRole('button', { name: /upload/i }).click();
  await expect(page.getByText(/uploaded successfully/i)).toBeVisible();
});
```

### 3. Cookies/LocalStorage
```typescript
test('persists session across page reloads', async ({ page }) => {
  // Set auth cookie
  await page.context().addCookies([
    { name: 'session', value: 'test-session-id', domain: 'localhost', path: '/' }
  ]);

  await page.goto('/dashboard');
  await expect(page.getByText(/dashboard/i)).toBeVisible();
});
```

### 4. Wait for Network Idle
```typescript
test('waits for all API calls to complete', async ({ page }) => {
  await page.goto('/dashboard', { waitUntil: 'networkidle' });
  await expect(page.getByText(/data loaded/i)).toBeVisible();
});
```

---

## Run Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run specific test file
npm run test:e2e -- tests/e2e/login.spec.ts

# Run tests in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# Generate test code with codegen
npm run test:e2e:codegen http://localhost:3000
```

---

## MCP Integration (Playwright MCP Server)

The project has Playwright MCP server configured for AI-assisted testing:

### Using MCP Tools:
```typescript
// AI can use these MCP tools:
mcp__playwright__browser_navigate       // Navigate to URL
mcp__playwright__browser_snapshot       // Capture page state
mcp__playwright__browser_click          // Click elements
mcp__playwright__browser_type           // Type text
mcp__playwright__browser_evaluate       // Run JavaScript
```

### Example MCP Usage:
1. Navigate: `mcp__playwright__browser_navigate({ url: 'http://localhost:3000/login' })`
2. Snapshot: `mcp__playwright__browser_snapshot()` - See page structure
3. Click: `mcp__playwright__browser_click({ element: 'Submit button', ref: 'button[type="submit"]' })`
4. Verify: Check page state with snapshot

---

**Last Updated**: 2025-01-09
