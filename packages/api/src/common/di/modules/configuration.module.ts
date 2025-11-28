/**
 * Configuration DI Module - SRP Compliant
 *
 * Single Responsibility: Configure configuration providers
 */

import { DIContainer, BaseContainerModule } from '../container';
import { ServiceResult } from '../../interfaces/base-service.interface';
import { IConfigurationProvider } from '../../interfaces/infrastructure.interface';

export class ConfigurationModule extends BaseContainerModule {
  constructor(private environment: string) {
    super();
  }

  async configure(container: DIContainer): Promise<ServiceResult<void>> {
    try {
      await Promise.resolve(); // ESLint requires await in async methods
      // Configuration provider is environment-aware
      container.registerFactory(
        'IConfigurationProvider',
        () => {
          return new EnvironmentConfigurationProvider(this.environment);
        },
        'singleton',
      );

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CONFIGURATION_MODULE_ERROR',
          message: 'Failed to configure configuration module',
          details: {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}

export class EnvironmentConfigurationProvider
  implements IConfigurationProvider
{
  constructor(private environment: string) {}

  get<T>(key: string, defaultValue?: T): T {
    const value = process.env[key];
    if (value === undefined) return defaultValue;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(value);
    } catch {
      return value as T;
    }
  }

  getString(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (value === undefined) return defaultValue || 0;
    return parseInt(value, 10) || defaultValue || 0;
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) return defaultValue || false;
    return value.toLowerCase() === 'true';
  }

  getObject<T>(key: string, defaultValue?: T): T {
    const value = process.env[key];
    if (value === undefined) return defaultValue;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }

  isDevelopment(): boolean {
    return this.environment === 'development';
  }

  isProduction(): boolean {
    return this.environment === 'production';
  }

  isTesting(): boolean {
    return this.environment === 'test';
  }

  async refresh(): Promise<ServiceResult<void>> {
    await Promise.resolve(); // ESLint requires await in async methods
    return { success: true };
  }

  watch(): void {
    // Implementation would watch for configuration changes
  }
}
