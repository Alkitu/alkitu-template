// @ts-nocheck
// 
import { IBaseService, ServiceResult } from '../../common/interfaces/base-service.interface';

/**
 * User Analytics Interface - ISP Compliant
 * 
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on user analytics and activity tracking
 * - Separating analytics concerns from user management and profiles
 * - Providing specialized interface for analytics operations
 * - Being easily testable with focused responsibilities
 */

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  sessionId?: string;
}

export interface UserAnalytics {
  userId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    totalSessions: number;
    uniqueVisits: number;
    totalPageViews: number;
    averageSessionDuration: number; // in minutes
    actionsPerformed: number;
    lastActiveDate: Date;
  };
  topActions: Array<{
    action: string;
    count: number;
    percentage: number;
  }>;
  deviceInfo: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserInfo: {
    chrome: number;
    firefox: number;
    safari: number;
    edge: number;
    other: number;
  };
}

export interface UserEngagement {
  userId: string;
  engagementScore: number; // 0-100
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high';
  factors: {
    loginFrequency: number;
    featureUsage: number;
    sessionDuration: number;
    actionDiversity: number;
  };
  trends: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  lastCalculated: Date;
}

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  userCount: number;
}

export interface ActivityFilters {
  action?: string;
  entity?: string;
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
  sessionId?: string;
}

/**
 * User Analytics Service Interface
 * 
 * ISP Contract:
 * - Only contains methods related to user analytics and tracking
 * - Does not include user management, profile, or subscription methods
 * - Clients that only need analytics don't depend on unused methods
 * - Focused on analytics and tracking operations
 */
export interface IUserAnalyticsService extends IBaseService {
  /**
   * Track user activity
   * 
   * ISP Compliance:
   * - Focused solely on activity recording
   * - Does not modify user or profile data
   * - Single responsibility for activity tracking
   */
  trackActivity(userId: string, action: string, metadata?: Record<string, any>): Promise<ServiceResult<UserActivity>>;

  /**
   * Get user analytics for a specific period
   * 
   * ISP Compliance:
   * - Specialized method for analytics retrieval
   * - Focused on analytics data aggregation
   * - Does not include basic user information
   */
  getUserAnalytics(userId: string, startDate: Date, endDate: Date): Promise<ServiceResult<UserAnalytics>>;

  /**
   * Get user engagement metrics
   * 
   * ISP Compliance:
   * - Focused on engagement calculation
   * - Specialized analytics operation
   * - Does not modify user state
   */
  getUserEngagement(userId: string): Promise<ServiceResult<UserEngagement>>;

  /**
   * Get user activity history
   * 
   * ISP Compliance:
   * - Focused on activity retrieval
   * - Provides activity audit trail
   * - Analytics-specific operation
   */
  getActivityHistory(userId: string, filters?: ActivityFilters, page?: number, limit?: number): Promise<ServiceResult<{ activities: UserActivity[]; total: number }>>;

  /**
   * Calculate user engagement score
   * 
   * ISP Compliance:
   * - Specialized engagement calculation
   * - Analytics-specific computation
   * - Does not affect user profile or subscription
   */
  calculateEngagementScore(userId: string): Promise<ServiceResult<number>>;

  /**
   * Get user segments
   * 
   * ISP Compliance:
   * - Focused on user segmentation
   * - Analytics-specific classification
   * - Does not modify user data
   */
  getUserSegments(userId: string): Promise<ServiceResult<UserSegment[]>>;

  /**
   * Track custom event
   * 
   * ISP Compliance:
   * - Flexible event tracking method
   * - Analytics-specific functionality
   * - Supports custom business events
   */
  trackCustomEvent(userId: string, eventName: string, properties?: Record<string, any>): Promise<ServiceResult<void>>;

  /**
   * Get popular actions for user
   * 
   * ISP Compliance:
   * - Analytics-specific data retrieval
   * - Focused on action analysis
   * - Does not include profile or subscription data
   */
  getPopularActions(userId: string, period: 'day' | 'week' | 'month'): Promise<ServiceResult<Array<{ action: string; count: number }>>>;
}