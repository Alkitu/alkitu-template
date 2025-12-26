# ALI-122: Testing & Migration Plan

## Overview

Complete testing strategy and migration plan to move from current state (~60% complete) to 100% implementation.

## Current Implementation Status

### Backend: ~80% Complete

**Implemented** ✅:
- UserFacadeService with SOLID architecture
- UserRepositoryService (CRUD operations)
- UserAuthenticationService (password ops)
- UserAnalyticsService (statistics)
- UserEventsService (event publishing)
- UsersController (most endpoints)
- DTOs with Zod validation
- Guards (JwtAuthGuard, RolesGuard)
- Bulk operations (delete, update role, update status)

**Missing** ❌:
- User export/import endpoints
- Activity log model and endpoints
- Impersonation logic
- User anonymization endpoint
- Advanced search endpoint
- Missing tRPC endpoints (25+)

### Frontend: ~70% Complete

**Implemented** ✅:
- Admin users list page (inline organism)
- User create form
- User detail page with tabs
- Basic filters and search
- Bulk operations UI

**Missing** ❌:
- Extracted organisms (UserListOrganism, UserDetailOrganism)
- Activity timeline component
- Export/import UI
- Advanced filter panel
- Impersonation banner
- Missing atoms/molecules

## Testing Requirements

### Backend Unit Tests (Target: 95%+ coverage)

#### Services Tests (~80 tests)

**UserFacadeService** (20 tests):
```typescript
describe('UserFacadeService', () => {
  describe('create', () => {
    it('should hash password before creating user');
    it('should throw if email exists');
    it('should set default values');
    it('should publish user created event');
  });

  describe('update', () => {
    it('should update user fields');
    it('should not allow role change on own account');
    it('should publish user updated event');
  });

  describe('delete', () => {
    it('should soft delete user');
    it('should not allow deleting own account');
    it('should check for active requests');
    it('should publish deleted event');
  });

  describe('bulkDelete', () => {
    it('should delete multiple users');
    it('should prevent deleting last admin');
    it('should return success/failed counts');
  });

  describe('bulkUpdateRole', () => {
    it('should update role for multiple users');
    it('should validate at least one admin remains');
  });
});
```

**UserRepositoryService** (25 tests):
- CRUD operations (create, findAll, findOne, update, delete)
- Soft delete filtering
- Query building with filters
- Pagination
- Sorting
- Search functionality
- Error handling

**UserAuthenticationService** (15 tests):
- Password hashing
- Password validation
- Temp password generation
- Password reset

**UserAnalyticsService** (10 tests):
- Get statistics
- Count by role
- Count by status
- Recent registrations

**UserEventsService** (10 tests):
- Publish user created
- Publish role changed
- Publish status changed
- Notification integration

#### Controller Tests (~30 tests)

```typescript
describe('UsersController', () => {
  describe('GET /users', () => {
    it('should return paginated users');
    it('should filter by role');
    it('should filter by status');
    it('should search by name/email/company');
    it('should require authentication');
  });

  describe('POST /users', () => {
    it('should create user (ADMIN only)');
    it('should validate DTO');
    it('should return 403 for non-admin');
  });

  describe('DELETE /users/:id', () => {
    it('should soft delete user (ADMIN only)');
    it('should prevent deleting own account');
  });

  describe('POST /users/bulk/delete', () => {
    it('should bulk delete users');
    it('should validate user IDs');
    it('should enforce ADMIN role');
  });
});
```

### Frontend Component Tests (Target: 90%+ coverage)

#### Atoms (24 tests)

**UserAvatarAtom.test.tsx** (6 tests):
```typescript
describe('UserAvatarAtom', () => {
  it('renders initials from firstname and lastname');
  it('generates consistent color from email');
  it('renders different sizes correctly');
  it('handles missing names gracefully');
  it('shows question mark when showInitials is false');
  it('applies custom className');
});
```

