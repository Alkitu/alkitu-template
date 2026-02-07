# Protected Routes Validation System

## Overview

The Protected Routes Validation System ensures that all routes in the Next.js application are properly configured with role-based access control (RBAC). It automatically scans the filesystem and validates against the `PROTECTED_ROUTES` configuration.

## Components

### 1. Route Generator (`src/lib/routes/generate-protected-routes.ts`)

Automatically generates route metadata by scanning the filesystem:

```typescript
import { generateProtectedRoutes } from '@/lib/routes/generate-protected-routes';

const routes = generateProtectedRoutes();
// Returns: RouteMetadata[] with path, roles, and filePath
```

**Features:**
- Scans `src/app/[lang]/(private)/**` for all `page.tsx` files
- Extracts roles from folder structure:
  - `admin/*` → `[UserRole.ADMIN]`
  - `employee/*` → `[UserRole.EMPLOYEE]`
  - `client/*` → `[UserRole.CLIENT]`
  - `(shared)/*` → `[UserRole.ADMIN, EMPLOYEE, CLIENT, LEAD]`
- Handles dynamic routes: `[id]` → `:id`
- Returns sorted routes for consistent output

### 2. Route Validator

Compares generated routes with configured routes:

```typescript
import { validateRoutes } from '@/lib/routes/generate-protected-routes';
import { PROTECTED_ROUTES } from '@/lib/routes/protected-routes';

const validation = validateRoutes(generated, PROTECTED_ROUTES);
```

**Returns:**
```typescript
{
  isValid: boolean;
  missing: RouteMetadata[];    // In filesystem but not in config
  extra: RouteMetadata[];      // In config but not in filesystem
  mismatched: Array<{          // Role mismatch between filesystem and config
    path: string;
    generated: UserRole[];
    configured: UserRole[];
  }>;
}
```

### 3. Validation Script (`scripts/validate-routes.ts`)

Command-line script to validate all routes:

```bash
npm run validate:routes
```

**Exit Codes:**
- `0` - All routes are valid
- `1` - Validation errors found

**Output Example:**
```
🔍 Validating Protected Routes...

📁 Found 25 routes in filesystem
📋 Found 25 routes in config

✅ All routes are valid!
✅ Route validation successful!
```

Or with errors:
```
❌ Route validation failed:

📁 Missing from config (found in filesystem):
  - /admin/new-feature [ADMIN]
    File: src/app/[lang]/(private)/admin/new-feature/page.tsx

🗑️  Extra in config (not in filesystem):
  - /admin/old-feature [ADMIN]

⚠️  Role mismatch:
  - /admin/settings
    Generated: [ADMIN]
    Configured: [ADMIN, EMPLOYEE]
```

## CI/CD Integration

### Build Integration

The validation script is automatically run during the build process:

```json
{
  "scripts": {
    "build": "npm run validate:routes && next build"
  }
}
```

This ensures that:
- ✅ All routes are protected before deploying
- ✅ No unprotected routes can reach production
- ✅ Configuration stays in sync with filesystem

### GitHub Actions (Recommended)

Add to `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  validate-routes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run validate:routes
        working-directory: packages/web
```

## Usage

### Daily Development

**Before committing code:**
```bash
cd packages/web
npm run validate:routes
```

**If validation fails:**
1. Review the output to see which routes are missing/extra
2. Update `src/lib/routes/protected-routes.ts`:
   ```typescript
   export const PROTECTED_ROUTES: ProtectedRoute[] = [
     // ... existing routes
     {
       path: '/admin/new-feature',
       roles: [UserRole.ADMIN],
     },
   ];
   ```
3. Run validation again to confirm

### Adding New Protected Routes

**Step 1:** Create the page file
```bash
# Example: Create admin analytics page
mkdir -p src/app/[lang]/(private)/admin/analytics
touch src/app/[lang]/(private)/admin/analytics/page.tsx
```

**Step 2:** Run validation to see suggested configuration
```bash
npm run validate:routes
```

**Step 3:** Add to `protected-routes.ts`
```typescript
{
  path: '/admin/analytics',
  roles: [UserRole.ADMIN],
},
```

**Step 4:** Verify
```bash
npm run validate:routes
# Should show: ✅ All routes are valid!
```

## Route Naming Conventions

### Folder Structure = Role Assignment

