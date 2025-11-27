# ALI-116 Verification Document

**Ticket**: ALI-116 - Profile Update for All Roles
**Status**: ⚠️ **IN TESTING - BLOCKED**
**Fecha**: Noviembre 24, 2024
**Blocker**: Servidor Next.js devolviendo 400 en todas las requests

---

## 📊 Estado Actual del Proyecto

### Código Implementado

**Status**: ✅ **COMPLETO**

**Backend** (packages/api/):
- ✅ UpdateProfileDto creado (`src/users/dto/update-profile.dto.ts`)
- ✅ PUT /users/me/profile endpoint implementado
- ✅ Role-based field filtering (CLIENT vs EMPLOYEE/ADMIN)
- ✅ 16 unit tests (91.12% coverage claim)
- ✅ Security: Cannot change email, password, role, status

**Frontend** (packages/web/):
- ✅ ProfileFormClientOrganism component creado
  - Location: `src/components/organisms/profile/ProfileFormClientOrganism.tsx`
  - Fields: firstname, lastname, phone, company, address, contactPerson

- ✅ ProfileFormEmployeeOrganism component creado
  - Location: `src/components/organisms/profile/ProfileFormEmployeeOrganism.tsx`
  - Fields: firstname, lastname, phone, company (NO address/contactPerson)

- ✅ Profile page implementado
  - Location: `src/app/[lang]/(private)/profile/page.tsx`
  - Route: `/es/profile`
  - Role-based rendering (CLIENT vs EMPLOYEE/ADMIN)
  - Fetches user data from `/api/users/profile`
  - Success redirect to `/admin/dashboard` after 2s

- ✅ API route implementado
  - Location: `src/app/api/users/profile/route.ts`
  - Handles GET and PUT requests

**Shared** (packages/shared/):
- ✅ UpdateProfileSchema con Zod
- ✅ TypeScript types sincronizados

### Testing Status

#### ❌ E2E Tests (Playwright)

**Status**: **0/14 tests passing (0%)**

**Test File**: `packages/web/tests/e2e/ali-116-profile-update.spec.ts` (462 lines)

**Test Coverage Intentada** (14 tests):

**CLIENT Role** (5 tests):
1. ✘ Should see profile page with full form
2. ✘ Should update basic fields successfully (skipped)
3. ✘ Should update address (skipped)
4. ✘ Should add contact person (skipped)
5. ✘ Should show note about CLIENT privileges (skipped)

**EMPLOYEE Role** (3 tests):
6. ✘ Should see simplified profile form
7. ✘ Should update basic fields successfully (skipped)
8. ✘ Should NOT see CLIENT privileges note (skipped)

**ADMIN Role** (2 tests):
9. ✘ Should see simplified profile form (timeout 35s)
10. ✘ Should update basic fields successfully (timeout 35s)

**Security** (4 tests):
11. ✘ Should show note about email being unchangeable (timeout 35s)
12. ✘ Should NOT have email input field (timeout 35s)
13. ✘ Should NOT have password field (timeout 35s)
14. ✘ Should redirect to dashboard after successful update (timeout 35s)

---

## 🐛 Problemas Identificados

### CRÍTICO: Servidor Next.js No Responde

**Síntomas**:
```bash
curl http://localhost:3000/es/auth/login
# Returns: HTTP 400 Bad Request
```

**Error en Tests**:
```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
- navigating to "http://localhost:3000/es/auth/register", waiting until "load"
- navigating to "http://localhost:3000/es/auth/login", waiting until "load"
```

**Impact**: BLOQUEADOR - todos los E2E tests fallan porque el servidor no responde correctamente.

**Tests Affected**:
- Tests 1 & 6: Fail at 0ms en `beforeAll` hook (registro de usuarios)
- Tests 9-14: Timeout a 35s en `beforeEach` hook (login)

**Diagnóstico**:

1. **Proceso Next.js corriendo**: ✅ (PID 81920, 81928)
```bash
ps aux | grep next
# luiseurdanetamartucci 81928   next-server (v16.0.1)
# luiseurdanetamartucci 81920   next dev
```

