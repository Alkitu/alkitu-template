# E2E Test Issues - Complete Analysis & Fix Plan

**Date**: 2025-12-02
**Current Status**: 35/61 tests passing (57.4%)
**Target**: 90%+ pass rate (55+/61 tests)

---

## Issue #1: ALI-118 Backend Permission Error (CRITICAL)

**Impact**: 10/13 tests failing (77% failure rate)

### Root Cause
`POST /categories` returns `403 Forbidden resource` even with valid ADMIN JWT token.

### Evidence
```bash
# Manual test with ADMIN token
curl -X POST http://localhost:3001/categories \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Category"}'

# Response: 403 Forbidden resource
```

### Diagnosis
- ✅ JWT token contains `"role":"ADMIN"` (verified in `.auth/admin.json`)
- ✅ GET `/categories` works (returns `[]`)
- ❌ POST `/categories` blocked by RolesGuard
- ❌ No RolesGuard console.log output in backend logs

### Likely Cause
The RolesGuard (`/packages/api/src/auth/guards/roles.guard.ts`) checks `user.role`, but the JWT strategy may not be populating this field correctly in the request object.

### Fix Required
Check JWT strategy implementation to ensure `role` from JWT payload is attached to `req.user.role`.

**File to Check**: `/packages/api/src/auth/strategies/jwt.strategy.ts`

---

## Issue #2: EMPLOYEE/ADMIN Profile Forms Missing Fields

**Impact**: 4/14 tests failing (29% of ALI-116)

### Failing Tests
- ALI-116 EMPLOYEE: Tests #15, #16 (2 failures)
- ALI-116 ADMIN: Tests #19, #20 (2 failures)

### Error
```
Field "first name" not found
Timeout - page/context closed
```

### Root Cause
Profile form components not rendering fields for EMPLOYEE/ADMIN roles. CLIENT role works perfectly (5/5 passing).

### Fix Required
Investigate and fix:
- `/packages/web/src/components/organisms/profile/ProfileFormEmployeeOrganism.tsx`
- `/packages/web/src/components/organisms/profile/ProfileFormAdminOrganism.tsx`

Likely missing proper field rendering in these components.

---

## Issue #3: Playwright Strict Mode Violations

**Impact**: 5 tests failing

### Affected Tests
1. **ALI-117** (Locations):
   - Test #2: "Create location with all fields" - 2 elements match selector
   - Test #3: "Create location with required fields only" - 2 elements match selector

2. **ALI-119** (Request Management):
   - CLIENT test #1: "Should see requests list page" - 2 headings match
   - EMPLOYEE test #1: "Should see requests list without New Request button" - 2 headings match
   - ADMIN test #1: "Should see all requests from all users" - Heading not found

### Root Cause
Multiple elements matching the same selector when Playwright expects exactly one.

### Fix Required
Update test selectors to use `.first()` or more specific queries:

```typescript
// BEFORE
await page.getByText('123 Test Street').click();

// AFTER
await page.getByText('123 Test Street').first().click();

// OR use more specific selector
await page.getByRole('button', { name: /123 Test Street/i }).click();
```

**Files to Fix**:
- `/packages/web/tests/e2e/ali-117-work-locations-management.spec.ts` (lines ~95-105)
- `/packages/web/tests/e2e/ali-119-service-request-management.spec.ts` (lines ~75, ~140, ~180)

---

## Implementation Priority

### High Priority (Blocks Multiple Tests)
1. **ALI-118 Backend Permission Fix** - 10 tests blocked
2. **EMPLOYEE/ADMIN Profile Forms** - 4 tests blocked

### Medium Priority (Easy Fixes)
3. **Playwright Strict Mode Violations** - 5 tests, straightforward selector fixes

---

## Expected Outcomes

### After Fix #1 (Backend Permission)
- ALI-118: 10+/13 tests passing (75%+)
- **Estimated improvement**: +7-10 tests

### After Fix #2 (Profile Forms)
- ALI-116 EMPLOYEE/ADMIN: 4/4 tests passing (100%)
- **Estimated improvement**: +4 tests

### After Fix #3 (Strict Mode)
- ALI-117: 8+/10 tests passing (80%+)
- ALI-119: 10/10 tests passing (100%)
- **Estimated improvement**: +5 tests

### Total Expected Result
- **Current**: 35/61 tests (57.4%)
- **After all fixes**: 54-57/61 tests (89-93%)
- **Goal**: ✅ 90%+ pass rate achieved

---

## Other Known Issues (Lower Priority)

### Onboarding Navigation (2 tests)
- ALI-115 tests #6, #10: TimeoutError waiting for `/onboarding` URL
- **Impact**: Minor - doesn't block other functionality
- **Fix**: Review `profileComplete` status handling in redirect logic

### Test Timeout Issues (8 tests)
- Various tests hitting 30-second timeout
- **Cause**: Page/context closing unexpectedly
- **Fix**: Investigate navigation logic and JavaScript errors in browser console

---

## Next Steps

1. Fix ALI-118 backend permission issue (JWT strategy)
2. Fix EMPLOYEE/ADMIN profile form rendering
3. Fix Playwright strict mode violations
4. Run complete E2E test suite
5. Verify 90%+ pass rate achieved
6. Create JIRA update with results

**Status**: Ready to implement fixes
