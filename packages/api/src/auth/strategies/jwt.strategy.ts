/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { TokenService } from '../token.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * JWT Authentication Strategy (ALI-115)
 * Updated to use JwtPayload interface with new field names
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Doble validación opcional: verificar refresh tokens válidos
    // Esto permite revocar sesiones inmediatamente al eliminar refresh tokens
    // Configurable via ENFORCE_REFRESH_TOKEN_VALIDATION=true
    const enforceRefreshTokenValidation =
      process.env.ENFORCE_REFRESH_TOKEN_VALIDATION === 'true';

    if (enforceRefreshTokenValidation) {
      const hasValidRefreshTokens =
        await this.tokenService.userHasValidRefreshTokens(payload.sub);

      if (!hasValidRefreshTokens) {
        throw new UnauthorizedException('Session has been revoked');
      }
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      firstname: payload.firstname,
      lastname: payload.lastname,
      profileComplete: payload.profileComplete,
      emailVerified: payload.emailVerified,
    };
  }
}
