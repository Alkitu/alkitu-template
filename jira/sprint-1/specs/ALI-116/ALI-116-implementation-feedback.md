# ALI-116: User Profile & Onboarding - Implementation Feedback

**Date:** 2025-01-24  
**Status:** ✅ Implemented  
**Related:** ALI-115 (Auth Flow)

---

## 📋 Implementation Summary

**User Story:**  
As a user, I want to update my profile information so that my account details are accurate and up to date.

**Acceptance Criteria Met:**

- ✅ Users can update basic info (firstname, lastname, phone, company)
- ✅ CLIENT role can update address and contactPerson
- ✅ EMPLOYEE/ADMIN cannot update address/contactPerson (role-based filtering)
- ✅ Email/password changes blocked (separate endpoints)
- ✅ Profile page renders correct form based on user role
- ✅ Success/error feedback to users
- ✅ API route forwards requests to NestJS backend

---

## 🏗️ Architecture Overview

### Backend (NestJS)

**Files Created:**

```
packages/api/src/users/dto/update-profile.dto.ts
```

**Files Modified:**

```
packages/api/src/users/dto/index.ts
packages/api/src/users/users.service.ts
packages/api/src/users/users.controller.ts
```

**Key Implementation:**

1. **UpdateProfileDto** (New DTO)
   - Fields: `firstname`, `lastname`, `phone`, `company`, `address`, `contactPerson`
   - Validation: Zod schema + class-validator decorators
   - More restrictive than `UpdateUserDto` (no email/password/role/status)

2. **UsersService.updateProfile()** (New Method)
   - Role-based field filtering
   - Only CLIENT can update `address` and `contactPerson`
   - EMPLOYEE/ADMIN restricted to basic fields
   - Returns updated user data

3. **UsersController: PUT /users/me/profile** (New Endpoint)
   - Requires JWT authentication
   - Uses `@Req() req: AuthenticatedRequest` to get user ID
   - Calls `usersService.updateProfile()`
   - Returns success message + updated user

**SOLID Compliance:**

- ✅ Single Responsibility: `updateProfile()` only handles profile updates
- ✅ Open/Closed: Extensible without modifying existing code
- ✅ Liskov Substitution: Follows service interface contracts
- ✅ Interface Segregation: Separate DTO for profile updates
- ✅ Dependency Inversion: Uses dependency injection

---

### Shared Package (Types + Schemas)

**Files Modified:**

```
packages/shared/src/schemas/auth.ts
```

**Key Additions:**

1. **UpdateProfileSchema** (Zod Schema)

   ```typescript
   export const UpdateProfileSchema = z.object({
     firstname: z.string().min(2).optional(),
     lastname: z.string().min(2).optional(),
     phone: z.string().optional(),
     company: z.string().optional(),
     address: z.string().optional(), // CLIENT only
     contactPerson: ContactPersonSchema.optional(), // CLIENT only
   });
   ```

2. **UpdateProfileInput** (Type)
   ```typescript
   export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
   ```

---

### Frontend (Next.js)

**Files Created:**

```
packages/web/src/app/api/users/profile/route.ts
packages/web/src/app/[lang]/(private)/profile/page.tsx
packages/web/src/components/organisms/profile/ProfileFormClientOrganism.tsx
packages/web/src/components/organisms/profile/ProfileFormClientOrganism.types.ts
packages/web/src/components/organisms/profile/ProfileFormEmployeeOrganism.tsx
packages/web/src/components/organisms/profile/ProfileFormEmployeeOrganism.types.ts
packages/web/src/components/organisms/profile/index.ts
```

**Key Implementation:**

1. **API Route: /api/users/profile**
   - Methods: GET, PUT
   - Forwards to backend `/users/me/profile`
   - Handles auth token from cookies
   - Error handling (503 for backend down, 401 for unauthorized)

2. **ProfilePage** (`/[lang]/profile`)
   - Role-based form rendering
   - CLIENT → `ProfileFormClientOrganism`
   - EMPLOYEE/ADMIN → `ProfileFormEmployeeOrganism`
   - Pre-fills with current user data from AuthContext
   - Success: Shows message + redirects to dashboard after 2s
   - Error: Shows error message

3. **ProfileFormClientOrganism** (Organism)
   - All fields: firstname, lastname, phone, company, address
   - Optional contact person (checkbox toggle)
   - Contact person fields: name, lastname, phone, email
   - Form validation
   - Loading states
   - Success/error messages

4. **ProfileFormEmployeeOrganism** (Organism)
   - Basic fields only: firstname, lastname, phone, company
   - No address or contactPerson
   - Simplified version for non-CLIENT roles
   - Same UX patterns as ClientForm

**Atomic Design Compliance:**

