// @ts-nocheck
import { ServiceResult } from './base-service.interface';
import { UserRole, UserStatus } from '@prisma/client';

/**
 * Repository Abstractions - DIP Compliant
 *
 * These interfaces follow the Dependency Inversion Principle by:
 * - Providing abstractions for data access patterns
 * - Allowing business logic to depend on data contracts, not implementations
 * - Enabling different storage backends without changing business logic
 * - Supporting comprehensive testing with mock implementations
 */

// =============================================================================
// BASE REPOSITORY ABSTRACTIONS
// =============================================================================

export interface EntityBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryFilter {
  [key: string]: any;
}

export interface QueryOptions {
  select?: string[];
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  populate?: string[];
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IBaseRepository<
  TEntity extends EntityBase,
  TCreateData = Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>,
> {
  // Basic CRUD operations
  findById(
    id: string,
    options?: QueryOptions,
  ): Promise<ServiceResult<TEntity | null>>;
  findOne(
    filter: QueryFilter,
    options?: QueryOptions,
  ): Promise<ServiceResult<TEntity | null>>;
  findMany(
    filter: QueryFilter,
    options?: QueryOptions,
  ): Promise<ServiceResult<TEntity[]>>;
  findWithPagination(
    filter: QueryFilter,
    page: number,
    limit: number,
    options?: QueryOptions,
  ): Promise<ServiceResult<PaginationResult<TEntity>>>;

  create(data: TCreateData): Promise<ServiceResult<TEntity>>;
  update(
    id: string,
    data: Partial<TCreateData>,
  ): Promise<ServiceResult<TEntity | null>>;
  delete(id: string): Promise<ServiceResult<boolean>>;

  // Bulk operations
  createMany(data: TCreateData[]): Promise<ServiceResult<TEntity[]>>;
  updateMany(
    filter: QueryFilter,
    data: Partial<TCreateData>,
  ): Promise<ServiceResult<number>>;
  deleteMany(filter: QueryFilter): Promise<ServiceResult<number>>;

  // Utility operations
  exists(filter: QueryFilter): Promise<ServiceResult<boolean>>;
  count(filter: QueryFilter): Promise<ServiceResult<number>>;

  // Transaction support
  withTransaction<T>(
    operation: (
      repository: IBaseRepository<TEntity, TCreateData>,
    ) => Promise<T>,
  ): Promise<ServiceResult<T>>;
}

// =============================================================================
// USER REPOSITORY ABSTRACTIONS
// =============================================================================

export interface User extends EntityBase {
  email: string;
  emailVerified: Date | null;
  name: string | null;
  lastName: string | null;
  image: string | null;
  password: string | null;
  contactNumber: string | null;
  role: UserRole;
  status: UserStatus;
  terms: boolean;
  isTwoFactorEnabled: boolean;
  lastLogin: Date | null;
  metadata?: Record<string, any>;
}

export interface UserCreateData {
  email: string;
  password?: string;
  name?: string;
  lastName?: string;
  contactNumber?: string;
  role?: UserRole;
  status?: UserStatus;
  terms?: boolean;
  isTwoFactorEnabled?: boolean;
  metadata?: Record<string, any>;
}

export interface UserFilters extends QueryFilter {
  email?: string;
  role?: 'user' | 'admin' | 'moderator';
  isActive?: boolean;
  isVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  search?: string; // Search in name or email
}

export interface IUserRepository extends IBaseRepository<User, UserCreateData> {
  // User-specific queries
  findByEmail(email: string): Promise<ServiceResult<User | null>>;
  findByRole(
    role: 'user' | 'admin' | 'moderator',
    options?: QueryOptions,
  ): Promise<ServiceResult<User[]>>;
  findActiveUsers(options?: QueryOptions): Promise<ServiceResult<User[]>>;
  findUnverifiedUsers(olderThan?: Date): Promise<ServiceResult<User[]>>;

  // User analytics
  countByRole(): Promise<ServiceResult<Record<string, number>>>;
  countNewUsersInPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<ServiceResult<number>>;
  findTopActiveUsers(limit: number): Promise<ServiceResult<User[]>>;

