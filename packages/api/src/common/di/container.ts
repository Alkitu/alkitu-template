/**
 * Dependency Injection Container - DIP Compliant
 *
 * This container follows the Dependency Inversion Principle by:
 * - Managing dependencies through abstractions
 * - Providing automatic dependency resolution
 * - Supporting different lifetimes (singleton, transient, scoped)
 * - Enabling easy testing through dependency substitution
 */

import { ServiceResult } from '../interfaces/base-service.interface';

// Disposable interface for proper type safety
interface Disposable {
  dispose(): Promise<void> | void;
}

// =============================================================================
// CONTAINER TYPES AND INTERFACES
// =============================================================================

export type ServiceLifetime = 'singleton' | 'transient' | 'scoped';

export type ServiceToken<T = any> = string | symbol | ServiceConstructor<T>;
export type ServiceConstructor<T = any> = new (...args: any[]) => T;
export type ServiceFactory<T = any> = (container: DIContainer) => T;

export interface ServiceDescriptor<T = any> {
  token: ServiceToken<T>;
  implementation?: ServiceConstructor<T>;
  factory?: ServiceFactory<T>;
  instance?: T;
  lifetime: ServiceLifetime;
  dependencies?: ServiceToken[];
}

export interface ServiceRegistration {
  register<T>(token: ServiceToken<T>): ServiceRegistrationBuilder<T>;
  registerSingleton<T>(
    token: ServiceToken<T>,
    implementation: ServiceConstructor<T>,
  ): void;
  registerTransient<T>(
    token: ServiceToken<T>,
    implementation: ServiceConstructor<T>,
  ): void;
  registerScoped<T>(
    token: ServiceToken<T>,
    implementation: ServiceConstructor<T>,
  ): void;
  registerInstance<T>(token: ServiceToken<T>, instance: T): void;
  registerFactory<T>(
    token: ServiceToken<T>,
    factory: ServiceFactory<T>,
    lifetime?: ServiceLifetime,
  ): void;
}

export interface ServiceRegistrationBuilder<T> {
  to(implementation: ServiceConstructor<T>): ServiceLifetimeBuilder<T>;
  toFactory(factory: ServiceFactory<T>): ServiceLifetimeBuilder<T>;
  toInstance(instance: T): void;
}

export interface ServiceLifetimeBuilder<T> {
  asSingleton(): void;
  asTransient(): void;
  asScoped(): void;
  withDependencies(...dependencies: ServiceToken[]): ServiceLifetimeBuilder<T>;
}

export interface ServiceResolution {
  resolve<T>(token: ServiceToken<T>): T;
  resolveOptional<T>(token: ServiceToken<T>): T | null;
  resolveAll<T>(token: ServiceToken<T>): T[];
  createScope(): DIContainer;
}

export interface ContainerManagement {
  isRegistered(token: ServiceToken): boolean;
  getRegistrations(): ServiceDescriptor[];
  clear(): void;
  dispose(): Promise<void>;
}

// =============================================================================
// DEPENDENCY INJECTION CONTAINER IMPLEMENTATION
// =============================================================================

