# Current Application Sitemap (Implemented)

## Overview

Este documento refleja el **estado actual** de todas las rutas implementadas en la aplicación web (`packages/web`). Incluye tanto páginas (UI routes) como endpoints de API.

**Generado el**: 2025-12-27
**Total de Páginas**: 56 páginas
**Total de API Endpoints**: 29 endpoints
**Framework**: Next.js 15 (App Router)
**Internacionalización**: Sí (`[lang]` route segment)

---

## 🌐 Public Routes (10 páginas)

### Landing & Home

| Route | Description | File |
|-------|-------------|------|
| `/:lang` | Landing Page / Home | `[lang]/page.tsx` |

### Authentication (9 páginas)

| Route | Description | File |
|-------|-------------|------|
| `/{lang}/auth/login` | Sign In Page | `[lang]/(public)/auth/login/page.tsx` |
| `/{lang}/auth/register` | Sign Up / Registration | `[lang]/(public)/auth/register/page.tsx` |
| `/{lang}/auth/forgot-password` | Forgot Password (Request) | `[lang]/(public)/auth/forgot-password/page.tsx` |
| `/{lang}/auth/reset-password` | Reset Password (With Token) | `[lang]/(public)/auth/reset-password/page.tsx` |
| `/{lang}/auth/new-password` | Set New Password | `[lang]/(public)/auth/new-password/page.tsx` |
| `/{lang}/auth/email-login` | Email Magic Link Login | `[lang]/(public)/auth/email-login/page.tsx` |
| `/{lang}/auth/verify-login-code` | Verify Login Code | `[lang]/(public)/auth/verify-login-code/page.tsx` |
| `/{lang}/auth/verify-request` | Email Verification Request | `[lang]/(public)/auth/verify-request/page.tsx` |
| `/{lang}/auth/new-verification` | New Email Verification | `[lang]/(public)/auth/new-verification/page.tsx` |
| `/{lang}/auth/auth-error` | Authentication Error Page | `[lang]/(public)/auth/auth-error/page.tsx` |

### Utility Pages

| Route | Description | File |
|-------|-------------|------|
| `/{lang}/unauthorized` | Unauthorized Access Page | `[lang]/(public)/unauthorized/page.tsx` |
| `/{lang}/design-system` | Design System Documentation | `[lang]/(public)/design-system/page.tsx` |
| `/{lang}/test` | Test Page | `[lang]/(public)/test/page.tsx` |

---

## 🔐 Private Routes (46 páginas)

### Shared Private Routes (5 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/dashboard` | Universal Dashboard (Role Redirect) | All Authenticated | `[lang]/(private)/dashboard/page.tsx` |
| `/{lang}/profile` | User Profile Settings | All Authenticated | `[lang]/(private)/profile/page.tsx` |
| `/{lang}/onboarding` | Complete Profile Onboarding | All Authenticated | `[lang]/(private)/onboarding/page.tsx` |
| `/{lang}/locations` | Work Locations Management | All Authenticated | `[lang]/(private)/locations/page.tsx` |
| `/{lang}/requests` | Requests List (Shared) | All Authenticated | `[lang]/(private)/requests/page.tsx` |
| `/{lang}/requests/:id` | Request Detail (Shared) | All Authenticated | `[lang]/(private)/requests/[id]/page.tsx` |
| `/{lang}/requests/new` | Create New Request (Shared) | All Authenticated | `[lang]/(private)/requests/new/page.tsx` |
| `/{lang}/services/:serviceId/request` | Create Request for Service | All Authenticated | `[lang]/(private)/services/[serviceId]/request/page.tsx` |

### Client Routes (7 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/client/dashboard` | Client Dashboard | **Client** | `[lang]/(private)/client/dashboard/page.tsx` |
| `/{lang}/client/profile` | Client Profile Settings | **Client** | `[lang]/(private)/client/profile/page.tsx` |
| `/{lang}/client/onboarding` | Client Profile Completion | **Client** | `[lang]/(private)/client/onboarding/page.tsx` |
| `/{lang}/client/notifications` | Client Notifications Center | **Client** | `[lang]/(private)/client/notifications/page.tsx` |
| `/{lang}/client/requests/new` | Create New Request | **Client** | `[lang]/(private)/client/requests/new/page.tsx` |
| `/{lang}/client/requests/new/success` | Request Submitted Success | **Client** | `[lang]/(private)/client/requests/new/success/page.tsx` |
| `/{lang}/client/requests/:requestId` | Request Detail View | **Client** | `[lang]/(private)/client/requests/[requestId]/page.tsx` |

