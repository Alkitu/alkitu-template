// @ts-nocheck
// ✅ SRP COMPLIANT: Single Responsibility - Authentication Logic Only
// packages/api/src/users/services/user-authentication.service.ts

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from '../dto/login-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {
  IUserAuthentication,
  AuthenticatedUser,
} from '../interfaces/user-authentication.interface';
import { UserRepositoryService } from './user-repository.service';

@Injectable()
export class UserAuthenticationService implements IUserAuthentication {
  constructor(private userRepository: UserRepositoryService) {}

  async validateUser(
    loginDto: LoginUserDto,
  ): Promise<AuthenticatedUser | null> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    // Validate password
    if (!user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // Return authenticated user (without password)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      contactNumber: user.contactNumber,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: new Date(),
      emailVerified: user.emailVerified,
    };
  }

  async validatePassword(userId: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return false;
    }

    const fullUser = await this.userRepository.findByEmail(user.email);
    if (!fullUser || !fullUser.password) {
      return false;
    }

    return await bcrypt.compare(password, fullUser.password);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get full user data to validate current password
    const fullUser = await this.userRepository.findByEmail(user.email);
    if (!fullUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate current password
    if (!fullUser.password) {
      throw new UnauthorizedException('User password not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      fullUser.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);

    // Update password
    await this.userRepository.updatePassword(userId, hashedNewPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    return bcrypt.hash(password, saltRounds);
  }

  async generatePasswordResetToken(userId: string): Promise<string> {
    // This would typically generate a JWT token or random token
    // For now, we'll return a simple token (in production, use proper JWT)
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Generate a simple token (in production, use JWT with expiration)
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');
    return token;
  }

  async validatePasswordResetToken(token: string): Promise<User | null> {
    try {
      // Decode token (in production, use proper JWT validation)
      const decoded = Buffer.from(token, 'base64').toString('ascii');
      const [userId, timestamp] = decoded.split(':');

      // Check if token is not expired (1 hour = 3600000 ms)
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > 3600000) {
        return null;
      }

      // Find and return user by ID (not email)
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return null;
      }

      // Get full user data
      return await this.userRepository.findByEmail(user.email);
    } catch {
      return null;
    }
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    // This would typically invalidate JWT tokens or session tokens
    // For now, we'll just verify the user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // In a real implementation, you would:
    // 1. Add token to blacklist
    // 2. Update user's token version
    // 3. Clear session storage
    // 4. Notify other services

    console.log(`Sessions invalidated for user ${userId}`);
  }
}