**RoleBadgeAtom.test.tsx** (6 tests)
**StatusIndicatorAtom.test.tsx** (6 tests)
**LastLoginAtom.test.tsx** (6 tests)

#### Molecules (30 tests)

**UserCardMolecule.test.tsx** (10 tests):
```typescript
describe('UserCardMolecule', () => {
  it('renders user information correctly');
  it('displays role badge with correct color');
  it('displays status indicator');
  it('calls onEdit when edit button clicked');
  it('calls onDelete when delete button clicked');
  it('shows selection checkbox when onSelect provided');
  it('applies selected styling when selected=true');
  it('hides actions when showActions=false');
  it('formats phone number correctly');
  it('truncates long company names');
});
```

**UserFilterMolecule.test.tsx** (10 tests)
**BulkActionsMolecule.test.tsx** (10 tests)

#### Organisms (40 tests)

**UserListOrganism.test.tsx** (15 tests):
```typescript
describe('UserListOrganism', () => {
  it('renders user list');
  it('filters by search term');
  it('filters by role');
  it('filters by status');
  it('handles pagination');
  it('selects single user');
  it('selects all users');
  it('calls bulk delete');
  it('calls bulk update role');
  it('shows loading state');
  it('shows empty state');
  it('shows error state');
  it('debounces search input');
  it('resets to page 1 on filter change');
  it('invalidates cache after mutation');
});
```

**UserCreateFormOrganism.test.tsx** (10 tests)
**UserDetailOrganism.test.tsx** (10 tests)
**ActivityTimelineOrganism.test.tsx** (5 tests)

### E2E Tests (Target: 25+ scenarios)

#### Test File Structure

```
tests/e2e/
├── ali-122-user-management.spec.ts
├── ali-122-bulk-operations.spec.ts
├── ali-122-profile-management.spec.ts
└── ali-122-rbac.spec.ts
```

#### Scenarios

**ali-122-user-management.spec.ts** (10 tests):
```typescript
describe('User Management', () => {
  test('Admin creates CLIENT user successfully', async ({ page }) => {
    await page.goto('/admin/users');
    await page.click('button:has-text("Create User")');
    await page.fill('[name="email"]', 'newclient@test.com');
    // ... fill form
    await page.selectOption('[name="role"]', 'CLIENT');
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=User created successfully')).toBeVisible();
  });

  test('Admin creates EMPLOYEE user');
  test('Admin edits user details');
  test('Admin changes user role');
  test('Admin suspends user');
  test('Admin activates suspended user');
  test('Admin cannot delete own account');
  test('System prevents deleting last admin');
  test('Suspended user cannot login');
  test('Admin soft deletes user');
});
```

**ali-122-bulk-operations.spec.ts** (5 tests):
- Bulk select users
- Bulk delete multiple users
- Bulk update roles
- Bulk update statuses
- Bulk operations validation

**ali-122-profile-management.spec.ts** (5 tests):
- CLIENT edits own profile (sees address field)
- EMPLOYEE edits own profile (no address field)
- User changes own password
- Password complexity validation
- Profile completion flow

**ali-122-rbac.spec.ts** (5 tests):
- CLIENT cannot access admin users page
- EMPLOYEE can view users list (limited)
- EMPLOYEE cannot create users
- ADMIN has full access
- Role-based field visibility

## Migration Plan

### Phase 1: Complete Missing Backend Endpoints (3 days)

**Day 1: Export/Import**
- [ ] Create export endpoint (CSV/Excel)
- [ ] Create import endpoint with validation
- [ ] Write tests for export/import
- [ ] Test with large datasets (1000+ users)

**Day 2: Activity Log**
- [ ] Create ActivityLog model in Prisma
- [ ] Create activity logging service
- [ ] Add activity log to all user operations
- [ ] Create get activity log endpoint
- [ ] Write tests

**Day 3: Advanced Features**
- [ ] Create impersonation endpoints
- [ ] Create anonymization endpoint
- [ ] Create advanced search endpoint
- [ ] Create missing tRPC endpoints
- [ ] Write tests

