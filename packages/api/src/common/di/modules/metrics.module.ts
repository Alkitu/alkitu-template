/**
 * Metrics DI Module - SRP Compliant
 * Single Responsibility: Configure metrics implementations
 */

import { DIContainer, BaseContainerModule } from '../container';
import { ServiceResult } from '../../interfaces/base-service.interface';
import { IMetrics } from '../../interfaces/infrastructure.interface';

export class MetricsModule extends BaseContainerModule {
  constructor(private environment: string) {
    super();
  }

  async configure(container: DIContainer): Promise<ServiceResult<void>> {
    try {
      await Promise.resolve(); // ESLint requires await in async methods
      container.registerFactory(
        'IMetrics',
        () => new NoOpMetrics(),
        'singleton',
      );
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'METRICS_MODULE_ERROR',
          message: 'Failed to configure metrics module',
          details: {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}

export class NoOpMetrics implements IMetrics {
  incrementCounter(): void {}
  decrementCounter(): void {}
  setGauge(): void {}
  incrementGauge(): void {}
  decrementGauge(): void {}
  recordHistogram(): void {}
  startTimer(): () => void {
    return () => {};
  }
  recordDuration(): void {}
  recordCustomMetric(): void {}
}
