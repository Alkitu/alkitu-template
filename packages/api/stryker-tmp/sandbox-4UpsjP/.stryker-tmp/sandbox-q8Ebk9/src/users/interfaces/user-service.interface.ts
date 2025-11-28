// @ts-nocheck
// 
import { User, UserRole, UserStatus } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateUserTagsDto } from '../dto/update-user-tags.dto';
// Import types from other interfaces
import { UserStats } from './user-analytics.interface';

// Define PaginationResult type locally
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Core User Service Interface
 * Handles basic user management operations
 * Following Single Responsibility Principle
 */
export interface IUserService {
  createUser(userData: CreateUserDto): Promise<User>;
  getUserById(id: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  getUsers(filters: FilterUsersDto): Promise<PaginationResult<User>>;
  updateUser(id: string, userData: UpdateUserDto): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Tag management
  updateUserTags(userId: string, tagData: UpdateUserTagsDto): Promise<User>;

  // Email verification
  markEmailAsVerified(userId: string): Promise<User>;

  // Basic queries
  userExists(id: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
}

/**
 * User Bulk Operations Service Interface
 * Handles bulk operations on multiple users
 * Separated to follow Single Responsibility Principle
 */
export interface IUserBulkService {
  bulkCreateUsers(users: CreateUserDto[]): Promise<User[]>;
  bulkUpdateRole(userIds: string[], role: UserRole): Promise<number>;
  bulkUpdateStatus(userIds: string[], status: UserStatus): Promise<number>;
  bulkDeleteUsers(userIds: string[]): Promise<number>;

  // Bulk tag operations
  bulkAddTags(userIds: string[], tagIds: string[]): Promise<number>;
  bulkRemoveTags(userIds: string[], tagIds: string[]): Promise<number>;

  // Bulk group operations
  bulkAddToGroups(userIds: string[], groupIds: string[]): Promise<number>;
  bulkRemoveFromGroups(userIds: string[], groupIds: string[]): Promise<number>;
}

/**
 * User Analytics Service Interface
 * Handles user statistics and analytics
 * Separated to follow Single Responsibility Principle
 */
export interface IUserAnalyticsService {
  getUserStats(): Promise<UserStats>;
  getUserGrowthStats(
    days: number,
  ): Promise<Array<{ date: string; count: number }>>;
  getActiveUsersCount(days: number): Promise<number>;
  getInactiveUsersCount(days: number): Promise<number>;
  getUsersByRole(role: UserRole): Promise<User[]>;
  getUsersByStatus(status: UserStatus): Promise<User[]>;
  getRecentUsers(days: number): Promise<User[]>;

  // Advanced analytics
  getUserEngagementMetrics(userId: string): Promise<any>;
  getUserRetentionStats(cohortDays: number): Promise<any>;
  getUserSegmentationData(): Promise<any>;
}

/**
 * User Search Service Interface
 * Handles user search and filtering operations
 * Separated to follow Single Responsibility Principle
 */
export interface IUserSearchService {
  searchUsers(query: string, limit?: number): Promise<User[]>;
  findUsersByTags(tagIds: string[]): Promise<User[]>;
  findUsersByGroups(groupIds: string[]): Promise<User[]>;
  findUsersByRole(role: UserRole): Promise<User[]>;
  findUsersByStatus(status: UserStatus): Promise<User[]>;
  findUsersWithFilters(
    filters: FilterUsersDto,
  ): Promise<PaginationResult<User>>;

  // Advanced search
  findUsersWithAdvancedFilters(filters: any): Promise<PaginationResult<User>>;
  findSimilarUsers(userId: string): Promise<User[]>;
  findInfluentialUsers(metric: string): Promise<User[]>;
}

/**
 * User Password Service Interface
 * Handles password-related operations
 * Separated to follow Single Responsibility Principle
 */
export interface IUserPasswordService {
  changePassword(
    userId: string,
    passwordData: ChangePasswordDto,
  ): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  resetPassword(userId: string, sendEmail?: boolean): Promise<string | void>;
  generateTemporaryPassword(): string;
  validatePasswordStrength(password: string): boolean;

  // Password security
  findUsersWithWeakPasswords(): Promise<User[]>;
  enforcePasswordPolicy(userId: string): Promise<void>;
  recordPasswordChange(userId: string): Promise<void>;
}

/**
 * User Notification Service Interface
 * Handles user notification operations
 * Separated to follow Single Responsibility Principle
 */
export interface IUserNotificationService {
  sendWelcomeMessage(userId: string): Promise<void>;
  sendPasswordResetNotification(
    userId: string,
    tempPassword: string,
  ): Promise<void>;
  sendEmailVerificationNotification(userId: string): Promise<void>;
  sendUserMessage(userId: string, message: string): Promise<void>;

  // Bulk notifications
  sendBulkNotification(userIds: string[], message: string): Promise<void>;
  sendRoleChangeNotification(
    userIds: string[],
    newRole: UserRole,
  ): Promise<void>;
  sendAccountStatusNotification(
    userIds: string[],
    newStatus: UserStatus,
  ): Promise<void>;
}

/**
 * User Audit Service Interface
 * Handles user audit and tracking operations
 * Separated to follow Single Responsibility Principle
 */
export interface IUserAuditService {
  recordLoginAttempt(email: string, success: boolean): Promise<void>;
  recordPasswordChange(userId: string): Promise<void>;
  recordRoleChange(
    userId: string,
    oldRole: UserRole,
    newRole: UserRole,
  ): Promise<void>;
  recordStatusChange(
    userId: string,
    oldStatus: UserStatus,
    newStatus: UserStatus,
  ): Promise<void>;

  // Audit queries
  getLoginAttempts(email: string, hours: number): Promise<number>;
  getUserAuditLog(userId: string): Promise<any[]>;
  getSystemAuditLog(filters: any): Promise<any[]>;

  // Security monitoring
  detectSuspiciousActivity(userId: string): Promise<any>;
  flagUnusualBehavior(userId: string): Promise<void>;
}

/**
 * User Cleanup Service Interface
 * Handles user cleanup and maintenance operations
 * Separated to follow Single Responsibility Principle
 */
export interface IUserCleanupService {
  deleteInactiveUsers(days: number): Promise<number>;
  anonymizeUser(userId: string): Promise<User>;
  cleanupUnverifiedUsers(days: number): Promise<number>;
  archiveOldUsers(days: number): Promise<number>;

  // Data maintenance
  cleanupOrphanedData(): Promise<void>;
  optimizeUserIndexes(): Promise<void>;
  generateCleanupReport(): Promise<any>;
}

/**
 * User Import/Export Service Interface
 * Handles user data import and export operations
 * Separated to follow Single Responsibility Principle
 */
export interface IUserImportExportService {
  exportUsers(format: 'csv' | 'json' | 'xlsx', filters?: any): Promise<Buffer>;
  importUsers(data: Buffer, format: 'csv' | 'json' | 'xlsx'): Promise<any>;
  validateImportData(data: any[]): Promise<any>;

  // Data transformation
  transformUserData(users: User[], format: string): Promise<any>;
  generateUserReport(userIds: string[]): Promise<any>;
  backupUserData(userIds: string[]): Promise<Buffer>;
}

/**
 * User Impersonation Service Interface
 * Handles user impersonation functionality
 * Separated to follow Single Responsibility Principle
 */
export interface IUserImpersonationService {
  createImpersonationToken(
    adminId: string,
    targetUserId: string,
  ): Promise<string>;
  validateImpersonationToken(token: string): Promise<any>;
  endImpersonationSession(token: string): Promise<void>;

  // Impersonation audit
  recordImpersonationStart(
    adminId: string,
    targetUserId: string,
  ): Promise<void>;
  recordImpersonationEnd(adminId: string, targetUserId: string): Promise<void>;
  getImpersonationHistory(adminId: string): Promise<any[]>;
}
