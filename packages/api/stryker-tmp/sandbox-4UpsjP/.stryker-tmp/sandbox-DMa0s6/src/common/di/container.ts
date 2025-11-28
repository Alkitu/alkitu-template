/**
 * Dependency Injection Container - DIP Compliant
 *
 * This container follows the Dependency Inversion Principle by:
 * - Managing dependencies through abstractions
 * - Providing automatic dependency resolution
 * - Supporting different lifetimes (singleton, transient, scoped)
 * - Enabling easy testing through dependency substitution
 */
// @ts-nocheck

// 


import { ServiceResult } from '../interfaces/base-service.interface';

// =============================================================================
// CONTAINER TYPES AND INTERFACES
// =============================================================================

export type ServiceLifetime = 'singleton' | 'transient' | 'scoped';

export interface ServiceDescriptor<T = any> {
  token: string | symbol | Function;
  implementation?: new (...args: any[]) => T;
  factory?: (container: DIContainer) => T;
  instance?: T;
  lifetime: ServiceLifetime;
  dependencies?: (string | symbol | Function)[];
}

export interface ServiceRegistration {
  register<T>(token: string | symbol | Function): ServiceRegistrationBuilder<T>;
  registerSingleton<T>(
    token: string | symbol | Function,
    implementation: new (...args: any[]) => T,
  ): void;
  registerTransient<T>(
    token: string | symbol | Function,
    implementation: new (...args: any[]) => T,
  ): void;
  registerScoped<T>(
    token: string | symbol | Function,
    implementation: new (...args: any[]) => T,
  ): void;
  registerInstance<T>(token: string | symbol | Function, instance: T): void;
  registerFactory<T>(
    token: string | symbol | Function,
    factory: (container: DIContainer) => T,
    lifetime?: ServiceLifetime,
  ): void;
}

export interface ServiceRegistrationBuilder<T> {
  to(implementation: new (...args: any[]) => T): ServiceLifetimeBuilder<T>;
  toFactory(factory: (container: DIContainer) => T): ServiceLifetimeBuilder<T>;
  toInstance(instance: T): void;
}

export interface ServiceLifetimeBuilder<T> {
  asSingleton(): void;
  asTransient(): void;
  asScoped(): void;
  withDependencies(
    ...dependencies: (string | symbol | Function)[]
  ): ServiceLifetimeBuilder<T>;
}

export interface ServiceResolution {
  resolve<T>(token: string | symbol | Function): T;
  resolveOptional<T>(token: string | symbol | Function): T | null;
  resolveAll<T>(token: string | symbol | Function): T[];
  createScope(): DIContainer;
}

export interface ContainerManagement {
  isRegistered(token: string | symbol | Function): boolean;
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
  private services = new Map<string | symbol | Function, ServiceDescriptor>();
  private singletonInstances = new Map<string | symbol | Function, any>();
  private scopedInstances = new Map<string | symbol | Function, any>();
  private isDisposed = false;
  private parent?: DIContainer;

  constructor(parent?: DIContainer) {
    this.parent = parent;
  }

  // =============================================================================
  // SERVICE REGISTRATION
  // =============================================================================

  register<T>(
    token: string | symbol | Function,
  ): ServiceRegistrationBuilder<T> {
    const builder = new ServiceRegistrationBuilderImpl<T>(this, token);
    return builder;
  }

  registerSingleton<T>(
    token: string | symbol | Function,
    implementation: new (...args: any[]) => T,
  ): void {
    this.services.set(token, {
      token,
      implementation,
      lifetime: 'singleton',
    });
  }

  registerTransient<T>(
    token: string | symbol | Function,
    implementation: new (...args: any[]) => T,
  ): void {
    this.services.set(token, {
      token,
      implementation,
      lifetime: 'transient',
    });
  }

  registerScoped<T>(
    token: string | symbol | Function,
    implementation: new (...args: any[]) => T,
  ): void {
    this.services.set(token, {
      token,
      implementation,
      lifetime: 'scoped',
    });
  }

  registerInstance<T>(token: string | symbol | Function, instance: T): void {
    this.services.set(token, {
      token,
      instance,
      lifetime: 'singleton',
    });
    this.singletonInstances.set(token, instance);
  }