```
src/app/[lang]/(private)/
├── admin/              → [UserRole.ADMIN]
│   ├── dashboard/
│   ├── users/
│   └── settings/
├── employee/           → [UserRole.EMPLOYEE]
│   ├── dashboard/
│   └── requests/
├── client/             → [UserRole.CLIENT]
│   ├── dashboard/
│   └── requests/
└── (shared)/           → [All roles]
    ├── profile/
    └── notifications/
```

**Important:**
- Route folder structure **MUST** match the intended role
- First segment determines the role automatically
- Mismatched roles will be flagged in validation

### Dynamic Routes

Dynamic segments use Next.js conventions:

```
/admin/users/[id]       → Matches /admin/users/:id
/admin/requests/[id]/edit → Matches /admin/requests/:id/edit
```

The validator automatically converts `[id]` to `:id` for consistency.

## Troubleshooting

### "Missing from config" Error

**Problem:** Route exists in filesystem but not in `protected-routes.ts`

**Solution:**
```typescript
// Add to protected-routes.ts
{
  path: '/admin/missing-route',
  roles: [UserRole.ADMIN],
},
```

### "Extra in config" Error

**Problem:** Route in config but file doesn't exist

**Solutions:**
1. Remove from `protected-routes.ts` (if route was deleted)
2. Create the missing page file (if route is still needed)

### "Role mismatch" Error

**Problem:** Configured roles don't match filesystem structure

**Example:**
```
⚠️  Role mismatch:
  - /admin/dashboard
    Generated: [ADMIN]           ← From folder structure
    Configured: [ADMIN, EMPLOYEE] ← From config
```

**Solution:** Decide which is correct:
- If config is correct → Move file to appropriate folder
- If filesystem is correct → Update config roles

## API Reference

### `generateProtectedRoutes(): RouteMetadata[]`

Scans filesystem and returns route metadata.

**Returns:**
```typescript
interface RouteMetadata {
  path: string;          // Route path (e.g., "/admin/users")
  roles: UserRole[];     // Required roles
  requiredFlags?: string[]; // Optional feature flags
  filePath?: string;     // Filesystem path
}
```

### `validateRoutes(generated, configured): ValidationResult`

Compares generated and configured routes.

**Parameters:**
- `generated: RouteMetadata[]` - From `generateProtectedRoutes()`
- `configured: RouteMetadata[]` - From `PROTECTED_ROUTES`

**Returns:**
```typescript
{
  isValid: boolean;
  missing: RouteMetadata[];
  extra: RouteMetadata[];
  mismatched: Array<{
    path: string;
    generated: UserRole[];
    configured: UserRole[];
  }>;
}
```

### `formatValidationResults(validation): string`

Formats validation results for console output.

## Best Practices

### 1. Validate Before Every Commit

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
cd packages/web
npm run validate:routes
```

### 2. Run in CI/CD Pipeline

Ensure validation runs on every PR to catch issues early.

### 3. Keep Config in Sync

When adding/removing routes, immediately update `protected-routes.ts`.

### 4. Review Validation Output

Don't ignore validation errors - they indicate security risks.

### 5. Use Role Hierarchy

Configure roles using the hierarchy system:
```typescript
// ✅ Good: Uses hierarchy (ADMIN inherits EMPLOYEE)
{
  path: '/employee/dashboard',
  roles: [UserRole.EMPLOYEE], // ADMIN can also access
}

// ❌ Bad: Explicit enumeration
{
  path: '/employee/dashboard',
  roles: [UserRole.ADMIN, UserRole.EMPLOYEE],
}
```

## Security Implications

### Why Validation Matters

**Unprotected routes are security vulnerabilities:**
- Users could access pages they shouldn't see
- Sensitive data could be exposed
- Admin functionality could be accessible to non-admins

**The validator prevents:**
- ❌ Forgetting to protect new routes
- ❌ Leaving orphaned routes after refactoring
- ❌ Role mismatches between frontend and backend

### Fail-Safe Design

The system is designed to **fail closed** (deny access by default):
- If a route is not in `PROTECTED_ROUTES`, the middleware will check filesystem structure
- If validation fails in CI, the build fails
- Missing routes are flagged immediately

## Related Documentation

- [Security Architecture](/docs/00-conventions/security-architecture.md)
- [Security Quick Reference](/docs/00-conventions/security-quick-reference.md)
- [Role Hierarchy System](/packages/shared/src/rbac/role-hierarchy.ts)
- [Auth Middleware](/packages/web/src/middleware/withAuthMiddleware.ts)

---

**Last Updated:** 2026-02-08
**Phase 2 - Priority 1:** Protected Routes Validation Script ✅ COMPLETE