### Employee Routes (3 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/employee/dashboard` | Employee Dashboard | **Employee** | `[lang]/(private)/employee/dashboard/page.tsx` |
| `/{lang}/employee/notifications` | Employee Notifications | **Employee** | `[lang]/(private)/employee/notifications/page.tsx` |
| `/{lang}/employee/requests` | Assigned Requests List | **Employee** | `[lang]/(private)/employee/requests/page.tsx` |

### Admin Routes (31 páginas)

#### Dashboard & Overview

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin` | Admin Home / Overview | **Admin** | `[lang]/(private)/admin/page.tsx` |
| `/{lang}/admin/dashboard` | Admin Dashboard | **Admin** | `[lang]/(private)/admin/dashboard/page.tsx` |

#### Catalog Management (2 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin/catalog/categories` | Categories Management | **Admin** | `[lang]/(private)/admin/catalog/categories/page.tsx` |
| `/{lang}/admin/catalog/services` | Services Catalog | **Admin** | `[lang]/(private)/admin/catalog/services/page.tsx` |

#### Channels Management (2 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin/channels` | Channels List | **Admin** | `[lang]/(private)/admin/channels/page.tsx` |
| `/{lang}/admin/channels/:channelId` | Channel Detail & Edit | **Admin** | `[lang]/(private)/admin/channels/[channelId]/page.tsx` |

#### Chat Management (3 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin/chat` | Chat Conversations List | **Admin** | `[lang]/(private)/admin/chat/page.tsx` |
| `/{lang}/admin/chat/:conversationId` | Conversation Detail | **Admin** | `[lang]/(private)/admin/chat/[conversationId]/page.tsx` |
| `/{lang}/admin/chat/analytics` | Chat Analytics Dashboard | **Admin** | `[lang]/(private)/admin/chat/analytics/page.tsx` |

#### Email Templates (1 página)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin/email-templates` | Email Templates Manager | **Admin** | `[lang]/(private)/admin/email-templates/page.tsx` |

#### Notifications Management (3 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin/notifications` | Notifications Center | **Admin** | `[lang]/(private)/admin/notifications/page.tsx` |
| `/{lang}/admin/notifications/analytics` | Notifications Analytics | **Admin** | `[lang]/(private)/admin/notifications/analytics/page.tsx` |
| `/{lang}/admin/notifications/preferences` | Notification Preferences | **Admin** | `[lang]/(private)/admin/notifications/preferences/page.tsx` |

#### Requests Management (2 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin/requests` | All Requests List | **Admin** | `[lang]/(private)/admin/requests/page.tsx` |
| `/{lang}/admin/requests/:id` | Request Detail & Management | **Admin** | `[lang]/(private)/admin/requests/[id]/page.tsx` |

#### Settings (3 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin/settings` | Settings Overview | **Admin** | `[lang]/(private)/admin/settings/page.tsx` |
| `/{lang}/admin/settings/chatbot` | Chatbot Configuration | **Admin** | `[lang]/(private)/admin/settings/chatbot/page.tsx` |
| `/{lang}/admin/settings/themes` | Theme Management | **Admin** | `[lang]/(private)/admin/settings/themes/page.tsx` |

#### Users Management (3 páginas)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/admin/users` | Users List (Team & Clients) | **Admin** | `[lang]/(private)/admin/users/page.tsx` |
| `/{lang}/admin/users/create` | Create New User | **Admin** | `[lang]/(private)/admin/users/create/page.tsx` |
| `/{lang}/admin/users/:userEmail` | User Detail & Edit | **Admin** | `[lang]/(private)/admin/users/[userEmail]/page.tsx` |

### Chat Popup (1 página)

| Route | Description | Access | File |
|-------|-------------|--------|------|
| `/{lang}/chat/popup/:conversationId` | Chat Popup Window | All Authenticated | `[lang]/chat/popup/[conversationId]/page.tsx` |

---

## 🔌 API Routes (29 endpoints)

### Authentication API (10 endpoints)

| Method | Endpoint | Description | File |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | User Registration | `api/auth/register/route.ts` |
| POST | `/api/auth/login` | User Login | `api/auth/login/route.ts` |
| POST | `/api/auth/logout` | User Logout | `api/auth/logout/route.ts` |
| POST | `/api/auth/refresh` | Refresh Access Token | `api/auth/refresh/route.ts` |
| POST | `/api/auth/forgot-password` | Request Password Reset | `api/auth/forgot-password/route.ts` |
| POST | `/api/auth/reset-password` | Reset Password with Token | `api/auth/reset-password/route.ts` |
| POST | `/api/auth/verify-email` | Verify Email Address | `api/auth/verify-email/route.ts` |
| POST | `/api/auth/send-login-code` | Send Login Code (Magic Link) | `api/auth/send-login-code/route.ts` |
| POST | `/api/auth/verify-login-code` | Verify Login Code | `api/auth/verify-login-code/route.ts` |
| PUT | `/api/auth/complete-profile` | Complete User Profile | `api/auth/complete-profile/route.ts` |

