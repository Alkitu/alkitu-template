import { withAuthMiddleware } from './src/middleware/withAuthMiddleware';
import { withI18nMiddleware } from './src/middleware/withI18nMiddleware';
import { chain } from './src/middleware/chain';

export default chain([withI18nMiddleware, withAuthMiddleware]);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
  ],
};