  // User management
  updateLastLogin(
    userId: string,
    loginTime: Date,
  ): Promise<ServiceResult<void>>;
  verifyUser(userId: string): Promise<ServiceResult<User | null>>;
  deactivateUser(
    userId: string,
    reason?: string,
  ): Promise<ServiceResult<User | null>>;
  changePassword(
    userId: string,
    newPasswordHash: string,
  ): Promise<ServiceResult<void>>;
}

// =============================================================================
// USER PROFILE REPOSITORY ABSTRACTIONS
// =============================================================================

export interface UserProfile extends EntityBase {
  userId: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    weeklyDigest: boolean;
  };
  customFields?: Record<string, any>;
}

export interface UserProfileCreateData {
  userId: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    weeklyDigest: boolean;
  };
  customFields?: Record<string, any>;
}

export interface IUserProfileRepository
  extends IBaseRepository<UserProfile, UserProfileCreateData> {
  findByUserId(userId: string): Promise<ServiceResult<UserProfile | null>>;
  findByLocation(location: string): Promise<ServiceResult<UserProfile[]>>;
  findByTimezone(timezone: string): Promise<ServiceResult<UserProfile[]>>;
  findByLanguage(language: string): Promise<ServiceResult<UserProfile[]>>;

  // Profile analytics
  getMostCommonTimezones(
    limit?: number,
  ): Promise<ServiceResult<Array<{ timezone: string; count: number }>>>;
  getMostCommonLanguages(
    limit?: number,
  ): Promise<ServiceResult<Array<{ language: string; count: number }>>>;

  // Profile management
  updateAvatar(
    userId: string,
    avatarUrl: string,
  ): Promise<ServiceResult<UserProfile | null>>;
  updatePreferences(
    userId: string,
    preferences: Partial<UserProfile['preferences']>,
  ): Promise<ServiceResult<UserProfile | null>>;
  updateSocialLinks(
    userId: string,
    socialLinks: Partial<UserProfile['socialLinks']>,
  ): Promise<ServiceResult<UserProfile | null>>;
}

// =============================================================================
// USER SUBSCRIPTION REPOSITORY ABSTRACTIONS
// =============================================================================

export interface UserSubscription extends EntityBase {
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'paused';
  startDate: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  pausedAt?: Date;
  trialEndsAt?: Date;
  isTrialActive: boolean;
  autoRenew: boolean;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}

export interface UserSubscriptionCreateData {
  userId: string;
  planId: string;
  status?: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'paused';
  startDate: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  trialEndsAt?: Date;
  isTrialActive?: boolean;
  autoRenew?: boolean;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}

export interface IUserSubscriptionRepository
  extends IBaseRepository<UserSubscription, UserSubscriptionCreateData> {
  findByUserId(userId: string): Promise<ServiceResult<UserSubscription | null>>;
  findByPlanId(planId: string): Promise<ServiceResult<UserSubscription[]>>;
  findByStatus(
    status: UserSubscription['status'],
  ): Promise<ServiceResult<UserSubscription[]>>;
  findActiveSubscriptions(): Promise<ServiceResult<UserSubscription[]>>;
  findExpiredSubscriptions(): Promise<ServiceResult<UserSubscription[]>>;
  findTrialSubscriptions(): Promise<ServiceResult<UserSubscription[]>>;

  // Subscription analytics
  countByPlan(): Promise<ServiceResult<Record<string, number>>>;
  countByStatus(): Promise<ServiceResult<Record<string, number>>>;
  getRevenueInPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<ServiceResult<number>>;

  // Subscription management
  cancelSubscription(
    userId: string,
    reason?: string,
  ): Promise<ServiceResult<UserSubscription | null>>;
  pauseSubscription(
    userId: string,
    pauseUntil?: Date,
  ): Promise<ServiceResult<UserSubscription | null>>;
  resumeSubscription(
    userId: string,
  ): Promise<ServiceResult<UserSubscription | null>>;
  updateNextBillingDate(
    userId: string,
    nextBillingDate: Date,
  ): Promise<ServiceResult<UserSubscription | null>>;
}

