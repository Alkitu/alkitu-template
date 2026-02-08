import { Injectable } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Define proper user data type
export interface UserData {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: Date | null;
  lastLogin: Date | null;
  twoFactorEnabled?: boolean;
}

// ✅ LSP: Base Authentication Interface
// All implementations must be substitutable without affecting correctness
export interface IAuthenticationService {
  validateCredentials(
    email: string,
    password: string,
  ): Promise<AuthenticationResult>;
  hashPassword(password: string): Promise<string>;
  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  generateToken(userId: string): Promise<string>;
  validateToken(token: string): Promise<TokenValidationResult>;
}

// ✅ LSP: Authentication Result Types
export interface AuthenticationResult {
  success: boolean;
  user?: UserAuthData;
  token?: string;
  message: string;
}

export interface TokenValidationResult {
  valid: boolean;
  userId?: string;
  expiresAt?: Date;
  message: string;
}

export interface UserAuthData {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLogin: Date | null;
}

// ✅ LSP COMPLIANT: Base Authentication Service
// This can be substituted by any subclass without breaking functionality
@Injectable()
export abstract class BaseAuthenticationService
  implements IAuthenticationService
{
  // ✅ LSP: Template method pattern - subclasses can override specific parts
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<AuthenticationResult> {
    try {
      // Step 1: Find user (can be overridden by subclasses)
      const user = await this.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Step 2: Check user status (can be overridden by subclasses)
      const statusCheck = await this.checkUserStatus(user);
      if (!statusCheck.allowed) {
        return {
          success: false,
          message: statusCheck.reason,
        };
      }

      // Step 3: Validate password (can be overridden by subclasses)
      const passwordValid = await this.validatePassword(
        password,
        user.password,
      );
      if (!passwordValid) {
        await this.handleFailedLogin(user.id);
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Step 4: Generate token (can be overridden by subclasses)
      const token = await this.generateToken(user.id);

      // Step 5: Update last login (can be overridden by subclasses)
      await this.updateLastLogin(user.id);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified !== null,
          lastLogin: new Date(),
        },
        token,
        message: 'Authentication successful',
      };
    } catch {
      return {
        success: false,
        message: 'Authentication failed due to system error',
      };
    }
  }

  // ✅ LSP: Standard password hashing implementation
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // ✅ LSP: Standard password comparison implementation
  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // ✅ LSP: Abstract methods that subclasses must implement
  abstract findUserByEmail(email: string): Promise<UserData | null>;
  abstract checkUserStatus(
    user: UserData,
  ): Promise<{ allowed: boolean; reason: string }>;
  abstract validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;
  abstract generateToken(userId: string): Promise<string>;
  abstract validateToken(token: string): Promise<TokenValidationResult>;
  abstract handleFailedLogin(userId: string): Promise<void>;
  abstract updateLastLogin(userId: string): Promise<void>;
}

// ✅ LSP COMPLIANT: Standard Authentication Service
// Can be substituted for BaseAuthenticationService without issues
@Injectable()
export class StandardAuthenticationService extends BaseAuthenticationService {
  // ✅ LSP: Implements abstract methods maintaining contract
  async findUserByEmail(email: string): Promise<UserData | null> {
    // Mock implementation - in real app would use repository
    if (email === 'test@example.com') {
      return {
        id: '1',
        email: 'test@example.com',
        firstname: 'Test User',
        lastname: 'User',
        password: await this.hashPassword('password123'),
        role: UserRole.CLIENT,
        status: UserStatus.VERIFIED,
        emailVerified: new Date(),
        lastLogin: null,
      };
    }
    return null;
  }

  checkUserStatus(
    user: UserData,
  ): Promise<{ allowed: boolean; reason: string }> {
    if (user.status === UserStatus.SUSPENDED) {
      return Promise.resolve({
        allowed: false,
        reason: 'Account is suspended',
      });
    }
    if (user.status === UserStatus.ANONYMIZED) {
      return Promise.resolve({
        allowed: false,
        reason: 'Account is deactivated',
      });
    }
    return Promise.resolve({ allowed: true, reason: 'Account is active' });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await this.comparePassword(password, hashedPassword);
  }

  generateToken(userId: string): Promise<string> {
    // Mock implementation - in real app would use JWT
    const timestamp = Date.now();
    const token = Buffer.from(`${userId}:${timestamp}`).toString('base64');
    return Promise.resolve(token);
  }

