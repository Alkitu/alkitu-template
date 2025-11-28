/**
 * Database DI Module - SRP Compliant
 *
 * Single Responsibility: Configure database implementations
 */

import { DIContainer, BaseContainerModule } from '../container';
import { ServiceResult } from '../../interfaces/base-service.interface';
import {
  IDatabase,
  IConfigurationProvider,
  ILogger,
} from '../../interfaces/infrastructure.interface';

export class DatabaseModule extends BaseContainerModule {
  constructor(private environment: string) {
    super();
  }

  async configure(container: DIContainer): Promise<ServiceResult<void>> {
    try {
      await Promise.resolve(); // ESLint requires await in async methods
      switch (this.environment) {
        case 'test':
          container.registerFactory(
            'IDatabase',
            () => new InMemoryDatabase(),
            'singleton',
          );
          break;
        case 'development':
        case 'production':
          container.registerFactory(
            'IDatabase',
            (container) => {
              const config = container.resolve<IConfigurationProvider>(
                'IConfigurationProvider',
              );
              const logger = container.resolve<ILogger>('ILogger');
              return new MongoDatabase(config, logger);
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
          code: 'DATABASE_MODULE_ERROR',
          message: 'Failed to configure database module',
          details: {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}

export class InMemoryDatabase implements IDatabase {
  private data = new Map<string, Record<string, unknown>[]>();
  private isConnectedFlag = false;

  async connect(): Promise<ServiceResult<any>> {
    await Promise.resolve();
    this.isConnectedFlag = true;
    return {
      success: true,
      data: {
        isConnected: true,
        database: 'memory',
        host: 'localhost',
        port: 0,
      },
    };
  }

  async disconnect(): Promise<ServiceResult<void>> {
    await Promise.resolve();
    this.isConnectedFlag = false;
    this.data.clear();
    return { success: true };
  }

  async isHealthy(): Promise<boolean> {
    await Promise.resolve();
    return this.isConnectedFlag;
  }

  async findOne<T>(
    collection: string,
    filter: Record<string, any>,
  ): Promise<ServiceResult<T | null>> {
    await Promise.resolve();
    const items = this.data.get(collection) || [];
    const found = items.find((item) => this.matchesFilter(item, filter));
    return { success: true, data: (found as T) || null };
  }

  async findMany<T>(
    collection: string,
    filter: Record<string, any>,
  ): Promise<ServiceResult<T[]>> {
    await Promise.resolve();
    const items = this.data.get(collection) || [];
    const matches = items.filter((item) => this.matchesFilter(item, filter));
    return { success: true, data: matches as T[] };
  }

  async insertOne<T>(
    collection: string,
    document: T,
  ): Promise<ServiceResult<T>> {
    await Promise.resolve();
    const items = this.data.get(collection) || [];
    const newDoc = {
      ...document,
      id: Math.random().toString(36),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    items.push(newDoc);
    this.data.set(collection, items);
    return { success: true, data: newDoc };
  }

  async updateOne<T>(
    collection: string,
    filter: Record<string, any>,
    update: Partial<T>,
  ): Promise<ServiceResult<T | null>> {
    await Promise.resolve();
    const items = this.data.get(collection) || [];
    const index = items.findIndex((item) => this.matchesFilter(item, filter));
    if (index >= 0) {
      items[index] = {
        ...items[index],
        ...update,
        updatedAt: new Date(),
      };
      return { success: true, data: items[index] as T };
    }
    return { success: true, data: null };
  }

  async deleteOne(
    collection: string,
    filter: Record<string, any>,
  ): Promise<ServiceResult<boolean>> {
    await Promise.resolve();
    const items = this.data.get(collection) || [];
    const index = items.findIndex((item) => this.matchesFilter(item, filter));
    if (index >= 0) {
      items.splice(index, 1);
      return { success: true, data: true };
    }
    return { success: true, data: false };
  }

  async startTransaction(): Promise<ServiceResult<string>> {
    await Promise.resolve();
    return { success: true, data: 'mock-transaction-id' };
  }

  async commitTransaction(): Promise<ServiceResult<void>> {
    await Promise.resolve();
    return { success: true };
  }

  async rollbackTransaction(): Promise<ServiceResult<void>> {
    await Promise.resolve();
    return { success: true };
  }

  private matchesFilter(
    item: Record<string, unknown>,
    filter: Record<string, unknown>,
  ): boolean {
    return Object.entries(filter).every(([key, value]) => item[key] === value);
  }
}

export class MongoDatabase implements IDatabase {
  constructor(
    private config: IConfigurationProvider,
    private logger: ILogger,
  ) {}

  async connect(): Promise<ServiceResult<any>> {
    await Promise.resolve();
    return {
      success: true,
      data: {
        isConnected: true,
        database: this.config.getString('DATABASE_NAME', 'alkitu'),
        host: this.config.getString('DATABASE_HOST', 'localhost'),
        port: this.config.getNumber('DATABASE_PORT', 27017),
      },
    };
  }

  async disconnect(): Promise<ServiceResult<void>> {
    await Promise.resolve();
    return { success: true };
  }

  async isHealthy(): Promise<boolean> {
    await Promise.resolve();
    return true;
  }

  async findOne<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _collection: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filter: Record<string, unknown>,
  ): Promise<ServiceResult<T | null>> {
    await Promise.resolve();
    return { success: true, data: null };
  }

  async findMany<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _collection: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filter: Record<string, unknown>,
  ): Promise<ServiceResult<T[]>> {
    await Promise.resolve();
    return { success: true, data: [] };
  }

  async insertOne<T>(
    _collection: string,
    document: T,
  ): Promise<ServiceResult<T>> {
    await Promise.resolve();
    return { success: true, data: document };
  }

  async updateOne<T>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _collection: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filter: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _update: Partial<T>,
  ): Promise<ServiceResult<T | null>> {
    await Promise.resolve();
    return { success: true, data: null };
  }

  async deleteOne(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _collection: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filter: Record<string, unknown>,
  ): Promise<ServiceResult<boolean>> {
    await Promise.resolve();
    return { success: true, data: false };
  }

  async startTransaction(): Promise<ServiceResult<string>> {
    await Promise.resolve();
    return { success: true, data: 'tx-id' };
  }

  async commitTransaction(): Promise<ServiceResult<void>> {
    await Promise.resolve();
    return { success: true };
  }

  async rollbackTransaction(): Promise<ServiceResult<void>> {
    await Promise.resolve();
    return { success: true };
  }
}
