/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

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
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {}

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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.tokenService.createRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

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

    const payload = { email: user.email, sub: user.id, role: user.role };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.tokenService.createRefreshToken(user.id);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(createUserDto: any) {
    const user = await this.usersService.create(createUserDto);

    // Enviar email de bienvenida
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      await this.emailService.sendWelcomeEmail({
        userName: `${user.name} ${user.lastName}`.trim() || 'Usuario',
        userEmail: user.email,
        registrationDate: new Date().toLocaleDateString('es-ES'),
        loginUrl: `${frontendUrl}/login`,
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
        userName: `${user.name} ${user.lastName}`.trim() || 'Usuario',
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
    const user = await this.usersService.findByEmail(tokenValidation.email!);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);

    // Consumir token
    await this.tokenService.consumePasswordResetToken(token);

    // Enviar notificación de cambio exitoso
    try {
      await this.emailService.sendNotification(
        user.email,
        `${user.name} ${user.lastName}`.trim() || 'Usuario',
        'Contraseña actualizada',
        'Tu contraseña ha sido actualizada exitosamente. Si no fuiste tú quien realizó este cambio, contacta inmediatamente a soporte.',
        'Ir a Login',
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
      );
    } catch (error: any) {
      console.log(
        'Error enviando notificación de contraseña actualizada:',
        error.message,
      );
    }

    return { message: 'Contraseña actualizada exitosamente' };
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
        userName: `${user.name} ${user.lastName}`.trim() || 'Usuario',
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
    const user = await this.usersService.findByEmail(tokenValidation.email!);
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
        `${user.name} ${user.lastName}`.trim() || 'Usuario',
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
}