### Categories API (2 endpoints)

| Method | Endpoint | Description | File |
|--------|----------|-------------|------|
| GET/POST | `/api/categories` | List/Create Categories | `api/categories/route.ts` |
| GET/PUT/DELETE | `/api/categories/:id` | Get/Update/Delete Category | `api/categories/[id]/route.ts` |

### Locations API (2 endpoints)

| Method | Endpoint | Description | File |
|--------|----------|-------------|------|
| GET/POST | `/api/locations` | List/Create Work Locations | `api/locations/route.ts` |
| GET/PUT/DELETE | `/api/locations/:id` | Get/Update/Delete Location | `api/locations/[id]/route.ts` |

### Notifications API (3 endpoints - Push)

| Method | Endpoint | Description | File |
|--------|----------|-------------|------|
| POST | `/api/notifications/push/subscribe` | Subscribe to Push Notifications | `api/notifications/push/subscribe/route.ts` |
| POST | `/api/notifications/push/unsubscribe` | Unsubscribe from Push | `api/notifications/push/unsubscribe/route.ts` |
| POST | `/api/notifications/push/test` | Test Push Notification | `api/notifications/push/test/route.ts` |

### Requests API (6 endpoints)

| Method | Endpoint | Description | File |
|--------|----------|-------------|------|
| GET/POST | `/api/requests` | List/Create Requests | `api/requests/route.ts` |
| GET/PUT/DELETE | `/api/requests/:id` | Get/Update/Delete Request | `api/requests/[id]/route.ts` |
| POST | `/api/requests/:id/assign` | Assign Request to Employee | `api/requests/[id]/assign/route.ts` |
| POST | `/api/requests/:id/cancel` | Cancel Request | `api/requests/[id]/cancel/route.ts` |
| POST | `/api/requests/:id/complete` | Complete Request | `api/requests/[id]/complete/route.ts` |

### Services API (2 endpoints)

| Method | Endpoint | Description | File |
|--------|----------|-------------|------|
| GET/POST | `/api/services` | List/Create Services | `api/services/route.ts` |
| GET/PUT/DELETE | `/api/services/:id` | Get/Update/Delete Service | `api/services/[id]/route.ts` |

### Users API (3 endpoints)

| Method | Endpoint | Description | File |
|--------|----------|-------------|------|
| GET/PUT | `/api/users/profile` | Get/Update Own Profile | `api/users/profile/route.ts` |
| GET | `/api/users/me/role` | Get Current User Role | `api/users/me/role/route.ts` |
| GET | `/api/users/filtered` | Get Filtered Users List | `api/users/filtered/route.ts` |

### Translations API (1 endpoint)

| Method | Endpoint | Description | File |
|--------|----------|-------------|------|
| GET | `/api/translations` | Get Translation Strings | `api/translations/route.ts` |

---

## 📊 Route Statistics

### Pages by Access Level

| Access Level | Count | Percentage |
|--------------|-------|------------|
| **Admin** | 21 | 37.5% |
| **Client** | 7 | 12.5% |
| **Employee** | 3 | 5.4% |
| **Shared Private** | 8 | 14.3% |
| **Public** | 13 | 23.2% |
| **Other** | 4 | 7.1% |
| **TOTAL** | **56** | **100%** |

### API Endpoints by Category

| Category | Count | Percentage |
|----------|-------|------------|
| **Authentication** | 10 | 34.5% |
| **Requests** | 6 | 20.7% |
| **Users** | 3 | 10.3% |
| **Notifications** | 3 | 10.3% |
| **Categories** | 2 | 6.9% |
| **Locations** | 2 | 6.9% |
| **Services** | 2 | 6.9% |
| **Translations** | 1 | 3.4% |
| **TOTAL** | **29** | **100%** |

---

## 🗺️ Complete Route Tree

