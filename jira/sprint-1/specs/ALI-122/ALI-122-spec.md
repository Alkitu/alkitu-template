# ALI-122: Users & Roles Management - Technical Specification

## Issue Information
- **Jira Issue**: ALI-122
- **Type**: Task
- **Priority**: Medium
- **Status**: Discovery (Implementation: ~60% Complete)
- **Sprint**: Sprint 1 (37)
- **Created**: 2025-11-18
- **Updated**: 2025-12-26

## Overview

Este issue implementa el sistema completo de gestión de usuarios y roles para administradores. Permite a los ADMINs crear, editar, eliminar y gestionar usuarios del sistema (tanto equipo interno como clientes), asignar roles, actualizar estados, y realizar operaciones masivas. El sistema se integra con la autenticación (ALI-115), perfiles (ALI-116), y la asignación de solicitudes (ALI-119).

**Current Implementation Status**: ~60%
- ✅ Backend: UsersModule completo con SOLID architecture
- ✅ Frontend: Admin pages (list, create, detail) implementadas
- ⚠️ Pending: 25+ tRPC endpoints, export/import, activity log, advanced features

## Database Schema

### UserRole Enum

```prisma
enum Role {
  ADMIN      // Full system access, user management, system configuration
  EMPLOYEE   // Service execution, assigned request management
  CLIENT     // Service requests, own profile management
  LEAD       // Future: Team lead capabilities (reserved)
  USER       // Future: Basic user (reserved)
  MODERATOR  // Future: Content moderation (reserved)
}
```

### UserStatus Enum

```prisma
enum UserStatus {
  ACTIVE      // Normal active user, full access
  SUSPENDED   // Temporarily disabled, cannot login
  ANONYMIZED  // GDPR anonymized, permanent (terminal state)
}
```

### User Model (Complete)

```prisma
model User {
  id               String          @id @default(auto()) @map("_id") @db.ObjectId

  // === Authentication ===
  email            String          @unique
  password         String
  emailVerified    Boolean         @default(false)

  // === Personal Information ===
  firstname        String
  lastname         String
  phone            String

  // === Business Information ===
  company          String
  address          String?         // Main address (CLIENT only)
  contactPerson    ContactPerson?  // Business contact (CLIENT only)

  // === Account Settings ===
  role             Role            @default(CLIENT)
  status           UserStatus      @default(ACTIVE)
  profileComplete  Boolean         @default(false)
  terms            Boolean         @default(false)

  // === Security ===
  isTwoFactorEnabled Boolean       @default(false)

  // === Relations ===
  locations        WorkLocation[]  @relation("UserLocations")
  requests         Request[]       @relation("UserRequests")         // Created by user
  assignedRequests Request[]       @relation("RequestAssignedEmployee")  // Assigned to employee
  notifications    Notification[]  @relation("UserNotifications")
  groups           Group[]         @relation("UserGroups")
  tags             Tag[]           @relation("UserTags")
  resources        Resource[]      @relation("UserResources")

  // === Audit ===
  createdBy        String?         @db.ObjectId
  updatedBy        String?         @db.ObjectId
  deletedAt        DateTime?

  // === Timestamps ===
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  // === Indexes ===
  @@index([email])
  @@index([role])
  @@index([status])
  @@index([company])
  @@index([deletedAt])
  @@index([createdAt])

  @@map("users")
}
```

### ContactPerson Type

```prisma
type ContactPerson {
  name     String
  lastname String
  phone    String
  email    String
}
```

## User Lifecycle State Machine

### State Transitions

```
REGISTRATION
    ↓
EMAIL_VERIFICATION (emailVerified = false → true)
    ↓
ONBOARDING (profileComplete = false → true)
    ↓
ACTIVE (status = ACTIVE)
    ↓
    ├──► SUSPENDED (Admin action) ──► ACTIVE (Admin reactivation)
    │
    └──► ANONYMIZED (GDPR request - TERMINAL STATE)
```