2. **Puerto 3000 respondiendo**: ✅ (pero con 400)
```bash
curl -I http://localhost:3000
# HTTP/1.1 400 Bad Request
```

3. **Posibles causas**:
   - Middleware bloqueando requests
   - Error en route configuration
   - Server state corrupto
   - Missing environment variables
   - Database connection issues

**Contraste con ALI-115**:
- ✅ ALI-115 E2E tests: 10/10 passing (100%)
- ❌ ALI-116 E2E tests: 0/14 passing (0%)
- Diferencia: El servidor funcionaba para ALI-115 pero no para ALI-116

---

## 📝 Análisis de los Tests

### Test Structure

**beforeAll Hooks** (CLIENT & EMPLOYEE tests):
```typescript
test.beforeAll(async ({ browser }) => {
  test.setTimeout(60000); // 60s timeout
  const page = await browser.newPage();

  // 1. Navigate to register
  await page.goto('http://localhost:3000/es/auth/register');
  await page.waitForLoadState('networkidle');

  // 2. Fill registration form
  await page.getByLabel(/nombre/i).first().fill(clientUser.firstname);
  await page.getByLabel(/apellido/i).fill(clientUser.lastname);
  await page.getByLabel(/correo/i).fill(clientUser.email);
  await page.locator('input[type="password"]').first().fill(clientUser.password);
  await page.locator('input[type="password"]').nth(1).fill(clientUser.password);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: /registrar/i }).click();

  // 3. Wait for redirect
  await page.waitForURL(/admin\/dashboard|auth\/verify/, { timeout: 10000 });
  await page.close();
});
```

**Problem**: `page.goto()` never completes because server returns 400.

**beforeEach Hooks** (All tests):
```typescript
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  // Login as specific role
  await page.goto('http://localhost:3000/es/auth/login');
  await page.waitForLoadState('networkidle');
  await page.getByLabel(/correo/i).fill(userEmail);
  await page.locator('input[type="password"]').first().fill(userPassword);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();

  // Wait for redirect to dashboard
  await page.waitForURL(/admin\/dashboard/, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
});
```

**Problem**: Same - `page.goto()` hangs on 400 response.

### Test Scenarios Defined

All test scenarios are well-defined and follow ALI-116 requirements:

**CLIENT Role Tests** ✅ (correctly defined):
- Full form with all fields (firstname, lastname, phone, company, address, contactPerson checkbox)
- Update basic fields
- Update address (CLIENT-only field)
- Add contact person (CLIENT-only feature)
- Show privilege note

**EMPLOYEE Role Tests** ✅ (correctly defined):
- Simplified form (NO address, NO contactPerson)
- Update basic fields only
- No CLIENT privileges note

**ADMIN Role Tests** ✅ (correctly defined):
- Simplified form (same as EMPLOYEE)
- Update basic fields only

**Security Tests** ✅ (correctly defined):
- Note about unchangeable email
- No email input field
- No password field (separate endpoint)
- Redirect after successful update

### What's Good About the Tests

1. **Role-based testing**: Properly tests all 3 roles (CLIENT, EMPLOYEE, ADMIN)
2. **Security validations**: Verifies cannot change email/password/role
3. **beforeAll setup**: Registers users once per suite (efficient)
4. **beforeEach login**: Ensures fresh authenticated state per test
5. **Unique emails**: Uses timestamp to avoid duplicates
6. **Good selectors**: Uses semantic selectors (getByLabel, getByRole)
7. **Proper waits**: waitForLoadState, waitForURL with timeouts

### What Needs Fixing

1. **Server 400 issue** (CRITICAL - blocks all tests)
2. **ADMIN user**: Uses hardcoded `admin@alkitu.com` but doesn't register it first
3. **Error handling**: No try-catch in beforeAll hooks
4. **Test isolation**: Tests share users (could cause conflicts)
5. **Missing component tests**: No unit tests for ProfileFormClientOrganism/ProfileFormEmployeeOrganism

