import { UserRole } from '@alkitu/shared/enums/user-role.enum';
import { glob } from 'glob';
import path from 'path';

/**
 * Route Metadata Interface
 */
export interface RouteMetadata {
  path: string;
  roles: UserRole[];
  requiredFlags?: string[];
  filePath?: string;
}

/**
 * Auto-generate protected routes by scanning filesystem
 *
 * Extracts role from folder structure:
 * - admin → [ADMIN]
 * - client → [CLIENT]
 * - employee → [EMPLOYEE]
 * - (shared) → [ADMIN, EMPLOYEE, CLIENT, LEAD]
 *
 * @returns Array of route metadata
 */
export function generateProtectedRoutes(): RouteMetadata[] {
  const routes: RouteMetadata[] = [];
  const appDir = path.join(process.cwd(), 'src/app/[lang]/(private)');

  // Find all page.tsx files in (private) folder
  const pageFiles = glob.sync('**/page.{ts,tsx}', {
    cwd: appDir,
    absolute: false,
  });

  for (const file of pageFiles) {
    // Parse path segments
    const segments = file.replace(/\/page\.(ts|tsx)$/, '').split('/');

    // Remove empty segments
    const cleanSegments = segments.filter((s) => s && s !== '.');

    // Determine roles based on first segment
    let roles: UserRole[] = [];
    let startIndex = 0;

    if (cleanSegments.length > 0) {
      const firstSegment = cleanSegments[0];

      if (firstSegment === 'admin') {
        roles = [UserRole.ADMIN];
        startIndex = 1;
      } else if (firstSegment === 'client') {
        roles = [UserRole.CLIENT];
        startIndex = 1;
      } else if (firstSegment === 'employee') {
        roles = [UserRole.EMPLOYEE];
        startIndex = 1;
      } else if (firstSegment === '(shared)') {
        // Shared routes accessible by all authenticated users
        roles = [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD];
        startIndex = 1;
      } else {
        // Unknown structure, default to all roles
        roles = [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD];
      }
    }

    // Build route path (skip role-specific prefix)
    const routeSegments = cleanSegments.slice(startIndex);
    const routePath = '/' + (startIndex > 0 ? cleanSegments[0] + '/' : '') + routeSegments.join('/');

    // Handle dynamic routes [id] → :id
    const normalizedPath = routePath.replace(/\[([^\]]+)\]/g, ':$1');

    routes.push({
      path: normalizedPath || '/' + cleanSegments[0],
      roles,
      filePath: path.join(appDir, file),
    });
  }

  // Sort by path for consistent output
  routes.sort((a, b) => a.path.localeCompare(b.path));

  return routes;
}

/**
 * Compare generated routes with configured routes
 *
 * @param generated - Auto-generated routes from filesystem
 * @param configured - Manually configured routes
 * @returns Validation result with missing/extra routes
 */
export function validateRoutes(
  generated: RouteMetadata[],
  configured: RouteMetadata[],
): {
  isValid: boolean;
  missing: RouteMetadata[];
  extra: RouteMetadata[];
  mismatched: Array<{
    path: string;
    generated: UserRole[];
    configured: UserRole[];
  }>;
} {
  const generatedMap = new Map(generated.map((r) => [r.path, r]));
  const configuredMap = new Map(configured.map((r) => [r.path, r]));

  // Find missing routes (in filesystem but not in config)
  const missing = generated.filter((r) => !configuredMap.has(r.path));

  // Find extra routes (in config but not in filesystem)
  const extra = configured.filter((r) => !generatedMap.has(r.path));

  // Find mismatched roles
  const mismatched: Array<{
    path: string;
    generated: UserRole[];
    configured: UserRole[];
  }> = [];

  for (const [path, generatedRoute] of generatedMap) {
    const configuredRoute = configuredMap.get(path);
    if (configuredRoute) {
      // Compare roles (order-independent)
      const genRoles = new Set(generatedRoute.roles);
      const confRoles = new Set(configuredRoute.roles);

      const rolesMatch =
        genRoles.size === confRoles.size &&
        [...genRoles].every((r) => confRoles.has(r));

      if (!rolesMatch) {
        mismatched.push({
          path,
          generated: generatedRoute.roles,
          configured: configuredRoute.roles,
        });
      }
    }
  }

  const isValid = missing.length === 0 && extra.length === 0 && mismatched.length === 0;

  return { isValid, missing, extra, mismatched };
}

/**
 * Format validation results for display
 */
export function formatValidationResults(validation: ReturnType<typeof validateRoutes>): string {
  const lines: string[] = [];

  if (validation.isValid) {
    lines.push('✅ All routes are valid!');
    return lines.join('\n');
  }

  lines.push('❌ Route validation failed:\n');

  if (validation.missing.length > 0) {
    lines.push('📁 Missing from config (found in filesystem):');
    for (const route of validation.missing) {
      lines.push(`  - ${route.path} [${route.roles.join(', ')}]`);
      lines.push(`    File: ${route.filePath}`);
    }
    lines.push('');
  }

  if (validation.extra.length > 0) {
    lines.push('🗑️  Extra in config (not in filesystem):');
    for (const route of validation.extra) {
      lines.push(`  - ${route.path} [${route.roles.join(', ')}]`);
    }
    lines.push('');
  }

  if (validation.mismatched.length > 0) {
    lines.push('⚠️  Role mismatch:');
    for (const mismatch of validation.mismatched) {
      lines.push(`  - ${mismatch.path}`);
      lines.push(`    Generated: [${mismatch.generated.join(', ')}]`);
      lines.push(`    Configured: [${mismatch.configured.join(', ')}]`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