### Business Rules

1. **Registration**: Anyone can register, default role = CLIENT
2. **Email Verification**: Required before profile completion
3. **Onboarding**: Required before accessing main application
4. **Role Assignment**: Only ADMIN can change roles
5. **Status Changes**: Only ADMIN can suspend/activate users
6. **Anonymization**: Irreversible, GDPR compliance (right to be forgotten)
7. **Soft Delete**: ADMINs can soft delete (deletedAt set), recoverable

## Roles & Permissions Matrix

| Permission/Action | CLIENT | EMPLOYEE | ADMIN |
|-------------------|--------|----------|-------|
| **Authentication** |
| Register | ✅ Public | ✅ Public | ✅ Public |
| Login | ✅ | ✅ | ✅ |
| Reset Password | ✅ | ✅ | ✅ |
| **Profile Management** |
| View own profile | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ |
| **User Management** |
| View all users | ❌ | ✅ View list | ✅ Full access |
| View user details | ❌ Own only | ❌ | ✅ |
| Create users | ❌ | ❌ | ✅ |
| Edit user roles | ❌ | ❌ | ✅ |
| Edit user status | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| Bulk operations | ❌ | ❌ | ✅ |
| Export users | ❌ | ❌ | ✅ |
| Import users | ❌ | ❌ | ✅ |
| Impersonate users | ❌ | ❌ | ✅ |
| View activity log | ❌ | ❌ | ✅ |
| Reset user password | ❌ | ❌ | ✅ |
| **Request Management** |
| Create requests | ✅ | ❌ | ✅ |
| View all requests | ❌ Own | ✅ Assigned | ✅ All |
| Assign requests | ❌ | ❌ | ✅ |
| Complete requests | ❌ | ✅ Assigned | ✅ |
| Cancel requests | ✅ Request | ❌ | ✅ Approve |
| **Location Management** |
| Manage locations | ✅ Own | ❌ | ✅ All |
| **Notification Management** |
| View notifications | ✅ Own | ✅ Own | ✅ All |
| Manage preferences | ✅ Own | ✅ Own | ✅ |

## API Endpoints

### Existing Endpoints (Implemented)

#### Authentication & Registration
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/complete-profile
```

#### User CRUD (ADMIN/EMPLOYEE)
```
GET /users
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20, max: 100)
  - search: string (searches firstname, lastname, email, company)
  - role: Role (filter by role)
  - status: UserStatus (filter by status)
  - sortBy: 'createdAt' | 'email' | 'firstname' | 'company' (default: createdAt)
  - sortOrder: 'asc' | 'desc' (default: desc)

