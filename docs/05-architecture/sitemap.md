# Application Sitemap

## Overview

Este sitemap documenta todas las rutas de la aplicación ALIANZA MANAGEMENT APP, organizadas por jerarquía y rol de acceso. Cada ruta está vinculada a su correspondiente issue de Jira (ALI-XX).

**Total de Rutas**: 30
**Roles**: Client, Employee, Admin, Global (Public)

---

## 🌐 Public Routes (Global Access)

### Landing & Authentication

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/` | Landing Page - Welcome & Access Entry | Global | [ALI-53](../../jira/backlog/ALI-53.md) |
| `/register` | Create Your Account | Global | [ALI-21](../../jira/backlog/ALI-21.md) |
| `/login` | Sign In to Your Account | Global | [ALI-22](../../jira/backlog/ALI-22.md) |
| `/password-reset` | Recover Your Access | Global | [ALI-23](../../jira/backlog/ALI-23.md) |

---

## 🔐 Authenticated Routes

### Dashboard (Role-based views)

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/app/dashboard` | My Service Requests | **Client** | [ALI-25](../../jira/backlog/ALI-25.md) |
| `/app/dashboard` | Assigned Tasks & Ongoing Jobs | **Employee** | [ALI-26](../../jira/backlog/ALI-26.md) |
| `/app/dashboard` | Operations & Metrics Overview | **Admin** | [ALI-28](../../jira/backlog/ALI-28.md) |

### Profile Management

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/app/profile` | My Account Settings | **Client** | [ALI-45](../../jira/backlog/ALI-45.md) |
| `/app/profile` | My Account Settings | **Employee** | [ALI-46](../../jira/backlog/ALI-46.md) |
| `/app/profile` | My Account Settings | **Admin** | [ALI-47](../../jira/backlog/ALI-47.md) |
| `/app/profile/onboarding` | Complete Your Profile (Onboarding) | **Client** | [ALI-54](../../jira/backlog/ALI-54.md) |

### Notifications

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/app/notifications` | My Notifications Center | **Client** | [ALI-33](../../jira/backlog/ALI-33.md) |
| `/app/notifications` | My Notifications Center | **Employee** | [ALI-34](../../jira/backlog/ALI-34.md) |
| `/app/notifications` | My Notifications Center | **Admin** | [ALI-35](../../jira/backlog/ALI-35.md) |

---

## 📝 Service Requests (Client Workflow)

### New Request Creation Flow

| Route | Step | Description | Role | Issue |
|-------|------|-------------|------|-------|
| `/app/requests/new/location` | Step 1 | Choose Location | **Client** | [ALI-36](../../jira/backlog/ALI-36.md) |
| `/app/requests/new/service` | Step 2 | Select Service | **Client** | [ALI-37](../../jira/backlog/ALI-37.md) |
| `/app/requests/new/template` | Step 3 | Service Details Form | **Client** | [ALI-38](../../jira/backlog/ALI-38.md) |
| `/app/requests/new/schedule` | Step 4 | Schedule Execution | **Client** | [ALI-39](../../jira/backlog/ALI-39.md) |
| `/app/requests/new/success` | Confirmation | Submitted Successfully | **Client** | [ALI-40](../../jira/backlog/ALI-40.md) |

### Request Detail (Role-based views)

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/app/requests/:requestId` | Request Overview & Status | **Client** | [ALI-41](../../jira/backlog/ALI-41.md) |
| `/app/requests/:requestId` | Job Details & Completion | **Employee** | [ALI-43](../../jira/backlog/ALI-43.md) |
| `/app/requests/:requestId` | Request Management & Assignment | **Admin** | [ALI-44](../../jira/backlog/ALI-44.md) |

---

## ⚙️ Admin Management

### Calendar

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/app/calendar` | Execution Schedule Planner | **Admin** | [ALI-55](../../jira/backlog/ALI-55.md) |

### Services Catalog

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/app/services` | Service Types & Templates Management (List) | **Admin** | [ALI-56](../../jira/backlog/ALI-56.md) |
| `/app/services/:serviceId` | Service Detail & Edit | **Admin** | [ALI-56](../../jira/backlog/ALI-56.md) |

### Email Templates

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/app/email-templates` | Email Templates Manager (List) | **Admin** | [ALI-57](../../jira/backlog/ALI-57.md) |
| `/app/email-templates/:templateId` | Email Template Detail & Edit | **Admin** | [ALI-57](../../jira/backlog/ALI-57.md) |

### Users Management

| Route | Description | Role | Issue |
|-------|-------------|------|-------|
| `/app/users` | Team & Clients Management (List) | **Admin** | [ALI-58](../../jira/backlog/ALI-58.md) |
| `/app/users/:userId` | User Detail & Edit | **Admin** | [ALI-58](../../jira/backlog/ALI-58.md) |

---

## 📊 Route Summary by Role

### Client (8 unique routes)
- Dashboard
- Profile & Onboarding
- Notifications
- New Request Flow (5 steps)
- Request Detail View

