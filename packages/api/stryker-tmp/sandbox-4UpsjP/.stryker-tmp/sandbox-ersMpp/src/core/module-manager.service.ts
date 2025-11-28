// @ts-nocheck
// 
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ModuleConfig,
  ModuleFlag,
  getModuleConfig,
} from '../config/modules.config';
import { ModulePluginRegistryService } from './services/module-plugin-registry.service';

export interface ModuleDefinition {
  name: string;
  version: string;
  dependencies: string[];
  factory: () => Promise<unknown>;
  config: Record<string, unknown>;
}

/**
 * Module Manager Service - OCP Refactored
 *
 * This service now uses the ModulePluginRegistry following OCP principles.
 * New modules can be added by registering plugins without modifying this service.
 */
@Injectable()
export class ModuleManagerService implements OnModuleInit {
  private readonly logger = new Logger(ModuleManagerService.name);
  private modules: Map<string, ModuleDefinition> = new Map();
  private loadedModules: Map<string, any> = new Map();
  private moduleConfig: ModuleConfig;

  constructor(
    private readonly modulePluginRegistry: ModulePluginRegistryService,
  ) {}

  async onModuleInit() {
    this.moduleConfig = getModuleConfig();
    await this.initializeModules();
  }

  /**
   * Initialize all enabled modules based on configuration
   */
  private async initializeModules(): Promise<void> {
    this.logger.log('Initializing modules...');

    const enabledModules = this.getEnabledModules();
    const sortedModules = this.sortModulesByDependencies(enabledModules);

    for (const module of sortedModules) {
      try {
        await this.loadModule(module);
        this.logger.log(`✅ Module loaded: ${module.name}`);
      } catch (error) {
        this.logger.error(`❌ Failed to load module ${module.name}:`, error);
      }
    }

    this.logger.log(
      `🚀 Module initialization complete. ${this.loadedModules.size} modules loaded.`,
    );
  }

  /**
   * Get all enabled modules from configuration
   */
  private getEnabledModules(): ModuleDefinition[] {
    const enabledModules: ModuleDefinition[] = [];

    // Process core modules
    Object.entries(this.moduleConfig.core).forEach(([key, config]) => {
      if (config.enabled) {
        enabledModules.push({
          name: key,
          version: config.version,
          dependencies: config.dependencies,
          factory: () => this.createModuleUsingRegistry(key, config),
          config: config.config,
        });
      }
    });

    // Process feature modules
    Object.entries(this.moduleConfig.features).forEach(([key, config]) => {
      if (config.enabled) {
        enabledModules.push({
          name: key,
          version: config.version,
          dependencies: config.dependencies,
          factory: () => this.createModuleUsingRegistry(key, config),
          config: config.config,
        });
      }
    });

    // Process integration modules
    Object.entries(this.moduleConfig.integrations).forEach(([key, config]) => {
      if (config.enabled) {
        enabledModules.push({
          name: key,
          version: config.version,
          dependencies: config.dependencies,
          factory: () => this.createModuleUsingRegistry(key, config),
          config: config.config,
        });
      }
    });

    return enabledModules;
  }

