// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - Authentication Logic Only
// packages/api/src/users/interfaces/user-authentication.interface.ts

import { LoginUserDto } from '../dto/login-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from '@prisma/client';

export interface IUserAuthentication {
  // Authentication Operations - Single Responsibility
  validateUser(loginDto: LoginUserDto): Promise<AuthenticatedUser | null>;
  validatePassword(userId: string, password: string): Promise<boolean>;
  changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void>;
  hashPassword(password: string): Promise<string>;

  // Token/Session Management (authentication-related)
  generatePasswordResetToken(userId: string): Promise<string>;
  validatePasswordResetToken(token: string): Promise<User | null>;
  invalidateUserSessions(userId: string): Promise<void>;
}

// Authentication Response Types
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  contactNumber: string | null;
  role: string;
  createdAt: Date;
  lastLogin: Date | null;
  emailVerified: Date | null;
}

export interface PasswordChangeResult {
  success: boolean;
  message: string;
}

export interface AuthPasswordResetResult {
  success: boolean;
  token?: string;
  expiresAt?: Date;
}