- ✅ Organisms: Self-contained profile forms
- ✅ Molecules: Reused Input, Label, Button, Checkbox
- ✅ Atoms: Primitives from shadcn/ui
- ✅ Page: Composition layer with role-based rendering

---

## 🔒 Security Features

1. **Role-Based Field Filtering (Backend)**
   - `address` and `contactPerson` only writable by CLIENT role
   - Backend enforces restrictions (not just frontend hiding)
   - Other roles' attempts to update these fields are silently ignored

2. **Restricted Fields**
   - Cannot change: `email`, `password`, `role`, `status`, `profileComplete`
   - Email changes require separate verification flow
   - Password changes use `/users/me/password` endpoint
   - Role/status changes require ADMIN permissions

3. **Authentication**
   - JWT required for all profile operations
   - Token validated on every request
   - User ID extracted from JWT payload

---

## 🎨 UX/UI Features

1. **Pre-filled Forms**
   - All fields populated with current user data
   - No need to re-enter existing information

2. **Responsive Design**
   - Mobile-friendly grid layout
   - 1 column on mobile, 2 columns on desktop
   - Proper spacing and typography

3. **Loading States**
   - Button shows "Saving..." during submission
   - All inputs disabled while loading
   - Prevents double submissions

4. **Feedback Messages**
   - Success: Green banner with "Profile updated successfully"
   - Error: Red banner with specific error message
   - Success auto-dismisses after 3 seconds

5. **Contact Person Toggle**
   - Checkbox to show/hide contact person fields
   - Only shown for CLIENT role form
   - Pre-checked if contactPerson exists

6. **Field Validation**
   - Required: firstname, lastname
   - Optional: phone, company, address, contactPerson
   - Email format validation for contact person email
   - Min length: 2 characters for names

---

## 📊 API Specification

### Backend Endpoint

```http
PUT /users/me/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "firstname": "John",
  "lastname": "Doe",
  "phone": "+1234567890",
  "company": "Acme Inc.",
  "address": "123 Main St", // CLIENT only
  "contactPerson": {        // CLIENT only
    "name": "Jane",
    "lastname": "Smith",
    "phone": "+0987654321",
    "email": "jane@example.com"
  }
}

Response (200 OK):
{
  "user": {
    "id": "...",
    "email": "...",
    "firstname": "John",
    "lastname": "Doe",
    "phone": "+1234567890",
    "company": "Acme Inc.",
    "address": "123 Main St",
    "contactPerson": { ... },
    "role": "CLIENT",
    "status": "ACTIVE",
    "profileComplete": true,
    "createdAt": "...",
    "updatedAt": "...",
    "emailVerified": "..."
  },
  "message": "Profile updated successfully"
}

Error Responses:
- 401 Unauthorized: Missing/invalid JWT token
- 404 Not Found: User not found
- 400 Bad Request: Validation errors
```

### Frontend API Route

```http
PUT /api/users/profile
Cookie: auth-token=<JWT_TOKEN>
Content-Type: application/json

Request Body: Same as backend
Response: Forwards backend response
```

---

## 🧪 Testing Coverage

### Unit Tests (Pending - ALI-116-3)

**Backend Tests:**

```typescript
// packages/api/src/users/users.service.spec.ts

describe("UsersService.updateProfile", () => {
  it("should update basic fields for all roles");
  it("should update address for CLIENT role");
  it("should update contactPerson for CLIENT role");
  it("should ignore address for EMPLOYEE role");
  it("should ignore contactPerson for ADMIN role");
  it("should throw NotFoundException for invalid user");
  it("should validate required fields");
});
```

**Expected Coverage:** 95%+

### E2E Tests (Pending - ALI-116-9)

**Playwright Tests:**

```typescript
// packages/web/tests/e2e/ali-116-profile-update.spec.ts

describe("ALI-116: Profile Update Flow", () => {
  describe("CLIENT Role", () => {
    it("should show full form with address and contactPerson");
    it("should successfully update all fields");
    it("should toggle contact person section");
  });

  describe("EMPLOYEE Role", () => {
    it("should show simplified form without address");
    it("should successfully update basic fields");
    it("should not send address/contactPerson to backend");
  });

  describe("ADMIN Role", () => {
    it("should show simplified form");
    it("should successfully update basic fields");
  });

  describe("Security", () => {
    it("should not allow email changes");
    it("should not allow password changes");
    it("should not allow role changes");
  });
});
```

---

## 📝 Database Schema

No changes needed - uses existing User model from ALI-115:

```prisma
model User {
  id              String         @id @default(cuid())
  email           String         @unique
  password        String?
  firstname       String
  lastname        String
  phone           String?
  company         String?
  address         String?         // CLIENT role
  contactPerson   Json?           // CLIENT role - {name, lastname, phone, email}
  role            UserRole       @default(USER)
  status          UserStatus     @default(PENDING)
  profileComplete Boolean        @default(false)
  emailVerified   DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  // ... other fields
}
```

