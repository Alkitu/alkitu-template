# Quick Guide: Running E2E Security Tests

## Prerequisites

1. **Seed test users** (run once):
   ```bash
   cd packages/api
   npm run seed:test-users
   ```

2. **Start dev environment**:
   ```bash
   # Option 1: Standard
   npm run dev

   # Option 2: Docker
   npm run dev:docker
   ```

## Running Tests

### All Security Tests (82 tests)
```bash
cd packages/web
npx playwright test tests/e2e/security-*.spec.ts
```

### With UI Mode (Recommended)
```bash
cd packages/web
npx playwright test tests/e2e/security-*.spec.ts --ui
```

### Individual Test Suites
```bash
# Resource Access Control (15 tests)
npx playwright test tests/e2e/security-resource-access-control.spec.ts

# Feature Flags (28 tests)
npx playwright test tests/e2e/security-feature-flags.spec.ts

# Audit Logging (39 tests)
npx playwright test tests/e2e/security-audit-logging.spec.ts
```

### Generate HTML Report
```bash
npx playwright test tests/e2e/security-*.spec.ts --reporter=html
npx playwright show-report
```

## Test Users

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin-e2e@alkitu.test | Admin123! |
| EMPLOYEE | employee-e2e@alkitu.test | EmployeePass123 |
| CLIENT | client-e2e@alkitu.test | ClientPass123 |

## Expected Results

- **Total**: 82 tests
- **Duration**: ~5-10 minutes (depending on system)
- **Pass Rate**: Should be 100% with dev environment running

## Troubleshooting

### Tests failing to start?
```bash
# Check if servers are running
lsof -i :3000 -i :3001

# If not, start them
npm run dev
```

### Authentication errors?
```bash
# Re-seed test users
cd packages/api
npm run seed:test-users

# Clear auth cache
cd packages/web
rm -rf .auth
```

## CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
- name: Seed test users
  run: cd packages/api && npm run seed:test-users

- name: Run E2E security tests
  run: cd packages/web && npx playwright test tests/e2e/security-*.spec.ts
```

## Documentation

See `E2E_SECURITY_TESTS_IMPLEMENTATION_COMPLETE.md` for full documentation.