export class DIContainer
  implements ServiceRegistration, ServiceResolution, ContainerManagement
{
  private services = new Map<ServiceToken, ServiceDescriptor<unknown>>();
  private singletonInstances = new Map<ServiceToken<any>, unknown>();
  private scopedInstances = new Map<ServiceToken<any>, unknown>();
  private isDisposed = false;
  private parent?: DIContainer;

  constructor(parent?: DIContainer) {
    this.parent = parent;
  }

  // =============================================================================
  // SERVICE REGISTRATION
  // =============================================================================

  register<T>(token: ServiceToken<T>): ServiceRegistrationBuilder<T> {
    const builder = new ServiceRegistrationBuilderImpl<T>(this, token);
    return builder;
  }

  registerSingleton<T>(
    token: ServiceToken<T>,
    implementation: ServiceConstructor<T>,
  ): void {
    this.services.set(token, {
      token,
      implementation,
      lifetime: 'singleton',
    } as ServiceDescriptor<T>);
  }

  registerTransient<T>(
    token: ServiceToken<T>,
    implementation: ServiceConstructor<T>,
  ): void {
    this.services.set(token, {
      token,
      implementation,
      lifetime: 'transient',
    } as ServiceDescriptor<T>); // Add explicit type assertion
  }

  registerScoped<T>(
    token: ServiceToken<T>,
    implementation: ServiceConstructor<T>,
  ): void {
    this.services.set(token, {
      token,
      implementation,
      lifetime: 'scoped',
    });
  }

  registerInstance<T>(token: ServiceToken<T>, instance: T): void {
    this.services.set(token, {
      token,
      instance,
      lifetime: 'singleton',
    });
    this.singletonInstances.set(token, instance);
  }

  registerFactory<T>(
    token: ServiceToken<T>,
    factory: ServiceFactory<T>,
    lifetime: ServiceLifetime = 'transient',
  ): void {
    this.services.set(token, {
      token,
      factory,
      lifetime,
    });
  }

  // =============================================================================
  // SERVICE RESOLUTION
  // =============================================================================

  resolve<T>(token: ServiceToken<T>): T {
    if (this.isDisposed) {
      throw new Error('Cannot resolve services from disposed container');
    }

    const service = this.getServiceDescriptor(token) as ServiceDescriptor<T>;
    if (!service) {
      throw new Error(`Service not registered: ${String(token)}`);
    }

    return this.createInstance<T>(service);
  }

  resolveOptional<T>(token: ServiceToken<T>): T | null {
    try {
      return this.resolve<T>(token);
    } catch {
      return null;
    }
  }

  resolveAll<T>(token: ServiceToken<T>): T[] {
    const instances: T[] = [];

    // Collect from parent containers
    if (this.parent) {
      instances.push(...this.parent.resolveAll<T>(token));
    }

    // Collect from current container
    for (const [serviceToken, descriptor] of this.services) {
      if (serviceToken === token) {
        instances.push(
          this.createInstance<T>(descriptor as ServiceDescriptor<T>),
        );
      }
    }

    return instances;
  }

  createScope(): DIContainer {
    return new DIContainer(this);
  }

  // =============================================================================
  // CONTAINER MANAGEMENT
  // =============================================================================

  isRegistered(token: ServiceToken): boolean {
    return (
      this.services.has(token) ||
      (this.parent ? this.parent.isRegistered(token) : false)
    );
  }

  getRegistrations(): ServiceDescriptor[] {
    const registrations = Array.from(this.services.values());
    if (this.parent) {
      registrations.push(...this.parent.getRegistrations());
    }
    return registrations;
  }

  clear(): void {
    this.services.clear();
    this.singletonInstances.clear();
    this.scopedInstances.clear();
  }

  async dispose(): Promise<void> {
    if (this.isDisposed) {
      return;
    }

    // Dispose scoped instances
    for (const instance of this.scopedInstances.values()) {
      if (isDisposable(instance)) {
        await instance.dispose();
      }
    }

    // Dispose singleton instances (only if this is the root container)
    if (!this.parent) {
      for (const instance of this.singletonInstances.values()) {
        if (isDisposable(instance)) {
          await instance.dispose();
        }
      }
    }

    this.clear();
    this.isDisposed = true;
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private getServiceDescriptor(
    token: ServiceToken,
  ): ServiceDescriptor<unknown> | null {
    const service = this.services.get(token);
    if (service) {
      return service;
    }

    if (this.parent) {
      return this.parent.getServiceDescriptor(token);
    }

    return null;
  }

  private createInstance<T>(descriptor: ServiceDescriptor<unknown>): T {
    switch (descriptor.lifetime) {
      case 'singleton':
        return this.createSingleton<T>(descriptor as ServiceDescriptor<T>);
      case 'scoped':
        return this.createScoped<T>(descriptor as ServiceDescriptor<T>);
      case 'transient':
      default:
        return this.createTransient<T>(descriptor as ServiceDescriptor<T>);
    }
  }

  private createSingleton<T>(descriptor: ServiceDescriptor<T>): T {
    const existing = this.singletonInstances.get(descriptor.token);
    if (existing) {
      return existing as T;
    }

    const instance = this.instantiate<T>(descriptor);
    this.singletonInstances.set(descriptor.token, instance);
    return instance;
  }

  private createScoped<T>(descriptor: ServiceDescriptor<T>): T {
    const existing = this.scopedInstances.get(descriptor.token);
    if (existing) {
      return existing as T;
    }

    const instance = this.instantiate<T>(descriptor);
    this.scopedInstances.set(descriptor.token, instance);
    return instance;
  }

  private createTransient<T>(descriptor: ServiceDescriptor<T>): T {
    return this.instantiate<T>(descriptor);
  }

  private instantiate<T>(descriptor: ServiceDescriptor<T>): T {
    if (descriptor.instance) {
      return descriptor.instance;
    }

    if (descriptor.factory) {
      return descriptor.factory(this);
    }

    if (descriptor.implementation) {
      const dependencies = this.resolveDependencies(descriptor);
      return new descriptor.implementation(...dependencies);
    }

    throw new Error(`Cannot instantiate service: ${String(descriptor.token)}`);
  }

  // 2. Fix the resolveDependencies method (line ~351):
  private resolveDependencies(
    descriptor: ServiceDescriptor<unknown>,
  ): unknown[] {
    if (!descriptor.dependencies || descriptor.dependencies.length === 0) {
      return [];
    }

    return descriptor.dependencies.map((dep: ServiceToken<unknown>) =>
      this.resolve(dep),
    );
  }

  // Internal method for builder access
  public internal_setServiceDescriptor(
    descriptor: ServiceDescriptor<unknown>,
  ): void {
    this.services.set(descriptor.token, descriptor);
  }
}

// =============================================================================
// SERVICE REGISTRATION BUILDER IMPLEMENTATION
// =============================================================================

class ServiceRegistrationBuilderImpl<T>
  implements ServiceRegistrationBuilder<T>
{
  constructor(
    private container: DIContainer,
    private token: ServiceToken<T>,
  ) {}

  to(implementation: ServiceConstructor<T>): ServiceLifetimeBuilder<T> {
    return new ServiceLifetimeBuilderImpl<T>(this.container, this.token, {
      implementation,
    });
  }

  toFactory(factory: ServiceFactory<T>): ServiceLifetimeBuilder<T> {
    return new ServiceLifetimeBuilderImpl<T>(this.container, this.token, {
      factory,
    });
  }

  toInstance(instance: T): void {
    this.container.registerInstance(this.token, instance);
  }
}

class ServiceLifetimeBuilderImpl<T> implements ServiceLifetimeBuilder<T> {
  private descriptor: Partial<ServiceDescriptor<T>>;

  constructor(
    private container: DIContainer,
    private token: ServiceToken<T>,
    options: {
      implementation?: ServiceConstructor<T>;
      factory?: ServiceFactory<T>;
    },
  ) {
    this.descriptor = {
      token: this.token,
      ...options,
      lifetime: 'transient', // default
    };
  }

  asSingleton(): void {
    this.descriptor.lifetime = 'singleton';
    this.finalize();
  }

  asTransient(): void {
    this.descriptor.lifetime = 'transient';
    this.finalize();
  }

  asScoped(): void {
    this.descriptor.lifetime = 'scoped';
    this.finalize();
  }

  withDependencies(...dependencies: ServiceToken[]): ServiceLifetimeBuilder<T> {
    this.descriptor.dependencies = dependencies;
    return this;
  }

  private finalize(): void {
    this.container.internal_setServiceDescriptor(
      this.descriptor as ServiceDescriptor<T>,
    );
  }
}

// =============================================================================
// CONTAINER UTILITIES AND HELPERS
// =============================================================================

export class ContainerError extends Error {
  constructor(
    message: string,
    public readonly token?: ServiceToken,
  ) {
    super(message);
    this.name = 'ContainerError';
  }
}

export function createContainer(): DIContainer {
  return new DIContainer();
}

export function isDisposable(obj: unknown): obj is Disposable {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'dispose' in obj &&
    typeof (obj as Disposable).dispose === 'function'
  );
}

