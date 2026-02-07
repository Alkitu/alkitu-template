import { withAuthMiddleware } from './src/middleware/withAuthMiddleware';
import { withI18nMiddleware } from './src/middleware/withI18nMiddleware';
import { withFeatureFlagMiddleware } from './src/middleware/withFeatureFlagMiddleware';
import { chain } from './src/middleware/chain';

/**
 * Middleware Chain Order:
 * 1. withI18nMiddleware - Handle internationalization
 * 2. withAuthMiddleware - Authenticate user and check roles
 * 3. withFeatureFlagMiddleware - Check feature flag requirements
 */
export default chain([
  withI18nMiddleware,
  withAuthMiddleware,
  withFeatureFlagMiddleware,
]);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
  ],
};
