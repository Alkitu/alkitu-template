import { Injectable, Logger } from '@nestjs/common';
import {
  IModulePlugin,
  ModuleCategory,
  ModuleMetadata,
} from '../module-plugin.interface';
import { ModuleFlag } from '../../../config/modules.config';

/**
 * Users Module Plugin - OCP Compliant
 *
 * Handles user management module creation following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class UsersModulePlugin implements IModulePlugin {
  private readonly logger = new Logger(UsersModulePlugin.name);

  readonly name = 'users';
  readonly category: ModuleCategory = 'core';
  readonly version = '1.0.0';
  readonly dependencies: string[] = ['auth']; // Users module depends on auth

  /**
   * Create users module instance
   */
  async create(config: ModuleFlag): Promise<any> {
    try {
      await Promise.resolve(); // ESLint requires await in async methods
      this.logger.log('Creating Users module with config:', config.config);

      // Here you would create the actual users module
      // For now, returning a mock implementation
      const usersModule = {
        name: 'users',
        type: 'core',
        config: config.config,
        initialized: true,
        services: {
          userRepositoryService: 'UserRepositoryService instance',
          userAuthenticationService: 'UserAuthenticationService instance',
          userAnalyticsService: 'UserAnalyticsService instance',
          userEventsService: 'UserEventsService instance',
          userFacadeService: 'UserFacadeService instance',
        },
        // Add any users-specific functionality
        createUser: (userData: any) => this.createUser(userData),
        findUser: (id: string) => this.findUser(id),
        updateUser: (id: string, data: any) => this.updateUser(id, data),
        deleteUser: (id: string) => this.deleteUser(id),
      };

      this.logger.log('Users module created successfully');
      return usersModule;
    } catch (error) {
      this.logger.error('Failed to create Users module:', error);
      throw error;
    }
  }

  /**
   * Check if this plugin supports the given module name
   */
  supports(name: string): boolean {
    return name === 'users';
  }

  /**
   * Validate users module configuration
   */
  validateConfig(config: ModuleFlag): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config) {
      errors.push('Users module config is required');
      return { isValid: false, errors };
    }

    if (!config.enabled) {
      return { isValid: true, errors: [] };
    }

    // Validate users-specific configuration
    if (!config.config) {
      errors.push('Users module config.config is required');
    } else {
      // Add specific users config validations
      if (
        config.config.enableProfilePictures &&
        typeof config.config.enableProfilePictures !== 'boolean'
      ) {
        errors.push('enableProfilePictures must be a boolean');
      }

      if (
        config.config.maxUsersPerOrg &&
        (!Number.isInteger(config.config.maxUsersPerOrg) ||
          config.config.maxUsersPerOrg < 1)
      ) {
        errors.push('maxUsersPerOrg must be a positive integer');
      }

      if (
        config.config.enableUserAnalytics &&
        typeof config.config.enableUserAnalytics !== 'boolean'
      ) {
        errors.push('enableUserAnalytics must be a boolean');
      }

      if (
        config.config.userRoles &&
        (!Array.isArray(config.config.userRoles) ||
          config.config.userRoles.length === 0)
      ) {
        errors.push('userRoles must be a non-empty array');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get users module metadata
   */
  getMetadata(): ModuleMetadata {
    return {
      name: this.name,
      category: this.category,
      version: this.version,
      dependencies: this.dependencies,
      description:
        'User management module providing CRUD operations, authentication integration, and user analytics',
      configSchema: {
        enableProfilePictures: {
          type: 'boolean',
          required: false,
          description: 'Enable user profile pictures',
        },
        maxUsersPerOrg: {
          type: 'number',
          required: false,
          description: 'Maximum users per organization',
        },
        enableUserAnalytics: {
          type: 'boolean',
          required: false,
          description: 'Enable user analytics tracking',
        },
        userRoles: {
          type: 'array',
          required: false,
          description: 'Available user roles',
        },
        defaultRole: {
          type: 'string',
          required: false,
          description: 'Default role for new users',
        },
      },
      tags: ['users', 'management', 'core', 'crud'],
    };
  }

  /**
   * Private users-specific helper methods
   */
  private async createUser(userData: any): Promise<any> {
    await Promise.resolve(); // ESLint requires await in async methods
    this.logger.debug('Creating user:', userData);
    // Mock user creation logic
    return {
      id: `user_${Date.now()}`,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private async findUser(id: string): Promise<any> {
    await Promise.resolve(); // ESLint requires await in async methods
    this.logger.debug(`Finding user: ${id}`);
    // Mock user lookup logic
    return {
      id,
      name: 'Mock User',
      email: 'mock@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private async updateUser(id: string, data: any): Promise<any> {
    await Promise.resolve(); // ESLint requires await in async methods
    this.logger.debug(`Updating user ${id}:`, data);
    // Mock user update logic
    return {
      id,
      ...data,
      updatedAt: new Date(),
    };
  }

  private async deleteUser(id: string): Promise<boolean> {
    await Promise.resolve(); // ESLint requires await in async methods
    this.logger.debug(`Deleting user: ${id}`);
    // Mock user deletion logic
    return true;
  }
}
