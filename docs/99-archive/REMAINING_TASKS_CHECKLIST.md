# Remaining Tasks Checklist - Error Handling & API Security

**Last Updated**: 2026-02-08
**Status**: 75% Complete (9/12 tasks done)

---

## 📋 QUICK REFERENCE

### ✅ COMPLETED (9 tasks)
- [x] Fix protectedProcedure middleware
- [x] Secure billing router
- [x] Secure request router
- [x] Secure location router
- [x] Secure user router (critical endpoints)
- [x] Create Prisma error mapper utility
- [x] Create shared pagination schemas
- [x] Create frontend error handler utility
- [x] Create CompactErrorBoundary component

### ⏳ REMAINING (3 tasks)
- [ ] Apply error handling across routers
- [ ] Implement pagination in endpoints
- [ ] Extract inline schemas to dedicated files
- [ ] Write security and error handling tests (optional but recommended)

---

## Task 6: Apply Error Handling Across Routers

**Estimated Time**: 1-2 hours
**Priority**: HIGH
**Files to Modify**: 3

### Checklist:

#### `/packages/api/src/trpc/routers/user.router.ts`
- [ ] Import `handlePrismaError` from `'../utils/prisma-error-mapper'`
- [ ] Replace catch block in `register` (line ~150)
- [ ] Replace catch block in `updateProfile` (line ~188)
- [ ] Replace catch block in `getAllUsers` (line ~205)
- [ ] Replace catch block in `getUserByEmail` (line ~219)
- [ ] Replace catch block in `getFilteredUsers` (line ~240)
- [ ] Replace catch block in `resetUserPassword` (line ~285)
- [ ] Replace any other generic error handlers

**Pattern**:
```typescript
// Find all instances of:
catch (error) {
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: '...',
    cause: error,
  });
}

// Replace with:
catch (error) {
  handlePrismaError(error, 'descriptive operation name');
}
```

#### `/packages/api/src/trpc/routers/notification.router.ts`
- [ ] Import `handlePrismaError`
- [ ] Identify all catch blocks (reportedly 15+)
- [ ] Replace generic error handling with `handlePrismaError`

#### `/packages/api/src/trpc/routers/request.router.ts`
- [ ] Already has some error handling, verify coverage
- [ ] Add `handlePrismaError` to mutations where missing
- [ ] Ensure `NOT_FOUND` errors use `handlePrismaError` instead of generic `Error`

---

## Task 8: Implement Pagination in Endpoints

**Estimated Time**: 2-3 hours
**Priority**: MEDIUM
**Files to Modify**: 3

### Checklist:

#### Step 1: Update `/packages/api/src/trpc/routers/user.router.ts`

**Endpoint**: `getAllUsers`

- [ ] Import pagination utilities:
  ```typescript
  import {
    paginatedSortingSchema,
    createPaginatedResponse,
    calculatePagination,
  } from '../schemas/common.schemas';
  ```

- [ ] Update endpoint signature:
  ```typescript
  getAllUsers: adminProcedure
    .input(paginatedSortingSchema)
    .query(async ({ input }) => {
  ```

- [ ] Implement pagination logic:
  ```typescript
  const { skip, take } = calculatePagination(input.page, input.limit);
  const [users, total] = await Promise.all([
    usersService.findAll({
      skip,
      take,
      orderBy: { [input.sortBy]: input.sortOrder },
    }),
    usersService.count(),
  ]);
  return createPaginatedResponse(users, {
    page: input.page,
    limit: input.limit,
    total,
  });
  ```

- [ ] Verify `usersService.findAll()` supports `skip`, `take`, `orderBy` parameters
  - If not, update the service method

#### Step 2: Update `/packages/api/src/trpc/routers/service.router.ts`

**Endpoint**: `getAllServices`

- [ ] Import pagination utilities
- [ ] Add `.input(paginatedSortingSchema)`
- [ ] Implement pagination with `calculatePagination` and `createPaginatedResponse`
- [ ] Update Prisma query to use `skip`, `take`, `orderBy`

#### Step 3: Update `/packages/api/src/trpc/routers/location.router.ts`

**Endpoint**: `getAllLocations`

- [ ] Import pagination utilities
- [ ] Merge existing input schema with `paginatedSortingSchema`:
  ```typescript
  .input(
    z.object({ userId: z.string().optional() })
      .merge(paginatedSortingSchema)
  )
  ```
