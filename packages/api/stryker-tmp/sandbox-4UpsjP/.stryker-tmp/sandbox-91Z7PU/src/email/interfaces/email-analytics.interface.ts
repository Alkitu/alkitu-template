// @ts-nocheck
// 
import { IBaseService, ServiceResult } from '../../common/interfaces/base-service.interface';

/**
 * Email Analytics Interface - ISP Compliant
 * 
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on email analytics and tracking
 * - Separating analytics from sending and template management
 * - Providing specialized interface for email metrics
 * - Being easily testable with focused responsibilities
 */

export interface EmailMetrics {
  messageId: string;
  campaignId?: string;
  templateId?: string;
  sentAt: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  bouncedAt?: Date;
  unsubscribedAt?: Date;
  spamReportedAt?: Date;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'spam';
  recipient: string;
  subject: string;
  deviceInfo?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
  locationInfo?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export interface EmailCampaignAnalytics {
  campaignId: string;
  campaignName: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  totalUnsubscribed: number;
  totalSpamReports: number;
  deliveryRate: number; // percentage
  openRate: number; // percentage
  clickRate: number; // percentage
  bounceRate: number; // percentage
  unsubscribeRate: number; // percentage
  spamRate: number; // percentage
  engagementScore: number; // 0-100
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface EmailTemplateAnalytics {
  templateId: string;
  templateName: string;
  usageCount: number;
  totalSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageBounceRate: number;
  performanceScore: number; // 0-100
  bestPerformingCampaign?: string;
  worstPerformingCampaign?: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface EmailEngagementTrends {
  period: 'daily' | 'weekly' | 'monthly';
  data: Array<{
    date: Date;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  }>;
  averages: {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribeRate: number;
  };
}

export interface EmailHeatmap {
  messageId: string;
  clickMap: Array<{
    linkUrl: string;
    clickCount: number;
    uniqueClicks: number;
    clickRate: number;
    linkText?: string;
    position?: string;
  }>;
  openMap: Array<{
    timestamp: Date;
    recipient: string;
    deviceType: string;
    location?: string;
  }>;
}

export interface EmailListAnalytics {
  listId?: string;
  listName?: string;
  totalSubscribers: number;
  activeSubscribers: number;
  engagedSubscribers: number; // opened/clicked in last 30 days
  disengagedSubscribers: number; // no activity in 90+ days
  averageEngagementScore: number;
  growthRate: number; // percentage
  churnRate: number; // percentage
  segmentPerformance: Array<{
    segment: string;
    subscriberCount: number;
    engagementScore: number;
    averageOpenRate: number;
    averageClickRate: number;
  }>;
}

export interface EmailAnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  campaignId?: string;
  templateId?: string;
  recipient?: string;
  status?: string[];
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  country?: string;
}

/**
 * Email Analytics Service Interface
 * 
 * ISP Contract:
 * - Only contains methods related to email analytics and metrics
 * - Does not include email sending, template management, or configuration
 * - Clients that only need analytics don't depend on unused methods
 * - Focused on email performance tracking and reporting
 */
export interface IEmailAnalyticsService extends IBaseService {
  /**
   * Track email event (open, click, bounce, etc.)
   * 
   * ISP Compliance:
   * - Focused solely on event tracking
   * - Does not handle email sending or template management
   * - Single responsibility for analytics data collection
   */
  trackEmailEvent(messageId: string, event: 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'spam', metadata?: Record<string, any>): Promise<ServiceResult<void>>;

  /**
   * Get email metrics for specific message
   * 
   * ISP Compliance:
   * - Focused on single message analytics
   * - Analytics-specific data retrieval
   * - Does not include sending or template data
   */
  getEmailMetrics(messageId: string): Promise<ServiceResult<EmailMetrics>>;

  /**
   * Get campaign analytics
   * 
   * ISP Compliance:
   * - Specialized method for campaign performance analysis
   * - Analytics-specific operation
   * - Focused on campaign-level metrics
   */
  getCampaignAnalytics(campaignId: string, startDate?: Date, endDate?: Date): Promise<ServiceResult<EmailCampaignAnalytics>>;

  /**
   * Get template performance analytics
   * 
   * ISP Compliance:
   * - Template performance specific analytics
   * - Focused on template effectiveness metrics
   * - Analytics-specific data processing
   */
  getTemplateAnalytics(templateId: string, startDate?: Date, endDate?: Date): Promise<ServiceResult<EmailTemplateAnalytics>>;

  /**
   * Get engagement trends over time
   * 
   * ISP Compliance:
   * - Analytics-specific trend analysis
   * - Focused on engagement pattern tracking
   * - Specialized reporting functionality
   */
  getEngagementTrends(period: 'daily' | 'weekly' | 'monthly', startDate?: Date, endDate?: Date): Promise<ServiceResult<EmailEngagementTrends>>;

  /**
   * Get email heatmap data
   * 
   * ISP Compliance:
   * - Specialized analytics for click and interaction tracking
   * - Focused on email content performance
   * - Analytics-specific visualization data
   */
  getEmailHeatmap(messageId: string): Promise<ServiceResult<EmailHeatmap>>;

  /**
   * Get subscriber list analytics
   * 
   * ISP Compliance:
   * - List performance specific analytics
   * - Focused on subscriber engagement metrics
   * - Analytics-specific data aggregation
   */
  getListAnalytics(listId?: string, startDate?: Date, endDate?: Date): Promise<ServiceResult<EmailListAnalytics>>;

  /**
   * Generate analytics report
   * 
   * ISP Compliance:
   * - Specialized reporting functionality
   * - Analytics-specific data processing
   * - Focused on performance reporting
   */
  generateAnalyticsReport(reportType: 'summary' | 'detailed' | 'comparative', filters?: EmailAnalyticsFilters): Promise<ServiceResult<Record<string, any>>>;

  /**
   * Get top performing campaigns
   * 
   * ISP Compliance:
   * - Analytics-specific performance ranking
   * - Focused on campaign comparison
   * - Specialized analytics query
   */
  getTopPerformingCampaigns(metric: 'open_rate' | 'click_rate' | 'engagement_score', limit?: number, period?: { startDate: Date; endDate: Date }): Promise<ServiceResult<Array<{ campaignId: string; campaignName: string; score: number }>>>;

  /**
   * Get email deliverability insights
   * 
   * ISP Compliance:
   * - Specialized deliverability analytics
   * - Focused on delivery performance metrics
   * - Analytics-specific technical insights
   */
  getDeliverabilityInsights(period?: { startDate: Date; endDate: Date }): Promise<ServiceResult<{ deliveryRate: number; bounceAnalysis: Record<string, number>; reputationScore: number; recommendations: string[] }>>;

  /**
   * Export analytics data
   * 
   * ISP Compliance:
   * - Analytics-specific data export
   * - Focused on analytics data portability
   * - Specialized reporting functionality
   */
  exportAnalyticsData(filters: EmailAnalyticsFilters, format: 'csv' | 'json' | 'excel'): Promise<ServiceResult<{ downloadUrl: string; expiresAt: Date }>>;
}