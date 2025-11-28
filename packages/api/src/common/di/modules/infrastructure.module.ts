/**
 * Infrastructure DI Module - DIP Compliant
 *
 * This module configures dependency injection for infrastructure concerns.
 * It follows DIP by:
 * - Registering concrete implementations for abstract interfaces
 * - Allowing different implementations for different environments
 * - Supporting configuration through abstractions
 * - Enabling easy testing through dependency substitution
 */

import { DIContainer, BaseContainerModule } from '../container';
import { ServiceResult } from '../../interfaces/base-service.interface';
import { LoggerModule } from './logger.module';
import { DatabaseModule } from './database.module';
import { CacheModule } from './cache.module';
import { FileStorageModule } from './file-storage.module';
import { ConfigurationModule } from './configuration.module';
import { EventBusModule } from './event-bus.module';
import { HttpClientModule } from './http-client.module';
import { QueueModule } from './queue.module';
import { MetricsModule } from './metrics.module';

export class InfrastructureModule extends BaseContainerModule {
  private modules: BaseContainerModule[] = [];

  constructor(
    private environment: 'development' | 'test' | 'production' = 'development',
  ) {
    super();

    // Initialize sub-modules following SRP
    this.modules = [
      new LoggerModule(this.environment) as BaseContainerModule,
      new DatabaseModule(this.environment) as BaseContainerModule,
      new CacheModule(this.environment) as BaseContainerModule,
      new FileStorageModule(this.environment) as BaseContainerModule,
      new ConfigurationModule(this.environment) as BaseContainerModule,
      new EventBusModule(this.environment) as BaseContainerModule,
      new HttpClientModule(this.environment) as BaseContainerModule,
      new QueueModule(this.environment) as BaseContainerModule,
      new MetricsModule(this.environment) as BaseContainerModule,
    ];
  }

  async configure(container: DIContainer): Promise<ServiceResult<void>> {
    try {
      // Configure each module independently (SRP)
      for (const module of this.modules) {
        const result = await module.configure(container);
        if (!result.success) {
          return result;
        }
      }

      return {
        success: true,
        metadata: {
          environment: this.environment,
          registeredServices: [
            'ILogger',
            'IDatabase',
            'ICache',
            'IFileStorage',
            'IConfigurationProvider',
            'IEventBus',
            'IHttpClient',
            'IQueue',
            'IMetrics',
          ],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'INFRASTRUCTURE_MODULE_ERROR',
          message: 'Failed to configure infrastructure module',
          details: {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}
