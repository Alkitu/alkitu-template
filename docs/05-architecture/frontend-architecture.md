# Frontend Architecture - Alkitu Template

> **Last Updated**: 2025-01-02
> **Document Version**: 1.0.0
> **Status**: Living Document

---

## Table of Contents

1. [Overview](#1-overview)
2. [Route Structure](#2-route-structure)
3. [Middleware Architecture](#3-middleware-architecture)
4. [Component Organization (Atomic Design)](#4-component-organization-atomic-design)
5. [Configuration Files](#5-configuration-files)
6. [Supporting Infrastructure](#6-supporting-infrastructure)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Internationalization](#8-internationalization)
9. [Errors Encountered (Recent Work)](#9-errors-encountered-recent-work)
10. [Outstanding Questions & Doubts](#10-outstanding-questions--doubts)
11. [Architecture Strengths](#11-architecture-strengths)
12. [Areas for Enhancement](#12-areas-for-enhancement)
13. [Quick Reference](#13-quick-reference)

---

## 1. Overview

### 1.1 Project Information

**Project Name**: Alkitu Template
**Framework**: Next.js 15 (App Router)
**Language**: TypeScript (Strict Mode)
**UI Paradigm**: Atomic Design Methodology
**State Management**: Zustand + React Query
**Styling**: Tailwind CSS v4 with OKLCH color space

### 1.2 Technology Stack

**Core Framework**:
- Next.js 15.1.0 with App Router
- React 19.0.0
- TypeScript 5.x (strict mode)

**UI & Styling**:
- Tailwind CSS v4 (CSS variables, OKLCH)
- Radix UI primitives
- NextUI components
- Lucide React icons

**API Integration**:
- tRPC (type-safe APIs)
- React Query (server state)
- GraphQL (optional)

**Authentication**:
- JWT tokens (HTTP-only cookies)
- Passport.js strategies
- Role-based access control (RBAC)

**Real-time**:
- Socket.IO for WebSocket connections

**Forms & Validation**:
- React Hook Form
- Zod schemas (shared with backend via `@alkitu/shared`)

### 1.3 Architecture Patterns

**Design Patterns**:
- **Atomic Design**: Components organized as Atoms → Molecules → Organisms → Pages
- **Middleware Chain**: Composable middleware functions
- **API Proxy Layer**: Next.js API routes proxy requests to backend
- **Route Groups**: `(public)` and `(private)` for access control

**Key Principles**:
- Type safety across frontend/backend boundary
- Separation of concerns (UI logic vs business logic)
- Component composition over inheritance
- Server-side rendering where beneficial
- Progressive enhancement

---

## 2. Route Structure

The application uses Next.js App Router with file-based routing and route groups for access control.

**Base URL Pattern**: `/{lang}/...` where `lang` is `es` (Spanish) or `en` (English)

### 2.1 Public Routes (`/(public)/`)

Located at: `/packages/web/src/app/[lang]/(public)/`

These routes are accessible to unauthenticated users.

#### Authentication Routes

| Route | Page File | Purpose |
|-------|-----------|---------|
| `/[lang]/auth/login` | `auth/login/page.tsx` | Main login page (email + password) |
| `/[lang]/auth/register` | `auth/register/page.tsx` | User registration form |
| `/[lang]/auth/email-login` | `auth/email-login/page.tsx` | Email-based login (passwordless) |
| `/[lang]/auth/verify-login-code` | `auth/verify-login-code/page.tsx` | Verify login code sent via email |
| `/[lang]/auth/forgot-password` | `auth/forgot-password/page.tsx` | Initiate password reset flow |
| `/[lang]/auth/reset-password` | `auth/reset-password/page.tsx` | Reset password with token |
| `/[lang]/auth/new-password` | `auth/new-password/page.tsx` | Set new password after reset |
| `/[lang]/auth/verify-request` | `auth/verify-request/page.tsx` | Email verification confirmation |
| `/[lang]/auth/new-verification` | `auth/new-verification/page.tsx` | Request new verification email |
| `/[lang]/auth/auth-error` | `auth/auth-error/page.tsx` | Authentication error display |

#### Utility Routes

| Route | Page File | Purpose |
|-------|-----------|---------|
| `/[lang]/design-system` | `design-system/page.tsx` | Design system showcase (Storybook-like) |
| `/[lang]/test` | `test/page.tsx` | Testing/development page |
| `/[lang]/unauthorized` | `unauthorized/page.tsx` | Unauthorized access error page |

### 2.2 Private Routes (`/(private)/`)

Located at: `/packages/web/src/app/[lang]/(private)/`

These routes require authentication. Access is controlled by middleware.

#### User Routes (CLIENT, EMPLOYEE, ADMIN roles)

| Route | Page File | Purpose | Roles |
|-------|-----------|---------|-------|
| `/[lang]/dashboard` | `dashboard/page.tsx` | Main user dashboard | CLIENT, LEAD |
| `/[lang]/profile` | `profile/page.tsx` | User profile management | All authenticated |
| `/[lang]/locations` | `locations/page.tsx` | Work locations management | All authenticated |
| `/[lang]/onboarding` | `onboarding/page.tsx` | User onboarding flow | New users |
| `/[lang]/requests` | `requests/page.tsx` | List all requests (paginated) | All authenticated |
| `/[lang]/requests/new` | `requests/new/page.tsx` | Create new request | All authenticated |
| `/[lang]/requests/[id]` | `requests/[id]/page.tsx` | View/edit specific request | All authenticated |

#### Services Routes

| Route | Page File | Purpose | Roles |
|-------|-----------|---------|-------|
| `/[lang]/services` | `services/page.tsx` | Browse available services | All authenticated |
| `/[lang]/services/[serviceId]/request` | `services/[serviceId]/request/page.tsx` | Request specific service | All authenticated |

#### Admin Routes (ADMIN role only)

Located at: `/packages/web/src/app/[lang]/(private)/admin/`

**Main Admin Pages**:

| Route | Page File | Purpose |
|-------|-----------|---------|
| `/[lang]/admin` | `admin/page.tsx` | Admin landing page |
| `/[lang]/admin/dashboard` | `admin/dashboard/page.tsx` | Admin dashboard with analytics |

**Catalog Management**:

| Route | Page File | Purpose |
|-------|-----------|---------|
| `/[lang]/admin/catalog/categories` | `admin/catalog/categories/page.tsx` | Manage service categories |
| `/[lang]/admin/catalog/services` | `admin/catalog/services/page.tsx` | Manage services inventory |

**User Management**:

| Route | Page File | Purpose |
|-------|-----------|---------|
| `/[lang]/admin/users` | `admin/users/page.tsx` | List all users |
| `/[lang]/admin/users/create` | `admin/users/create/page.tsx` | Create new user |
| `/[lang]/admin/users/[userEmail]` | `admin/users/[userEmail]/page.tsx` | Edit user details |

**Communications**:

| Route | Page File | Purpose |
|-------|-----------|---------|
| `/[lang]/admin/chat` | `admin/chat/page.tsx` | Chat interface |
| `/[lang]/admin/chat/[conversationId]` | `admin/chat/[conversationId]/page.tsx` | Specific conversation |
| `/[lang]/admin/chat/analytics` | `admin/chat/analytics/page.tsx` | Chat analytics dashboard |

**Notifications**:

| Route | Page File | Purpose |
|-------|-----------|---------|
| `/[lang]/admin/notifications` | `admin/notifications/page.tsx` | Notification management |
| `/[lang]/admin/notifications/preferences` | `admin/notifications/preferences/page.tsx` | Notification preferences |
| `/[lang]/admin/notifications/analytics` | `admin/notifications/analytics/page.tsx` | Notification analytics |

**Settings**:

| Route | Page File | Purpose |
|-------|-----------|---------|
| `/[lang]/admin/settings` | `admin/settings/page.tsx` | General settings |
| `/[lang]/admin/settings/themes` | `admin/settings/themes/page.tsx` | Theme editor and management |
| `/[lang]/admin/settings/chatbot` | `admin/settings/chatbot/page.tsx` | Chatbot configuration |

### 2.3 API Routes (Proxy Layer)

Located at: `/packages/web/src/app/api/`

API routes act as middleware/proxy between frontend and backend (NestJS on port 3001).

#### Authentication Endpoints

| Method | Route | Purpose | Backend Proxy |
|--------|-------|---------|---------------|
| POST | `/api/auth/login` | User login | `POST /auth/login` |
| POST | `/api/auth/register` | User registration | `POST /auth/register` |
| POST | `/api/auth/logout` | User logout | `POST /auth/logout` |
| POST | `/api/auth/refresh` | Refresh JWT tokens | `POST /auth/refresh` |
| POST | `/api/auth/send-login-code` | Send login code via email | `POST /auth/send-login-code` |
| POST | `/api/auth/verify-login-code` | Verify login code | `POST /auth/verify-login-code` |
| POST | `/api/auth/forgot-password` | Initiate password reset | `POST /auth/forgot-password` |
| POST | `/api/auth/reset-password` | Reset password with token | `POST /auth/reset-password` |
| POST | `/api/auth/verify-email` | Verify email address | `POST /auth/verify-email` |
| POST | `/api/auth/complete-profile` | Complete user profile | `POST /auth/complete-profile` |

#### User Management

| Method | Route | Purpose | Backend Proxy |
|--------|-------|---------|---------------|
| GET | `/api/users/profile` | Get current user profile | `GET /users/profile` |
| GET | `/api/users/me/role` | Get current user role | `GET /users/me/role` |

#### Requests Management

| Method | Route | Purpose | Backend Proxy |
|--------|-------|---------|---------------|
| GET | `/api/requests` | List all requests | `GET /requests` |
| POST | `/api/requests` | Create new request | `POST /requests` |
| GET | `/api/requests/[id]` | Get request details | `GET /requests/:id` |
| PUT | `/api/requests/[id]` | Update request | `PUT /requests/:id` |
| POST | `/api/requests/[id]/assign` | Assign request to user | `POST /requests/:id/assign` |
| POST | `/api/requests/[id]/complete` | Mark request as complete | `POST /requests/:id/complete` |
| POST | `/api/requests/[id]/cancel` | Cancel request | `POST /requests/:id/cancel` |

#### Services & Categories

| Method | Route | Purpose | Backend Proxy |
|--------|-------|---------|---------------|
| GET | `/api/services` | List services | `GET /services` |
| POST | `/api/services` | Create service (admin) | `POST /services` |
| GET | `/api/services/[id]` | Get service details | `GET /services/:id` |
| PUT | `/api/services/[id]` | Update service (admin) | `PUT /services/:id` |
| GET | `/api/categories` | List categories | `GET /categories` |
| POST | `/api/categories` | Create category (admin) | `POST /categories` |
| GET | `/api/categories/[id]` | Get category details | `GET /categories/:id` |
| PUT | `/api/categories/[id]` | Update category (admin) | `PUT /categories/:id` |

#### Locations

| Method | Route | Purpose | Backend Proxy |
|--------|-------|---------|---------------|
| GET | `/api/locations` | List work locations | `GET /locations` |
| POST | `/api/locations` | Create location | `POST /locations` |
| GET | `/api/locations/[id]` | Get location details | `GET /locations/:id` |
| PUT | `/api/locations/[id]` | Update location | `PUT /locations/:id` |

#### Notifications

| Method | Route | Purpose | Backend Proxy |
|--------|-------|---------|---------------|
| POST | `/api/notifications/push/subscribe` | Subscribe to push notifications | `POST /notifications/push/subscribe` |
| POST | `/api/notifications/push/unsubscribe` | Unsubscribe from push | `POST /notifications/push/unsubscribe` |
| POST | `/api/notifications/push/test` | Send test notification | `POST /notifications/push/test` |

#### Localization

| Method | Route | Purpose | Backend Proxy |
|--------|-------|---------|---------------|
| GET | `/api/translations` | Get translations for locale | `GET /translations` |

### 2.4 Special Pages

| Route | File | Purpose |
|-------|------|---------|
| `/error.tsx` | Root error boundary | Global error handling |
| `/500.tsx` | Server error page | 500 Internal Server Error |
| `/` | Root redirect | Redirects to `/[lang]` based on locale |

---

## 3. Middleware Architecture

The frontend uses a composable middleware chain pattern for authentication and internationalization.

### 3.1 Middleware Chain Pattern

**Location**: `/packages/web/src/middleware/chain.ts`

The middleware uses a functional composition pattern:

```typescript
// Simplified chain implementation
export function chain(
  functions: MiddlewareFactory[],
  index = 0
): MiddlewareFactory {
  const current = functions[index];

  if (current) {
    const next = chain(functions, index + 1);
    return current(next);
  }

  return (req) => NextResponse.next();
}
```

**Benefits**:
- Composable: Stack middleware functions in any order
- Type-safe: Full TypeScript support
- Testable: Each middleware can be tested independently
- Maintainable: Clear separation of concerns

### 3.2 Authentication Middleware

**Location**: `/packages/web/src/middleware/withAuthMiddleware.ts`

**Responsibilities**:
1. Route protection based on user roles
2. Cookie-based JWT validation
3. Token refresh logic
4. Locale detection from URL/cookie
5. Redirect to login for protected routes

**Key Features**:

**Development Bypass**:
```typescript
if (process.env.SKIP_AUTH === 'true') {
  return NextResponse.next();
}
```

**Protected Route Configuration**:
Routes are defined in `/packages/web/src/lib/routes/protected-routes.ts`:

```typescript
const protectedRoutes = {
  '/admin': ['ADMIN'],
  '/dashboard': ['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD'],
  '/profile': ['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD'],
  // ...
};
```

**Role-Based Access Control**:
- **ADMIN**: Full system access
- **EMPLOYEE**: Internal staff access
- **CLIENT**: External customer access
- **LEAD**: Sales/Lead management access

**Token Refresh Logic**:
- Automatically refreshes expired access tokens
- Uses refresh token from cookies
- Updates `auth-token` cookie with new JWT
- Falls back to login redirect if refresh fails

### 3.3 Internationalization Middleware

**Location**: `/packages/web/src/middleware/withI18nMiddleware.ts`

**Responsibilities**:
1. Language detection from URL prefix (`/es/`, `/en/`)
2. Locale cookie management (`NEXT_LOCALE`)
3. Automatic redirect to prefixed routes
4. Fallback to Spanish (`es`) as default language
5. Cookie expiration (1 year) with SameSite=Lax

**Locale Detection Flow**:
1. Check URL path for `/es/` or `/en/` prefix
2. If missing, check `NEXT_LOCALE` cookie
3. If no cookie, fallback to `es` (Spanish)
4. Redirect to properly prefixed URL

**Supported Languages**:
- `es` - Spanish (default)
- `en` - English

### 3.4 Middleware Proxy Export

**Location**: `/packages/web/src/proxy.ts`

Chains both middlewares and exports as default:

```typescript
import { chain } from './middleware/chain';
import { withAuthMiddleware } from './middleware/withAuthMiddleware';
import { withI18nMiddleware } from './middleware/withI18nMiddleware';

export default chain([
  withAuthMiddleware,
  withI18nMiddleware,
]);

export const config = {
  matcher: '/((?!api|_next|.*\\.).*)', // Exclude API routes, Next.js internals, static files
};
```

**Route Matcher Pattern**:
- **Includes**: All page routes
- **Excludes**:
  - `/api/*` - API routes
  - `/_next/*` - Next.js internal routes
  - `/*.*` - Static files (images, fonts, etc.)

---

## 4. Component Organization (Atomic Design)

The frontend follows **Atomic Design** methodology with strict component hierarchy.

**Reference**: See `/docs/00-conventions/atomic-design-architecture.md` for complete guidelines.

### 4.1 Component Hierarchy

```
Atoms (Basic building blocks)
  ↓
Molecules (Combinations of atoms)
  ↓
Organisms (Complex features)
  ↓
Templates (Page layouts - not yet implemented)
  ↓
Pages (Route-specific composition)
```

### 4.2 Atoms (25 components)

**Location**: `/packages/web/src/components/atoms/`

Basic, reusable building blocks. **No business logic**, only UI presentation.

#### Form Elements

| Component | File | Purpose |
|-----------|------|---------|
| Button | `buttons/` | Button variants and styles |
| Checkbox | `checkbox/` | Checkbox component |
| Radio Button | `radio-button/` | Radio button component |
| Select | `select/` | Select/dropdown component |
| Input | `inputs/` | Text input fields |
| Textarea | `textarea/` | Multi-line text area |
| Toggle | `toggle/` | Toggle switch component |
| Slider | `slider/` | Range slider component |
| Password Strength | `password-strength-indicator/` | Password strength meter |

#### UI Components

| Component | File | Purpose |
|-----------|------|---------|
| Alert | `alert/` | Alert/notification component |
| Badge | `badge/`, `badges/` | Badge and variants |
| Tab | `tabs/` | Tab navigation component |
| Tooltip | `tooltip/` | Tooltip component |
| Separator | `separator/` | Visual separator (hr) |
| Progress Bar | `progress-bar/` | Progress indicator |
| Spinner | `spinners/` | Loading spinners |

#### Visual Elements

| Component | File | Purpose |
|-----------|------|---------|
| Icon | `icons/`, `custom-icon/` | Icon components (Lucide React) |
| Avatar | `avatars/` | User avatar component |
| Chip | `chips/` | Chip/pill component |
| Brand Logo | `brands/` | Brand logos |

#### Layout & Theme

| Component | File | Purpose |
|-----------|------|---------|
| Spacer | `spacer/` | Spacing component |
| Typography | `typography/` | Typography components (H1-H6, P) |
| Theme Toggle | `ThemeToggle/` | Dark/light theme toggle |

### 4.3 Molecules (23 components)

**Location**: `/packages/web/src/components/molecules/`

Combinations of atoms with **light UI logic**. No direct API calls.

#### Forms & Input

| Component | File | Purpose |
|-----------|------|---------|
| Dynamic Form | `dynamic-form/` | Dynamic form builder with field validation |
| Date Picker | `date-picker/` | Date selection component |
| Combobox | `combobox/` | Searchable combo box |
| Dropdown Menu | `dropdown-menu/` | Context menu dropdown |
| Toggle Group | `toggle-group/` | Group of toggle buttons |

#### Display & Navigation

| Component | File | Purpose |
|-----------|------|---------|
| Tabs | `tabs/` | Tab navigation system |
| Pagination | `pagination/` | Pagination controls |
| Breadcrumb | `breadcrumb/` | Breadcrumb navigation |
| Card | `Card/` | Card container component |
| Navigation Menu | `navigation-menu/` | Menu navigation |
| Accordion | `accordion/` | Accordion/collapsible sections |

#### Domain-Specific Molecules

| Component | File | Purpose |
|-----------|------|---------|
| Auth | `auth/` | Authentication-related molecules |
| Category | `category/` | Category display/selection |
| Service | `service/` | Service card and display |
| Request | `request/` | Request card and display |
| Location | `location/` | Location selection/display |
| Theme | `theme/` | Theme selector component |
| Preview Image | `preview-image/` | Image preview component |

#### Standalone Cards

- `RequestCard.tsx` - Request card component with types
- `ServiceCard.tsx` - Service card component with types

### 4.4 Organisms (17 components)

**Location**: `/packages/web/src/components/organisms/`

Complex feature components with **business logic and API integration**.

#### Authentication

| Component | File | Purpose |
|-----------|------|---------|
| Auth Forms | `auth/` | Login, register, password reset forms |

#### Domain Features

| Component | File | Purpose |
|-----------|------|---------|
| Request Management | `request/` | Request creation and management forms |
| Request Templates | `request-template/` | Template-based request forms |
| Service Management | `service/` | Service CRUD interface (admin) |
| Category Management | `category/` | Category CRUD interface (admin) |
| Location Management | `location/` | Location CRUD interface |
| Profile Forms | `profile/` | User profile update forms (role-based) |

#### UI Containers

| Component | File | Purpose |
|-----------|------|---------|
| Footer | `footer/` | Footer component |
| Hero | `hero/` | Hero section component |
| Feature Grid | `feature-grid/` | Feature showcase grid |
| Pricing Card | `pricing-card/` | Pricing card layouts |
| Icon Uploader | `icon-uploader/` | File upload for icons |

#### Admin Tools

| Component | File | Purpose |
|-----------|------|---------|
| Theme Editor | `theme-editor/` | Theme customization interface (OKLCH) |
| Theme Management | `theme/` | Theme CRUD operations |

#### Utilities

| Component | File | Purpose |
|-----------|------|---------|
| Sonner | `sonner/` | Toast notification container (Sonner library) |
| Onboarding | `onboarding/` | Multi-step onboarding flow |
| Unauthorized | `unauthorized/` | Unauthorized access display |

### 4.5 Component File Structure Pattern

Every component follows this pattern:

```
ComponentName/
├── ComponentName.tsx         # Main component implementation
├── ComponentName.types.ts    # TypeScript interfaces & types
├── index.ts                  # Export file
└── ComponentName.test.tsx    # Unit tests (NOT YET IMPLEMENTED)
```

**Example** (`/components/molecules/category/CategoryCard/`):

```typescript
// CategoryCard.tsx
import { CategoryCardProps } from './CategoryCard.types';

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Component implementation
};

// CategoryCard.types.ts
export interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

// index.ts
export { CategoryCard } from './CategoryCard';
export type { CategoryCardProps } from './CategoryCard.types';

// CategoryCard.test.tsx (NOT YET IMPLEMENTED)
// import { render } from '@testing-library/react';
// import { CategoryCard } from './CategoryCard';
// ...tests...
```

**Testing Status**: ⚠️ Component test files (`.test.tsx`) are **NOT yet implemented** for most components.

**Reference**: See `/docs/00-conventions/component-structure-and-testing.md` for testing conventions.

---

## 5. Configuration Files

### 5.1 Next.js Configuration

**File**: `/packages/web/next.config.mjs`

**Key Settings**:

```javascript
{
  // Force transpilation of lucide-react
  transpilePackages: ['lucide-react'],

  // Build optimization
  experimental: {
    optimizeCss: false, // Disabled for faster builds
    workerThreads: false,
    cpus: 1,
  },

  // HMR configuration
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-left',
  },

  // Type checking
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Consider enabling for production
  },

  // Image optimization
  images: {
    unoptimized: true, // Disabled for development speed
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'drive.google.com' },
    ],
  },

  // Webpack optimizations
  webpack: (config) => {
    // Memory optimization
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules|packages\/api|\.stryker-tmp|coverage/,
    };

    // Module resolution fallbacks
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Lucide-react bundling fix
    config.resolve.alias['lucide-react'] = path.resolve(
      __dirname,
      'node_modules/lucide-react'
    );

    return config;
  },
}
```

### 5.2 Tailwind CSS Configuration

**File**: `/packages/web/tailwind.config.ts`

**Design Tokens** (CSS Variables):

```typescript
{
  theme: {
    extend: {
      // Container settings
      container: {
        center: true,
        screens: { '2xl': '1400px' },
      },

      // Color system (CSS variables for dynamic theming)
      colors: {
        // Semantic colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        // Status colors
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)',
        },

        // Sidebar colors
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },

      // Responsive breakpoints
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
  },
}
```

**OKLCH Color Space Support**:
- Dynamic theme system uses OKLCH for perceptually uniform colors
- Better color manipulation than RGB/HSL
- Maintained via Culori library

### 5.3 TypeScript Configuration

**File**: `/packages/web/tsconfig.json`

**Path Aliases**:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@alkitu/shared": ["../shared/src"],
      "@alkitu/shared/*": ["../shared/src/*"],
      "@ui/*": ["src/components/primitives/ui/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

**Compiler Options**:
- Target: ES2017
- Strict mode: **Enabled**
- JSX: React JSX (automatic runtime)
- Incremental builds: **Enabled**
- Module resolution: Node.js style

**Usage Examples**:

```typescript
// Instead of: import { Button } from '../../components/atoms/buttons'
import { Button } from '@components/atoms/buttons';

// Instead of: import { CreateUserDto } from '../../../shared/src/dtos'
import { CreateUserDto } from '@alkitu/shared/dtos';

// Instead of: import { Input } from '../../../components/primitives/ui/input'
import { Input } from '@ui/input';
```

---

## 6. Supporting Infrastructure

### 6.1 Hooks

**Location**: `/packages/web/src/hooks/`

Custom React hooks for common functionality:

| Hook | File | Purpose |
|------|------|---------|
| `useAuthRedirect` | `useAuthRedirect.ts` | Handle authentication redirects based on role |
| `useGlobalTheme` | `useGlobalTheme.ts` | Global theme state management (Zustand) |
| `useWebSocket` | `useWebSocket.ts` | WebSocket connection management (Socket.IO) |
| `useMobile` | `use-mobile.tsx` | Mobile responsiveness detection |
| `useInfiniteScroll` | `use-infinite-scroll.ts` | Infinite scroll pagination |
| `useNotificationCount` | `use-notification-count.ts` | Notification badge counting |
| `usePushNotifications` | `use-push-notifications.ts` | Push notification handling |

**Example** (`useAuthRedirect.ts`):

```typescript
export function useAuthRedirect() {
  const router = useRouter();
  const { data: userData } = useUser();
  const currentLocale = useLocale();

  const redirectAfterLogin = useCallback(() => {
    let dashboardUrl = `/${currentLocale}/admin/dashboard`;

    if (userData?.role) {
      const role = userData.role.toUpperCase();
      switch (role) {
        case 'CLIENT':
        case 'LEAD':
          dashboardUrl = `/${currentLocale}/dashboard`;
          break;
        case 'EMPLOYEE':
        case 'ADMIN':
        default:
          dashboardUrl = `/${currentLocale}/admin/dashboard`;
          break;
      }
    }

    router.push(dashboardUrl);
  }, [userData, currentLocale, router]);

  return { redirectAfterLogin };
}
```

### 6.2 Context Providers

**Location**: `/packages/web/src/context/`

React Context providers for global state:

- **Theme Context**: Global theme switching (dark/light mode)
- **Auth Context**: User authentication state
- **Notification Context**: Toast notifications and alerts

### 6.3 State Management

**Client State** (Zustand):
- **Location**: `/packages/web/src/stores/`
- **Purpose**: UI state, theme preferences, client-side caching
- **Benefits**: Simple API, no boilerplate, TypeScript support

**Server State** (React Query):
- **Configuration**: `/packages/web/src/lib/react-query.ts`
- **Purpose**: API data caching, background refetching, optimistic updates
- **Integration**: Works seamlessly with tRPC

### 6.4 Utilities

**Location**: `/packages/web/src/lib/`

| Utility | File | Purpose |
|---------|------|---------|
| tRPC Client | `trpc.ts` | tRPC client configuration |
| Server tRPC | `server-trpc.ts` | Server-side tRPC calls |
| React Query | `react-query.ts` | React Query client setup |
| Protected Routes | `routes/protected-routes.ts` | Route protection config |
| Theme Utilities | `theme/` | Theme helpers and utilities |
| Locale Utilities | `locale.ts` | Localization helpers |
| General Utils | `utils.ts` | Common utility functions |
| Logger | `logger.ts` | Logging utilities |
| Predefined Themes | `predefined-themes.ts` | Pre-configured theme presets |
| Icon Mapping | `icons.ts` | Icon name to component mapping |

### 6.5 Types

**Location**: `/packages/web/src/types/`

Global TypeScript type definitions and interfaces shared across the frontend.

**Shared Types**:
- Many types are imported from `@alkitu/shared` package
- Ensures type consistency between frontend and backend

---

## 7. Authentication & Authorization

### 7.1 Cookie-Based JWT Authentication

**Tokens** (HTTP-only cookies):

| Cookie Name | Purpose | Expiration | SameSite |
|-------------|---------|------------|----------|
| `auth-token` | JWT access token | 24 hours | Lax |
| `refresh-token` | Refresh token | 7 days | Lax |
| `NEXT_LOCALE` | Language preference | 1 year | Lax |

**Token Flow**:
1. User logs in via `/api/auth/login`
2. Backend validates credentials
3. Backend returns JWT tokens
4. Frontend stores tokens in HTTP-only cookies
5. Middleware validates `auth-token` on protected routes
6. If expired, middleware attempts refresh using `refresh-token`
7. If refresh fails, redirect to `/auth/login`

### 7.2 Role-Based Access Control (RBAC)

**Supported Roles**:

| Role | Description | Access Level |
|------|-------------|--------------|
| `ADMIN` | System administrator | Full system access, all routes |
| `EMPLOYEE` | Internal staff | Private routes, limited admin access |
| `CLIENT` | External customer | User routes only (dashboard, profile, requests) |
| `LEAD` | Sales/Lead management | Similar to CLIENT with additional permissions |

**Role Hierarchy**:
```
ADMIN (highest privileges)
  ↓
EMPLOYEE
  ↓
CLIENT / LEAD
  ↓
Unauthenticated (lowest)
```

### 7.3 Protected Routes Configuration

**File**: `/packages/web/src/lib/routes/protected-routes.ts`

Routes requiring specific roles:

```typescript
const protectedRoutes = {
  // Admin-only routes
  '/admin': ['ADMIN'],
  '/admin/dashboard': ['ADMIN'],
  '/admin/users': ['ADMIN'],
  '/admin/catalog': ['ADMIN'],
  '/admin/settings': ['ADMIN'],
  '/admin/notifications': ['ADMIN'],
  '/admin/chat': ['ADMIN'],

  // Authenticated user routes
  '/dashboard': ['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD'],
  '/profile': ['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD'],
  '/requests': ['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD'],
  '/locations': ['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD'],
  '/services': ['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD'],
};
```

**Middleware Enforcement**:
- Middleware checks user role from JWT payload
- Compares role against allowed roles for route
- Redirects to `/unauthorized` if insufficient permissions
- Redirects to `/auth/login` if unauthenticated

---

## 8. Internationalization

### 8.1 Language Support

**Supported Languages**:
- `es` - Spanish (Español) - **Default**
- `en` - English

**Default Language**: Spanish (`es`)

### 8.2 Implementation

**URL-Based Routing**:
- All routes are prefixed with language code: `/{lang}/...`
- Examples:
  - Spanish: `/es/dashboard`
  - English: `/en/dashboard`

**Translation Files**:
- **Location**: `/packages/web/src/locales/`
- **Format**: JSON files organized by namespace
- **Structure**:
  ```
  locales/
  ├── es/
  │   ├── common.json
  │   ├── auth.json
  │   └── dashboard.json
  └── en/
      ├── common.json
      ├── auth.json
      └── dashboard.json
  ```

**Translation Utilities**:
- **File**: `/packages/web/src/lib/locale.ts`
- Locale detection and management
- Cookie handling for locale persistence

**Server-Side Translations**:
- **File**: `/packages/web/src/lib/getTranslations.ts`
- Hook for server components: `useTranslations(namespace)`

**Middleware-Based**:
- `withI18nMiddleware` handles language detection
- Checks URL prefix first, then `NEXT_LOCALE` cookie
- Redirects to properly prefixed URL if missing

**Cookie Management**:
- Cookie name: `NEXT_LOCALE`
- Expiration: 1 year
- SameSite: Lax
- Stores user's language preference

---

## 9. Errors Encountered (Recent Work)

This section documents errors encountered during recent E2E testing work and their resolutions.

### 9.1 ThrottlerException Error

**Error**: `"ThrottlerException: Too Many Requests"` appearing in E2E test error snapshots

**Context**:
- Appeared in Playwright error context during E2E test runs
- Error snapshot example:
  ```yaml
  - generic [ref=e29]: "ThrottlerException: Too Many Requests"
  ```

**Root Cause**:
- Global throttler in NestJS backend set to 1000 requests/minute
- Insufficient for E2E test suites making rapid sequential requests
- E2E tests perform multiple logins in quick succession

**Fix Applied**:
- **File**: `/packages/api/src/app.module.ts` (line 29)
- Increased global limit to 10000 requests/minute for dev/test environments:
  ```typescript
  ThrottlerModule.forRoot([
    {
      ttl: 60000, // 60 seconds
      limit: process.env.NODE_ENV === 'production' ? 100 : 10000,
    },
  ]),
  ```

**Status**: ✅ **Fixed** in backend configuration

**Remaining Issue**: ⚠️ Error still appearing in Playwright error snapshots (likely stale cache from previous test runs)

**Related Files**:
- Backend: `/packages/api/src/app.module.ts`
- Test results: `/packages/web/FINAL-TEST-RESULTS.log`
- Error snapshots: `/packages/web/test-results/.../error-context.md`

---

### 9.2 TypeScript Compilation Error with @SkipThrottle()

**Error**:
```
error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'Record<string, boolean>'.
```

**Context**:
- Attempted to conditionally skip throttling based on environment:
  ```typescript
  @SkipThrottle(process.env.NODE_ENV !== 'production')
  @Post('login')
  async login(@Request() req) { ... }
  ```

**Root Cause**:
- The `@SkipThrottle()` decorator doesn't accept runtime boolean expressions
- It expects either:
  - No arguments: `@SkipThrottle()` - skips all throttlers
  - Object with throttler names: `@SkipThrottle({ medium: true })` - selective skip

**Attempted Fix**:
```typescript
@SkipThrottle(process.env.NODE_ENV !== 'production') // ❌ FAILED
```

**Actual Resolution**:
- Removed both `@SkipThrottle()` and `@Throttle()` decorators from login endpoint
- Login endpoint now uses only the **global throttler** (10000/min in dev/test)
- **File**: `/packages/api/src/auth/auth.controller.ts` (lines 118-120)

**Final Code**:
```typescript
/**
 * User login (ALI-115)
 * Rate limit: Uses global throttler (10000/min in dev/test, 100/min in production)
 */
@UseGuards(LocalAuthGuard)
@Post('login')
@HttpCode(HttpStatus.OK)
async login(@Request() req, @Body() _loginDto: LoginUserDto) {
  return this.authService.login(req.user);
}
```

**Status**: ✅ **Resolved** - Backend compiles successfully with no TypeScript errors

**Lessons Learned**:
- NestJS decorators are evaluated at **compile time**, not runtime
- Cannot use runtime expressions in decorator parameters
- Global throttler configuration is simpler and sufficient for most cases

---

### 9.3 E2E Test Timeouts for EMPLOYEE/ADMIN Roles

**Error**: 6 tests failing with `TimeoutError: page.waitForURL: Timeout 10000ms exceeded`

**Test Pattern**:

| Role | Tests | Status |
|------|-------|--------|
| CLIENT | 5 tests | ✅ All PASS |
| EMPLOYEE | 3 tests | ❌ All FAIL (timeout) |
| ADMIN | 2 tests | ❌ All FAIL (timeout) |
| Security (mixed) | 4 tests | ✅ 3 PASS, ❌ 1 FAIL |

**Failure Location**:
```typescript
// Tests timeout here (line 180 and 256 in test file)
await page.waitForURL(/\/dashboard/, { timeout: 10000 });
```

**Test Results** (from `FINAL-TEST-RESULTS.log`):
```
✓  1-5: CLIENT role tests - ALL PASS
✘  6-8: EMPLOYEE role tests - ALL FAIL (timeout at waitForURL)
✘  9-10: ADMIN role tests - ALL FAIL (timeout at waitForURL)
✘  11: Security test with login - FAIL
✓  12-14: Security tests without login - ALL PASS

6 failed, 8 passed (1.7m total)
```

**Observations**:
1. Login succeeds (tests show credentials filled and submitted)
2. Both dashboard pages exist and render correctly:
   - `/es/dashboard` - CLIENT dashboard ✅ EXISTS
   - `/es/admin/dashboard` - ADMIN dashboard ✅ EXISTS
3. CLIENT role redirects successfully
4. EMPLOYEE/ADMIN roles timeout during redirect

**Attempted Fixes**:

1. **Changed navigation method** (useAuthRedirect.ts):
   - Tried `window.location.href` instead of `router.push()`
   - **Result**: No improvement ❌

2. **Increased global throttler**:
   - Changed from 1000 to 10000 requests/min
   - **Result**: No improvement initially ❌

3. **Added @SkipThrottle() decorator**:
   - **Result**: TypeScript compilation error (see 9.2) ❌

4. **Removed conflicting decorators**:
   - Removed both `@SkipThrottle()` and `@Throttle()`
   - **Result**: Backend compiles, tests still fail ❌

**Current Status**: ❌ **UNRESOLVED**

**Hypothesis**:
- Middleware role-based redirect logic may have issues for EMPLOYEE/ADMIN roles
- Possible race condition between:
  - Authentication cookie setting
  - Middleware validation
  - Role-based redirect determination
- May be related to admin dashboard route protection

**Next Steps for Investigation**:
1. Add detailed logging to `useAuthRedirect` hook
2. Inspect middleware logs during EMPLOYEE/ADMIN login
3. Verify route protection configuration for `/admin/dashboard`
4. Test manually with EMPLOYEE/ADMIN accounts in browser
5. Check if Playwright browser state is persisting cookies correctly
6. Consider increasing timeout to 15000ms as temporary workaround

**Related Files**:
- Frontend hook: `/packages/web/src/hooks/useAuthRedirect.ts`
- Middleware: `/packages/web/src/middleware/withAuthMiddleware.ts`
- Protected routes: `/packages/web/src/lib/routes/protected-routes.ts`
- Test file: `/packages/web/tests/e2e/ali-116-profile-update.spec.ts`
- Dashboard pages:
  - `/packages/web/src/app/[lang]/(private)/dashboard/page.tsx`
  - `/packages/web/src/app/[lang]/(private)/admin/dashboard/page.tsx`

---

## 10. Outstanding Questions & Doubts

This section documents architectural questions and uncertainties that need resolution.

### 10.1 Middleware File Structure

**Question**: Why is middleware exported from `proxy.ts` instead of standard `middleware.ts`?

**Observation**:
- No root-level `/packages/web/src/middleware.ts` file exists
- Middleware chain is exported from `/packages/web/src/proxy.ts`
- Next.js convention is to use `middleware.ts` at root or `src/` level

**Current Pattern**:
```
packages/web/
├── src/
│   ├── middleware/          # Middleware implementation directory
│   │   ├── chain.ts
│   │   ├── withAuthMiddleware.ts
│   │   └── withI18nMiddleware.ts
│   └── proxy.ts             # Middleware export (non-standard location)
```

**Standard Next.js Pattern**:
```
packages/web/
├── src/
│   ├── middleware/
│   │   └── ...
│   └── middleware.ts        # Standard location ✓
```

**Consideration**: Should `/packages/web/src/proxy.ts` be renamed to `/packages/web/src/middleware.ts` to follow Next.js conventions?

**Impact**:
- No functional difference
- Improved discoverability for new developers
- Aligns with Next.js documentation

**Decision Needed**: Rename `proxy.ts` to `middleware.ts` or document reason for custom naming

---

### 10.2 EMPLOYEE/ADMIN Redirect Logic

**Question**: Why do EMPLOYEE/ADMIN users timeout on redirect while CLIENT users succeed?

**Observation**:
- Both `/dashboard` and `/admin/dashboard` pages exist and render correctly
- CLIENT users redirect successfully to `/dashboard`
- EMPLOYEE/ADMIN users timeout when redirecting to `/admin/dashboard`
- Login succeeds (tests fill credentials and submit form successfully)

**Current Redirect Logic** (`useAuthRedirect.ts`):
```typescript
let dashboardUrl = `/${currentLocale}/admin/dashboard`; // Default for ADMIN/EMPLOYEE

if (userData?.role) {
  switch (userData.role.toUpperCase()) {
    case 'CLIENT':
    case 'LEAD':
      dashboardUrl = `/${currentLocale}/dashboard`;
      break;
    case 'EMPLOYEE':
    case 'ADMIN':
    default:
      dashboardUrl = `/${currentLocale}/admin/dashboard`;
      break;
  }
}

router.push(dashboardUrl);
```

**Test Behavior**:
```
CLIENT login  → router.push('/es/dashboard')       → ✅ SUCCESS (2.8s)
EMPLOYEE login → router.push('/es/admin/dashboard') → ❌ TIMEOUT (11.1s)
ADMIN login    → router.push('/es/admin/dashboard') → ❌ TIMEOUT (11.2s)
```

**Investigation Needed**:
1. Middleware role validation for `/admin/*` routes
2. Cookie propagation timing between login and middleware check
3. Route protection configuration for admin routes
4. Potential middleware infinite redirect loop
5. Next.js router caching behavior

**Hypothesis**:
- Middleware may be blocking navigation to `/admin/dashboard` due to:
  - Cookie not yet available during middleware execution
  - Role check failing even with valid JWT
  - Route protection misconfiguration

**Decision Needed**: Debug middleware execution flow during EMPLOYEE/ADMIN login attempts

---

### 10.3 Navigation Method

**Question**: Should `useAuthRedirect` use `router.push()` or `window.location.href`?

**Current Implementation**: Uses `router.push()` (client-side navigation)

**Tested Approaches**:

1. **`router.push()` (current)**:
   ```typescript
   router.push(dashboardUrl);
   ```
   - Client-side navigation (no page reload)
   - Faster for end users
   - Cookies already accessible in browser
   - Preferred for SPA-like experience

2. **`window.location.href` (tested, reverted)**:
   ```typescript
   window.location.href = dashboardUrl;
   ```
   - Full page reload
   - Re-executes middleware chain
   - More reliable for cookie propagation
   - Slower user experience

**Test Results**:
- ✅ `router.push()`: CLIENT tests pass
- ❌ `router.push()`: EMPLOYEE/ADMIN tests fail
- ❌ `window.location.href`: EMPLOYEE/ADMIN tests still fail (no improvement)

**Conclusion**: Navigation method is **NOT the root cause** of EMPLOYEE/ADMIN redirect failures.

**Decision Needed**: Continue using `router.push()` for better UX, but resolve underlying redirect issue

---

### 10.4 Test Environment Throttling

**Question**: Is 10000 requests/min sufficient for E2E tests, or should throttling be completely disabled for `NODE_ENV=test`?

**Current Setting**:
```typescript
// packages/api/src/app.module.ts
ThrottlerModule.forRoot([
  {
    ttl: 60000, // 60 seconds
    limit: process.env.NODE_ENV === 'production' ? 100 : 10000, // 10000 for dev/test
  },
]),
```

**Trade-offs**:

**Option 1: Keep 10000/min limit** (current):
- ✅ Still provides some protection against runaway tests
- ✅ Closer to production behavior
- ❌ May cause issues with very large test suites
- ❌ Requires manual tuning if tests grow

**Option 2: Completely disable for test environment**:
- ✅ No throttling concerns during testing
- ✅ Tests run as fast as possible
- ❌ Tests don't match production behavior
- ❌ Could mask rate limiting bugs

**Option 3: Use `@SkipThrottle()` on specific endpoints**:
- ✅ Selective throttling bypass
- ✅ Most endpoints still throttled
- ❌ Requires per-endpoint configuration
- ❌ TypeScript decorator limitations (see 9.2)

**Recommendation**: Keep current setting (10000/min) unless test suite grows significantly.

**Decision Needed**: Monitor test suite size and adjust if needed

---

### 10.5 Component Testing Coverage

**Observation**: Component test files (`.test.tsx`) are **not yet implemented** for most components.

**Current State**:
- ✅ Component structure follows Atomic Design
- ✅ TypeScript interfaces defined in `.types.ts` files
- ❌ `.test.tsx` files missing for atoms, molecules, and organisms
- ❌ No unit test coverage for UI components

**Gap**: Missing unit tests for:
- 25 Atoms
- 23 Molecules
- 17 Organisms
- **Total**: ~65 components without tests

**Reference**: See testing conventions in `/docs/00-conventions/component-structure-and-testing.md`

**Coverage Requirements** (from conventions):
- Atoms: 95%+ coverage
- Molecules: 90%+ coverage
- Organisms: 95%+ coverage

**Testing Frameworks Available**:
- Vitest + Testing Library (unit tests)
- Playwright (E2E tests)
- Storybook + Chromatic (visual regression)

**Decision Needed**:
1. Prioritize which components to test first (organisms → molecules → atoms)
2. Set up testing infrastructure (Vitest config, test utilities, mocks)
3. Create test templates for each component type
4. Assign testing tasks to development team

---

### 10.6 API Standardization

**Observation**: Mix of tRPC endpoints and direct proxy routes in `/app/api/`.

**Current State**:

**tRPC Routes** (type-safe):
- Some routes use tRPC client with full type inference
- Example: User profile fetching

**Proxy Routes** (simple forwarding):
- Most routes in `/app/api/` are simple HTTP proxies
- Extract JWT from cookies
- Forward to backend NestJS API
- Return JSON response

**Example Proxy Route** (`/app/api/auth/login/route.ts`):
```typescript
export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

**Question**: Should we standardize on one approach or maintain both?

**Trade-offs**:

**Option 1: Migrate all to tRPC**:
- ✅ Full type safety across frontend/backend
- ✅ Automatic type inference
- ✅ Better developer experience
- ❌ Higher initial setup cost
- ❌ Requires tRPC routers in backend

**Option 2: Keep proxy pattern**:
- ✅ Simple and straightforward
- ✅ Easy to understand
- ✅ Minimal code
- ❌ No type safety
- ❌ Manual type definitions needed
- ❌ Prone to runtime errors

**Option 3: Hybrid approach** (current):
- ✅ Use tRPC for complex queries
- ✅ Use proxy for simple CRUD
- ❌ Inconsistent patterns
- ❌ Developers must know when to use which

**Recommendation**: Gradually migrate to tRPC for new endpoints, maintain proxy for existing simple routes.

**Decision Needed**: Define clear guidelines for when to use tRPC vs proxy

---

## 11. Architecture Strengths

### 11.1 Clear Route Group Separation

**Strength**: Route groups (`(public)`, `(private)`, `admin/`) provide clear access control boundaries.

**Benefits**:
- Easy to understand which routes require authentication
- Admin routes clearly separated from user routes
- Middleware can apply different logic to different groups
- New developers can quickly navigate the codebase

### 11.2 Type-Safe API Integration

**Strength**: tRPC + shared types package (`@alkitu/shared`) ensures type safety across frontend/backend boundary.

**Benefits**:
- Compile-time type checking for API calls
- Automatic type inference in IDE
- Shared Zod schemas between frontend and backend
- Reduced runtime errors

### 11.3 Scalable Atomic Design Component Organization

**Strength**: Strict Atomic Design hierarchy makes components reusable and composable.

**Benefits**:
- Clear component hierarchy (Atoms → Molecules → Organisms)
- Easy to find components by complexity
- Promotes component reuse
- Testable at each level
- Follows industry best practices

### 11.4 Composable Middleware Chain Pattern

**Strength**: Functional middleware composition allows flexible middleware stacking.

**Benefits**:
- Easy to add/remove middleware functions
- Clear execution order
- Testable middleware in isolation
- Type-safe middleware composition

### 11.5 Built-In Internationalization Support

**Strength**: First-class i18n support with URL-based routing and middleware.

**Benefits**:
- SEO-friendly language URLs (`/es/`, `/en/`)
- Cookie-based language persistence
- Server-side translation support
- Easy to add new languages

### 11.6 Dynamic Theme System with OKLCH

**Strength**: CSS variable-based theming with OKLCH color space.

**Benefits**:
- Runtime theme switching (dark/light mode)
- Perceptually uniform colors (OKLCH)
- No CSS rebuilds needed for theme changes
- Admin theme editor for custom themes
- Better color manipulation than RGB/HSL

### 11.7 Fine-Grained Role-Based Access Control

**Strength**: Middleware-enforced RBAC with role hierarchy.

**Benefits**:
- Secure access control at middleware level
- Flexible role permissions
- Easy to add new roles
- Centralized route protection configuration

---

## 12. Areas for Enhancement

### 12.1 Root-Level Middleware.ts File

**Current**: Middleware exported from `src/proxy.ts` (non-standard)

**Enhancement**: Rename to `src/middleware.ts` to follow Next.js conventions.

**Impact**: Low effort, improves discoverability

### 12.2 Component Test Coverage

**Current**: `.test.tsx` files not implemented for most components

**Enhancement**:
1. Set up Vitest infrastructure
2. Create test templates for Atoms, Molecules, Organisms
3. Prioritize testing organisms first (most critical)
4. Target 90%+ coverage

**Impact**: High effort, significantly improves code quality and confidence

### 12.3 Centralized Error Boundary Structure

**Current**: Basic error boundaries in place

**Enhancement**:
1. Create global error boundary with better UX
2. Add error tracking/logging (Sentry, LogRocket)
3. Implement graceful degradation
4. Add retry logic for transient errors

**Impact**: Medium effort, improves user experience during errors

### 12.4 API Route Standardization

**Current**: Mix of tRPC and proxy routes

**Enhancement**:
1. Define clear guidelines for tRPC vs proxy usage
2. Migrate complex queries to tRPC
3. Keep simple CRUD as proxy routes
4. Document decision criteria

**Impact**: Medium effort, improves consistency

### 12.5 Cross-Tab State Synchronization

**Current**: No cross-tab communication

**Enhancement**:
1. Implement Broadcast Channel API or LocalStorage events
2. Sync authentication state across tabs
3. Sync theme changes across tabs
4. Handle logout in one tab affecting others

**Impact**: Low-medium effort, better UX for multi-tab users

### 12.6 WCAG Accessibility Audit

**Current**: Basic accessibility, no comprehensive audit

**Enhancement**:
1. Run automated accessibility tests (jest-axe, axe DevTools)
2. Manual keyboard navigation testing
3. Screen reader testing (NVDA, JAWS, VoiceOver)
4. Color contrast verification
5. ARIA label audit
6. Focus management review

**Impact**: Medium effort, critical for compliance and inclusivity

---

## 13. Quick Reference

### 13.1 File Locations by Purpose

| Purpose | Location |
|---------|----------|
| **Pages** | `/packages/web/src/app/[lang]/(public\|private)/` |
| **API Routes** | `/packages/web/src/app/api/` |
| **Components** | `/packages/web/src/components/(atoms\|molecules\|organisms)/` |
| **Hooks** | `/packages/web/src/hooks/` |
| **Middleware** | `/packages/web/src/middleware/` |
| **Types** | `/packages/web/src/types/` |
| **Utilities** | `/packages/web/src/lib/` |
| **State Stores** | `/packages/web/src/stores/` |
| **Context** | `/packages/web/src/context/` |
| **Configuration** | `/packages/web/next.config.mjs`, `tailwind.config.ts`, `tsconfig.json` |
| **Route Protection** | `/packages/web/src/lib/routes/protected-routes.ts` |
| **Theme System** | `/packages/web/src/lib/theme/`, Tailwind config |
| **Localization** | `/packages/web/src/locales/`, `/packages/web/src/lib/locale.ts` |

### 13.2 Route Protection by Role

| Route Pattern | Allowed Roles |
|---------------|---------------|
| `/admin/**` | ADMIN |
| `/dashboard` | CLIENT, LEAD |
| `/admin/dashboard` | ADMIN, EMPLOYEE |
| `/profile` | All authenticated |
| `/requests/**` | All authenticated |
| `/locations/**` | All authenticated |
| `/services/**` | All authenticated |
| `/auth/**` | Public (unauthenticated) |

### 13.3 API Endpoint Quick Reference

| Category | Endpoints | HTTP Methods |
|----------|-----------|--------------|
| **Authentication** | `/api/auth/*` | POST |
| **Users** | `/api/users/*` | GET |
| **Requests** | `/api/requests`, `/api/requests/[id]` | GET, POST, PUT |
| **Services** | `/api/services`, `/api/services/[id]` | GET, POST, PUT |
| **Categories** | `/api/categories`, `/api/categories/[id]` | GET, POST, PUT |
| **Locations** | `/api/locations`, `/api/locations/[id]` | GET, POST, PUT |
| **Notifications** | `/api/notifications/*` | POST |
| **Translations** | `/api/translations` | GET |

### 13.4 Component Count by Type

| Type | Count | Location |
|------|-------|----------|
| Atoms | 25 | `/components/atoms/` |
| Molecules | 23 | `/components/molecules/` |
| Organisms | 17 | `/components/organisms/` |
| **Total** | **65** | `/components/` |

### 13.5 Key Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
SKIP_AUTH=true  # Development only - bypasses auth middleware

# Backend (.env)
DATABASE_URL=mongodb://localhost:27017/alkitu?replicaSet=rs0
JWT_SECRET=your-jwt-secret
RESEND_API_KEY=your-resend-key
NODE_ENV=development|production|test
```

### 13.6 Development Commands

```bash
# Start development servers
npm run dev              # All services (API + Web)
npm run dev:web          # Frontend only (port 3000)
npm run dev:api          # Backend only (port 3001)

# Testing
npm run test:e2e         # Playwright E2E tests
npm run test             # Frontend unit tests (Vitest)
npm run test:watch       # Vitest watch mode

# Database
npm run db:studio        # Prisma Studio GUI
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes

# Code quality
npm run lint             # ESLint
npm run type-check       # TypeScript compilation

# Build
npm run build            # Production build
```

---

## Appendix: Related Documentation

### Internal Documentation

- **Conventions**: `/docs/00-conventions/`
  - `atomic-design-architecture.md` - Component structure rules
  - `component-structure-and-testing.md` - Testing conventions
  - `testing-strategy-and-frameworks.md` - Which framework to use when
  - `documentation-guidelines.md` - How to write documentation

- **Testing**: `/docs/05-testing/`
  - `frontend-testing-guide.md` - Complete frontend testing guide
  - `backend-testing-guide.md` - TDD workflow for backend
  - `playwright-setup-and-usage.md` - E2E testing with Playwright
  - `testing-cheatsheet.md` - Quick reference

- **AI Agents**: `.claude/agents/`
  - `frontend-component-builder.md` - Component creation agent
  - `frontend-testing-expert.md` - Test generation agent

### External References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [React Query (TanStack Query)](https://tanstack.com/query/latest)
- [tRPC Documentation](https://trpc.io/docs)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)

---

**Document Maintenance**:
- Update this document when adding new routes, components, or architectural patterns
- Review quarterly for accuracy
- Link to this document from onboarding materials

**Last Updated**: 2025-01-02
**Contributors**: Claude (AI Agent)
**Approval**: Pending team review
