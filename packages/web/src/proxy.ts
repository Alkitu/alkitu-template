import { chain } from "./middleware/chain";
import { withI18nMiddleware } from './middleware/withI18nMiddleware';
import { withAuthMiddleware } from './middleware/withAuthMiddleware';

export default chain([withAuthMiddleware, withI18nMiddleware]);

export const config = {
  matcher: [
    // Incluir todas las rutas excepto assets y API
    '/((?!api|_next|.*\\.).*)',
  ],
};