- [ ] Implement pagination
- [ ] Update Prisma query

#### Step 4: Frontend Updates (if needed)

- [ ] Check if frontend components call these endpoints
- [ ] Update frontend to handle paginated responses:
  ```typescript
  const { items, pagination } = data;
  // Use pagination.hasNext, pagination.totalPages, etc.
  ```

---

## Task 9: Extract Inline Schemas to Dedicated Files

**Estimated Time**: 1 hour
**Priority**: MEDIUM
**Files to Create**: 1
**Files to Modify**: 1

### Checklist:

#### Step 1: Create `/packages/api/src/trpc/schemas/user.schemas.ts`

- [ ] Create file
- [ ] Import Zod: `import { z } from 'zod';`
- [ ] Copy schemas from `user.router.ts` lines 17-90:
  - [ ] `registerSchema`
  - [ ] `updateProfileSchema`
  - [ ] `getUserByEmailSchema`
  - [ ] `getFilteredUsersSchema`
  - [ ] `bulkDeleteUsersSchema`
  - [ ] `bulkUpdateRoleSchema`
  - [ ] `bulkUpdateStatusSchema`
  - [ ] `resetUserPasswordSchema`
  - [ ] `adminChangePasswordSchema`
  - [ ] `sendMessageToUserSchema`
  - [ ] `anonymizeUserSchema`
  - [ ] `createImpersonationTokenSchema`

- [ ] Export all schemas

#### Step 2: Update `/packages/api/src/trpc/routers/user.router.ts`

- [ ] Remove schema definitions (lines 17-90)
- [ ] Add import:
  ```typescript
  import {
    registerSchema,
    updateProfileSchema,
    getUserByEmailSchema,
    getFilteredUsersSchema,
    bulkDeleteUsersSchema,
    bulkUpdateRoleSchema,
    bulkUpdateStatusSchema,
    resetUserPasswordSchema,
    adminChangePasswordSchema,
    sendMessageToUserSchema,
    anonymizeUserSchema,
    createImpersonationTokenSchema,
  } from '../schemas/user.schemas';
  ```

- [ ] Verify all schemas are imported
- [ ] Test that router compiles without errors

#### Step 3 (Optional): Extract Other Router Schemas

Consider extracting schemas from:
- [ ] `notification.router.ts` (if it has inline schemas)
- [ ] `service.router.ts` (if it has inline schemas)

---

## Task 12: Write Security and Error Handling Tests

**Estimated Time**: 3-4 hours
**Priority**: HIGH (for production)
**Files to Create**: 3

### Checklist:

#### Step 1: Create E2E Security Tests

**File**: `/packages/web/tests/e2e/security-authentication.spec.ts`

- [ ] Create file
- [ ] Import Playwright test utilities
- [ ] Write test: "should reject unauthenticated access to protected endpoints"
  - Test billing endpoint without auth → 401
  - Test requests endpoint without auth → 401
  - Test user profile endpoint without auth → 401

- [ ] Write test: "CLIENT cannot access billing of another user"
  - Login as CLIENT
  - Try to access other user's billing → 403

- [ ] Write test: "CLIENT can access their own billing"
  - Login as CLIENT
  - Access own billing → 200

- [ ] Write test: "ADMIN can access all billing records"
  - Login as ADMIN
  - Access any user's billing → 200

- [ ] Write test: "CLIENT only sees their own requests"
  - Login as CLIENT
  - Fetch requests → verify only own requests returned

- [ ] Write test: "EMPLOYEE sees assigned + own requests"
  - Login as EMPLOYEE
  - Fetch requests → verify assigned + own requests

- [ ] Write test: "Only ADMIN can perform bulk operations"
  - Login as CLIENT → try bulk delete → 403
  - Login as EMPLOYEE → try bulk delete → 403
  - Login as ADMIN → try bulk delete → 200

#### Step 2: Create Error Handling Unit Tests

**File**: `/packages/api/src/trpc/routers/__tests__/error-handling.spec.ts`

- [ ] Create file
- [ ] Setup test environment (mock Prisma, create tRPC caller)
- [ ] Test: "should return 409 CONFLICT for duplicate users"
  ```typescript
  await expect(
    caller.user.register({ email: 'existing@example.com', ... })
  ).rejects.toMatchObject({
    code: 'CONFLICT',
    message: expect.stringContaining('already exists'),
  });
  ```

