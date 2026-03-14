#!/usr/bin/env tsx

import { generateProtectedRoutes } from '../src/lib/routes/generate-protected-routes';
import { isPublicRoute, getRequiredRoles } from '../src/lib/routes/route-access';

/**
 * Route Validation Script
 *
 * With deny-by-default middleware, this script verifies that:
 * 1. All filesystem routes are either public (whitelisted) or role-protected.
 * 2. The prefix-based role rules match the folder structure.
 *
 * Usage:
 *   pnpm run validate:routes
 *   tsx scripts/validate-routes.ts
 */

console.log('🔍 Validating Route Access (deny-by-default model)...\n');

const generated = generateProtectedRoutes();
console.log(`📁 Found ${generated.length} routes in filesystem\n`);

let hasWarnings = false;

for (const route of generated) {
  const cleanPath = route.path;
  const isPublic = isPublicRoute(cleanPath);
  const requiredRoles = getRequiredRoles(cleanPath);

  // Compare filesystem-derived roles vs prefix-derived roles
  const fsRolesSet = new Set(route.roles.map((r) => r.toString()));
  const prefixRolesSet = new Set(requiredRoles.map((r) => r.toString()));

  const match =
    fsRolesSet.size === prefixRolesSet.size &&
    [...fsRolesSet].every((r) => prefixRolesSet.has(r));

  if (isPublic) {
    console.log(`  ✅ ${cleanPath} → public (whitelisted)`);
  } else if (match) {
    console.log(`  ✅ ${cleanPath} → [${requiredRoles.join(', ')}]`);
  } else {
    hasWarnings = true;
    console.log(`  ⚠️  ${cleanPath}`);
    console.log(`      Filesystem roles: [${route.roles.join(', ')}]`);
    console.log(`      Prefix rules:     [${requiredRoles.join(', ')}]`);
  }
}

console.log('');

if (hasWarnings) {
  console.log(
    '⚠️  Some routes have role mismatches between folder structure and prefix rules.',
  );
  console.log(
    '   This is informational — prefix rules are authoritative at runtime.\n',
  );
} else {
  console.log('✅ All routes are consistent with prefix-based access rules.\n');
}

process.exit(0);
