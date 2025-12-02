# Route Comparison and Implementation Plan

**Date**: 2025-12-02
**Purpose**: Compare existing routes with requested sitemap and create implementation plan
**Constraint**: ⚠️ **DO NOT REMOVE** any existing routes - only ADD new ones

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Route Structure](#current-route-structure)
3. [Requested Sitemap (User Requirements)](#requested-sitemap-user-requirements)
4. [Gap Analysis](#gap-analysis)
5. [Implementation Plan](#implementation-plan)
6. [Route Mapping Strategy](#route-mapping-strategy)

---

## Executive Summary

### Current State
- **Total Routes**: 39 page components
- **Private Routes**: 24 (1 dashboard + 16 admin + 7 user features)
- **Public Routes**: 14 (10 auth + 4 utility)
- **Route Structure**: Uses `/(public)/` and `/(private)/` groups (no role-specific groups)

### Requested Changes
The user provided a comprehensive sitemap with role-based route organization:
- **Client Routes**: `/[lang]/client/*` pattern
- **Employee Routes**: `/[lang]/employee/*` pattern
- **Admin Routes**: `/[lang]/admin/*` pattern (already partially exists)

### Strategy
**Hybrid approach** - Maintain existing routes while adding new role-based structure:
1. Keep all existing routes as-is (no breaking changes)
2. Add new role-based route groups (`/client`, `/employee`)
3. Use middleware to redirect based on user role
4. Gradually migrate features to new structure

---

## Current Route Structure

### Existing Private Routes (`/(private)/`)

#### User Routes (All Authenticated Roles)
| Current Route | File Path | Status |
|---------------|-----------|--------|
| `/[lang]/dashboard` | `(private)/dashboard/page.tsx` | ✅ Exists |
| `/[lang]/profile` | `(private)/profile/page.tsx` | ✅ Exists |
| `/[lang]/onboarding` | `(private)/onboarding/page.tsx` | ✅ Exists |
| `/[lang]/locations` | `(private)/locations/page.tsx` | ✅ Exists |
| `/[lang]/requests` | `(private)/requests/page.tsx` | ✅ Exists |
| `/[lang]/requests/new` | `(private)/requests/new/page.tsx` | ✅ Exists |
| `/[lang]/requests/[id]` | `(private)/requests/[id]/page.tsx` | ✅ Exists |
| `/[lang]/services/[serviceId]/request` | `(private)/services/[serviceId]/request/page.tsx` | ✅ Exists |

#### Admin Routes (Existing)
| Current Route | File Path | Status |
|---------------|-----------|--------|
| `/[lang]/admin` | `(private)/admin/page.tsx` | ✅ Exists |
| `/[lang]/admin/dashboard` | `(private)/admin/dashboard/page.tsx` | ✅ Exists |
| `/[lang]/admin/users` | `(private)/admin/users/page.tsx` | ✅ Exists |
| `/[lang]/admin/users/create` | `(private)/admin/users/create/page.tsx` | ✅ Exists |
| `/[lang]/admin/users/[userEmail]` | `(private)/admin/users/[userEmail]/page.tsx` | ✅ Exists |
| `/[lang]/admin/catalog/categories` | `(private)/admin/catalog/categories/page.tsx` | ✅ Exists |
| `/[lang]/admin/catalog/services` | `(private)/admin/catalog/services/page.tsx` | ✅ Exists |
| `/[lang]/admin/chat` | `(private)/admin/chat/page.tsx` | ✅ Exists |
| `/[lang]/admin/chat/[conversationId]` | `(private)/admin/chat/[conversationId]/page.tsx` | ✅ Exists |
| `/[lang]/admin/chat/analytics` | `(private)/admin/chat/analytics/page.tsx` | ✅ Exists |
| `/[lang]/admin/notifications` | `(private)/admin/notifications/page.tsx` | ✅ Exists |
| `/[lang]/admin/notifications/analytics` | `(private)/admin/notifications/analytics/page.tsx` | ✅ Exists |
| `/[lang]/admin/notifications/preferences` | `(private)/admin/notifications/preferences/page.tsx` | ✅ Exists |
| `/[lang]/admin/settings` | `(private)/admin/settings/page.tsx` | ✅ Exists |
| `/[lang]/admin/settings/themes` | `(private)/admin/settings/themes/page.tsx` | ✅ Exists |
| `/[lang]/admin/settings/chatbot` | `(private)/admin/settings/chatbot/page.tsx` | ✅ Exists |

### Existing Public Routes (`/(public)/`)

#### Authentication Routes
| Current Route | File Path | Status |
|---------------|-----------|--------|
| `/[lang]/auth/login` | `(public)/auth/login/page.tsx` | ✅ Exists |
| `/[lang]/auth/register` | `(public)/auth/register/page.tsx` | ✅ Exists |
| `/[lang]/auth/email-login` | `(public)/auth/email-login/page.tsx` | ✅ Exists |
| `/[lang]/auth/forgot-password` | `(public)/auth/forgot-password/page.tsx` | ✅ Exists |
| `/[lang]/auth/reset-password` | `(public)/auth/reset-password/page.tsx` | ✅ Exists |
| `/[lang]/auth/new-password` | `(public)/auth/new-password/page.tsx` | ✅ Exists |
| `/[lang]/auth/verify-request` | `(public)/auth/verify-request/page.tsx` | ✅ Exists |
| `/[lang]/auth/verify-login-code` | `(public)/auth/verify-login-code/page.tsx` | ✅ Exists |
| `/[lang]/auth/new-verification` | `(public)/auth/new-verification/page.tsx` | ✅ Exists |
| `/[lang]/auth/auth-error` | `(public)/auth/auth-error/page.tsx` | ✅ Exists |

#### Utility Routes
| Current Route | File Path | Status |
|---------------|-----------|--------|
| `/[lang]/` | `[lang]/page.tsx` | ✅ Exists (Landing) |
| `/[lang]/design-system` | `(public)/design-system/page.tsx` | ✅ Exists |
| `/[lang]/test` | `(public)/test/page.tsx` | ✅ Exists |
| `/[lang]/unauthorized` | `(public)/unauthorized/page.tsx` | ✅ Exists |

---

## Requested Sitemap (User Requirements)

### Client Routes (`/[lang]/client/*`)

#### Dashboard & Overview
| Requested Route | Purpose | Notes |
|-----------------|---------|-------|
| `/[lang]/client/dashboard` | Client main dashboard | Similar to existing `/[lang]/dashboard` |

#### Request Management
| Requested Route | Purpose | Notes |
|-----------------|---------|-------|
| `/[lang]/client/requests/new` | Create new request (wizard with 4 steps) | **Internal wizard** - single route with step state |
| `/[lang]/client/requests/new/success` | Request creation success page | New route needed |
| `/[lang]/client/requests/[requestId]` | View specific request detail | Similar to existing `/[lang]/requests/[id]` |

**Wizard Steps** (internal state, not routes):
- Step 1: Select service
- Step 2: Fill request form
- Step 3: Select work location
- Step 4: Review and confirm

#### Account & Settings
| Requested Route | Purpose | Notes |
|-----------------|---------|-------|
| `/[lang]/client/notifications` | View and manage notifications | New route needed |
| `/[lang]/client/profile` | Client profile management | Similar to existing `/[lang]/profile` |
| `/[lang]/client/onboarding` | Client onboarding flow | Similar to existing `/[lang]/onboarding` |

---

### Employee Routes (`/[lang]/employee/*`)

#### Dashboard & Work Management
| Requested Route | Purpose | Notes |
|-----------------|---------|-------|
| `/[lang]/employee/dashboard` | Employee main dashboard | New route needed |
| `/[lang]/employee/requests/[requestId]` | View and manage assigned request | New route needed |

#### Account & Settings
| Requested Route | Purpose | Notes |
|-----------------|---------|-------|
| `/[lang]/employee/notifications` | View notifications | New route needed |
| `/[lang]/employee/profile` | Employee profile management | Similar to existing `/[lang]/profile` |

---

### Admin Routes (`/[lang]/admin/*`)

#### Dashboard & Analytics
| Requested Route | Purpose | Status |
|-----------------|---------|--------|
| `/[lang]/admin/dashboard` | Admin main dashboard | ✅ Exists |

#### Management Features
| Requested Route | Purpose | Status |
|-----------------|---------|--------|
| `/[lang]/admin/calendar` | Calendar for scheduling | 🆕 New route needed |
| `/[lang]/admin/services` | Service catalog management | ✅ Exists (`/admin/catalog/services`) |
| `/[lang]/admin/email-automation` | Email automation configuration | 🆕 New route needed |
| `/[lang]/admin/users` | User management | ✅ Exists |

#### Request Management
| Requested Route | Purpose | Status |
|-----------------|---------|--------|
| `/[lang]/admin/requests/[requestId]` | Admin view of specific request | 🆕 New route needed |

#### Account & Settings
| Requested Route | Purpose | Status |
|-----------------|---------|--------|
| `/[lang]/admin/notifications` | Admin notifications | ✅ Exists |
| `/[lang]/admin/profile` | Admin profile management | 🆕 New route needed (or use `/[lang]/profile`) |

---

## Gap Analysis

### Routes That Need to Be Created

#### Client-Specific Routes (6 new routes)
1. 🆕 `/[lang]/client/dashboard` - Client dashboard (or redirect from `/[lang]/dashboard`)
2. 🆕 `/[lang]/client/requests/new` - Wizard-based request creation
3. 🆕 `/[lang]/client/requests/new/success` - Success confirmation page
4. 🆕 `/[lang]/client/requests/[requestId]` - Client request detail view
5. 🆕 `/[lang]/client/notifications` - Client notifications center
6. 🆕 `/[lang]/client/profile` - Client profile (or redirect from `/[lang]/profile`)
7. 🆕 `/[lang]/client/onboarding` - Client onboarding (or redirect from `/[lang]/onboarding`)

#### Employee-Specific Routes (4 new routes)
1. 🆕 `/[lang]/employee/dashboard` - Employee work dashboard
2. 🆕 `/[lang]/employee/requests/[requestId]` - Employee request management view
3. 🆕 `/[lang]/employee/notifications` - Employee notifications
4. 🆕 `/[lang]/employee/profile` - Employee profile (or redirect from `/[lang]/profile`)

#### Admin-Specific Routes (3 new routes)
1. 🆕 `/[lang]/admin/calendar` - Scheduling calendar
2. 🆕 `/[lang]/admin/email-automation` - Email automation dashboard
3. 🆕 `/[lang]/admin/requests/[requestId]` - Admin request detail view
4. 🆕 `/[lang]/admin/profile` - Admin profile (or redirect from `/[lang]/profile`)

### Routes That Already Exist (Keep As-Is)

#### Shared Routes (8 existing)
- ✅ `/[lang]/dashboard` - Generic dashboard (currently used)
- ✅ `/[lang]/profile` - Generic profile page
- ✅ `/[lang]/onboarding` - Generic onboarding
- ✅ `/[lang]/locations` - Work locations management
- ✅ `/[lang]/requests` - Request list
- ✅ `/[lang]/requests/new` - Current request creation (non-wizard)
- ✅ `/[lang]/requests/[id]` - Request detail view
- ✅ `/[lang]/services/[serviceId]/request` - Service-based request creation

#### Admin Routes (16 existing)
- ✅ All routes in `/[lang]/admin/*` listed in "Current Route Structure" section above

#### Public Routes (14 existing)
- ✅ All authentication and utility routes listed above

---

## Implementation Plan

### Phase 1: Client Routes (Priority: HIGH)
**Estimated Effort**: 2-3 days

#### Tasks:
1. **Create Client Route Group** (`/packages/web/src/app/[lang]/(private)/client/`)
   - Set up `layout.tsx` with CLIENT role protection
   - Configure middleware to allow CLIENT role access

2. **Create Client Dashboard** (`/client/dashboard/page.tsx`)
   - Reuse existing dashboard components
   - Add CLIENT-specific widgets (active requests, quick actions)

3. **Create Wizard-Based Request Creation** (`/client/requests/new/page.tsx`)
   - **Step 1**: Service selection (integrate with `/services` API)
   - **Step 2**: Request form (dynamic fields based on service)
   - **Step 3**: Work location selection (integrate with `/locations` API)
   - **Step 4**: Review and confirmation
   - Use React state for step management (no separate routes per step)
   - Add form validation with Zod schemas

4. **Create Success Page** (`/client/requests/new/success/page.tsx`)
   - Display request confirmation details
   - Show request ID and status
   - Provide navigation to view request or return to dashboard

5. **Create Client Request Detail** (`/client/requests/[requestId]/page.tsx`)
   - Display request details in read-only mode
   - Show request timeline and status updates
   - Add "Cancel Request" action (if status allows)

6. **Create Client Notifications** (`/client/notifications/page.tsx`)
   - List user notifications (paginated)
   - Mark as read/unread functionality
   - Filter by notification type

7. **Create Client Profile** (`/client/profile/page.tsx`)
   - Can reuse existing `/profile` components
   - Add CLIENT-specific fields (contact person, address, etc.)

8. **Create Client Onboarding** (`/client/onboarding/page.tsx`)
   - Multi-step onboarding flow
   - Profile completion wizard
   - Welcome tour integration

---

### Phase 2: Employee Routes (Priority: MEDIUM)
**Estimated Effort**: 1-2 days

#### Tasks:
1. **Create Employee Route Group** (`/packages/web/src/app/[lang]/(private)/employee/`)
   - Set up `layout.tsx` with EMPLOYEE role protection
   - Configure middleware to allow EMPLOYEE + ADMIN roles

2. **Create Employee Dashboard** (`/employee/dashboard/page.tsx`)
   - Display assigned requests (PENDING, ONGOING)
   - Show work calendar/schedule
   - Display performance metrics

3. **Create Employee Request Management** (`/employee/requests/[requestId]/page.tsx`)
   - View request details with full context
   - Update request status (PENDING → ONGOING → COMPLETED)
   - Add notes and internal comments
   - Upload work evidence/photos
   - Mark tasks as complete

4. **Create Employee Notifications** (`/employee/notifications/page.tsx`)
   - Show assignment notifications
   - Display schedule changes
   - Filter by urgency/type

5. **Create Employee Profile** (`/employee/profile/page.tsx`)
   - Basic profile information (read-only email)
   - Skills and certifications
   - Availability settings

---

### Phase 3: Admin Routes (Priority: LOW)
**Estimated Effort**: 2-3 days

#### Tasks:
1. **Create Admin Calendar** (`/admin/calendar/page.tsx`)
   - Full calendar view (month/week/day)
   - Display all requests with scheduling
   - Assign requests to employees
   - Drag-and-drop rescheduling

2. **Create Admin Email Automation** (`/admin/email-automation/page.tsx`)
   - Configure email templates
   - Set up automation rules
   - View email sending history
   - Test email templates

3. **Create Admin Request Detail** (`/admin/requests/[requestId]/page.tsx`)
   - Full administrative view of request
   - Reassign to different employee
   - Override status/priority
   - View full audit log
   - Handle escalations

4. **Create Admin Profile** (`/admin/profile/page.tsx`)
   - Admin user profile settings
   - Notification preferences
   - Security settings

---

### Phase 4: Middleware & Navigation Updates
**Estimated Effort**: 1 day

#### Tasks:
1. **Update Middleware for Role-Based Redirects**
   - After login: redirect CLIENT → `/client/dashboard`, EMPLOYEE → `/employee/dashboard`, ADMIN → `/admin/dashboard`
   - Update `packages/web/src/middleware/authMiddleware.ts`

2. **Update Navigation Components**
   - Update sidebar/navigation to show role-specific links
   - CLIENT sees: Dashboard, Requests, Notifications, Profile
   - EMPLOYEE sees: Dashboard, My Requests, Notifications, Profile
   - ADMIN sees: Dashboard, Calendar, Services, Users, Email Automation, Requests, Notifications

3. **Add Breadcrumbs**
   - Implement breadcrumb navigation for all new routes
   - Show current location in route hierarchy

---

### Phase 5: Testing & Documentation
**Estimated Effort**: 1-2 days

#### Tasks:
1. **E2E Tests (Playwright)**
   - Test CLIENT wizard flow (all 4 steps + success)
   - Test EMPLOYEE request management flow
   - Test ADMIN calendar and assignment
   - Test role-based redirects after login

2. **Component Tests (Vitest)**
   - Test wizard step navigation
   - Test form validation
   - Test role-based component rendering

3. **Update Documentation**
   - Update `frontend-architecture.md` with new routes
   - Create route migration guide
   - Document wizard pattern implementation

---

## Route Mapping Strategy

### Strategy 1: Parallel Routes (RECOMMENDED)
**Approach**: Keep existing routes AND add new role-based routes in parallel

**Pros**:
- ✅ No breaking changes to existing features
- ✅ Gradual migration path
- ✅ Easy rollback if issues arise
- ✅ Both old and new routes work simultaneously

**Cons**:
- ⚠️ Duplicate routes temporarily (higher maintenance)
- ⚠️ Need to keep both in sync during transition

**Implementation**:
```
Existing (Keep):                    New (Add):
/[lang]/dashboard              →    /[lang]/client/dashboard
/[lang]/requests/[id]          →    /[lang]/client/requests/[requestId]
/[lang]/profile               →    /[lang]/client/profile
                              +    /[lang]/employee/dashboard
                              +    /[lang]/employee/requests/[requestId]
/[lang]/admin/dashboard       ✅   (already exists)
```

**Middleware Logic**:
```typescript
// After login, redirect based on role
if (role === 'CLIENT') {
  return NextResponse.redirect('/[lang]/client/dashboard');
}
if (role === 'EMPLOYEE') {
  return NextResponse.redirect('/[lang]/employee/dashboard');
}
if (role === 'ADMIN') {
  return NextResponse.redirect('/[lang]/admin/dashboard');
}
```

---

### Strategy 2: Route Aliases (ALTERNATIVE)
**Approach**: Keep existing routes, create route aliases that render same components

**Pros**:
- ✅ No code duplication
- ✅ Single source of truth for components

**Cons**:
- ⚠️ More complex routing configuration
- ⚠️ URL changes may confuse existing users

**Implementation**: Use Next.js rewrites in `next.config.mjs`

---

## Component Reuse Plan

### Shared Components (Reuse Across Roles)

#### Organisms (High-Level Features)
- ✅ `RequestListOrganism` - Used by CLIENT, EMPLOYEE, ADMIN
- ✅ `RequestFormOrganism` - Base form (extended per role)
- ✅ `LocationListOrganism` - Work location management
- ✅ `ProfileFormOrganism` - Base profile (CLIENT/EMPLOYEE/ADMIN variants)
- ✅ `NotificationListOrganism` - Notification center

#### Molecules (Mid-Level Components)
- ✅ `RequestCardMolecule` - Request display card
- ✅ `LocationCardMolecule` - Location display
- ✅ `NotificationItemMolecule` - Notification item
- ✅ `ServiceCardMolecule` - Service selector

#### New Components Needed
- 🆕 `RequestWizardOrganism` - Multi-step request creation
- 🆕 `CalendarOrganism` - Admin scheduling calendar
- 🆕 `EmailAutomationOrganism` - Email template editor
- 🆕 `RequestTimelineOrganism` - Request status history

---

## Migration Checklist

### Pre-Implementation
- [ ] Review this document with team
- [ ] Confirm route naming conventions
- [ ] Validate wizard flow with stakeholders
- [ ] Confirm role permissions matrix

### During Implementation
- [ ] Create route groups with proper layouts
- [ ] Implement middleware role checks
- [ ] Reuse existing components where possible
- [ ] Write E2E tests for each new route
- [ ] Update API routes if needed (new endpoints)

### Post-Implementation
- [ ] Update architecture documentation
- [ ] Create user guide for new flows
- [ ] Monitor error logs for routing issues
- [ ] Gather user feedback on new structure
- [ ] Plan deprecation of old routes (if desired)

---

## Success Criteria

✅ All existing routes continue to work without breaking changes
✅ New role-based routes are accessible based on user role
✅ Wizard flow completes successfully (4 steps + success page)
✅ Middleware correctly redirects users after login
✅ All E2E tests pass (old and new routes)
✅ No regression in existing functionality
✅ Documentation updated with new route structure

---

## Timeline

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1: Client Routes | 2-3 days | TBD | TBD |
| Phase 2: Employee Routes | 1-2 days | TBD | TBD |
| Phase 3: Admin Routes | 2-3 days | TBD | TBD |
| Phase 4: Middleware Updates | 1 day | TBD | TBD |
| Phase 5: Testing & Docs | 1-2 days | TBD | TBD |
| **Total** | **7-11 days** | TBD | TBD |

---

## Notes

1. **No Deletions**: All existing routes will remain functional during and after implementation
2. **Wizard Pattern**: Request creation wizard uses internal state, not separate routes per step
3. **Role Protection**: Each route group will have its own `layout.tsx` with role checking
4. **Component Reuse**: Maximize reuse of existing Atomic Design components
5. **Gradual Migration**: Users can be migrated from old to new routes gradually
6. **API Compatibility**: Existing API routes remain unchanged unless new endpoints are needed

---

## Questions for Team Review

1. **Route Naming**: Confirm `/client/`, `/employee/`, `/admin/` naming convention
2. **Wizard Steps**: Validate 4-step wizard flow (service → form → location → review)
3. **Profile Routes**: Use shared `/profile` or role-specific `/[role]/profile`?
4. **Deprecation Plan**: When to deprecate old routes (if ever)?
5. **Calendar Integration**: Which calendar library to use for `/admin/calendar`?
6. **Email Templates**: Use existing email service or new implementation?

---

**Last Updated**: 2025-12-02
**Author**: Claude Code
**Status**: 📋 Planning - Awaiting Implementation Approval