  registerFactory<T>(
    token: string | symbol | Function,
    factory: (container: DIContainer) => T,
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

  resolve<T>(token: string | symbol | Function): T {
    if (this.isDisposed) {
      throw new Error('Cannot resolve services from disposed container');
    }

    const service = this.getServiceDescriptor(token);
    if (!service) {
      throw new Error(`Service not registered: ${String(token)}`);
    }

    return this.createInstance<T>(service);
  }

  resolveOptional<T>(token: string | symbol | Function): T | null {
    try {
      return this.resolve<T>(token);
    } catch {
      return null;
    }
  }

  resolveAll<T>(token: string | symbol | Function): T[] {
    const instances: T[] = [];

    // Collect from parent containers
    if (this.parent) {
      instances.push(...this.parent.resolveAll<T>(token));
    }

    // Collect from current container
    for (const [serviceToken, descriptor] of this.services) {
      if (serviceToken === token) {
        instances.push(this.createInstance<T>(descriptor));
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

  isRegistered(token: string | symbol | Function): boolean {
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
      if (instance && typeof instance.dispose === 'function') {
        await instance.dispose();
      }
    }

    // Dispose singleton instances (only if this is the root container)
    if (!this.parent) {
      for (const instance of this.singletonInstances.values()) {
        if (instance && typeof instance.dispose === 'function') {
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
    token: string | symbol | Function,
  ): ServiceDescriptor | null {
    const service = this.services.get(token);
    if (service) {
      return service;
    }

    if (this.parent) {
      return this.parent.getServiceDescriptor(token);
    }

    return null;
  }

  private createInstance<T>(descriptor: ServiceDescriptor): T {
    switch (descriptor.lifetime) {
      case 'singleton':
        return this.createSingleton<T>(descriptor);
      case 'scoped':
        return this.createScoped<T>(descriptor);
      case 'transient':
      default:
        return this.createTransient<T>(descriptor);
    }
  }

  private createSingleton<T>(descriptor: ServiceDescriptor): T {
    const existing = this.singletonInstances.get(descriptor.token);
    if (existing) {
      return existing;
    }

    const instance = this.instantiate<T>(descriptor);
    this.singletonInstances.set(descriptor.token, instance);
    return instance;
  }

  private createScoped<T>(descriptor: ServiceDescriptor): T {
    const existing = this.scopedInstances.get(descriptor.token);
    if (existing) {
      return existing;
    }

    const instance = this.instantiate<T>(descriptor);
    this.scopedInstances.set(descriptor.token, instance);
    return instance;
  }

  private createTransient<T>(descriptor: ServiceDescriptor): T {
    return this.instantiate<T>(descriptor);
  }

  private instantiate<T>(descriptor: ServiceDescriptor): T {
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

  private resolveDependencies(descriptor: ServiceDescriptor): any[] {
    if (!descriptor.dependencies || descriptor.dependencies.length === 0) {
      return [];
    }

    return descriptor.dependencies.map((dep) => this.resolve(dep));
  }

  // Internal method for builder access
  internal_setServiceDescriptor(descriptor: ServiceDescriptor): void {
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
    private token: string | symbol | Function,
  ) {}

  to(implementation: new (...args: any[]) => T): ServiceLifetimeBuilder<T> {
    return new ServiceLifetimeBuilderImpl<T>(this.container, this.token, {
      implementation,
    });
  }

  toFactory(factory: (container: DIContainer) => T): ServiceLifetimeBuilder<T> {
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
    private token: string | symbol | Function,
    options: {
      implementation?: new (...args: any[]) => T;
      factory?: (container: DIContainer) => T;
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

  withDependencies(
    ...dependencies: (string | symbol | Function)[]
  ): ServiceLifetimeBuilder<T> {
    this.descriptor.dependencies = dependencies;
    return this;
  }

  private finalize(): void {
    (this.container as any).internal_setServiceDescriptor(
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
    public readonly token?: string | symbol | Function,
  ) {
    super(message);
    this.name = 'ContainerError';
  }
}

export function createContainer(): DIContainer {
  return new DIContainer();
}

export function isDisposable(
  obj: any,
): obj is { dispose(): Promise<void> | void } {
  return obj && typeof obj.dispose === 'function';
}

// =============================================================================
// DECORATOR SUPPORT (OPTIONAL)
// =============================================================================

export const INJECTABLE_METADATA_KEY = Symbol('injectable');
export const INJECT_METADATA_KEY = Symbol('inject');

export function Injectable(token?: string | symbol): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, token || target, target);
    return target;
  };
}

export function Inject(token: string | symbol | Function): ParameterDecorator {
  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) {
    const existingTokens =
      Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingTokens, target);
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
          return result as ServiceResult<DIContainer>;
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