---

## 🔍 Root Cause Analysis

### Why Server Returns 400

**Hypotheses**:

1. **Middleware Issue** 🔴 HIGH PROBABILITY
   ```typescript
   // Possible cause in middleware.ts
   export function middleware(request: NextRequest) {
     // If middleware has a bug or is blocking all requests
     // Could cause 400 responses
   }
   ```

2. **Environment Variables** 🟡 MEDIUM PROBABILITY
   ```bash
   # Missing required env vars could cause errors
   # Check .env.local exists and has all vars
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Database Connection** 🟡 MEDIUM PROBABILITY
   ```bash
   # If backend API is down, profile page fetches will fail
   # Check if API is running on :3001
   curl http://localhost:3001/health
   ```

4. **Build Corruption** 🟡 MEDIUM PROBABILITY
   ```bash
   # .next folder might be corrupted
   # Solution: rm -rf .next && npm run dev
   ```

5. **Port Conflict** 🟢 LOW PROBABILITY
   ```bash
   # Another process using port 3000
   lsof -i :3000
   ```

### Next Steps to Diagnose

1. Check middleware.ts for issues
2. Check .env.local exists and is complete
3. Restart Next.js dev server
4. Clear .next build folder
5. Check backend API is running on :3001
6. Check browser console for errors
7. Check Next.js terminal output for error logs

---

## ✅ Verification Checklist

### Code Verification

- [x] ProfileFormClientOrganism component exists
- [x] ProfileFormEmployeeOrganism component exists
- [x] Profile page exists at `/[lang]/(private)/profile/page.tsx`
- [x] API route exists at `/api/users/profile/route.ts`
- [x] Backend endpoint exists `PUT /users/me/profile`
- [x] UpdateProfileDto implements role-based filtering
- [x] E2E test file created (462 lines, 14 tests)

### Testing Verification

**Backend**:
- [ ] Run backend unit tests: `cd packages/api && npm test`
- [ ] Verify 91.12% coverage claim
- [ ] Check mutation score
- [ ] Test PUT /users/me/profile endpoint manually

**Frontend Unit Tests** (MISSING):
- [ ] Create ProfileFormClientOrganism.test.tsx
- [ ] Create ProfileFormEmployeeOrganism.test.tsx
- [ ] Create profile page.test.tsx
- [ ] Target: 95%+ coverage for organisms

**Frontend E2E Tests**:
- [ ] Fix server 400 issue (CRITICAL)
- [ ] Restart Next.js dev server
- [ ] Run: `npx playwright test tests/e2e/ali-116-profile-update.spec.ts`
- [ ] Target: 14/14 tests passing
- [ ] Fix ADMIN user registration in beforeAll hook
- [ ] Add error handling to hooks

### Manual Testing

**CLIENT Role**:
- [ ] Login as CLIENT
- [ ] Navigate to /es/profile
- [ ] Verify all fields visible (firstname, lastname, phone, company, address, contactPerson checkbox)
- [ ] Update basic fields → verify success message
- [ ] Update address → verify saved
- [ ] Add contact person → verify saved
- [ ] Verify email field NOT present
- [ ] Verify password field NOT present
- [ ] Verify redirect to dashboard after save

**EMPLOYEE Role**:
- [ ] Login as EMPLOYEE
- [ ] Navigate to /es/profile
- [ ] Verify simplified form (NO address, NO contactPerson)
- [ ] Verify only: firstname, lastname, phone, company
- [ ] Update fields → verify success
- [ ] Verify no CLIENT privileges note

**ADMIN Role**:
- [ ] Login as ADMIN
- [ ] Navigate to /es/profile
- [ ] Verify same as EMPLOYEE (simplified form)
- [ ] Update fields → verify success

**Security**:
- [ ] Verify cannot change email through any form
- [ ] Verify cannot change password (separate endpoint)
- [ ] Verify cannot change role
- [ ] Verify cannot access other users' profiles

### Browser Compatibility

- [ ] Chrome/Chromium (primary)
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Performance

- [ ] Profile page loads < 1s
- [ ] Form submit < 2s
- [ ] No memory leaks on repeated updates

---

## 📋 Action Items

### Immediate (CRITICAL)

1. **Fix Server 400 Issue** 🔴
   - Priority: P0 - BLOCKER
   - Assignee: TBD
   - Est: 30-60 min
   - Actions:
     - Check middleware.ts
     - Check .env.local
     - Restart dev server
     - Clear .next folder
     - Check backend API status

2. **Run Backend Tests** 🟡
   - Priority: P1
   - Assignee: TBD
   - Est: 15 min
   - Actions:
     - `cd packages/api && npm test`
     - Verify 91.12% coverage
     - Screenshot results

### Short Term

3. **Fix E2E Tests** 🟡
   - Priority: P1
   - Assignee: TBD
   - Est: 1-2 hours
   - Dependencies: #1 (server fix)
   - Actions:
     - Fix ADMIN user registration
     - Add error handling
     - Run full test suite
     - Screenshot passing results

4. **Create Component Unit Tests** 🟡
   - Priority: P2
   - Assignee: TBD
   - Est: 2-3 hours
   - Files needed:
     - ProfileFormClientOrganism.test.tsx
     - ProfileFormEmployeeOrganism.test.tsx
     - profile/page.test.tsx

5. **Manual QA Testing** 🟢
   - Priority: P2
   - Assignee: QA Team
   - Est: 1 hour
   - Complete checklist above

### Medium Term

6. **Update ALI-116-implementation-complete.md** 🟢
   - Priority: P3
   - Assignee: TBD
   - Est: 15 min
   - Changes needed:
     - Remove "PRODUCTION READY" claim
     - Update E2E test status to "FAILING - server 400 issue"
     - Update status to "IN TESTING"

7. **Performance Testing** 🟢
   - Priority: P3
   - Assignee: TBD
   - Est: 30 min

---

## 📊 Success Criteria

### Definition of Done

✅ ALI-116 is considered COMPLETE when:

1. **All E2E tests passing**: 14/14 tests (100%)
2. **Backend tests passing**: All unit tests + integration tests
3. **Component tests created**: ProfileFormClientOrganism, ProfileFormEmployeeOrganism, page.tsx
4. **Manual QA approved**: All 3 roles tested successfully
5. **Security verified**: Cannot change email/password/role
6. **Performance verified**: < 1s page load, < 2s form submit
7. **Documentation updated**: All specs reflect actual implementation
8. **Server 400 issue resolved**: All routes responding correctly

### Current Score

- [x] Code implementation: COMPLETE (100%)
- [ ] Backend tests: UNKNOWN (need to run)
- [ ] E2E tests: FAILING (0% - blocked by server)
- [ ] Component tests: NOT CREATED (0%)
- [ ] Manual QA: NOT STARTED (0%)
- [ ] Security verification: NOT TESTED (0%)
- [ ] Performance verification: NOT TESTED (0%)
- [ ] Documentation: OUTDATED (claims "PRODUCTION READY" incorrectly)

**Overall Progress**: ~30% (code done, testing blocked)

---

## 🚦 Status Summary

**Implementation**: ✅ COMPLETE
**Testing**: ❌ BLOCKED (server 400)
**Documentation**: ⚠️ OUTDATED
**Ready for Production**: ❌ NO

**Blocker**: Server returns 400 on all requests - must be fixed before any E2E tests can run.

**ETA to Unblock**: 30-60 minutes (once server issue is diagnosed and fixed)

**ETA to Complete**: 4-6 hours total
- Fix server: 30-60 min
- Run backend tests: 15 min
- Fix E2E tests: 1-2 hours
- Create component tests: 2-3 hours
- Manual QA: 1 hour
- Update docs: 15 min

---

**Documento creado**: 2024-11-24
**Última actualización**: 2024-11-24
**Autor**: Claude Code
**Próxima revisión**: Después de fix del servidor 400