// =============================================================================
// EMAIL REPOSITORY ABSTRACTIONS
// =============================================================================

export interface EmailMessage extends EntityBase {
  messageId: string;
  to: string[];
  from: string;
  replyTo?: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: string;
  campaignId?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sentAt: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface EmailMessageCreateData {
  messageId: string;
  to: string[];
  from: string;
  replyTo?: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  templateId?: string;
  campaignId?: string;
  status?: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sentAt: Date;
  metadata?: Record<string, any>;
}

export interface IEmailMessageRepository
  extends IBaseRepository<EmailMessage, EmailMessageCreateData> {
  findByMessageId(
    messageId: string,
  ): Promise<ServiceResult<EmailMessage | null>>;
  findByCampaignId(campaignId: string): Promise<ServiceResult<EmailMessage[]>>;
  findByTemplateId(templateId: string): Promise<ServiceResult<EmailMessage[]>>;
  findByRecipient(email: string): Promise<ServiceResult<EmailMessage[]>>;
  findByStatus(
    status: EmailMessage['status'],
  ): Promise<ServiceResult<EmailMessage[]>>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ServiceResult<EmailMessage[]>>;

  // Email analytics
  getDeliveryStats(campaignId?: string): Promise<
    ServiceResult<{
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
      failed: number;
    }>
  >;

  getEngagementRates(campaignId?: string): Promise<
    ServiceResult<{
      deliveryRate: number;
      openRate: number;
      clickRate: number;
      bounceRate: number;
    }>
  >;

  // Email tracking
  updateStatus(
    messageId: string,
    status: EmailMessage['status'],
    timestamp: Date,
  ): Promise<ServiceResult<EmailMessage | null>>;
  recordOpen(messageId: string): Promise<ServiceResult<EmailMessage | null>>;
  recordClick(messageId: string): Promise<ServiceResult<EmailMessage | null>>;
  recordBounce(
    messageId: string,
    reason?: string,
  ): Promise<ServiceResult<EmailMessage | null>>;
}

// =============================================================================
// AUDIT LOG REPOSITORY ABSTRACTIONS
// =============================================================================

export interface AuditLog extends EntityBase {
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  result: 'success' | 'failure';
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogCreateData {
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  result: 'success' | 'failure';
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface IAuditLogRepository
  extends IBaseRepository<AuditLog, AuditLogCreateData> {
  findByUserId(
    userId: string,
    options?: QueryOptions,
  ): Promise<ServiceResult<AuditLog[]>>;
  findByAction(
    action: string,
    options?: QueryOptions,
  ): Promise<ServiceResult<AuditLog[]>>;
  findByResource(
    resource: string,
    resourceId?: string,
    options?: QueryOptions,
  ): Promise<ServiceResult<AuditLog[]>>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: QueryOptions,
  ): Promise<ServiceResult<AuditLog[]>>;
  findByResult(
    result: 'success' | 'failure',
    options?: QueryOptions,
  ): Promise<ServiceResult<AuditLog[]>>;

  // Audit analytics
  getActionCounts(
    startDate?: Date,
    endDate?: Date,
  ): Promise<ServiceResult<Record<string, number>>>;
  getFailureAnalysis(
    startDate?: Date,
    endDate?: Date,
  ): Promise<
    ServiceResult<Array<{ action: string; failures: number; total: number }>>
  >;
  getUserActivitySummary(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<
    ServiceResult<{
      totalActions: number;
      uniqueResources: number;
      successRate: number;
      mostFrequentActions: Array<{ action: string; count: number }>;
    }>
  >;

  // Compliance operations
  purgeOldLogs(olderThan: Date): Promise<ServiceResult<number>>;
  exportLogs(
    filter: QueryFilter,
    format: 'json' | 'csv',
  ): Promise<ServiceResult<string>>;
}