---

## 🔄 Integration with ALI-115

ALI-116 builds on top of ALI-115's authentication and user management:

1. **Uses ALI-115 Auth:**
   - JWT authentication
   - auth-token cookie
   - User session management

2. **Extends ALI-115 User Model:**
   - All fields defined in ALI-115
   - No schema changes needed

3. **Follows ALI-115 Patterns:**
   - Similar API route structure
   - Consistent error handling
   - Same translation patterns
   - Matching form components

---

## 🎯 User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User logs in (ALI-115)                                   │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User navigates to /profile                               │
└────────────────┬────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Page checks user role from AuthContext                  │
└────────┬────────────────────────────────────┬───────────────┘
         ↓                                    ↓
   CLIENT Role                          EMPLOYEE/ADMIN Role
         ↓                                    ↓
┌────────────────────┐              ┌────────────────────────┐
│ ProfileFormClient  │              │ ProfileFormEmployee    │
│ - All fields       │              │ - Basic fields only    │
│ - Address          │              │ - No address           │
│ - ContactPerson    │              │ - No contactPerson     │
└────────┬───────────┘              └──────────┬─────────────┘
         │                                     │
         └──────────────┬──────────────────────┘
                        ↓
         ┌──────────────────────────────────┐
         │ 4. User updates fields           │
         └──────────────┬───────────────────┘
                        ↓
         ┌──────────────────────────────────┐
         │ 5. Form submits to               │
         │    /api/users/profile (PUT)      │
         └──────────────┬───────────────────┘
                        ↓
         ┌──────────────────────────────────┐
         │ 6. Next.js forwards to backend   │
         │    /users/me/profile (PUT)       │
         └──────────────┬───────────────────┘
                        ↓
         ┌──────────────────────────────────┐
         │ 7. Backend validates role        │
         │    and updates allowed fields    │
         └──────────────┬───────────────────┘
                        ↓
         ┌──────────────────────────────────┐
         │ 8. Success message shown         │
         │    User redirected to dashboard  │
         └──────────────────────────────────┘
```

---

## ✅ Checklist

### Backend

- ✅ UpdateProfileDto created with validation
- ✅ updateProfile() method in UsersService
- ✅ PUT /users/me/profile endpoint in UsersController
- ✅ Role-based field filtering implemented
- ✅ Error handling for invalid users
- ⏳ Unit tests (95%+ coverage) - PENDING

### Shared

- ✅ UpdateProfileSchema (Zod)
- ✅ UpdateProfileInput type
- ✅ Exported from index.ts

### Frontend

- ✅ API route /api/users/profile (GET, PUT)
- ✅ ProfileFormClientOrganism component
- ✅ ProfileFormEmployeeOrganism component
- ✅ Profile page with role-based rendering
- ✅ Pre-filled forms with current data
- ✅ Success/error feedback
- ⏳ E2E tests (Playwright) - PENDING

### Documentation

- ✅ This feedback document
- ✅ Inline code comments
- ✅ Type documentation
- ✅ API specification

---

## 🚀 Next Steps

1. **Complete Unit Tests** (ALI-116-3)
   - Create comprehensive tests for `updateProfile()` method
   - Achieve 95%+ coverage
   - Test all role-based scenarios

2. **Complete E2E Tests** (ALI-116-9)
   - Write Playwright tests for all 3 roles
   - Test complete user flows
   - Verify security restrictions

3. **Optional Enhancements:**
   - Add profile picture upload
   - Add notification preferences
   - Add timezone selection
   - Add language preference

---

## 💡 Lessons Learned

1. **Role-Based Filtering:**
   - Backend enforcement is critical (not just frontend hiding)
   - Silent filtering (ignore fields) is better than errors for UX

2. **Reusable Components:**
   - Two separate organisms (Client/Employee) better than one complex component
   - Easier to test and maintain

3. **Pre-filling Forms:**
   - useEffect to update form when initialData changes
   - Provides better UX than forcing users to re-enter data

4. **API Design:**
   - PUT /users/me/profile is more RESTful than PATCH
   - Separating profile/password/email endpoints improves security

---

## 📚 Related Documentation

- [ALI-115: Authentication Flow](./ALI-115-auth-spec.md)
- [Atomic Design Architecture](/docs/00-conventions/atomic-design-architecture.md)
- [Component Structure and Testing](/docs/00-conventions/component-structure-and-testing.md)
- [Testing Strategy](/docs/00-conventions/testing-strategy-and-frameworks.md)

---

**Implementation completed:** 2025-01-24  
**Pending items:** Unit tests (backend), E2E tests (Playwright)  
**Ready for review:** ✅ YES
