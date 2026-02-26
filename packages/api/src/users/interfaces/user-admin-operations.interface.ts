// ✅ SRP COMPLIANT: Single Responsibility - Admin Operations Only
// packages/api/src/users/interfaces/user-admin-operations.interface.ts

import type { ResetUserPasswordInput } from '../../trpc/schemas/user.schemas';

export interface IUserAdminOperations {
  // Admin-Specific Operations - Single Responsibility
  resetUserPassword(
    resetPasswordDto: ResetUserPasswordInput,
  ): Promise<PasswordResetResult>;
  adminChangePassword(userId: string, newPassword: string): Promise<void>;
  anonymizeUser(userId: string): Promise<AnonymizationResult>;
  createImpersonationToken(
    adminId: string,
    targetUserId: string,
  ): Promise<ImpersonationResult>;
  revokeImpersonationToken(token: string): Promise<void>;

  // Admin audit operations
  getAdminActionHistory(adminId: string, days?: number): Promise<AdminAction[]>;
  logAdminAction(
    adminId: string,
    action: string,
    targetUserId: string,
    metadata?: any,
  ): Promise<void>;

  // User management for admins
  forceUserLogout(userId: string): Promise<void>;
  suspendUser(
    userId: string,
    reason: string,
    suspendedBy: string,
  ): Promise<void>;
  unsuspendUser(userId: string, unsuspendedBy: string): Promise<void>;
}

// Admin Operations Response Types
export interface PasswordResetResult {
  success: boolean;
  message: string;
  tempPassword?: string; // Only if email not sent
  emailSent: boolean;
}

export interface AnonymizationResult {
  success: boolean;
  userId: string;
  anonymizedFields: string[];
  retainedFields: string[];
  timestamp: Date;
}

export interface ImpersonationResult {
  token: string;
  expiresAt: Date;
  targetUserId: string;
  adminId: string;
  restrictions?: string[];
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  targetUserId: string;
  metadata?: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export enum AdminActionType {
  PASSWORD_RESET = 'password.reset',
  PASSWORD_CHANGE = 'password.change',
  USER_ANONYMIZE = 'user.anonymize',
  IMPERSONATION_START = 'impersonation.start',
  IMPERSONATION_END = 'impersonation.end',
  USER_SUSPEND = 'user.suspend',
  USER_UNSUSPEND = 'user.unsuspend',
  FORCE_LOGOUT = 'user.force.logout',
}