  validateToken(token: string): Promise<TokenValidationResult> {
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const [userId, timestamp] = decoded.split(':');

      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (tokenAge > maxAge) {
        return Promise.resolve({
          valid: false,
          message: 'Token has expired',
        });
      }

      return Promise.resolve({
        valid: true,
        userId,
        expiresAt: new Date(parseInt(timestamp) + maxAge),
        message: 'Token is valid',
      });
    } catch {
      return Promise.resolve({
        valid: false,
        message: 'Invalid token format',
      });
    }
  }

  handleFailedLogin(userId: string): Promise<void> {
    // Mock implementation - in real app would track failed attempts
    console.log(`Failed login attempt for user ${userId}`);
    return Promise.resolve();
  }

  updateLastLogin(userId: string): Promise<void> {
    // Mock implementation - in real app would update database
    console.log(`Updated last login for user ${userId}`);
    return Promise.resolve();
  }
}

// ✅ LSP COMPLIANT: Enhanced Authentication Service
// Can be substituted for BaseAuthenticationService, adds extra features
@Injectable()
export class EnhancedAuthenticationService extends BaseAuthenticationService {
  private failedAttempts = new Map<
    string,
    { count: number; lastAttempt: Date }
  >();
  private readonly maxFailedAttempts = 5;
  private readonly lockoutDuration = 30 * 60 * 1000; // 30 minutes

  // ✅ LSP: Overrides base behavior while maintaining contract
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<AuthenticationResult> {
    // Check if account is locked
    if (await this.isAccountLocked(email)) {
      return {
        success: false,
        message:
          'Account is temporarily locked due to too many failed attempts',
      };
    }

    // Call parent implementation
    const result = await super.validateCredentials(email, password);

    // Reset failed attempts on successful login
    if (result.success) {
      this.failedAttempts.delete(email);
    }

    return result;
  }

  async findUserByEmail(email: string): Promise<UserData | null> {
    // Enhanced user lookup with additional fields
    if (email === 'admin@example.com') {
      return {
        id: '2',
        email: 'admin@example.com',
        firstname: 'Admin User',
        lastname: 'Administrator',
        password: await this.hashPassword('admin123'),
        role: UserRole.ADMIN,
        status: UserStatus.VERIFIED,
        emailVerified: new Date(),
        lastLogin: null,
        twoFactorEnabled: true,
      };
    }
    if (email === 'test@example.com') {
      return {
        id: '1',
        email: 'test@example.com',
        firstname: 'Test User',
        lastname: 'User',
        password: await this.hashPassword('password123'),
        role: UserRole.CLIENT,
        status: UserStatus.VERIFIED,
        emailVerified: new Date(),
        lastLogin: null,
        twoFactorEnabled: false,
      };
    }
    return null;
  }

  async checkUserStatus(
    user: UserData,
  ): Promise<{ allowed: boolean; reason: string }> {
    // Enhanced status checking
    const baseCheck = await this.checkUserStatusBase(user);
    if (!baseCheck.allowed) {
      return baseCheck;
    }

    // Additional checks for enhanced service
    if (!user.emailVerified) {
      return { allowed: false, reason: 'Email address not verified' };
    }

    return { allowed: true, reason: 'Account is verified and active' };
  }

  private checkUserStatusBase(
    user: UserData,
  ): Promise<{ allowed: boolean; reason: string }> {
    if (user.status === UserStatus.SUSPENDED) {
      return Promise.resolve({
        allowed: false,
        reason: 'Account is suspended',
      });
    }
    if (user.status === UserStatus.ANONYMIZED) {
      return Promise.resolve({
        allowed: false,
        reason: 'Account is deactivated',
      });
    }
    return Promise.resolve({ allowed: true, reason: 'Account is active' });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await this.comparePassword(password, hashedPassword);
  }

  generateToken(userId: string): Promise<string> {
    // Enhanced token generation with more security
    const timestamp = Date.now();
    const randomBytes = Math.random().toString(36).substring(2);
    const token = Buffer.from(`${userId}:${timestamp}:${randomBytes}`).toString(
      'base64',
    );
    return Promise.resolve(token);
  }

