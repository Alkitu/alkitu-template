/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { OnboardingDto } from '../users/dto/onboarding.dto';
import * as bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '@alkitu/shared';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private tokenService: TokenService,
    private prisma: PrismaService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // We'll skip last login update here as it's handled by UsersService.validateUser

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = user;
        return result;
      }
    }
    return null;
  }

  /**
   * User login (ALI-115)
   * Updated to use new field names and include profileComplete in JWT payload
   */
  async login(user: any) {
    // Mark user as active (session started)
    await this.usersService.updateSessionStatus(user.id, true);

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      profileComplete: user.profileComplete || false,
      emailVerified: !!user.emailVerified,
      status: user.status,
      isActive: true,
      provider: user.provider || 'local',
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.tokenService.createRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profileComplete: user.profileComplete,
        emailVerified: !!user.emailVerified,
      },
    };
  }

  /**
   * Refresh access token (ALI-115)
   * Updated to use new field names and JwtPayload interface
   */
  async refreshTokens(refreshToken: string) {
    const tokenValidation =
      await this.tokenService.validateRefreshToken(refreshToken);

    if (!tokenValidation.valid || !tokenValidation.userId) {
      throw new BadRequestException('Invalid or expired refresh token');
    }

    // Consume the old refresh token
    await this.tokenService.consumeRefreshToken(refreshToken);

    const user = await this.usersService.findOne(tokenValidation.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Determine provider from linked accounts (default to 'local')
    const accounts = await this.prisma.account.findFirst({
      where: { userId: user.id },
      select: { provider: true },
    });

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      profileComplete: user.profileComplete || false,
      emailVerified: !!user.emailVerified,
      status: user.status,
      isActive: user.isActive || false,
      provider: accounts?.provider || 'local',
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.tokenService.createRefreshToken(user.id);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profileComplete: user.profileComplete,
        emailVerified: !!user.emailVerified,
      },
    };
  }

  /**
   * User registration (ALI-115)
   * Updated to use CreateUserDto and set profileComplete=false by default
   * New field names: firstname, lastname, phone
   */
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    // Enviar email de bienvenida
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      await this.emailService.sendWelcomeEmail({
        userName: `${user.firstname} ${user.lastname}`.trim() || 'Usuario',
        userEmail: user.email,
        registrationDate: new Date().toLocaleDateString('es-ES'),
        loginUrl: `${frontendUrl}/auth/login`,
        unsubscribeUrl: `${frontendUrl}/unsubscribe`,
        supportUrl: `${frontendUrl}/support`,
      });
    } catch (error: any) {
      console.log('Error enviando email de bienvenida:', error.message);
      // No fallar el registro si el email falla
    }

    return user;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Verificar que el usuario existe
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('No se encontró un usuario con ese email');
    }

    // Generar token de reset
    const resetToken = await this.tokenService.createPasswordResetToken(email);

    // Enviar email de reset
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      await this.emailService.sendPasswordResetEmail({
        userName: `${user.firstname} ${user.lastname}`.trim() || 'Usuario',
        userEmail: user.email,
        resetUrl: `${frontendUrl}/reset-password?token=${resetToken}`,
        supportUrl: `${frontendUrl}/support`,
        securityUrl: `${frontendUrl}/security`,
      });

      return {
        message:
          'Se ha enviado un email con las instrucciones para restablecer tu contraseña',
      };
    } catch {
      throw new BadRequestException(
        'Error enviando el email de restablecimiento',
      );
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // Validar token
    const tokenValidation =
      await this.tokenService.validatePasswordResetToken(token);
    if (!tokenValidation.valid) {
      throw new BadRequestException('Token inválido o expirado');
    }

    // Buscar usuario
    if (!tokenValidation.email) {
      throw new BadRequestException('Token inválido - email no encontrado');
    }
    const user = await this.usersService.findByEmail(tokenValidation.email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await this.usersService.updatePassword(user.id, hashedPassword);

    // Consumir token
    await this.tokenService.consumePasswordResetToken(token);

    // Enviar notificación de cambio exitoso
    try {
      await this.emailService.sendNotification(
        user.email,
        `${user.firstname} ${user.lastname}`.trim() || 'Usuario',
        'Contraseña actualizada',
        'Tu contraseña ha sido actualizada exitosamente. Si no fuiste tú quien realizó este cambio, contacta inmediatamente a soporte.',
        'Ir a Login',
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login`,
      );
    } catch (error: any) {
      console.log(
        'Error enviando notificación de contraseña actualizada:',
        error.message,
      );
    }

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async sendLoginCode(email: string): Promise<{ message: string }> {
    // Verificar que el usuario existe
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('No se encontró un usuario con ese email');
    }

    // Generar código de login
    const code = await this.tokenService.createLoginCode(email);

    // Enviar email con código
    try {
      await this.emailService.sendLoginCodeEmail({
        userName: `${user.firstname} ${user.lastname}`.trim() || 'Usuario',
        userEmail: user.email,
        code,
      });

      return {
        message: 'Se ha enviado un código de acceso a tu email',
      };
    } catch {
      throw new BadRequestException(
        'Error enviando el email con el código de acceso',
      );
    }
  }

  async verifyLoginCode(
    email: string,
    code: string,
  ): Promise<{ access_token: string; refresh_token: string; user: any }> {
    // Validar código
    const codeValidation = await this.tokenService.validateLoginCode(
      email,
      code,
    );

    if (!codeValidation.valid) {
      // Incrementar intentos fallidos
      await this.tokenService.incrementLoginCodeAttempts(email);
      throw new BadRequestException('Código inválido o expirado');
    }

    // Buscar usuario
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Consumir código
    await this.tokenService.consumeLoginCode(email);

    // Marcar sesión como activa
    await this.usersService.updateSessionStatus(user.id, true);

    // Generar tokens (mismo patrón que login())
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      profileComplete: user.profileComplete || false,
      emailVerified: !!user.emailVerified,
      status: user.status,
      isActive: true,
      provider: 'login-code',
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.tokenService.createRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profileComplete: user.profileComplete,
        emailVerified: !!user.emailVerified,
      },
    };
  }

  async sendEmailVerification(email: string): Promise<{ message: string }> {
    // Verificar que el usuario existe
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('No se encontró un usuario con ese email');
    }

    if (user.emailVerified) {
      throw new BadRequestException('El email ya está verificado');
    }

    // Generar token de verificación
    const verificationToken =
      await this.tokenService.createEmailVerificationToken(email);

    // Enviar email de verificación
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      await this.emailService.sendEmailVerification({
        userName: `${user.firstname} ${user.lastname}`.trim() || 'Usuario',
        userEmail: user.email,
        verificationUrl: `${frontendUrl}/verify-email?token=${verificationToken}`,
        supportUrl: `${frontendUrl}/support`,
      });

      return { message: 'Se ha enviado un email de verificación' };
    } catch {
      throw new BadRequestException('Error enviando el email de verificación');
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    // Validar token
    const tokenValidation =
      await this.tokenService.validateEmailVerificationToken(token);
    if (!tokenValidation.valid) {
      throw new BadRequestException('Token inválido o expirado');
    }

    // Buscar usuario
    if (!tokenValidation.email) {
      throw new BadRequestException('Token inválido - email no encontrado');
    }
    const user = await this.usersService.findByEmail(tokenValidation.email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Marcar email como verificado
    await this.usersService.markEmailAsVerified(user.id);

    // Consumir token
    await this.tokenService.consumeEmailVerificationToken(token);

    // Enviar notificación de verificación exitosa
    try {
      await this.emailService.sendNotification(
        user.email,
        `${user.firstname} ${user.lastname}`.trim() || 'Usuario',
        '¡Email verificado exitosamente!',
        'Tu dirección de email ha sido verificada. Ya puedes disfrutar de todas las funcionalidades de Alkitu.',
        'Ir al Dashboard',
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
      );
    } catch (error: any) {
      console.log(
        'Error enviando notificación de email verificado:',
        error.message,
      );
    }

    return { message: 'Email verificado exitosamente' };
  }

  /**
   * Complete user profile during onboarding (ALI-115)
   * Sets profileComplete=true after user provides additional information
   */
  async completeProfile(userId: string, onboardingDto: OnboardingDto) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Update user with onboarding data and mark profile as complete
    const updatedUser = await this.usersService.update(userId, {
      ...onboardingDto,
      profileComplete: true,
    });

    // Attempt automatic verification if email verified AND profile complete
    await this.usersService.attemptUserVerification(userId);

    // Send profile completion notification
    try {
      await this.emailService.sendNotification(
        updatedUser.email,
        `${updatedUser.firstname} ${updatedUser.lastname}`.trim() || 'Usuario',
        '¡Perfil completado exitosamente!',
        'Has completado tu perfil en Alkitu. Ahora puedes acceder a todas las funcionalidades de la plataforma.',
        'Ir al Dashboard',
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
      );
    } catch (error: any) {
      console.log(
        'Error enviando notificación de perfil completado:',
        error.message,
      );
    }

    return {
      message: 'Profile completed successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        phone: updatedUser.phone,
        company: updatedUser.company,
        address: updatedUser.address,
        contactPerson: updatedUser.contactPerson,
        profileComplete: updatedUser.profileComplete,
        role: updatedUser.role,
      },
    };
  }

  /**
   * User logout - marks session as inactive
   */
  async logout(userId: string): Promise<void> {
    await this.usersService.updateSessionStatus(userId, false);
  }

  /**
   * Handle OAuth login/registration flow
   *
   * 1. Look up existing Account by provider + providerAccountId
   * 2. If found -> login the linked User
   * 3. If not found -> find User by email
   *    a. If User exists -> create Account and link
   *    b. If no User -> create User (no password, emailVerified) + Account
   * 4. Return tokens with provider in JWT
   */
  async handleOAuthLogin(
    oauthProfile: {
      providerAccountId: string;
      email: string;
      firstname: string;
      lastname: string;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
    },
    provider: string,
  ) {
    // Step 1: Check for existing Account
    const existingAccount = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: oauthProfile.providerAccountId,
        },
      },
      include: { user: true },
    });

    if (existingAccount) {
      // Account exists -> login the linked user
      const user = existingAccount.user;
      return this.loginWithProvider(user, provider);
    }

    // Step 2: No Account found, check if User exists by email
    const existingUser = await this.usersService.findByEmail(oauthProfile.email);

    if (existingUser) {
      // User exists -> create Account and link
      await this.prisma.account.create({
        data: {
          userId: existingUser.id,
          type: 'oauth',
          provider,
          providerAccountId: oauthProfile.providerAccountId,
          access_token: oauthProfile.accessToken,
          refresh_token: oauthProfile.refreshToken,
        },
      });

      return this.loginWithProvider(existingUser, provider);
    }

    // Step 3: Neither Account nor User exists -> create both
    const newUser = await this.prisma.user.create({
      data: {
        email: oauthProfile.email,
        password: null,
        firstname: oauthProfile.firstname,
        lastname: oauthProfile.lastname,
        image: oauthProfile.image,
        emailVerified: new Date(),
        profileComplete: false,
        status: 'PENDING',
        role: 'CLIENT',
        terms: true,
        accounts: {
          create: {
            type: 'oauth',
            provider,
            providerAccountId: oauthProfile.providerAccountId,
            access_token: oauthProfile.accessToken,
            refresh_token: oauthProfile.refreshToken,
          },
        },
      },
    });

    return this.loginWithProvider(newUser, provider);
  }

  /**
   * Link an OAuth account to an existing user (from profile page)
   *
   * 1. Check if the provider+providerAccountId is already linked to a different user
   * 2. Check if the user already has this provider linked
   * 3. Create the Account record
   */
  async linkOAuthAccount(
    userId: string,
    oauthProfile: {
      providerAccountId: string;
      email: string;
      firstname: string;
      lastname: string;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
    },
    provider: string,
  ) {
    // Check if this provider account is already linked to another user
    const existingAccount = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: oauthProfile.providerAccountId,
        },
      },
    });

    if (existingAccount && existingAccount.userId !== userId) {
      throw new BadRequestException(
        'This Google account is already linked to another user',
      );
    }

    // Check if user already has this provider linked
    const userAccount = await this.prisma.account.findFirst({
      where: { userId, provider },
    });

    if (userAccount) {
      throw new BadRequestException('Google account already connected');
    }

    // Create the link
    await this.prisma.account.create({
      data: {
        userId,
        type: 'oauth',
        provider,
        providerAccountId: oauthProfile.providerAccountId,
        access_token: oauthProfile.accessToken,
        refresh_token: oauthProfile.refreshToken,
      },
    });

    return { success: true };
  }

  /**
   * Generate tokens with provider information for OAuth users
   */
  private async loginWithProvider(user: any, provider: string) {
    await this.usersService.updateSessionStatus(user.id, true);

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      profileComplete: user.profileComplete || false,
      emailVerified: !!user.emailVerified,
      status: user.status,
      isActive: true,
      provider,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.tokenService.createRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        profileComplete: user.profileComplete,
        emailVerified: !!user.emailVerified,
      },
    };
  }
}