- [ ] Test: "should return 404 NOT_FOUND for missing resource"
  ```typescript
  await expect(
    caller.request.getRequestById({ id: 'non-existent-id' })
  ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  ```

- [ ] Test: "should return 400 BAD_REQUEST for invalid references"
  ```typescript
  await expect(
    caller.request.createRequest({
      userId: 'valid-id',
      serviceId: 'invalid-service-id',
      ...
    })
  ).rejects.toMatchObject({
    code: 'BAD_REQUEST',
    message: expect.stringContaining('Invalid reference'),
  });
  ```

- [ ] Test: "should preserve TRPCError codes"
  - Throw TRPCError in mutation
  - Verify it's not wrapped in another error

- [ ] Test: "should extract field names from CONFLICT errors"
  - Create duplicate user
  - Verify cause contains field name ('email')

#### Step 3: Create Pagination Tests

**File**: `/packages/api/src/trpc/routers/__tests__/pagination.spec.ts`

- [ ] Create file
- [ ] Setup test data (create 50+ users for testing)
- [ ] Test: "should paginate users correctly"
  ```typescript
  const result = await caller.user.getAllUsers({ page: 1, limit: 20 });
  expect(result.items).toHaveLength(20);
  expect(result.pagination).toMatchObject({
    page: 1,
    limit: 20,
    total: 50,
    totalPages: 3,
    hasNext: true,
    hasPrev: false,
  });
  ```

- [ ] Test: "should respect maximum limit of 100"
  ```typescript
  const result = await caller.user.getAllUsers({ page: 1, limit: 200 });
  expect(result.items.length).toBeLessThanOrEqual(100);
  ```

- [ ] Test: "should sort correctly"
  - Request sorted by email (asc)
  - Verify items are sorted alphabetically

- [ ] Test: "pagination metadata is accurate"
  - Verify `hasNext` is true when more pages exist
  - Verify `hasPrev` is false on first page
  - Verify `totalPages` calculation is correct

#### Step 4: Run Tests

- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Run unit tests: `npm test`
- [ ] Verify all tests pass
- [ ] Check code coverage: `npm run test:cov`

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying to production:

### Backend:
- [ ] All remaining tasks completed
- [ ] All tests passing
- [ ] Database indexes verified:
  - [ ] `Billing.userId`
  - [ ] `Request.userId`
  - [ ] `Request.assignedToId`
  - [ ] `WorkLocation.userId`
- [ ] Environment variables set
- [ ] Error logging configured (e.g., Sentry)

### Frontend:
- [ ] Error handler applied in all mutation/query hooks
- [ ] CompactErrorBoundary used in critical components
- [ ] Auth token handling verified
- [ ] 401/403 redirect flow tested

### Documentation:
- [ ] Update API documentation with new error codes
- [ ] Update pagination documentation with examples
- [ ] Add migration notes for frontend team
- [ ] Update changelog

### Monitoring:
- [ ] Set up alerts for 401/403 spikes
- [ ] Monitor Prisma error rates
- [ ] Track pagination performance
- [ ] Set up error tracking (Sentry/LogRocket)

---

## 📝 NOTES

### Common Pitfalls:
1. **Error Handling**: Don't forget to import `handlePrismaError` in each router
2. **Pagination**: Ensure service methods support `skip`, `take`, `orderBy` parameters
3. **Schemas**: When extracting schemas, verify all imports are updated
4. **Testing**: Use test database, not production data

### Tips:
- Test each router individually after applying changes
- Use TypeScript to catch missing imports/exports
- Run linter after major changes: `npm run lint`
- Check for compilation errors: `npm run type-check`

---

## 🎯 ESTIMATED COMPLETION TIME

- **Task 6** (Error Handling): 1-2 hours
- **Task 8** (Pagination): 2-3 hours
- **Task 9** (Schemas): 1 hour
- **Task 12** (Testing): 3-4 hours

**Total Remaining Work**: 7-10 hours

---

## ✅ FINAL VERIFICATION

After completing all tasks:

- [ ] All 12 tasks marked as complete
- [ ] No TypeScript compilation errors
- [ ] All tests passing (unit + E2E)
- [ ] Code coverage meets thresholds
- [ ] Documentation updated
- [ ] Peer review completed
- [ ] Staging deployment successful
- [ ] Production deployment plan created

---

**Last Updated**: 2026-02-08
**Document Version**: 1.0
**Maintained By**: Development Team
