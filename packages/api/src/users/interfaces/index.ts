// ✅ SOLID COMPLIANT: Interface Segregation - Centralized exports
// packages/api/src/users/interfaces/index.ts

// Core Service Interfaces
export * from './user-service.interface';
export * from './user-repository.interface';
export * from './user-authentication.interface';
export * from './user-events.interface';
export * from './user-bulk-operations.interface';
export * from './user-admin-operations.interface';

// Analytics interfaces - explicit export to resolve conflicts
export {
  UserActivity,
  UserAnalytics,
  UserEngagement,
  UserSegment,
  ActivityFilters,
  UserStats,
  GrowthStats,
  ActivityStats,
  DemographicsStats,
  RetentionStats,
  RoleDistribution,
  StatusDistribution,
  SourceDistribution,
  GeographicDistribution,
  LoginFrequencyStats,
  EngagementScore,
  TopUserStats,
  CohortSize,
  IUserAnalytics,
  IUserAnalyticsService,
} from './user-analytics.interface';
