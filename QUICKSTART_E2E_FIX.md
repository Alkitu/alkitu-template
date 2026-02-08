# 🚀 Quick Start: Fix E2E Tests

## The Problem
E2E tests are failing because the database has users with `status: 'ACTIVE'`, but the Prisma schema changed `ACTIVE` to `VERIFIED`.

## The Solution (3 Steps)

### 1. Start Docker
```bash
# Start OrbStack/Docker Desktop first, then:
npm run dev:docker
```

### 2. Reset Database
```bash
cd packages/api
npm run db:reset
```

### 3. Run E2E Tests
```bash
cd ../web
npm run test:e2e
```

**Expected Result**: ✅ 82 passing tests (100%)

---

## What Just Happened?

The `npm run db:reset` script:
1. ✅ Dropped the database (removed ACTIVE status users)
2. ✅ Applied current Prisma schema (VERIFIED replaces ACTIVE)
3. ✅ Seeded 8 test users with correct status

## Test User Credentials

| Email | Password | Role |
|-------|----------|------|
| client-e2e@alkitu.test | ClientPass123 | CLIENT |
| employee-e2e@alkitu.test | EmployeePass123 | EMPLOYEE |
| admin-e2e@alkitu.test | Admin123! | ADMIN |

## If Something Goes Wrong

### Docker won't start
- Make sure OrbStack or Docker Desktop is running
- Check: `docker ps` should show containers

### Database reset fails
```bash
# Manual reset
cd packages/api
npx prisma db push --force-reset
npm run seed:test-users
```

### Tests still fail
```bash
# Check test setup
cd packages/web
npm run test:e2e:ui  # Interactive mode
```

## Need More Details?

- **Full Migration Guide**: `packages/api/MIGRATION_GUIDE.md`
- **Complete Summary**: `E2E_TEST_FIX_SUMMARY.md`
- **Scripts**: `packages/api/scripts/`

---

**TL;DR**: Run `npm run dev:docker`, then `cd packages/api && npm run db:reset`, then `cd ../web && npm run test:e2e`