  /**
   * Sort modules by dependencies (topological sort)
   */
  private sortModulesByDependencies(
    modules: ModuleDefinition[],
  ): ModuleDefinition[] {
    const sorted: ModuleDefinition[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (module: ModuleDefinition) => {
      if (visiting.has(module.name)) {
        throw new Error(`Circular dependency detected: ${module.name}`);
      }

      if (visited.has(module.name)) {
        return;
      }

      visiting.add(module.name);

      // Visit dependencies first
      for (const depName of module.dependencies) {
        const dependency = modules.find((m) => m.name === depName);
        if (dependency) {
          visit(dependency);
        }
      }

      visiting.delete(module.name);
      visited.add(module.name);
      sorted.push(module);
    };

    for (const module of modules) {
      visit(module);
    }

    return sorted;
  }

  /**
   * Load a specific module
   */
  private async loadModule(module: ModuleDefinition): Promise<void> {
    // Check if dependencies are loaded
    if (!this.checkDependencies(module)) {
      throw new Error(`Dependencies not met for module: ${module.name}`);
    }

    // Load the module
    const moduleInstance = await module.factory();
    this.loadedModules.set(module.name, moduleInstance);
    this.modules.set(module.name, module);
  }

  /**
   * Check if module dependencies are satisfied
   */
  private checkDependencies(module: ModuleDefinition): boolean {
    return module.dependencies.every((dep) => this.loadedModules.has(dep));
  }

  /**
   * Create module using the OCP-compliant plugin registry
   *
   * ✅ OCP COMPLIANT: No switch statements needed!
   * The registry dynamically finds the appropriate plugin
   * New modules can be added without modifying this method
   */
  private async createModuleUsingRegistry(
    name: string,
    config: ModuleFlag,
  ): Promise<unknown> {
    try {
      this.logger.log(`Creating module '${name}' using plugin registry`);

      // ✅ OCP: Delegate to registry - no switch statements
      const moduleInstance = await this.modulePluginRegistry.createModule(
        name,
        config,
      );

      this.logger.log(
        `Module '${name}' created successfully via plugin registry`,
      );
      return moduleInstance;
    } catch (error) {
      this.logger.error(
        `Failed to create module '${name}' via plugin registry:`,
        error,
      );

      // Fallback to legacy methods for backward compatibility
      this.logger.warn(
        `Attempting to create module '${name}' using legacy methods...`,
      );
      return this.createModuleLegacy(name, config);
    }
  }

  /**
   * Legacy module creation methods (for backward compatibility)
   *
   * ⚠️ DEPRECATED: These methods contain the original switch statements
   * They are kept for backward compatibility but should be replaced by plugins
   */
  private createModuleLegacy(name: string, config: ModuleFlag): unknown {
    this.logger.warn(`Using legacy module creation for: ${name}`);

    // Try each category in order
    try {
      return this.createCoreModuleLegacy(name, config);
    } catch {
      try {
        return this.createFeatureModuleLegacy(name, config);
      } catch {
        try {
          return this.createIntegrationModuleLegacy(name, config);
        } catch {
          throw new Error(
            `Unknown module: ${name}. Please register a plugin for this module.`,
          );
        }
      }
    }
  }

  /**
   * Legacy core module creation (DEPRECATED)
   */
  private createCoreModuleLegacy(name: string, config: ModuleFlag): unknown {
    switch (name) {
      case 'auth':
        return this.createAuthModule(config);
      case 'users':
        return this.createUsersModule(config);
      case 'health':
        return this.createHealthModule(config);
      default:
        throw new Error(`Unknown core module: ${name}`);
    }
  }

  /**
   * Legacy feature module creation (DEPRECATED)
   */
  private createFeatureModuleLegacy(name: string, config: ModuleFlag): unknown {
    switch (name) {
      case 'notifications':
        return this.createNotificationsModule(config);
      case 'billing':
        return this.createBillingModule(config);
      case 'analytics':
        return this.createAnalyticsModule(config);
      case 'websocket':
        return this.createWebSocketModule(config);
      case 'email':
        return this.createEmailModule(config);
      default:
        throw new Error(`Unknown feature module: ${name}`);
    }
  }

  /**
   * Legacy integration module creation (DEPRECATED)
   */
  private createIntegrationModuleLegacy(
    name: string,
    config: ModuleFlag,
  ): unknown {
    switch (name) {
      case 'tRPC':
        return this.createTRPCModule(config);
      case 'graphQL':
        return this.createGraphQLModule(config);
      case 'rest':
        return this.createRESTModule(config);
      case 'mcp':
        return this.createMCPModule(config);
      default:
        throw new Error(`Unknown integration module: ${name}`);
    }
  }

  // Module creation methods (placeholders for now)
  private createAuthModule(config: ModuleFlag): unknown {
    this.logger.log('Creating Auth module with config:', config.config);
    return { name: 'auth', config: config.config };
  }

  private createUsersModule(config: ModuleFlag): unknown {
    this.logger.log('Creating Users module with config:', config.config);
    return { name: 'users', config: config.config };
  }

  private createHealthModule(config: ModuleFlag): unknown {
    this.logger.log('Creating Health module with config:', config.config);
    return { name: 'health', config: config.config };
  }

  private createNotificationsModule(config: ModuleFlag): unknown {
    this.logger.log(
      'Creating Notifications module with config:',
      config.config,
    );
    return { name: 'notifications', config: config.config };
  }

  private createBillingModule(config: ModuleFlag): unknown {
    this.logger.log('Creating Billing module with config:', config.config);
    return { name: 'billing', config: config.config };
  }

  private createAnalyticsModule(config: ModuleFlag): unknown {
    this.logger.log('Creating Analytics module with config:', config.config);
    return { name: 'analytics', config: config.config };
  }

  private createWebSocketModule(config: ModuleFlag): unknown {
    this.logger.log('Creating WebSocket module with config:', config.config);
    return { name: 'websocket', config: config.config };
  }

  private createEmailModule(config: ModuleFlag): unknown {
    this.logger.log('Creating Email module with config:', config.config);
    return { name: 'email', config: config.config };
  }

  private createTRPCModule(config: ModuleFlag): unknown {
    this.logger.log('Creating tRPC module with config:', config.config);
    return { name: 'tRPC', config: config.config };
  }

  private createGraphQLModule(config: ModuleFlag): unknown {
    this.logger.log('Creating GraphQL module with config:', config.config);
    return { name: 'graphQL', config: config.config };
  }

  private createRESTModule(config: ModuleFlag): unknown {
    this.logger.log('Creating REST module with config:', config.config);
    return { name: 'rest', config: config.config };
  }

  private createMCPModule(config: ModuleFlag): unknown {
    this.logger.log('Creating MCP module with config:', config.config);
    return { name: 'mcp', config: config.config };
  }

  /**
   * Get loaded module by name
   */
  public getModule(name: string): any {
    return this.loadedModules.get(name);
  }

  /**
   * Check if module is loaded
   */
  public isModuleLoaded(name: string): boolean {
    return this.loadedModules.has(name);
  }

  /**
   * Get all loaded modules
   */
  public getLoadedModules(): Map<string, any> {
    return this.loadedModules;
  }

  /**
   * Get module configuration
   */
  public getModuleConfig(): ModuleConfig {
    return this.moduleConfig;
  }

  /**
   * Update module configuration and reload
   */
  public async updateModuleConfig(
    newConfig: Partial<ModuleConfig>,
  ): Promise<void> {
    this.moduleConfig = { ...this.moduleConfig, ...newConfig };
    await this.initializeModules();
  }

  /**
   * Unload a module
   */
  public unloadModule(name: string): void {
    if (this.loadedModules.has(name)) {
      // Check if other modules depend on this one
      const dependentModules = Array.from(this.modules.values()).filter(
        (module) => module.dependencies.includes(name),
      );

      if (dependentModules.length > 0) {
        throw new Error(
          `Cannot unload module ${name}: depended on by ${dependentModules.map((m) => m.name).join(', ')}`,
        );
      }

      this.loadedModules.delete(name);
      this.modules.delete(name);
      this.logger.log(`Module unloaded: ${name}`);
    }
  }

  /**
   * Get module status report (Enhanced with OCP info)
   */
  public getModuleStatus(): any {
    const loadedModules = Array.from(this.loadedModules.keys());
    const availableModules = Object.keys({
      ...this.moduleConfig.core,
      ...this.moduleConfig.features,
      ...this.moduleConfig.integrations,
    });

    // Get registry information for OCP capabilities
    const registryStats = this.modulePluginRegistry.getRegistryStats();

    return {
      loaded: loadedModules,
      available: availableModules,
      loadedCount: loadedModules.length,
      availableCount: availableModules.length,
      config: this.moduleConfig,

      // ✅ OCP Information
      ocpCompliance: {
        description: 'This system follows the Open/Closed Principle',
        registeredPlugins: registryStats.totalPlugins,
        supportedModules: registryStats.supportedModules,
        pluginsByCategory: registryStats.pluginsByCategory,
        benefits: [
          'New modules can be added without modifying existing code',
          'Modules are registered dynamically through plugins',
          'System is extensible without breaking existing functionality',
          'Each module type has its own validation and creation logic',
        ],
        extensionExample:
          'To add a new module, create a class implementing IModulePlugin and register it',
      },
    };
  }

  /**
   * Get detailed plugin information (OCP capability demonstration)
   */
  public getPluginInfo(): any {
    return {
      registryStats: this.modulePluginRegistry.getRegistryStats(),
      pluginMetadata: this.modulePluginRegistry.getPluginMetadata(),
      ocpDemonstration: {
        title: 'Open/Closed Principle Implementation',
        description:
          'This module system demonstrates OCP by allowing extension without modification',
        examples: [
          'WebhookModulePlugin was added without modifying existing code',
          'New module categories can be added by implementing IModulePlugin',
          'Plugin registry handles all module creation dynamically',
          'No switch statements need modification for new modules',
        ],
        architecture: {
          'Plugin Interface':
            'IModulePlugin defines the contract for all modules',
          'Plugin Registry':
            'ModulePluginRegistryService manages registration and discovery',
          'Module Manager':
            'ModuleManagerService delegates creation to registry',
          'Extension Points': 'New plugins can be registered at runtime',
        },
      },
    };
  }
}
