// ✅ SOLID Services Exports
// packages/api/src/users/services/index.ts

// Core SOLID Services
export { UserRepositoryService } from './user-repository.service';
export { UserAuthenticationService } from './user-authentication.service';
export { UserAnalyticsService } from './user-analytics.service';
export { UserEventsService } from './user-events.service';

// Facade Service for Backward Compatibility
export { UserFacadeService } from './user-facade.service';

// Service Interfaces (re-exported for convenience)
export * from '../interfaces';
