import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // If this is a link request (user wants to connect their Google account),
    // persist the intent through the OAuth redirect via an API-domain cookie.
    if (request.query?.link === 'true') {
      response.cookie('oauth-link-mode', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 5 * 60 * 1000, // 5 minutes
        path: '/',
      });
    }

    return super.canActivate(context);
  }
}
