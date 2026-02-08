# UserStatus Migration Guide

## Issue
The E2E tests are failing because the database contains users with `status: 'ACTIVE'`, but the Prisma schema's `UserStatus` enum has been updated to replace `ACTIVE` with `VERIFIED`.

## Error Message
```
Invalid `prisma.user.findUnique()` invocation
Value 'ACTIVE' not found in enum 'UserStatus'
```

## Current Valid UserStatus Values
- `PENDING` - User registered but email not verified OR profile incomplete
- `VERIFIED` - Email verified AND profile complete (replaces ACTIVE)
- `SUSPENDED` - Account blocked by admin
- `ANONYMIZED` - Data anonymized for GDPR compliance

## Migration Steps

### Option 1: Quick Reset (Recommended for Development)

This option drops the entire database and starts fresh:

```bash
# 1. Start Docker/MongoDB
npm run dev:docker
# Wait for MongoDB to be ready (check logs: docker logs -f alkitu-mongodb)

# 2. Reset database and apply schema
cd packages/api
npx prisma db push --force-reset

# 3. Seed test users
npm run seed:test-users

# 4. Verify seeding was successful
npm run db:studio
# Check that test users exist with status: VERIFIED
```

### Option 2: Migrate Existing Data

This option preserves existing data and updates ACTIVE to VERIFIED:

```bash
# 1. Start Docker/MongoDB
npm run dev:docker
# Wait for MongoDB to be ready

# 2. Run the fix script
cd packages/api
npx ts-node -r tsconfig-paths/register scripts/fix-user-status.ts

# 3. Verify the update
npm run db:studio
# Check that no users have status: ACTIVE

# 4. Seed test users (if needed)
npm run seed:test-users
```

### Option 3: Manual MongoDB Update

If scripts fail, update MongoDB directly:

```bash
# Connect to MongoDB
docker exec -it alkitu-mongodb mongosh

# Switch to alkitu database
use alkitu

# Check for ACTIVE users
db.User.find({ status: "ACTIVE" }).count()

# Update all ACTIVE to VERIFIED
db.User.updateMany(
  { status: "ACTIVE" },
  { $set: { status: "VERIFIED" } }
)

# Verify update
db.User.find({ status: "ACTIVE" }).count()  // Should return 0

# Exit
exit
```

## After Migration

Once the database is fixed, run the E2E tests:

```bash
cd packages/web
npm run test:e2e
```

## Preventing This Issue

To prevent similar issues in the future:

1. **Always create data migrations** when changing enums that affect existing data
2. **Use Prisma migrations** instead of `db push` in production
3. **Document enum changes** in migration files
4. **Update seed scripts** to use new enum values

## Test Users

After migration, these test users should exist:

| Email | Role | Status | Password |
|-------|------|--------|----------|
| client-e2e@alkitu.test | CLIENT | VERIFIED | ClientPass123 |
| employee-e2e@alkitu.test | EMPLOYEE | VERIFIED | EmployeePass123 |
| admin-e2e@alkitu.test | ADMIN | VERIFIED | Admin123! |

Note: All test users have `profileComplete: true` to skip onboarding during E2E tests.

## Verification Checklist

- [ ] Docker/MongoDB is running
- [ ] No users with status: ACTIVE in database
- [ ] Test users are seeded with status: VERIFIED
- [ ] E2E tests pass without enum errors
- [ ] Global authentication setup completes successfully

## Related Files

- **Fix Script**: `packages/api/scripts/fix-user-status.ts`
- **Seed Script**: `packages/api/scripts/seed-test-users.ts`
- **Prisma Schema**: `packages/api/prisma/schema.prisma` (line 79 - UserStatus enum)
- **Shared Types**: `packages/shared/src/types/user.ts` (line 14 - UserStatus enum)
- **E2E Tests**: `packages/web/tests/e2e/*.spec.ts`

## Troubleshooting

### MongoDB won't start
```bash
# Check if port 27017 is in use
lsof -i :27017

# Remove old containers
docker-compose down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Prisma client out of sync
```bash
cd packages/api
npx prisma generate
npm run dev  # Restart API server
```

### Tests still failing after migration
```bash
# Check test user credentials match TEST_USERS in fixtures
cat packages/web/tests/fixtures/test-users.ts

# Check global-setup.ts is using correct selectors
cat packages/web/tests/global-setup.ts

# Run tests in UI mode to debug
cd packages/web
npm run test:e2e:ui
```
