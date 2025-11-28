// @ts-nocheck
// 
import { ModuleFlag } from '../../config/modules.config';

/**
 * Module Plugin Interface - OCP Compliant
 *
 * Defines the contract for all module plugin implementations.
 * New module types can be added by implementing this interface
 * without modifying existing code.
 */
export interface IModulePlugin {
  /**
   * Unique identifier for this module plugin
   */
  readonly name: string;

  /**
   * Module category (core, feature, integration)
   */
  readonly category: ModuleCategory;

  /**
   * Module version
   */
  readonly version: string;

  /**
   * Dependencies required by this module
   */
  readonly dependencies: string[];

  /**
   * Create module instance with given configuration
   * @param config Module configuration
   * @returns Module instance
   */
  create(config: ModuleFlag): Promise<any> | any;

  /**
   * Check if this plugin supports a given module name
   * @param name Module name to check
   * @returns True if this plugin supports the module
   */
  supports(name: string): boolean;

  /**
   * Validate module configuration
   * @param config Module configuration
   * @returns Validation result
   */
  validateConfig(config: ModuleFlag): { isValid: boolean; errors: string[] };

  /**
   * Get module metadata
   * @returns Module metadata
   */
  getMetadata(): ModuleMetadata;
}

/**
 * Module categories following the existing system structure
 */
export type ModuleCategory = 'core' | 'feature' | 'integration';

/**
 * Module metadata interface
 */
export interface ModuleMetadata {
  name: string;
  category: ModuleCategory;
  version: string;
  dependencies: string[];
  description: string;
  configSchema?: any;
  tags?: string[];
}

/**
 * Module Plugin Registry Interface
 *
 * Manages registration and discovery of module plugins
 * following the Open/Closed Principle
 */
export interface IModulePluginRegistry {
  /**
   * Register a new module plugin
   * @param plugin Module plugin implementation
   */
  registerPlugin(plugin: IModulePlugin): void;

  /**
   * Get plugin that supports a specific module name
   * @param name Module name
   * @returns Module plugin or undefined if not found
   */
  getPlugin(name: string): IModulePlugin | undefined;

  /**
   * Get all plugins by category
   * @param category Module category
   * @returns Array of plugins in the category
   */
  getPluginsByCategory(category: ModuleCategory): IModulePlugin[];

  /**
   * Get all registered plugins
   * @returns Array of all registered plugins
   */
  getAllPlugins(): IModulePlugin[];

  /**
   * Get all supported module names
   * @returns Array of supported module names
   */
  getSupportedModules(): string[];

  /**
   * Check if a specific module is supported
   * @param name Module name
   * @returns True if supported
   */
  isModuleSupported(name: string): boolean;
}
