/**
 * Module Plugins - Index File
 *
 * Centralized exports for all module plugin interfaces and implementations.
 * Following OCP: New plugins can be added here without modifying existing exports.
 */
// @ts-nocheck

// 


// Interfaces
export * from './module-plugin.interface';

// Core Module Plugins
export * from './core-modules/auth-module.plugin';
export * from './core-modules/users-module.plugin';
export * from './core-modules/health-module.plugin';

// Feature Module Plugins
export * from './feature-modules/notifications-module.plugin';
// Add more feature module plugins here as they are created
// export * from './feature-modules/billing-module.plugin';
// export * from './feature-modules/analytics-module.plugin';
// export * from './feature-modules/email-module.plugin';

// Integration Module Plugins
export * from './integration-modules/webhook-module.plugin';
// Add more integration module plugins here as they are created
// export * from './integration-modules/trpc-module.plugin';
// export * from './integration-modules/graphql-module.plugin';
// export * from './integration-modules/rest-module.plugin';

// Registry Service
export * from '../services/module-plugin-registry.service';