Response: 200 OK
{
  "data": [
    {
      "id": "...",
      "email": "user@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "phone": "+1234567890",
      "company": "Acme Inc",
      "role": "CLIENT",
      "status": "ACTIVE",
      "profileComplete": true,
      "emailVerified": true,
      "createdAt": "2025-11-20T10:00:00Z",
      "updatedAt": "2025-11-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

```
GET /users/:id
Authorization: ADMIN or own user

Response: 200 OK
{
  "id": "...",
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "phone": "+1234567890",
  "company": "Acme Inc",
  "address": "123 Main St, City, State 12345",
  "contactPerson": {
    "name": "Jane",
    "lastname": "Smith",
    "phone": "+0987654321",
    "email": "jane@example.com"
  },
  "role": "CLIENT",
  "status": "ACTIVE",
  "profileComplete": true,
  "emailVerified": true,
  "isTwoFactorEnabled": false,
  "groups": [],
  "tags": [],
  "createdAt": "2025-11-20T10:00:00Z",
  "updatedAt": "2025-12-01T15:30:00Z"
}
```

```
POST /users (ADMIN only)
Content-Type: application/json

Request Body:
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstname": "Jane",
  "lastname": "Doe",
  "phone": "+1234567890",
  "company": "New Company",
  "role": "EMPLOYEE",
  "address": "Optional address",
  "contactPerson": { ... }  // Optional
}

Response: 201 Created
{
  "id": "...",
  "email": "newuser@example.com",
  "firstname": "Jane",
  "lastname": "Doe",
  "role": "EMPLOYEE",
  "status": "ACTIVE",
  "profileComplete": false,
  "emailVerified": false,
  "createdAt": "2025-12-26T10:00:00Z"
}
```

```
PATCH /users/:id (ADMIN only)
Content-Type: application/json

Request Body (all optional):
{
  "firstname": "Updated",
  "lastname": "Name",
  "phone": "+9876543210",
  "company": "New Company",
  "address": "New address",
  "role": "ADMIN",
  "status": "SUSPENDED"
}

Response: 200 OK
```

```
DELETE /users/:id (ADMIN only - soft delete)
Response: 200 OK
{
  "message": "User deleted successfully"
}
```

#### User Statistics (ADMIN)
```
GET /users/stats
Response: 200 OK
{
  "total": 150,
  "byRole": {
    "CLIENT": 120,
    "EMPLOYEE": 25,
    "ADMIN": 5
  },
  "byStatus": {
    "ACTIVE": 140,
    "SUSPENDED": 8,
    "ANONYMIZED": 2
  },
  "recentRegistrations": 15,  // Last 7 days
  "emailVerified": 135,
  "profileComplete": 140
}
```

#### Profile Management (Own user)
```
GET /users/me
Authorization: Required (any role)

Response: 200 OK (same as GET /users/:id)
```

```
PATCH /users/me/profile
Content-Type: application/json

Request Body (all optional, role-based fields):
{
  "firstname": "Updated",
  "lastname": "Name",
  "phone": "+9876543210",
  "company": "Company",
  "address": "Address (CLIENT only)",
  "contactPerson": { ... }  // CLIENT only
}

Response: 200 OK
```

```
PATCH /users/me/password
Content-Type: application/json

Request Body:
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}

Validation:
  - currentPassword must match
  - newPassword: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
  - confirmPassword must match newPassword

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

#### Bulk Operations (ADMIN)
```
POST /users/bulk/delete
Content-Type: application/json

Request Body:
{
  "userIds": ["id1", "id2", "id3"]
}

Validation:
  - Cannot delete own account
  - Cannot delete last ADMIN

Response: 200 OK
{
  "deleted": 3,
  "failed": 0
}
```

```
POST /users/bulk/update-role
Content-Type: application/json

Request Body:
{
  "userIds": ["id1", "id2"],
  "role": "EMPLOYEE"
}

Response: 200 OK
{
  "updated": 2,
  "failed": 0
}
```

```
POST /users/bulk/update-status
Content-Type: application/json

Request Body:
{
  "userIds": ["id1", "id2"],
  "status": "SUSPENDED"
}

Response: 200 OK
{
  "updated": 2,
  "failed": 0
}
```

#### Admin Operations
```
POST /users/:id/reset-password (ADMIN only)
Content-Type: application/json

Request Body:
{
  "newPassword": "TempPass123!"
}

Response: 200 OK
{
  "message": "Password reset successfully"
}
```

```
PATCH /users/:id/tags (ADMIN only)
Content-Type: application/json

Request Body:
{
  "tagIds": ["tag1", "tag2"]
}

Response: 200 OK
```

### Missing Endpoints (To Implement)

#### User Export/Import
```
GET /users/export (ADMIN only)
Query Parameters:
  - format: 'csv' | 'excel' (default: csv)
  - filters: same as GET /users

Response: 200 OK
Content-Type: text/csv or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="users-export-2025-12-26.csv"
```

```
POST /users/import (ADMIN only)
Content-Type: multipart/form-data

Request Body:
  file: CSV or Excel file with columns: email, firstname, lastname, phone, company, role

Response: 200 OK
{
  "imported": 50,
  "failed": 3,
  "errors": [
    {
      "row": 5,
      "email": "invalid@",
      "error": "Invalid email format"
    }
  ]
}
```

#### Activity Log
```
GET /users/:id/activity-log (ADMIN only)
Query Parameters:
  - page: number
  - limit: number
  - startDate: ISO date
  - endDate: ISO date

Response: 200 OK
{
  "data": [
    {
      "id": "...",
      "userId": "...",
      "action": "LOGIN",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "metadata": { ... },
      "createdAt": "2025-12-26T10:00:00Z"
    }
  ],
  "meta": { ... }
}
```

#### User Impersonation
```
POST /users/:id/impersonate (ADMIN only)
Response: 200 OK
{
  "token": "impersonation-jwt-token",
  "originalAdminId": "admin-id",
  "impersonatedUserId": "user-id",
  "expiresAt": "2025-12-26T12:00:00Z"
}
```

```
POST /users/stop-impersonation
Response: 200 OK
{
  "token": "original-admin-jwt-token"
}
```

#### GDPR Compliance
```
POST /users/:id/anonymize (ADMIN only)
Response: 200 OK
{
  "message": "User anonymized successfully",
  "status": "ANONYMIZED"
}

Side effects:
  - Email replaced with "anonymized-{id}@deleted.local"
  - Personal data cleared (firstname, lastname, phone, address, contactPerson)
  - status = ANONYMIZED (permanent)
  - Relations preserved with anonymized user ID
```

```
GET /users/:id/data-export (ADMIN or own user)
Response: 200 OK
Content-Type: application/json
{
  "user": { ... },
  "requests": [ ... ],
  "locations": [ ... ],
  "notifications": [ ... ],
  "activityLog": [ ... ]
}
```

#### Advanced Search
```
POST /users/search (ADMIN/EMPLOYEE)
Content-Type: application/json

Request Body:
{
  "query": "search text",
  "filters": {
    "roles": ["CLIENT", "EMPLOYEE"],
    "statuses": ["ACTIVE"],
    "tags": ["tag1"],
    "groups": ["group1"],
    "dateRange": {
      "field": "createdAt",
      "from": "2025-01-01",
      "to": "2025-12-31"
    },
    "hasLocations": true,
    "hasRequests": true,
    "emailVerified": true,
    "profileComplete": true
  },
  "sort": {
    "field": "createdAt",
    "order": "desc"
  },
  "page": 1,
  "limit": 20
}

Response: 200 OK (same as GET /users)
```

#### User Messaging
```
POST /users/:id/send-message (ADMIN only)
Content-Type: application/json

Request Body:
{
  "subject": "Important Notice",
  "message": "Message body",
  "channel": "email" | "notification" | "both"
}

Response: 200 OK
{
  "sent": true,
  "channels": ["email", "notification"]
}
```

## tRPC Endpoints

### Existing tRPC Router

Located at: `packages/api/src/trpc/routers/user.router.ts`

```typescript
// Existing queries
user.getAll          // List all users with filters
user.getById         // Get user by ID
user.getStats        // User statistics
user.getMe           // Current user profile

// Existing mutations
user.create          // Create user (ADMIN)
user.update          // Update user (ADMIN)
user.delete          // Delete user (ADMIN)
user.updateProfile   // Update own profile
user.changePassword  // Change own password
user.bulkDelete      // Bulk delete (ADMIN)
user.bulkUpdateRole  // Bulk update role (ADMIN)
user.bulkUpdateStatus // Bulk update status (ADMIN)
user.resetPassword   // Admin password reset
user.updateTags      // Update user tags
```

### Missing tRPC Endpoints (Referenced in Frontend)

```typescript
// Required by admin/users/page.tsx
user.getFilteredUsers    // Advanced filtering
user.exportUsers         // Export to CSV/Excel
user.importUsers         // Import from CSV/Excel

// Required by admin/users/[userEmail]/page.tsx
user.getUserByEmail      // Get user by email
user.getActivityLog      // User activity history
user.impersonate         // Admin impersonation
user.stopImpersonation   // Stop impersonation
user.anonymizeUser       // GDPR anonymization
user.exportUserData      // GDPR data export
user.sendMessage         // Send message to user

// Required for advanced search
user.searchUsers         // Advanced search with complex filters
```

## Validation Rules

### CreateUserDto (Admin)

```typescript
{
  email: string (required, valid email, unique),
  password: string (required, min 8, 1 uppercase, 1 lowercase, 1 number, 1 special),
  firstname: string (required, min 2, max 50),
  lastname: string (required, min 2, max 50),
  phone: string (required, valid phone format),
  company: string (required, min 2, max 100),
  role: Role (required, one of: CLIENT, EMPLOYEE, ADMIN),
  address: string (optional, max 500),
  contactPerson: ContactPerson (optional, required if CLIENT role)
}
```

### UpdateUserDto (Admin)

```typescript
{
  firstname: string (optional, min 2, max 50),
  lastname: string (optional, min 2, max 50),
  phone: string (optional, valid phone),
  company: string (optional, min 2, max 100),
  address: string (optional, max 500),
  role: Role (optional),
  status: UserStatus (optional),
  contactPerson: ContactPerson (optional)
}
```

### UpdateProfileDto (Self-service)

```typescript
{
  firstname: string (optional, min 2, max 50),
  lastname: string (optional, min 2, max 50),
  phone: string (optional, valid phone),
  company: string (optional, min 2, max 100),
  address: string (optional, max 500, CLIENT only),
  contactPerson: ContactPerson (optional, CLIENT only)
}
```

### ChangePasswordDto

```typescript
{
  currentPassword: string (required),
  newPassword: string (required, min 8, complex),
  confirmPassword: string (required, must match newPassword)
}
```

### BulkOperationDto

```typescript
{
  userIds: string[] (required, min 1 item, max 100 items, valid ObjectIds)
}
```

## Frontend Components (Atomic Design)

### Atoms

#### UserAvatarAtom
```typescript
interface UserAvatarAtomProps {
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showInitials?: boolean;
}

// Displays user avatar with initials fallback
// Colors based on email hash for consistency
```

#### RoleBadgeAtom
```typescript
interface RoleBadgeAtomProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
}

// Color mapping:
// CLIENT: blue
// EMPLOYEE: green
// ADMIN: red
// LEAD: purple
```

#### StatusIndicatorAtom
```typescript
interface StatusIndicatorAtomProps {
  status: UserStatus;
  showLabel?: boolean;
}

// Status colors:
// ACTIVE: green dot
// SUSPENDED: yellow dot
// ANONYMIZED: gray dot
```

#### LastLoginAtom
```typescript
interface LastLoginAtomProps {
  timestamp: Date;
  format?: 'relative' | 'absolute';
}

// Displays: "2 hours ago" or "2025-12-26 10:30"
```

### Molecules

#### UserCardMolecule (Existing - Needs Enhancement)
```typescript
interface UserCardMoleculeProps {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
    status: UserStatus;
    company: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  selected?: boolean;
}
```

#### UserFilterMolecule (Existing)
```typescript
interface UserFilterMoleculeProps {
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

// Includes: search, role selector, status selector, date range
```

#### BulkActionsMolecule (Existing)
```typescript
interface BulkActionsMoleculeProps {
  selectedIds: string[];
  onBulkDelete: () => void;
  onBulkUpdateRole: (role: Role) => void;
  onBulkUpdateStatus: (status: UserStatus) => void;
  onClearSelection: () => void;
}
```

#### RoleSelectorMolecule
```typescript
interface RoleSelectorMoleculeProps {
  value: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
  showDescriptions?: boolean;
}

// Dropdown with role descriptions
```

#### PasswordStrengthMolecule (Existing - from ALI-115)
```typescript
interface PasswordStrengthMoleculeProps {
  password: string;
  showRequirements?: boolean;
}

// Visual strength indicator + requirements checklist
```

### Organisms

#### UserListOrganism (Existing - Partial)

**Location**: `packages/web/src/app/[lang]/(private)/admin/users/page.tsx` (inline)

**Current Features**:
- Search and filter (role, status)
- Pagination
- Bulk selection
- Bulk actions (delete, update role, update status)
- User cards with edit/delete actions

**Missing Features**:
- Export functionality
- Import wizard integration
- Advanced filters (tags, groups, date ranges)
- Column customization
- Sort by multiple fields

**Refactoring Needed**: Extract to `packages/web/src/components/organisms/user/UserListOrganism.tsx`

#### UserDetailOrganism (Existing)

**Location**: `packages/web/src/app/[lang]/(private)/admin/users/[userEmail]/page.tsx` (inline)

**Current Features**:
- Profile tab (view/edit)
- Security tab (password reset, 2FA)
- Products/Resources tab
- Groups tab
- Actions (suspend, activate, delete)

**Missing Features**:
- Activity log tab
- Impersonation button
- Anonymize user action
- Export user data
- Send message to user

#### UserCreateFormOrganism (Existing)

**Location**: `packages/web/src/app/[lang]/(private)/admin/users/create/page.tsx`

**Features**:
- Multi-step form
- Role selection
- Field validation
- Password generation
- Success/error handling

**Working Well**: No major changes needed

#### UserEditFormOrganism (Missing)

**To Create**: `packages/web/src/components/organisms/user/UserEditFormOrganism.tsx`

```typescript
interface UserEditFormOrganismProps {
  userId: string;
  initialData: User;
  onSuccess: () => void;
  onCancel: () => void;
}

// Features:
// - Edit all user fields
// - Role change with confirmation
// - Status change
// - Validation
// - Optimistic updates
```

#### ActivityTimelineOrganism (Missing)

**To Create**: `packages/web/src/components/organisms/user/ActivityTimelineOrganism.tsx`

```typescript
interface ActivityTimelineOrganismProps {
  userId: string;
  limit?: number;
}

// Features:
// - Login history
// - Profile updates
// - Role changes
// - Status changes
// - Request actions
// - Timeline visualization
```

#### UserExportDialogOrganism (Missing)

```typescript
interface UserExportDialogOrganismProps {
  filters: FilterState;
  onExport: (format: 'csv' | 'excel') => void;
  onClose: () => void;
}

// Features:
// - Format selection
// - Column selection
// - Preview
// - Download
```

#### UserImportWizardOrganism (Missing)

```typescript
interface UserImportWizardOrganismProps {
  onSuccess: (result: ImportResult) => void;
  onCancel: () => void;
}

// Features:
// - File upload (CSV/Excel)
// - Column mapping
// - Validation preview
// - Error handling
// - Progress tracking
```

## Frontend Pages

### /admin/users (List Page) - Existing

**Location**: `packages/web/src/app/[lang]/(private)/admin/users/page.tsx`

**Status**: ✅ Implemented (needs refactoring)

**Current Implementation**:
- Inline organism (should extract to UserListOrganism)
- Search, filters, pagination working
- Bulk actions working
- User cards with edit/delete

**Missing**:
- Export/import buttons
- Advanced filter panel
- Activity log quick view

### /admin/users/create (Create Page) - Existing

**Location**: `packages/web/src/app/[lang]/(private)/admin/users/create/page.tsx`

**Status**: ✅ Implemented

**Features**:
- Multi-step form
- Role selection
- Validation working
- Success redirect

**No changes needed**

### /admin/users/[userEmail] (Detail Page) - Existing

**Location**: `packages/web/src/app/[lang]/(private)/admin/users/[userEmail]/page.tsx`

**Status**: ⚠️ Partial (70% complete)

**Current Tabs**:
- Profile (edit inline)
- Security (password reset)
- Products/Resources
- Groups
- Actions sidebar

**Missing Tabs**:
- Activity log
- Requests history
- Notifications history

**Missing Actions**:
- Impersonate user
- Anonymize user
- Export user data
- Send message

## Integration Points

### With ALI-115 (Authentication)

**Integrated**:
- User registration creates User record
- Login uses User.email + User.password
- JWT contains userId, email, role
- Email verification updates User.emailVerified
- Password reset updates User.password

**Flow**:
```
Register → User.create(role=CLIENT, profileComplete=false)
  ↓
Email verification → User.update(emailVerified=true)
  ↓
Login → JWT(userId, role)
  ↓
Middleware checks profileComplete → Redirect to onboarding if false
```

### With ALI-116 (Profile Management)

**Integrated**:
- Profile completion updates User.profileComplete = true
- CLIENT users have address and contactPerson fields
- Role-based field filtering (CLIENT sees address, EMPLOYEE/ADMIN don't)

**Fields by Role**:
- **CLIENT**: All fields including address, contactPerson
- **EMPLOYEE**: firstname, lastname, phone, email, company (no address)
- **ADMIN**: Same as EMPLOYEE

### With ALI-119 (Requests)

**Integrated**:
- Request.userId → User (creator)
- Request.assignedToId → User (EMPLOYEE)
- Role-based request filtering:
  - CLIENT: sees own requests
  - EMPLOYEE: sees assigned requests
  - ADMIN: sees all requests

**User Management Impact**:
- Admin can assign requests to EMPLOYEE users
- Deleting user should handle request reassignment
- Suspending user should pause assigned requests

### With ALI-120 (Notifications)

**Integrated**:
- Welcome notification on user creation
- Password reset notification
- Role change notification
- Status change notification
- User events published via UserEventsService

### With ALI-117 (Locations)

**Integrated**:
- WorkLocation.userId → User
- CLIENTs can create multiple locations
- Locations shown in user profile

## Security Considerations

1. **Password Security**:
   - Bcrypt hashing (10 rounds)
   - Password complexity requirements enforced
   - Never return password in API responses

2. **Role-Based Access Control**:
   - JwtAuthGuard on all endpoints
   - RolesGuard enforces role requirements
   - @Roles() decorator per endpoint

3. **Field-Level Security**:
   - CLIENT-only fields filtered by role
   - Sensitive fields excluded from responses
   - Admin actions logged

4. **Bulk Operations**:
   - Cannot bulk delete own account
   - Cannot delete last ADMIN
   - Transaction-based (all-or-nothing)

5. **GDPR Compliance**:
   - Right to be forgotten (anonymization)
   - Data export for users
   - Consent tracking (terms field)

6. **Audit Trail**:
   - createdBy, updatedBy tracked
   - Action logging for admin operations
   - IP and user agent tracking

## Test Requirements

### Backend Unit Tests (95%+ coverage)

**Services** (~80 tests):
- UserFacadeService (15 tests)
- UserRepositoryService (20 tests)
- UserAuthenticationService (15 tests)
- UserAnalyticsService (10 tests)
- UserEventsService (10 tests)
- DTOs validation (10 tests)

**Controllers** (~30 tests):
- UsersController endpoints (all CRUD)
- Bulk operations
- Statistics
- Error handling

### Frontend Component Tests (90%+ coverage)

**Atoms** (10 tests):
- UserAvatarAtom rendering
- RoleBadgeAtom colors
- StatusIndicatorAtom states

**Molecules** (15 tests):
- UserCardMolecule actions
- UserFilterMolecule changes
- BulkActionsMolecule selections

**Organisms** (20 tests):
- UserListOrganism filtering, pagination
- UserDetailOrganism tabs
- UserCreateFormOrganism validation

### E2E Tests (Playwright) (25+ scenarios)

**User Management** (15 tests):
1. Admin creates new user (CLIENT, EMPLOYEE, ADMIN)
2. Admin edits user details
3. Admin changes user role
4. Admin suspends/activates user
5. Admin deletes user
6. Search users by name, email, company
7. Filter by role and status
8. Pagination works correctly
9. Bulk delete multiple users
10. Bulk update roles
11. Bulk update statuses
12. Export users to CSV
13. Export users to Excel
14. Import users from CSV
15. View user activity log

**Profile Management** (5 tests):
16. User edits own profile
17. User changes own password
18. Password complexity validation
19. CLIENT sees address fields
20. EMPLOYEE doesn't see address fields

**Integration** (5 tests):
21. Created user can login
22. Assigned employee sees requests
23. Suspended user cannot login
24. Anonymized user data cleared
25. User notifications sent on changes

## Performance Optimizations

1. **Database Indexes**:
   - email (unique, login queries)
   - role (filtering)
   - status (filtering)
   - company (search)
   - createdAt (sorting)

2. **Query Optimization**:
   - Pagination limit 100 max
   - Select only needed fields
   - Exclude password from all queries
   - Use lean() for read-only operations

3. **Caching** (Future):
   - User roles cached (5 min TTL)
   - Statistics cached (1 min TTL)
   - Invalidate on user updates

4. **Frontend**:
   - Virtualized lists for 1000+ users
   - Debounced search (500ms)
   - Optimistic updates
   - React Query caching

## Known Issues & TODOs

### Backend

1. **Missing tRPC Endpoints** (Priority: HIGH):
   - user.getFilteredUsers
   - user.exportUsers
   - user.importUsers
   - user.getUserByEmail
   - user.getActivityLog
   - user.impersonate
   - user.anonymizeUser
   - user.sendMessage

2. **Activity Logging** (Priority: MEDIUM):
   - No UserActivityLog model exists
   - Need to create activity tracking
   - Store: action, IP, user agent, metadata

3. **Email Integration** (Priority: LOW):
   - Welcome email on user creation
   - Role change notification email
   - Impersonation alert email

### Frontend

1. **Component Refactoring** (Priority: HIGH):
   - Extract UserListOrganism from page
   - Extract UserDetailOrganism from page
   - Create UserEditFormOrganism

2. **Missing Features** (Priority: MEDIUM):
   - Export/Import UI
   - Activity timeline
   - Advanced filters panel
   - Impersonation UI

3. **Testing** (Priority: MEDIUM):
   - E2E tests for bulk operations
   - Visual regression tests
   - Accessibility tests

## Next Steps

1. **Implement Missing tRPC Endpoints** (2-3 days)
   - Export/import functionality
   - Activity log
   - Impersonation
   - GDPR anonymization

2. **Refactor Frontend Components** (1-2 days)
   - Extract organisms from pages
   - Create missing organisms
   - Improve component reusability

3. **Add Activity Logging** (1 day)
   - Create UserActivityLog model
   - Log admin actions
   - Display in activity timeline

4. **Testing** (2 days)
   - Complete E2E test suite
   - Achieve 95%+ backend coverage
   - Achieve 90%+ frontend coverage

5. **Documentation** (1 day)
   - API documentation
   - Component Storybook stories
   - User guide for admins

**Total Estimated Completion Time**: 7-9 days

## References

- [Jira Issue](https://alkitu.atlassian.net/browse/ALI-122)
- [ALI-115 Spec](../ALI-115/ALI-115-auth-spec.md) (Authentication integration)
- [ALI-116 Spec](../ALI-116/ALI-116-final-spec.md) (Profile integration)
- [ALI-119 Spec](../ALI-119/ALI-119-spec.md) (Requests integration)
- [Prisma Schema](../../../packages/api/prisma/schema.prisma)
- [UsersModule](../../../packages/api/src/users/)
- [Admin Users Pages](../../../packages/web/src/app/[lang]/(private)/admin/users/)

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
**Author**: Luis Eduardo Urdaneta Martucci
**Status**: Technical Specification Complete - Implementation 60% Complete