```
/:lang (Landing)
└── {lang}/
    ├── auth/ (Public Authentication)
    │   ├── login
    │   ├── register
    │   ├── forgot-password
    │   ├── reset-password
    │   ├── new-password
    │   ├── email-login
    │   ├── verify-login-code
    │   ├── verify-request
    │   ├── new-verification
    │   └── auth-error
    │
    ├── (Private - Shared)
    │   ├── dashboard
    │   ├── profile
    │   ├── onboarding
    │   ├── locations
    │   ├── requests/
    │   │   ├── (list)
    │   │   ├── :id
    │   │   └── new
    │   └── services/:serviceId/request
    │
    ├── client/ (Client-only)
    │   ├── dashboard
    │   ├── profile
    │   ├── onboarding
    │   ├── notifications
    │   └── requests/
    │       ├── new
    │       ├── new/success
    │       └── :requestId
    │
    ├── employee/ (Employee-only)
    │   ├── dashboard
    │   ├── notifications
    │   └── requests
    │
    ├── admin/ (Admin-only)
    │   ├── (overview)
    │   ├── dashboard
    │   ├── catalog/
    │   │   ├── categories
    │   │   └── services
    │   ├── channels/
    │   │   ├── (list)
    │   │   └── :channelId
    │   ├── chat/
    │   │   ├── (list)
    │   │   ├── :conversationId
    │   │   └── analytics
    │   ├── email-templates
    │   ├── notifications/
    │   │   ├── (list)
    │   │   ├── analytics
    │   │   └── preferences
    │   ├── requests/
    │   │   ├── (list)
    │   │   └── :id
    │   ├── settings/
    │   │   ├── (overview)
    │   │   ├── chatbot
    │   │   └── themes
    │   └── users/
    │       ├── (list)
    │       ├── create
    │       └── :userEmail
    │
    ├── chat/popup/:conversationId
    │
    └── (Public Utility)
        ├── design-system
        ├── test
        └── unauthorized
```

---

## 🔒 Access Control Summary

| Route Pattern | Client | Employee | Admin | Public |
|---------------|--------|----------|-------|--------|
| `/:lang` | ✅ | ✅ | ✅ | ✅ |
| `/{lang}/auth/*` | - | - | - | ✅ |
| `/{lang}/dashboard` | ✅ | ✅ | ✅ | - |
| `/{lang}/profile` | ✅ | ✅ | ✅ | - |
| `/{lang}/onboarding` | ✅ | ✅ | ✅ | - |
| `/{lang}/client/*` | ✅ | - | - | - |
| `/{lang}/employee/*` | - | ✅ | - | - |
| `/{lang}/admin/*` | - | - | ✅ | - |
| `/{lang}/locations` | ✅ | ✅ | ✅ | - |
| `/{lang}/requests` | ✅ | ✅ | ✅ | - |

---

## 🆕 New Features Implemented

### Advanced Features (Not in Original Backlog)

1. **Channels Management** (Admin)
   - Channel creation and configuration
   - Channel detail management

2. **Chat System** (Admin)
   - Real-time chat conversations
   - Chat analytics dashboard
   - Chat popup windows

3. **Settings Management** (Admin)
   - Chatbot configuration
   - Theme customization

4. **Push Notifications**
   - Subscribe/Unsubscribe to push
   - Test push notifications

5. **Multi-language Support**
   - Dynamic language routing (`[lang]`)
   - Translation API endpoint

---

## 📝 Implementation Status vs Backlog

### ✅ Implemented from Backlog

- **Authentication Flow** (ALI-21, 22, 23) - ✅ **COMPLETE**
  - Login, Register, Password Reset + Extended flows
- **Dashboards** (ALI-25, 26, 28) - ✅ **COMPLETE**
  - Client, Employee, Admin dashboards
- **Profile Management** (ALI-45, 46, 47) - ✅ **COMPLETE**
  - Role-based profile pages
- **Onboarding** (ALI-54) - ✅ **COMPLETE**
  - Client onboarding flow
- **Requests** (ALI-36-44) - ✅ **COMPLETE**
  - Full request lifecycle
- **Notifications** (ALI-33, 34, 35) - ✅ **COMPLETE**
  - Role-based notification centers
- **Users Management** (ALI-58) - ✅ **COMPLETE**
  - Team & clients management
- **Email Templates** (ALI-57) - ✅ **PARTIAL**
  - Management page exists
- **Services Catalog** (ALI-56) - ✅ **COMPLETE**
  - Categories + Services management

### ⏳ Not Yet Implemented

- **Landing Page** (ALI-53) - ❌ **MISSING**
  - Currently redirects to dashboard
- **Calendar** (ALI-55) - ❌ **MISSING**
  - Execution schedule planner

---

## 🔗 Related Documentation

- [Planned Sitemap](./sitemap.md) - Future features roadmap
- [Jira Backlog](../../jira/backlog/README.md) - Development tasks
- [Database Schema](../../packages/api/prisma/schema.prisma)
- [API Documentation](../../packages/api/)
- [Frontend Components](../../packages/web/src/components/)

---

**Last Updated**: 2025-12-27
**Version**: 1.0.0
**Maintained By**: Development Team
**Status**: 🟢 Production Ready
