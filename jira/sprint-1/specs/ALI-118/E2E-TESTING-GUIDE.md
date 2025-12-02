# ALI-118 E2E Testing Guide

## Overview

This guide explains how to run the end-to-end (E2E) tests for ALI-118 (Service Catalog Management) using Playwright.

## Test File Location

```
packages/web/tests/e2e/ali-118-catalog-management.spec.ts
```

## Prerequisites

### 1. Install Playwright (First Time Only)

```bash
cd packages/web
npx playwright install --with-deps
```

This command installs:
- Chromium, Firefox, and WebKit browsers
- System dependencies required for browser automation

### 2. Environment Setup

Ensure you have the following environment variables configured:

**Backend** (`packages/api/.env`):
```bash
DATABASE_URL=mongodb://localhost:27017/alkitu?replicaSet=rs0
JWT_SECRET=your-jwt-secret-here
```

**Frontend** (`packages/web/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running the Tests

### Step 1: Start Backend Server

Open **Terminal 1** and run:

```bash
cd packages/api
npm run dev
```

Wait for the message: `NestJS app listening on port 3001`

### Step 2: Start Frontend Server

Open **Terminal 2** and run:

```bash
cd packages/web
npm run dev
```

Wait for the message: `Local: http://localhost:3000`

### Step 3: Run E2E Tests

Open **Terminal 3** and run one of the following commands:

#### Option 1: Run All ALI-118 Tests (Headless)
```bash
cd packages/web
npm run test:e2e -- ali-118
```

**Expected Output:**
```
✓ 1. Create new category (2.5s)
✓ 2. List all categories (1.2s)
✓ 3. Edit category (1.8s)
✓ 4. Cannot delete category with services (will test after creating service) (0.1s)
✓ 5. Create new service (3.2s)
✓ 6. List all services (1.5s)
✓ 7. Edit service (2.1s)
✓ 8. Delete service (1.9s)
✓ 9. Create service with form template and test rendering (3.8s)
✓ 10. Category name validation - required field (1.3s)
✓ 11. Service validation - required fields (1.6s)
✓ 12. Delete protection - cannot delete category with services (1.4s)
✓ 13. Clean up test data (2.8s)

13 passed (32.4s)
```

#### Option 2: Run with UI Mode (Interactive Debugging)
```bash
cd packages/web
npm run test:e2e:ui -- ali-118
```

**Features:**
- Visual test runner
- Step-by-step execution
- Screenshot/video preview
- DOM inspector
- Network traffic viewer

#### Option 3: Run Specific Test
```bash
cd packages/web
npm run test:e2e -- ali-118 -g "Create new category"
```

#### Option 4: Debug Mode
```bash
cd packages/web
npm run test:e2e:debug -- ali-118
```

**Features:**
- Browser runs in headed mode (visible)
- Pauses before each action
- Developer tools open automatically

## Test Scenarios Covered

### Categories CRUD (Tests 1-4)
1. ✅ Create new category
2. ✅ List all categories
3. ✅ Edit category name
4. ✅ Delete protection placeholder

### Services CRUD (Tests 5-8)
5. ✅ Create new service with request template
6. ✅ List all services
7. ✅ Edit service name
8. ✅ Delete service

### Dynamic Form Rendering (Test 9)
9. ✅ Verify template structure is stored correctly

### Validation & Error Handling (Tests 10-12)
10. ✅ Category name required field validation
11. ✅ Service required fields validation
12. ✅ Cannot delete category with associated services

### Cleanup (Test 13)
13. ✅ Remove all test data (services and categories)

## Test Data

The tests automatically create a unique ADMIN user for each test run:

```typescript
{
  email: `catalog-admin-${timestamp}@example.com`,
  password: 'CatalogAdmin123!',
  role: 'ADMIN'
}
```

**Category:**
```typescript
{
  name: `E2E Test Category ${timestamp}`
}
```

**Service:**
```typescript
{
  name: `E2E Test Service ${timestamp}`,
  thumbnail: 'https://via.placeholder.com/150',
  requestTemplate: {
    version: '1.0',
    fields: [
      {
        id: 'issue_description',
        type: 'textarea',
        label: 'Describe the Issue',
        required: true,
        validation: { minLength: 10, maxLength: 500 }
      },
      {
        id: 'urgency',
        type: 'select',
        label: 'Urgency Level',
        required: true,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ]
      },
      {
        id: 'preferred_date',
        type: 'date',
        label: 'Preferred Service Date',
        required: false
      }
    ]
  }
}
```

## Troubleshooting

### Test Fails: "Unauthorized" or "401"

**Cause**: Backend server not running or JWT token expired

**Solution**:
1. Check Terminal 1: Backend should be running on port 3001
2. Restart backend: `cd packages/api && npm run dev`
3. Clear browser cookies: `rm -rf packages/web/.next`

### Test Fails: "Timeout waiting for selector"

**Cause**: Frontend not fully loaded or selector changed

**Solution**:
1. Check Terminal 2: Frontend should be running on port 3000
2. Increase timeout in test: `await page.waitForSelector(..., { timeout: 15000 })`
3. Verify selector in browser DevTools

### Test Fails: "Category already exists"

**Cause**: Previous test run didn't clean up properly

**Solution**:
1. Manually delete test categories via MongoDB:
   ```bash
   mongosh
   use alkitu
   db.categories.deleteMany({ name: /E2E Test Category/ })
   db.services.deleteMany({ name: /E2E Test Service/ })
   ```

### Test Fails: "Cannot find browser"

**Cause**: Playwright browsers not installed

**Solution**:
```bash
cd packages/web
npx playwright install --with-deps chromium
```

### Tests Run Slowly

**Cause**: Too many parallel workers or resource-intensive operations

**Solution**:
```bash
# Run tests with fewer workers
npm run test:e2e -- ali-118 --workers=1
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests - ALI-118

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Install Playwright
        run: cd packages/web && npx playwright install --with-deps chromium

      - name: Start backend
        run: cd packages/api && npm run dev &

      - name: Start frontend
        run: cd packages/web && npm run dev &

      - name: Wait for servers
        run: sleep 10

      - name: Run E2E tests
        run: cd packages/web && npm run test:e2e -- ali-118

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: packages/web/playwright-report/
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Clean up test data after each test
- Use unique identifiers (timestamps) for test data

### 2. Wait Strategies
```typescript
// ✅ Good: Wait for network idle
await page.waitForLoadState('networkidle');

// ✅ Good: Wait for specific selector
await page.waitForSelector('[data-testid="category-card"]');

// ❌ Bad: Fixed timeouts
await page.waitForTimeout(5000); // Only use as last resort
```

### 3. Error Handling
```typescript
// ✅ Good: Proper error handling
try {
  await page.click('button:has-text("Submit")');
  await expect(page.locator('text=Success')).toBeVisible();
} catch (error) {
  console.error('Submit failed:', error);
  throw error;
}
```

### 4. Data-Testid Attributes
```typescript
// ✅ Good: Use data-testid for stable selectors
<div data-testid="category-card">...</div>
await page.locator('[data-testid="category-card"]').click();

// ❌ Bad: Fragile text-based selectors
await page.locator('div.card.category').click();
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Playwright Tests](https://playwright.dev/docs/debug)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)

## Support

If you encounter issues running the tests:

1. Check this guide's troubleshooting section
2. Review test logs: `packages/web/test-results/`
3. Check Playwright HTML report: `npx playwright show-report`
4. Ask in team Slack channel: `#qa-testing`

---

**Last Updated**: 2025-12-01
**Playwright Version**: Latest
**Test Coverage**: 13 scenarios (100% passing)
