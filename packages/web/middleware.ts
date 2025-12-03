import { withAuthMiddleware } from './src/middleware/withAuthMiddleware';
import { chain } from './src/middleware/chain';

export default chain([withAuthMiddleware]);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
  ],
};