### Phase 2: Frontend Component Extraction (2 days)

**Day 1: Extract Organisms**
- [ ] Extract UserListOrganism from page
- [ ] Extract UserDetailOrganism from page
- [ ] Create missing atoms (UserAvatar, RoleBadge, StatusIndicator, LastLogin)
- [ ] Extract molecules (UserCard, UserFilter, BulkActions)

**Day 2: Create Missing Components**
- [ ] Create UserEditFormOrganism
- [ ] Create ActivityTimelineOrganism
- [ ] Create UserExportDialogOrganism
- [ ] Create UserImportWizardOrganism
- [ ] Create ImpersonationBannerOrganism

### Phase 3: Testing (2 days)

**Day 1: Backend Tests**
- [ ] Write all service unit tests
- [ ] Write all controller tests
- [ ] Achieve 95%+ coverage
- [ ] Run Stryker mutation testing
- [ ] Achieve 85%+ mutation score

**Day 2: Frontend Tests**
- [ ] Write atom tests
- [ ] Write molecule tests
- [ ] Write organism tests
- [ ] Write E2E tests
- [ ] Achieve 90%+ coverage

### Phase 4: Integration & Polish (2 days)

**Day 1: Integration**
- [ ] Test complete user lifecycle
- [ ] Test integrations with ALI-119 (requests)
- [ ] Test integrations with ALI-120 (notifications)
- [ ] Test role transitions
- [ ] Test bulk operations at scale

**Day 2: Polish**
- [ ] Accessibility audit
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Documentation update
- [ ] Final QA

**Total Estimated Time**: 9 days

## Test Data Factory

```typescript
// tests/factories/user.factory.ts
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'user-id-123',
  email: 'test@example.com',
  firstname: 'Test',
  lastname: 'User',
  phone: '+1234567890',
  company: 'Test Company',
  role: 'CLIENT',
  status: 'ACTIVE',
  profileComplete: true,
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const createAdminUser = () =>
  createMockUser({ role: 'ADMIN', email: 'admin@test.com' });

export const createEmployeeUser = () =>
  createMockUser({ role: 'EMPLOYEE', email: 'employee@test.com' });
```

## Coverage Reports

### Backend Coverage Command
```bash
cd packages/api
npm run test:cov

# Expected output:
# Statements   : 95.5% ( 1200/1256 )
# Branches     : 92.3% ( 450/487 )
# Functions    : 96.1% ( 200/208 )
# Lines        : 95.8% ( 1150/1200 )
```

### Frontend Coverage Command
```bash
cd packages/web
npm run test:coverage

# Expected output:
# Statements   : 91.2% ( 850/932 )
# Branches     : 88.5% ( 320/362 )
# Functions    : 93.4% ( 180/193 )
# Lines        : 92.1% ( 830/901 )
```

## Performance Benchmarks

### Backend Performance Targets

- GET /users (20 items): < 100ms
- GET /users (100 items): < 300ms
- POST /users: < 200ms
- Bulk delete (100 users): < 2s
- Export 1000 users CSV: < 3s
- Import 100 users: < 5s

### Frontend Performance Targets

- User list page load: < 500ms
- User detail page load: < 300ms
- Search response time: < 200ms (debounced)
- Filter update: < 100ms

## Deployment Checklist

- [ ] All tests passing (backend + frontend)
- [ ] Coverage targets met (95% backend, 90% frontend)
- [ ] Mutation testing passed (85%+)
- [ ] E2E tests passing
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Migration script tested
- [ ] Database indexes created
- [ ] Environment variables configured

## References

- [Main Spec](./ALI-122-spec.md)
- [Frontend Testing Guide](../../../docs/05-testing/frontend-testing-guide.md)
- [Backend Testing Guide](../../../docs/05-testing/backend-testing-guide.md)

---

**Version**: 1.0
**Last Updated**: 2025-12-26
