# Middleware Route Security — Deny by Default

## Design Principle

The auth middleware follows a **deny-by-default** (allowlist) model:

> Every route requires authentication **unless explicitly whitelisted** as public.

This is the opposite of the old "protect-by-name" model where forgetting to add a route left it exposed. Now, forgetting to whitelist a route keeps it locked behind auth — the safe default.

## How It Works

The middleware processes requests in this order:

1. **Bypass routes** — API (`/api/*`), Next.js internals (`/_next/*`), static files (`*.ext`), `/not-found`. These skip auth entirely.
2. **Auth page routes** — `/auth/login`, `/auth/register`, etc. Unauthenticated users pass through; authenticated users are redirected to their dashboard.
3. **Public routes** — Explicitly whitelisted paths that require no authentication (`/design-system`, `/contrast-checker`, `/unauthorized`, `/feature-disabled`, landing page `/`).
4. **Everything else** — **Requires authentication.** Role requirements are determined by path prefix (`/admin` → ADMIN, `/employee` → EMPLOYEE, `/client` → CLIENT, others → any authenticated user).

## Configuration Files

- **`packages/web/src/lib/routes/route-access.ts`** — Route access rules (public whitelist, role prefix rules)
- **`packages/web/src/lib/routes/path-utils.ts`** — Shared locale/path utilities
- **`packages/web/src/middleware/withAuthMiddleware.ts`** — The middleware implementation

## How to Add a Public Route

Edit `route-access.ts`:

```ts
// For prefix-based routes (e.g., /blog/*)
export const PUBLIC_PREFIXES = [
  '/auth/',
  '/unauthorized',
  '/contrast-checker',
  '/design-system',
  '/chat/popup/',
  '/feature-disabled',
  '/blog',             // ← add here
] as const;

// For exact-match routes
export const PUBLIC_EXACT = ['/', '', '/about'] as const;  // ← add here
```

## How Role-Based Access Works

Role requirements are derived from the **first path segment** after the locale:

| Path prefix   | Required role(s) |
|---------------|------------------|
| `/admin/*`    | `ADMIN`          |
| `/employee/*` | `EMPLOYEE`       |
| `/client/*`   | `CLIENT`         |
| anything else | `ADMIN`, `EMPLOYEE`, `CLIENT`, `LEAD` (any authenticated user) |

The `hasRole()` function from `@alkitu/shared/rbac/role-hierarchy` handles role hierarchy (e.g., ADMIN can access EMPLOYEE routes).

## Anti-Patterns

### DO NOT: Add routes to an "allow" list to protect them

```ts
// ❌ OLD PATTERN — open by default
const PROTECTED_ROUTES = [
  { path: '/admin/users', roles: [UserRole.ADMIN] },
  // Forgot /admin/reports → it's publicly accessible!
];
```

### DO: Add routes to the public whitelist to make them accessible

```ts
// ✅ NEW PATTERN — closed by default
export const PUBLIC_PREFIXES = [
  '/auth/',
  '/blog',  // Explicitly public
] as const;
// /admin/reports is auto-protected because it's not whitelisted
```

### DO NOT: Create per-route role mappings

```ts
// ❌ Unnecessary — prefix rules already handle this
{ path: '/admin/users', roles: [UserRole.ADMIN] },
{ path: '/admin/billing', roles: [UserRole.ADMIN] },
```

The `/admin` prefix rule already covers all admin sub-routes.

### DO NOT: Rely on client-side route guards alone

The middleware is the **primary enforcement layer**. Client-side guards are UX helpers, not security controls.

## Testing

Run the middleware tests:

```bash
cd packages/web
pnpm run test -- src/middleware/__tests__/withAuthMiddleware.test.ts
```

Key test cases:
- Unknown routes without token → redirect to login (deny by default)
- New admin routes without ADMIN role → redirect to unauthorized
- Public routes without token → pass through
- Auth pages with valid token → redirect to dashboard