### Employee (4 unique routes)
- Dashboard
- Profile
- Notifications
- Request Detail (Job Completion)

### Admin (13 unique routes)
- Dashboard
- Profile
- Notifications
- Request Management
- Calendar
- Services Catalog (2 routes)
- Email Templates (2 routes)
- Users Management (2 routes)

### Global/Public (4 routes)
- Landing Page
- Register
- Login
- Password Reset

---

## 🗺️ Complete Route Hierarchy

```
/                                           → Landing Page [Global] (ALI-53)
├── register                                → Register [Global] (ALI-21)
├── login                                   → Login [Global] (ALI-22)
├── password-reset                          → Password Reset [Global] (ALI-23)
└── app/
    ├── dashboard                           → Dashboard [Client/Employee/Admin] (ALI-25/26/28)
    ├── profile/
    │   ├── (index)                         → Profile Settings [Client/Employee/Admin] (ALI-45/46/47)
    │   └── onboarding                      → Complete Profile [Client] (ALI-54)
    ├── notifications                       → Notifications Center [Client/Employee/Admin] (ALI-33/34/35)
    ├── requests/
    │   ├── new/
    │   │   ├── location                    → New Request Step 1 [Client] (ALI-36)
    │   │   ├── service                     → New Request Step 2 [Client] (ALI-37)
    │   │   ├── template                    → New Request Step 3 [Client] (ALI-38)
    │   │   ├── schedule                    → New Request Step 4 [Client] (ALI-39)
    │   │   └── success                     → Request Submitted [Client] (ALI-40)
    │   └── :requestId                      → Request Detail [Client/Employee/Admin] (ALI-41/43/44)
    ├── calendar                            → Schedule Planner [Admin] (ALI-55)
    ├── services/
    │   ├── (index)                         → Services List [Admin] (ALI-56)
    │   └── :serviceId                      → Service Detail [Admin] (ALI-56)
    ├── email-templates/
    │   ├── (index)                         → Email Templates List [Admin] (ALI-57)
    │   └── :templateId                     → Email Template Detail [Admin] (ALI-57)
    └── users/
        ├── (index)                         → Users List [Admin] (ALI-58)
        └── :userId                         → User Detail [Admin] (ALI-58)
```

---

## 🔒 Access Control Matrix

| Route Pattern | Client | Employee | Admin | Public |
|---------------|--------|----------|-------|--------|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/register` | - | - | - | ✅ |
| `/login` | - | - | - | ✅ |
| `/password-reset` | - | - | - | ✅ |
| `/app/dashboard` | ✅ | ✅ | ✅ | - |
| `/app/profile` | ✅ | ✅ | ✅ | - |
| `/app/profile/onboarding` | ✅ | - | - | - |
| `/app/notifications` | ✅ | ✅ | ✅ | - |
| `/app/requests/new/*` | ✅ | - | - | - |
| `/app/requests/:id` | ✅ | ✅ | ✅ | - |
| `/app/calendar` | - | - | ✅ | - |
| `/app/services` | - | - | ✅ | - |
| `/app/email-templates` | - | - | ✅ | - |
| `/app/users` | - | - | ✅ | - |

---

## 🎯 Implementation Priority

### Phase 1: Foundation (High Priority)
1. **Public Routes** (ALI-21, 22, 23, 53)
   - Landing, Register, Login, Password Reset
2. **Profile & Onboarding** (ALI-45, 46, 47, 54)
   - User profile management and onboarding flow

### Phase 2: Core Features (Medium Priority)
3. **Dashboards** (ALI-25, 26, 28)
   - Role-based dashboard views
4. **Request Creation** (ALI-36, 37, 38, 39, 40)
   - Complete request workflow for clients
5. **Request Management** (ALI-41, 43, 44)
   - Request detail views for all roles

### Phase 3: Enhanced Features (Low Priority)
6. **Notifications** (ALI-33, 34, 35)
   - Notification center for all roles
7. **Admin Tools** (ALI-55, 56, 57, 58)
   - Calendar, Services, Email Templates, Users Management

---

## 📝 Notes

- **Shared Routes**: Some routes like `/app/dashboard`, `/app/profile`, `/app/notifications`, and `/app/requests/:requestId` render different content based on the authenticated user's role
- **Client-Only Routes**: The new request flow (`/app/requests/new/*`) is exclusively for client users
- **Admin-Only Routes**: Calendar, Services, Email Templates, and Users Management are restricted to admin users only
- **Dynamic Parameters**: Routes with `:paramName` are dynamic and require a valid ID (e.g., `:requestId`, `:serviceId`, `:templateId`, `:userId`)

---

## 🔗 Related Documentation

- [Jira Backlog](../../jira/backlog/README.md)
- [Database Schema](../../packages/api/prisma/schema.prisma)
- [API Routes](../../packages/api/src/)
- [Frontend Pages](../../packages/web/src/app/)

---

**Last Updated**: 2025-12-26
**Total Routes**: 30
**Maintained By**: Development Team
