/**
 * Logger DI Module - SRP Compliant
 *
 * Single Responsibility: Configure logger implementations
 */

import { DIContainer, BaseContainerModule } from '../container';
import { ServiceResult } from '../../interfaces/base-service.interface';
import {
  ILogger,
  IConfigurationProvider,
} from '../../interfaces/infrastructure.interface';

export class LoggerModule extends BaseContainerModule {
  constructor(private environment: string) {
    super();
  }

  async configure(container: DIContainer): Promise<ServiceResult<void>> {
    try {
      await Promise.resolve(); // ESLint requires await in async methods
      switch (this.environment) {
        case 'test':
          container.registerFactory(
            'ILogger',
            () => new TestLogger(),
            'singleton',
          );
          break;
        case 'development':
          container.registerFactory(
            'ILogger',
            () => new DevelopmentLogger(),
            'singleton',
          );
          break;
        case 'production':
          container.registerFactory(
            'ILogger',
            (container) => {
              const config = container.resolve<IConfigurationProvider>(
                'IConfigurationProvider',
              );
              return new ProductionLogger(config);
            },
            'singleton',
          );
          break;
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LOGGER_MODULE_ERROR',
          message: 'Failed to configure logger module',
          details: {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}

export class TestLogger implements ILogger {
  error(): void {}
  warn(): void {}
  info(): void {}
  debug(): void {}
  verbose(): void {}
}

export class DevelopmentLogger implements ILogger {
  error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  debug(message: string): void {
    console.log(`[DEBUG] ${message}`);
  }

  verbose(message: string): void {
    console.log(`[VERBOSE] ${message}`);
  }
}

export class ProductionLogger implements ILogger {
  constructor(private config: IConfigurationProvider) {}

  error(message: string, error?: Error): void {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error?.message,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  warn(message: string): void {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  info(message: string): void {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  debug(message: string): void {
    if (this.config.getBoolean('ENABLE_DEBUG_LOGS', false)) {
      console.log(
        JSON.stringify({
          level: 'debug',
          message,
          timestamp: new Date().toISOString(),
        }),
      );
    }
  }

  verbose(message: string): void {
    if (this.config.getBoolean('ENABLE_VERBOSE_LOGS', false)) {
      console.log(
        JSON.stringify({
          level: 'verbose',
          message,
          timestamp: new Date().toISOString(),
        }),
      );
    }
  }
}
