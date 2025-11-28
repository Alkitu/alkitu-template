// @ts-nocheck
// 
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  IModulePlugin,
  IModulePluginRegistry,
  ModuleCategory,
} from '../plugins/module-plugin.interface';
import { ModuleFlag } from '../../config/modules.config';

/**
 * Module Plugin Registry Service - OCP Compliant
 *
 * Manages module plugin registration and discovery following OCP.
 * This service is OPEN for extension (new plugins) but CLOSED for modification.
 */
@Injectable()
export class ModulePluginRegistryService
  implements IModulePluginRegistry, OnModuleInit
{
  private readonly logger = new Logger(ModulePluginRegistryService.name);
  private readonly plugins = new Map<string, IModulePlugin>();

  async onModuleInit() {
    this.logger.log('Module Plugin Registry initialized');
    this.logRegisteredPlugins();
  }

  /**
   * Register a new module plugin
   *
   * This method allows EXTENSION without MODIFICATION - core OCP principle
   */
  registerPlugin(plugin: IModulePlugin): void {
    if (this.plugins.has(plugin.name)) {
      this.logger.warn(
        `Module plugin '${plugin.name}' is already registered. Overriding existing plugin.`,
      );
    }

    // Validate plugin before registration
    const validation = this.validatePlugin(plugin);
    if (!validation.isValid) {
      throw new Error(
        `Invalid module plugin '${plugin.name}': ${validation.errors.join(', ')}`,
      );
    }

    this.plugins.set(plugin.name, plugin);
    this.logger.log(
      `Module plugin '${plugin.name}' registered successfully (category: ${plugin.category})`,
    );
  }

  /**
   * Get plugin that supports a specific module name
   */
  getPlugin(name: string): IModulePlugin | undefined {
    const plugin = this.plugins.get(name);

    if (!plugin) {
      this.logger.warn(`No module plugin found for: ${name}`);
      return undefined;
    }

    if (!plugin.supports(name)) {
      this.logger.error(
        `Plugin '${plugin.name}' is registered for '${name}' but doesn't support it`,
      );
      return undefined;
    }

    return plugin;
  }

  /**
   * Get all plugins by category
   */
  getPluginsByCategory(category: ModuleCategory): IModulePlugin[] {
    return Array.from(this.plugins.values()).filter(
      (plugin) => plugin.category === category,
    );
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): IModulePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all supported module names
   */
  getSupportedModules(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Check if a specific module is supported
   */
  isModuleSupported(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Create module using the appropriate plugin
   *
   * This method orchestrates module creation without needing modification
   * when new module types are added
   */
  async createModule(name: string, config: ModuleFlag): Promise<any> {
    const plugin = this.getPlugin(name);

    if (!plugin) {
      const supportedModules = this.getSupportedModules().join(', ');
      const errorMessage = `Module '${name}' is not supported. Supported modules: ${supportedModules}`;

      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Validate configuration before creating
    const validation = plugin.validateConfig(config);
    if (!validation.isValid) {
      const errorMessage = `Invalid configuration for module '${name}': ${validation.errors.join(', ')}`;

      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      this.logger.log(
        `Creating module '${name}' using ${plugin.constructor.name}`,
      );
      const moduleInstance = await plugin.create(config);

      this.logger.log(`Module '${name}' created successfully`);
      return moduleInstance;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Exception creating module '${name}':`, error);

      throw new Error(`Failed to create module '${name}': ${errorMessage}`);
    }
  }

  /**
   * Unregister a module plugin
   */
  unregisterPlugin(name: string): boolean {
    const existed = this.plugins.has(name);
    this.plugins.delete(name);

    if (existed) {
      this.logger.log(`Module plugin '${name}' unregistered successfully`);
    } else {
      this.logger.warn(
        `Attempted to unregister non-existent module plugin: ${name}`,
      );
    }

    return existed;
  }

  /**
   * Get registry statistics
   */
  getRegistryStats(): {
    totalPlugins: number;
    supportedModules: string[];
    pluginsByCategory: Record<ModuleCategory, string[]>;
    pluginDetails: Array<{
      name: string;
      category: ModuleCategory;
      version: string;
      dependencies: string[];
      className: string;
    }>;
  } {
    const plugins = this.getAllPlugins();

    const pluginsByCategory = plugins.reduce(
      (acc, plugin) => {
        if (!acc[plugin.category]) {
          acc[plugin.category] = [];
        }
        acc[plugin.category].push(plugin.name);
        return acc;
      },
      {} as Record<ModuleCategory, string[]>,
    );

    return {
      totalPlugins: plugins.length,
      supportedModules: this.getSupportedModules(),
      pluginsByCategory,
      pluginDetails: plugins.map((plugin) => ({
        name: plugin.name,
        category: plugin.category,
        version: plugin.version,
        dependencies: plugin.dependencies,
        className: plugin.constructor.name,
      })),
    };
  }

  /**
   * Get detailed information about all plugins
   */
  getPluginMetadata(): any[] {
    return this.getAllPlugins().map((plugin) => plugin.getMetadata());
  }

  /**
   * Validate dependencies for a set of modules
   */
  validateDependencies(moduleNames: string[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const availableModules = new Set(this.getSupportedModules());

    for (const moduleName of moduleNames) {
      const plugin = this.getPlugin(moduleName);
      if (!plugin) {
        errors.push(`Module '${moduleName}' is not supported`);
        continue;
      }

      // Check if dependencies are available
      for (const dependency of plugin.dependencies) {
        if (!availableModules.has(dependency)) {
          errors.push(
            `Module '${moduleName}' depends on unsupported module '${dependency}'`,
          );
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate a plugin before registration
   */
  private validatePlugin(plugin: IModulePlugin): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!plugin.name || typeof plugin.name !== 'string') {
      errors.push('Plugin name is required and must be a string');
    }

    if (
      !plugin.category ||
      !['core', 'feature', 'integration'].includes(plugin.category)
    ) {
      errors.push('Plugin category must be one of: core, feature, integration');
    }

    if (!plugin.version || typeof plugin.version !== 'string') {
      errors.push('Plugin version is required and must be a string');
    }

    if (!Array.isArray(plugin.dependencies)) {
      errors.push('Plugin dependencies must be an array');
    }

    if (typeof plugin.create !== 'function') {
      errors.push('Plugin must implement create method');
    }

    if (typeof plugin.supports !== 'function') {
      errors.push('Plugin must implement supports method');
    }

    if (typeof plugin.validateConfig !== 'function') {
      errors.push('Plugin must implement validateConfig method');
    }

    if (typeof plugin.getMetadata !== 'function') {
      errors.push('Plugin must implement getMetadata method');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private logRegisteredPlugins(): void {
    const stats = this.getRegistryStats();

    this.logger.log(`Module Plugin Registry Status:`);
    this.logger.log(`- Total plugins: ${stats.totalPlugins}`);
    this.logger.log(
      `- Supported modules: ${stats.supportedModules.join(', ')}`,
    );

    Object.entries(stats.pluginsByCategory).forEach(([category, modules]) => {
      this.logger.log(`- ${category} modules: ${modules.join(', ')}`);
    });

    stats.pluginDetails.forEach((detail) => {
      this.logger.log(
        `- ${detail.name} (${detail.category}): ${detail.className} v${detail.version}`,
      );
    });
  }
}