  validateToken(token: string): Promise<TokenValidationResult> {
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      const parts = decoded.split(':');

      if (parts.length !== 3) {
        return Promise.resolve({
          valid: false,
          message: 'Invalid token format',
        });
      }

      const [userId, timestamp] = parts;

      // Check if token is expired (12 hours for enhanced security)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 12 * 60 * 60 * 1000; // 12 hours

      if (tokenAge > maxAge) {
        return Promise.resolve({
          valid: false,
          message: 'Token has expired',
        });
      }

      return Promise.resolve({
        valid: true,
        userId,
        expiresAt: new Date(parseInt(timestamp) + maxAge),
        message: 'Token is valid',
      });
    } catch {
      return Promise.resolve({
        valid: false,
        message: 'Invalid token format',
      });
    }
  }

  async handleFailedLogin(userId: string): Promise<void> {
    const user = await this.findUserByEmail(userId);
    if (!user) return;

    const attempts = this.failedAttempts.get(user.email) || {
      count: 0,
      lastAttempt: new Date(),
    };
    attempts.count++;
    attempts.lastAttempt = new Date();

    this.failedAttempts.set(user.email, attempts);

    console.log(`Failed login attempt ${attempts.count} for user ${userId}`);
  }

  updateLastLogin(userId: string): Promise<void> {
    console.log(`Updated last login for user ${userId} with enhanced tracking`);
    return Promise.resolve();
  }

  // ✅ LSP: Additional methods that don't break substitutability
  private isAccountLocked(email: string): Promise<boolean> {
    const attempts = this.failedAttempts.get(email);
    if (!attempts) return Promise.resolve(false);

    if (attempts.count >= this.maxFailedAttempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
      if (timeSinceLastAttempt < this.lockoutDuration) {
        return Promise.resolve(true);
      } else {
        // Reset attempts after lockout period
        this.failedAttempts.delete(email);
        return Promise.resolve(false);
      }
    }

    return Promise.resolve(false);
  }

  unlockAccount(email: string): Promise<void> {
    this.failedAttempts.delete(email);
    console.log(`Account unlocked for ${email}`);
    return Promise.resolve();
  }
}

// ✅ LSP COMPLIANT: Two-Factor Authentication Service
// Can be substituted for BaseAuthenticationService, adds 2FA
@Injectable()
export class TwoFactorAuthenticationService extends EnhancedAuthenticationService {
  // ✅ LSP: Extends behavior while maintaining contract
  async validateCredentials(
    email: string,
    password: string,
    twoFactorCode?: string,
  ): Promise<AuthenticationResult> {
    // First validate standard credentials
    const baseResult = await super.validateCredentials(email, password);

    if (!baseResult.success) {
      return baseResult;
    }

    // Check if user has 2FA enabled
    const user = await this.findUserByEmail(email);
    if (user?.twoFactorEnabled) {
      if (!twoFactorCode) {
        return {
          success: false,
          message: 'Two-factor authentication code required',
        };
      }

      const twoFactorValid = await this.validateTwoFactorCode(
        user.id,
        twoFactorCode,
      );
      if (!twoFactorValid) {
        return {
          success: false,
          message: 'Invalid two-factor authentication code',
        };
      }
    }

    return baseResult;
  }

  private validateTwoFactorCode(
    _userId: string,
    code: string,
  ): Promise<boolean> {
    // Mock implementation - in real app would validate TOTP code
    return Promise.resolve(code === '123456');
  }

  generateTwoFactorSecret(userId: string): Promise<string> {
    // Mock implementation - in real app would generate TOTP secret
    return Promise.resolve(`secret_${userId}_${Date.now()}`);
  }

  enableTwoFactor(userId: string): Promise<boolean> {
    // Mock implementation - in real app would save secret to database
    console.log(`Two-factor authentication enabled for user ${userId}`);
    return Promise.resolve(true);
  }

  disableTwoFactor(userId: string): Promise<boolean> {
    // Mock implementation - in real app would remove secret from database
    console.log(`Two-factor authentication disabled for user ${userId}`);
    return Promise.resolve(true);
  }
}

// ✅ LSP BENEFITS DEMONSTRATED:
// 1. Any subclass can be substituted for the base class without breaking functionality
// 2. All implementations maintain the same interface contract
// 3. Subclasses can extend behavior without violating the contract
// 4. Clients can use any implementation without knowing the specific type
// 5. New authentication methods can be added without changing existing code

// Example usage demonstrating LSP:
/*
function authenticateUser(authService: IAuthenticationService, email: string, password: string) {
  // This function works with ANY implementation of IAuthenticationService
  return authService.validateCredentials(email, password);
}

// All of these work the same way:
const standardAuth = new StandardAuthenticationService();
const enhancedAuth = new EnhancedAuthenticationService();
const twoFactorAuth = new TwoFactorAuthenticationService();

// LSP: These are all substitutable
await authenticateUser(standardAuth, 'test@example.com', 'password123');
await authenticateUser(enhancedAuth, 'test@example.com', 'password123');
await authenticateUser(twoFactorAuth, 'test@example.com', 'password123');
*/
