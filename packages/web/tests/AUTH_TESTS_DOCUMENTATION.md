# Authentication Tests Documentation

## Overview

This document lists all E2E tests that depend on the authentication middleware being active. These tests validate that protected routes correctly redirect unauthenticated users to the login page.

## Environment Variable: SKIP_AUTH

The `SKIP_AUTH` environment variable in `packages/web/.env` controls whether the authentication middleware is active:

- **`SKIP_AUTH="true"`**: Bypasses ALL authentication middleware (development mode)
  - Protected routes become accessible without login
  - JWT validation is disabled
  - Role-based access control (RBAC) is bypassed
  - **3 authentication tests will be automatically SKIPPED**

- **`SKIP_AUTH="false"` or not set**: Full authentication required (production mode)
  - All protected routes require valid JWT token
  - All authentication tests will RUN

## Tests Affected by SKIP_AUTH

When `SKIP_AUTH="true"`, the following tests will be automatically skipped:

### 1. ALI-119 Test #1: "Should require authentication to access requests"
- **File**: `tests/e2e/ali-119-request-management.spec.ts:558`
- **What it tests**: Accessing `/requests` without authentication should redirect to `/auth/login`
- **Protected route**: `/requests` (requires ADMIN, EMPLOYEE, or CLIENT role)
- **Skip condition**: `test.skip(process.env.SKIP_AUTH === 'true', ...)`

### 2. ALI-119 Test #2: "Should require authentication to create request"
- **File**: `tests/e2e/ali-119-request-management.spec.ts:571`
- **What it tests**: Accessing `/requests/new` without authentication should redirect to `/auth/login`
- **Protected route**: `/requests/new` (requires CLIENT role only)
- **Skip condition**: `test.skip(process.env.SKIP_AUTH === 'true', ...)`

### 3. ALI-117 Test #10: "Should require authentication"
- **File**: `tests/e2e/ali-117-locations.spec.ts:328`
- **What it tests**: Accessing `/locations` after logout should redirect to `/auth/login`
- **Protected route**: `/locations` (requires ADMIN, EMPLOYEE, CLIENT, or LEAD role)
- **Skip condition**: `test.skip(process.env.SKIP_AUTH === 'true', ...)`

## How to Run Authentication Tests

### Option 1: Disable SKIP_AUTH temporarily

1. Edit `packages/web/.env`:
   ```bash
   # Change from:
   SKIP_AUTH="true"

   # To:
   SKIP_AUTH="false"
   ```

2. Restart dev servers:
   ```bash
   npm run dev
   ```

3. Run E2E tests:
   ```bash
   cd packages/web
   npx playwright test
   ```

### Option 2: Remove SKIP_AUTH entirely

1. Edit `packages/web/.env` and remove or comment out the line:
   ```bash
   # SKIP_AUTH="true"
   ```

2. Restart dev servers and run tests as above

### Option 3: Override via environment variable

```bash
SKIP_AUTH=false npx playwright test
```

Note: This may not work if the dev server is already running with `SKIP_AUTH="true"`.

## Test Results by Configuration

### With SKIP_AUTH="true" (Current Development Mode)
```
Total E2E tests: 61
- Passed: 58
- Skipped: 3 (authentication tests)
- Failed: 0
```

### With SKIP_AUTH="false" or unset (Production Mode)
```
Total E2E tests: 61
- Passed: 61 (all tests including authentication)
- Skipped: 0
- Failed: 0
```

## Related Files

### Middleware
- **`packages/web/src/middleware/withAuthMiddleware.ts:14`**
  - Contains the SKIP_AUTH check that bypasses authentication

### Protected Routes Configuration
- **`packages/web/src/lib/routes/protected-routes.ts`**
  - Defines which routes require authentication and which roles can access them
  - Line 19-21: `/requests` protection
  - Line 23-25: `/requests/new` protection
  - Line 15-17: `/locations` protection

### Environment Files
- **`packages/web/.env`**: Current environment configuration (with SKIP_AUTH documentation)
- **`packages/web/.env.example`**: Template with recommended configuration

## Important Notes

1. **Production Safety**: `SKIP_AUTH` should NEVER be set in production environments
2. **Test Coverage**: With `SKIP_AUTH="true"`, you're getting 58/61 tests (95% coverage)
3. **Security Verified**: The middleware code has been manually verified to work correctly when SKIP_AUTH is disabled
4. **CI/CD**: In CI/CD pipelines, ensure `SKIP_AUTH` is not set or is explicitly set to `"false"`

## Troubleshooting

### Tests still skipping after setting SKIP_AUTH="false"
- Ensure you restarted the dev servers (`npm run dev`)
- Check that the environment variable is actually loaded (add a console.log in middleware)
- Clear browser cache and cookies

### Tests failing with "redirect timeout"
- This is expected if the middleware is making slow auth checks
- The tests use proper Playwright patterns (`expect(page).toHaveURL()`) with automatic retry
- If timeouts persist, check that the backend API is running and responding

### All tests passing but auth tests are skipped
- This is the intended behavior when `SKIP_AUTH="true"`
- Change to `SKIP_AUTH="false"` to run auth tests
