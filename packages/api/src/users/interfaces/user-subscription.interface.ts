import {
  IBaseService,
  ServiceResult,
} from '../../common/interfaces/base-service.interface';

/**
 * User Subscription Interface - ISP Compliant
 *
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on user subscription management
 * - Separating subscription concerns from user management and profiles
 * - Providing specialized interface for subscription operations
 * - Being easily testable with focused responsibilities
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    users?: number;
    storage?: number; // in GB
    apiCalls?: number;
    projects?: number;
  };
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionUsage {
  userId: string;
  planId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  usage: {
    users: number;
    storage: number; // in bytes
    apiCalls: number;
    projects: number;
  };
  limits: {
    users?: number;
    storage?: number; // in bytes
    apiCalls?: number;
    projects?: number;
  };
  percentUsed: {
    users?: number;
    storage?: number;
    apiCalls?: number;
    projects?: number;
  };
}

export interface SubscriptionChange {
  fromPlanId: string;
  toPlanId: string;
  changeType: 'upgrade' | 'downgrade' | 'sidegrade';
  prorationAmount?: number;
  effectiveDate: Date;
  reason?: string;
}

/**
 * User Subscription Service Interface
 *
 * ISP Contract:
 * - Only contains methods related to subscription management
 * - Does not include user management or profile methods
 * - Clients that only need subscription functionality don't depend on unused methods
 * - Focused on subscription-specific operations
 */
export interface IUserSubscriptionService extends IBaseService {
  /**
   * Get user's current subscription
   *
   * ISP Compliance:
   * - Focused solely on subscription retrieval
   * - Does not include user or profile data
   * - Single responsibility for subscription access
   */
  getSubscription(userId: string): Promise<ServiceResult<UserSubscription>>;

  /**
   * Update user's subscription plan
   *
   * ISP Compliance:
   * - Specialized method for plan changes
   * - Handles subscription upgrades/downgrades
   * - Focused on subscription modification
   */
  updateSubscription(
    userId: string,
    newPlanId: string,
    options?: { immediate?: boolean },
  ): Promise<ServiceResult<UserSubscription>>;

  /**
   * Cancel user's subscription
   *
   * ISP Compliance:
   * - Focused on subscription cancellation
   * - Does not handle user account deletion
   * - Single responsibility for subscription termination
   */
  cancelSubscription(
    userId: string,
    reason?: string,
    cancelAtPeriodEnd?: boolean,
  ): Promise<ServiceResult<UserSubscription>>;

  /**
   * Pause user's subscription
   *
   * ISP Compliance:
   * - Specialized method for subscription pausing
   * - Subscription-specific operation
   * - Does not affect user account status
   */
  pauseSubscription(
    userId: string,
    pauseUntil?: Date,
  ): Promise<ServiceResult<UserSubscription>>;

  /**
   * Resume paused subscription
   *
   * ISP Compliance:
   * - Focused on subscription resumption
   * - Complementary to pause functionality
   * - Subscription-specific operation
   */
  resumeSubscription(userId: string): Promise<ServiceResult<UserSubscription>>;

  /**
   * Get subscription usage information
   *
   * ISP Compliance:
   * - Specialized method for usage tracking
   * - Provides subscription-specific metrics
   * - Focused on subscription limits and usage
   */
  getSubscriptionUsage(
    userId: string,
  ): Promise<ServiceResult<SubscriptionUsage>>;

  /**
   * Check if user can perform action based on subscription limits
   *
   * ISP Compliance:
   * - Subscription-specific authorization check
   * - Focused on subscription-based permissions
   * - Single-purpose validation method
   */
  canPerformAction(
    userId: string,
    action: 'create_user' | 'upload_file' | 'api_call' | 'create_project',
  ): Promise<ServiceResult<boolean>>;

  /**
   * Get subscription history
   *
   * ISP Compliance:
   * - Focused on subscription change history
   * - Does not include user activity history
   * - Subscription-specific audit trail
   */
  getSubscriptionHistory(
    userId: string,
  ): Promise<ServiceResult<SubscriptionChange[]>>;

  /**
   * Validate subscription status
   *
   * ISP Compliance:
   * - Subscription-specific validation
   * - Checks subscription health and status
   * - Focused single-purpose method
   */
  validateSubscriptionStatus(
    userId: string,
  ): Promise<ServiceResult<{ isValid: boolean; issues: string[] }>>;

  /**
   * Get available plans for upgrade/downgrade
   *
   * ISP Compliance:
   * - Subscription-specific plan recommendations
   * - Focused on subscription change options
   * - Does not include general plan catalog
   */
  getAvailablePlanChanges(userId: string): Promise<
    ServiceResult<{
      upgrades: SubscriptionPlan[];
      downgrades: SubscriptionPlan[];
    }>
  >;
}
