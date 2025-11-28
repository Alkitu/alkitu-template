import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  /**
   * Genera un token único de 32 caracteres
   */
  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Crea un token de reset de contraseña
   */
  async createPasswordResetToken(email: string): Promise<string> {
    const token = this.generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Eliminar tokens existentes para este email
    await this.prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Crear nuevo token
    await this.prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return token;
  }

  /**
   * Valida un token de reset de contraseña
   */
  async validatePasswordResetToken(
    token: string,
  ): Promise<{ valid: boolean; email?: string }> {
    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return { valid: false };
    }

    if (tokenRecord.expires < new Date()) {
      // Token expirado, eliminar
      await this.prisma.passwordResetToken.delete({
        where: { token },
      });
      return { valid: false };
    }

    return { valid: true, email: tokenRecord.email };
  }

  /**
   * Consume un token de reset de contraseña (lo elimina)
   */
  async consumePasswordResetToken(token: string): Promise<void> {
    await this.prisma.passwordResetToken.delete({
      where: { token },
    });
  }

  /**
   * Crea un token de verificación de email
   */
  async createEmailVerificationToken(email: string): Promise<string> {
    const token = this.generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Eliminar tokens existentes para este email
    await this.prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Crear nuevo token
    await this.prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    return token;
  }

  /**
   * Valida un token de verificación de email
   */
  async validateEmailVerificationToken(
    token: string,
  ): Promise<{ valid: boolean; email?: string }> {
    const tokenRecord = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return { valid: false };
    }

    if (tokenRecord.expires < new Date()) {
      // Token expirado, eliminar
      await this.prisma.verificationToken.delete({
        where: { token },
      });
      return { valid: false };
    }

    return { valid: true, email: tokenRecord.identifier };
  }

  /**
   * Consume un token de verificación de email (lo elimina)
   */
  async consumeEmailVerificationToken(token: string): Promise<void> {
    await this.prisma.verificationToken.delete({
      where: { token },
    });
  }

  /**
   * Limpia tokens expirados (para ejecutar periódicamente)
   */
  /**
   * Crea un token de refresco
   */
  async createRefreshToken(userId: string): Promise<string> {
    const token = this.generateToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expires,
      },
    });

    return token;
  }

  /**
   * Valida un token de refresco
   */
  async validateRefreshToken(
    token: string,
  ): Promise<{ valid: boolean; userId?: string }> {
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return { valid: false };
    }

    if (tokenRecord.expires < new Date()) {
      // Token expirado, eliminar
      await this.prisma.refreshToken.delete({
        where: { token },
      });
      return { valid: false };
    }

    return { valid: true, userId: tokenRecord.userId };
  }

  /**
   * Consume un token de refresco (lo elimina)
   */
  async consumeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  /**
   * Encuentra un token de refresco por su valor
   */
  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  /**
   * Verifica si un usuario tiene refresh tokens válidos
   * Útil para validar si las sesiones del usuario han sido revocadas
   */
  async userHasValidRefreshTokens(userId: string): Promise<boolean> {
    const validTokenCount = await this.prisma.refreshToken.count({
      where: {
        userId,
        expires: { gt: new Date() }, // Solo tokens no expirados
      },
    });

    return validTokenCount > 0;
  }

  /**
   * Revoca todas las sesiones de un usuario (elimina todos sus refresh tokens)
   */
  async revokeAllUserSessions(userId: string): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  /**
   * Revoca todas las sesiones de todos los usuarios (elimina todos los refresh tokens)
   */
  async revokeAllSessions(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({});
    return result.count;
  }

  /**
   * Limpia tokens expirados (para ejecutar periódicamente)
   */
  async cleanExpiredTokens(): Promise<{
    passwordResetTokens: number;
    verificationTokens: number;
    refreshTokens: number;
  }> {
    const now = new Date();

    const [passwordResetCount, verificationCount, refreshCount] =
      await Promise.all([
        this.prisma.passwordResetToken.deleteMany({
          where: { expires: { lt: now } },
        }),
        this.prisma.verificationToken.deleteMany({
          where: { expires: { lt: now } },
        }),
        this.prisma.refreshToken.deleteMany({
          where: { expires: { lt: now } },
        }),
      ]);

    return {
      passwordResetTokens: passwordResetCount.count,
      verificationTokens: verificationCount.count,
      refreshTokens: refreshCount.count,
    };
  }
}