// =============================================================================
// DECORATOR SUPPORT (OPTIONAL)
// =============================================================================

export const INJECTABLE_METADATA_KEY = Symbol('injectable');
export const INJECT_METADATA_KEY = Symbol('inject');

// Simple metadata storage
const metadataStore = new WeakMap<object, Map<string | symbol, unknown>>();

function setMetadata(
  key: string | symbol,
  value: unknown,
  target: object,
): void {
  if (!metadataStore.has(target)) {
    metadataStore.set(target, new Map());
  }
  metadataStore.get(target)?.set(key, value);
}

function getMetadata<T>(key: string | symbol, target: object): T | undefined {
  return metadataStore.get(target)?.get(key) as T | undefined;
}

export function Injectable(token?: string | symbol): ClassDecorator {
  return function (target: any): any {
    setMetadata(INJECTABLE_METADATA_KEY, token || target, target);
    return target;
  };
}

export function Inject(token: ServiceToken): ParameterDecorator {
  return function (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) {
    const existingTokens: ServiceToken<unknown>[] =
      getMetadata<ServiceToken<unknown>[]>(INJECT_METADATA_KEY, target) || [];
    existingTokens[parameterIndex] = token;
    setMetadata(INJECT_METADATA_KEY, existingTokens, target);
  };
}

// =============================================================================
// CONTAINER CONFIGURATION HELPERS
// =============================================================================

export interface ContainerConfiguration {
  registerInfrastructure(container: DIContainer): Promise<ServiceResult<void>>;
  registerRepositories(container: DIContainer): Promise<ServiceResult<void>>;
  registerServices(container: DIContainer): Promise<ServiceResult<void>>;
  registerControllers(container: DIContainer): Promise<ServiceResult<void>>;
}

export abstract class BaseContainerModule {
  abstract configure(container: DIContainer): Promise<ServiceResult<void>>;
}

export class ContainerBuilder {
  private modules: BaseContainerModule[] = [];

  addModule(module: BaseContainerModule): ContainerBuilder {
    this.modules.push(module);
    return this;
  }

  async build(): Promise<ServiceResult<DIContainer>> {
    try {
      const container = new DIContainer();

      for (const module of this.modules) {
        const result = await module.configure(container);
        if (!result.success) {
          return {
            success: false,
            error: result.error,
          } as ServiceResult<DIContainer>;
        }
      }

      return {
        success: true,
        data: container,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CONTAINER_BUILD_ERROR',
          message: 'Failed to build dependency injection container',
          details: {
            originalError:
              error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}
