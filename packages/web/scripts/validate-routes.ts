#!/usr/bin/env tsx

import { generateProtectedRoutes, validateRoutes, formatValidationResults } from '../src/lib/routes/generate-protected-routes';
import { PROTECTED_ROUTES } from '../src/lib/routes/protected-routes';

/**
 * Route Validation Script
 *
 * Validates that all protected routes in the filesystem
 * are properly configured in protected-routes.ts
 *
 * Usage:
 *   npm run validate:routes
 *   tsx scripts/validate-routes.ts
 */

console.log('🔍 Validating Protected Routes...\n');

// Generate routes from filesystem
const generated = generateProtectedRoutes();
console.log(`📁 Found ${generated.length} routes in filesystem`);
console.log(`📋 Found ${PROTECTED_ROUTES.length} routes in config\n`);

// Validate against configured routes
const validation = validateRoutes(generated, PROTECTED_ROUTES);

// Display results
console.log(formatValidationResults(validation));

// Exit with appropriate code
if (validation.isValid) {
  console.log('✅ Route validation successful!');
  process.exit(0);
} else {
  console.log('❌ Route validation failed. Please update protected-routes.ts');
  console.log('\nTo fix:');
  console.log('  1. Review the missing/extra routes above');
  console.log('  2. Update packages/web/src/lib/routes/protected-routes.ts');
  console.log('  3. Run: npm run validate:routes\n');
  process.exit(1);
}
