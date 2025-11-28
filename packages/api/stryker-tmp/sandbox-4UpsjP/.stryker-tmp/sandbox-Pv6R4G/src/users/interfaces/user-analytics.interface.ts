// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - User Analytics Only
// packages/api/src/users/interfaces/user-analytics.interface.ts

import { UserRole, UserStatus } from '@prisma/client';

export interface IUserAnalytics {
  // User Statistics - Single Responsibility
  getUserStats(): Promise<UserStats>;
  getUserGrowthStats(days: number): Promise<GrowthStats[]>;
  getUserActivityStats(days: number): Promise<ActivityStats>;
  getUserDemographics(): Promise<DemographicsStats>;
  getUserRetentionStats(days: number): Promise<RetentionStats>;

  // Role and Status Analytics
  getUsersByRole(): Promise<RoleDistribution[]>;
  getUsersByStatus(): Promise<StatusDistribution[]>;
  getActiveUsersCount(days: number): Promise<number>;
  getInactiveUsersCount(days: number): Promise<number>;

  // Engagement Analytics
  getLoginFrequencyStats(days: number): Promise<LoginFrequencyStats>;
  getUserEngagementScore(userId: string): Promise<EngagementScore>;
  getTopActiveUsers(limit: number, days: number): Promise<TopUserStats[]>;
}

// Analytics Response Types
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  recentSignups: number; // Last 30 days
  deletedRecently: number; // Last 30 days
}

export interface GrowthStats {
  date: string;
  newUsers: number;
  deletedUsers: number;
  netGrowth: number;
  totalUsers: number;
}

export interface ActivityStats {
  totalLogins: number;
  uniqueActiveUsers: number;
  averageSessionsPerUser: number;
  peakActivityDay: string;
  peakActivityHour: number;
}

export interface DemographicsStats {
  byRole: RoleDistribution[];
  byStatus: StatusDistribution[];
  byRegistrationSource: SourceDistribution[];
  geographicDistribution?: GeographicDistribution[];
}

export interface RetentionStats {
  day1: number; // % of users who return after 1 day
  day7: number; // % of users who return after 7 days
  day30: number; // % of users who return after 30 days
  cohortSizes: CohortSize[];
}

export interface RoleDistribution {
  role: UserRole;
  count: number;
  percentage: number;
}

export interface StatusDistribution {
  status: UserStatus;
  count: number;
  percentage: number;
}

export interface SourceDistribution {
  source: string;
  count: number;
  percentage: number;
}

export interface GeographicDistribution {
  country: string;
  count: number;
  percentage: number;
}

export interface LoginFrequencyStats {
  daily: number;
  weekly: number;
  monthly: number;
  rarely: number;
  never: number;
}

export interface EngagementScore {
  userId: string;
  score: number; // 0-100
  factors: {
    loginFrequency: number;
    featureUsage: number;
    profileCompleteness: number;
    socialEngagement: number;
  };
  category: 'high' | 'medium' | 'low';
}

export interface TopUserStats {
  userId: string;
  name: string;
  email: string;
  loginCount: number;
  lastLogin: Date;
  engagementScore: number;
}

export interface CohortSize {
  cohortMonth: string;
  size: number;
  retainedUsers: number;
  retentionRate: number;
}
