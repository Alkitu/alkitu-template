import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaService } from '../prisma.service';

/**
 * Conditionally include GoogleStrategy only if GOOGLE_CLIENT_ID is configured.
 * This prevents startup errors when Google OAuth credentials are not set.
 */
const optionalProviders = [];
if (process.env.GOOGLE_CLIENT_ID) {
  optionalProviders.push(GoogleStrategy);
}

/**
 * Authentication Module (ALI-115 updated)
 * Added ThrottlerModule for rate limiting protection
 * Added Google OAuth strategy (conditional on GOOGLE_CLIENT_ID)
 */
@Module({
  imports: [
    forwardRef(() => UsersModule),
    EmailModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    // Rate limiting configuration (ALI-115)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 5, // 5 requests per minute (strict for login)
      },
      {
        name: 'medium',
        ttl: 3600000, // 1 hour
        limit: 20, // 20 requests per hour (registration, password reset)
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    ...optionalProviders,
    // RolesGuard should NOT be a global guard - it must execute AFTER JwtAuthGuard
    // Use @UseGuards(JwtAuthGuard, RolesGuard) at controller level instead
  ],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
