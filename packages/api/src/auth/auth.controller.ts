import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { OnboardingDto } from '../users/dto/onboarding.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SendLoginCodeDto } from './dto/send-login-code.dto';
import { VerifyLoginCodeDto } from './dto/verify-login-code.dto';
import { TokenService } from './token.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  /**
   * User registration (ALI-115)
   * Rate limit: 20 requests per hour in production, 500 per minute in dev/test
   */
  @Post('register')
  @Throttle({
    medium: {
      limit: process.env.NODE_ENV === 'production' ? 20 : 10000,
      ttl: process.env.NODE_ENV === 'production' ? 3600000 : 60000, // 1 hour in prod, 1 min in dev/test
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '60d5ecb74f3b2c001c8b4566',
          email: 'user@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
          profileComplete: false,
          emailVerified: false,
          createdAt: '2024-06-29T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    schema: {
      example: {
        message: 'User with this email already exists',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        message: [
          'email must be a valid email',
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Too many registration attempts',
    schema: {
      example: {
        message: 'Too many requests. Please try again later.',
        error: 'Too Many Requests',
        statusCode: 429,
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /**
   * User login (ALI-115)
   * Rate limit: Uses global throttler (10000/min in dev/test, 100/min in production)
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '60d5ecb74f3b2c001c8b4566',
          email: 'user@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
          profileComplete: false,
          emailVerified: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Invalid email or password',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Too many login attempts',
    schema: {
      example: {
        message: 'Too many requests. Please try again later.',
        error: 'Too Many Requests',
        statusCode: 429,
      },
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Request() req, @Body() _loginDto: LoginUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Access token successfully refreshed',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'another-long-refresh-token',
        user: {
          id: '60d5ecb74f3b2c001c8b4566',
          email: 'user@example.com',
          name: 'John',
          lastName: 'Doe',
          role: 'USER',
          emailVerified: true,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired refresh token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('forgot-password')
  @Throttle({ medium: { limit: 20, ttl: 3600000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Error sending email' })
  @ApiResponse({ status: 429, description: 'Too many password reset requests' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('send-login-code')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send login code to email' })
  @ApiResponse({ status: 200, description: 'Login code sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async sendLoginCode(@Body() dto: SendLoginCodeDto) {
    return this.authService.sendLoginCode(dto.email);
  }

  @Post('verify-login-code')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify login code and return tokens' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async verifyLoginCode(@Body() dto: VerifyLoginCodeDto) {
    return this.authService.verifyLoginCode(dto.email, dto.code);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @Post('send-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send email verification' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 400,
    description: 'Email already verified or error sending email',
  })
  async sendEmailVerification(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.sendEmailVerification(forgotPasswordDto.email);
  }

  @Post('verify-email')
  @Throttle({ medium: { limit: 20, ttl: 3600000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiResponse({ status: 200, description: 'Email successfully verified' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too many verification attempts' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @SkipThrottle() // No rate limit needed for logout
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout user and invalidate all user sessions' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() req: { user: { id: string } }) {
    // Revocar todas las sesiones del usuario (invalidar todos los refresh tokens)
    const revokedCount = await this.tokenService.revokeAllUserSessions(
      req.user.id,
    );
    return {
      message: 'Logout successful',
      revokedSessions: revokedCount,
    };
  }

  /**
   * Complete user profile during onboarding (ALI-115)
   * Sets profileComplete=true after user provides additional info
   */
  @UseGuards(JwtAuthGuard)
  @Post('complete-profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Complete user profile during onboarding' })
  @ApiResponse({
    status: 200,
    description: 'Profile completed successfully',
    schema: {
      example: {
        message: 'Profile completed successfully',
        user: {
          id: '60d5ecb74f3b2c001c8b4566',
          email: 'user@example.com',
          firstname: 'John',
          lastname: 'Doe',
          phone: '+1234567890',
          company: 'Acme Inc.',
          address: '123 Main St',
          contactPerson: {
            name: 'Jane',
            lastname: 'Smith',
            phone: '+0987654321',
            email: 'jane@example.com',
          },
          profileComplete: true,
          role: 'CLIENT',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async completeProfile(
    @Request() req: { user: { userId: string } },
    @Body() onboardingDto: OnboardingDto,
  ) {
    return this.authService.completeProfile(req.user.userId, onboardingDto);
  }

  /**
   * Google OAuth - Initiate flow
   * Redirects user to Google consent screen
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @SkipThrottle()
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @ApiResponse({ status: 302, description: 'Redirects to Google consent screen' })
  async googleAuth() {
    // Guard redirects to Google automatically
  }

  /**
   * Google OAuth - Callback
   * Handles the callback from Google after user authorization.
   * Creates/links account, sets tokens, and redirects to frontend.
   *
   * Link mode: If oauth-link-mode cookie is set, the user initiated this
   * from their profile to connect their Google account. The flow uses
   * handleOAuthLogin (which auto-links by email match) but redirects
   * differently so the frontend doesn't overwrite the existing session.
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @SkipThrottle()
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with tokens' })
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    const oauthProfile = req.user;

    // Detect link mode from API-domain cookie (set by GoogleAuthGuard)
    const cookieHeader = (req.headers?.cookie as string) || '';
    const isLinkMode = cookieHeader.includes('oauth-link-mode=true');

    // Clear the link mode cookie
    if (isLinkMode) {
      res.clearCookie('oauth-link-mode', { path: '/' });
    }

    // handleOAuthLogin handles both cases:
    // - Existing account: logs in the linked user
    // - Existing user by email: creates Account link, then logs in
    // - New user: creates user + account
    const result = await this.authService.handleOAuthLogin(oauthProfile, 'google');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const callbackUrl = new URL('/api/auth/oauth-callback', frontendUrl);
    callbackUrl.searchParams.set('access_token', result.access_token);
    callbackUrl.searchParams.set('refresh_token', result.refresh_token);

    if (isLinkMode) {
      callbackUrl.searchParams.set('mode', 'link');
    }

    return res.redirect(callbackUrl.toString());
  }

  // Endpoints administrativos para gestión de sesiones
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('sessions/revoke-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke all user sessions (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All sessions revoked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async revokeAllSessions() {
    const revokedCount = await this.tokenService.revokeAllSessions();
    return {
      message: 'All user sessions have been revoked',
      revokedSessions: revokedCount,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('sessions/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Revoke all sessions for a specific user (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User sessions revoked successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async revokeUserSessions(@Param('userId') userId: string) {
    const revokedCount = await this.tokenService.revokeAllUserSessions(userId);
    return {
      message: `All sessions for user ${userId} have been revoked`,
      revokedSessions: revokedCount,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('sessions/cleanup')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Clean up expired tokens (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Expired tokens cleaned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async cleanupExpiredTokens() {
    const result = await this.tokenService.cleanExpiredTokens();
    return {
      message: 'Expired tokens cleaned successfully',
      cleaned: result,
    };
  }
}
