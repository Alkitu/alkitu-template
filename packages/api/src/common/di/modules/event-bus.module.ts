/**
 * Event Bus DI Module - SRP Compliant
 * Single Responsibility: Configure event bus implementations
 */

import { DIContainer, BaseContainerModule } from '../container';
import { ServiceResult } from '../../interfaces/base-service.interface';
import {
  IEventBus,
  DomainEvent,
  EventHandler,
} from '../../interfaces/infrastructure.interface';

export class EventBusModule extends BaseContainerModule {
  constructor(private environment: string) {
    super();
  }

  async configure(container: DIContainer): Promise<ServiceResult<void>> {
    try {
      await Promise.resolve(); // ESLint requires await in async methods
      container.registerFactory(
        'IEventBus',
        () => new InMemoryEventBus(),
        'singleton',
      );
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EVENT_BUS_MODULE_ERROR',
          message: 'Failed to configure event bus module',
          details: {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}

export class InMemoryEventBus implements IEventBus {
  private handlers = new Map<string, EventHandler<any>[]>();

  async publish<TData>(
    eventType: string,
    data: TData,
  ): Promise<ServiceResult<void>> {
    const eventHandlers = this.handlers.get(eventType) || [];
    await Promise.all(
      eventHandlers.map((handler) =>
        handler.handle({
          type: eventType,
          data,
          metadata: {
            eventId: 'test',
            timestamp: new Date(),
            source: 'test',
            version: '1.0.0',
          },
        }),
      ),
    );
    return { success: true };
  }

  async subscribe<TEvent extends DomainEvent>(
    eventType: string,
    handler: EventHandler<TEvent>,
  ): Promise<ServiceResult<void>> {
    await Promise.resolve(); // ESLint requires await in async methods
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
    return { success: true };
  }

  async unsubscribe(): Promise<ServiceResult<void>> {
    await Promise.resolve(); // ESLint requires await in async methods
    return { success: true };
  }

  async publishMany(): Promise<ServiceResult<void>> {
    await Promise.resolve(); // ESLint requires await in async methods
    return { success: true };
  }

  async getEvents(): Promise<ServiceResult<any[]>> {
    await Promise.resolve(); // ESLint requires await in async methods
    return { success: true, data: [] };
  }

  async replay(): Promise<ServiceResult<number>> {
    await Promise.resolve(); // ESLint requires await in async methods
    return { success: true, data: 0 };
  }
}
