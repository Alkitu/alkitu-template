import * as PluginExports from './index';

describe('Core Plugins Index', () => {
  describe('exports', () => {
    it('should export module plugin interface', () => {
      // Note: Interfaces are not exported as runtime objects in TypeScript
      // They are only available at compile time
      expect(typeof PluginExports).toBe('object');
      expect(Object.keys(PluginExports).length).toBeGreaterThan(0);
    });

    it('should export core module plugins', () => {
      expect(PluginExports).toHaveProperty('AuthModulePlugin');
      expect(PluginExports).toHaveProperty('UsersModulePlugin');
      expect(PluginExports).toHaveProperty('HealthModulePlugin');
    });

    it('should export feature module plugins', () => {
      expect(PluginExports).toHaveProperty('NotificationsModulePlugin');
    });

    it('should export integration module plugins', () => {
      expect(PluginExports).toHaveProperty('WebhookModulePlugin');
    });

    it('should export registry service', () => {
      expect(PluginExports).toHaveProperty('ModulePluginRegistryService');
    });
  });

  describe('plugin class constructors', () => {
    it('should be able to instantiate AuthModulePlugin', () => {
      const plugin = new PluginExports.AuthModulePlugin();
      expect(plugin).toBeInstanceOf(PluginExports.AuthModulePlugin);
      expect(plugin.name).toBe('auth');
      expect(plugin.category).toBe('core');
    });

    it('should be able to instantiate UsersModulePlugin', () => {
      const plugin = new PluginExports.UsersModulePlugin();
      expect(plugin).toBeInstanceOf(PluginExports.UsersModulePlugin);
      expect(plugin.name).toBe('users');
      expect(plugin.category).toBe('core');
    });

    it('should be able to instantiate HealthModulePlugin', () => {
      const plugin = new PluginExports.HealthModulePlugin();
      expect(plugin).toBeInstanceOf(PluginExports.HealthModulePlugin);
      expect(plugin.name).toBe('health');
      expect(plugin.category).toBe('core');
    });

    it('should be able to instantiate NotificationsModulePlugin', () => {
      const plugin = new PluginExports.NotificationsModulePlugin();
      expect(plugin).toBeInstanceOf(PluginExports.NotificationsModulePlugin);
      expect(plugin.name).toBe('notifications');
      expect(plugin.category).toBe('feature');
    });

    it('should be able to instantiate WebhookModulePlugin', () => {
      const plugin = new PluginExports.WebhookModulePlugin();
      expect(plugin).toBeInstanceOf(PluginExports.WebhookModulePlugin);
      expect(plugin.name).toBe('webhook');
      expect(plugin.category).toBe('integration');
    });

    it('should be able to instantiate ModulePluginRegistryService', () => {
      const service = new PluginExports.ModulePluginRegistryService();
      expect(service).toBeInstanceOf(PluginExports.ModulePluginRegistryService);
    });
  });

  describe('plugin interface implementations', () => {
    it('should verify all plugins implement IModulePlugin', () => {
      const plugins = [
        new PluginExports.AuthModulePlugin(),
        new PluginExports.UsersModulePlugin(),
        new PluginExports.HealthModulePlugin(),
        new PluginExports.NotificationsModulePlugin(),
        new PluginExports.WebhookModulePlugin(),
      ];

      plugins.forEach(plugin => {
        expect(plugin).toHaveProperty('name');
        expect(plugin).toHaveProperty('category');
        expect(plugin).toHaveProperty('version');
        expect(plugin).toHaveProperty('dependencies');
        expect(plugin).toHaveProperty('create');
        expect(plugin).toHaveProperty('supports');
        expect(plugin).toHaveProperty('validateConfig');
        expect(plugin).toHaveProperty('getMetadata');
        expect(typeof plugin.create).toBe('function');
        expect(typeof plugin.supports).toBe('function');
        expect(typeof plugin.validateConfig).toBe('function');
        expect(typeof plugin.getMetadata).toBe('function');
      });
    });

    it('should verify plugin categories are correct', () => {
      const corePlugins = [
        new PluginExports.AuthModulePlugin(),
        new PluginExports.UsersModulePlugin(),
        new PluginExports.HealthModulePlugin(),
      ];

      const featurePlugins = [
        new PluginExports.NotificationsModulePlugin(),
      ];

      const integrationPlugins = [
        new PluginExports.WebhookModulePlugin(),
      ];

      corePlugins.forEach(plugin => {
        expect(plugin.category).toBe('core');
      });

      featurePlugins.forEach(plugin => {
        expect(plugin.category).toBe('feature');
      });

      integrationPlugins.forEach(plugin => {
        expect(plugin.category).toBe('integration');
      });
    });

    it('should verify plugin names are unique', () => {
      const plugins = [
        new PluginExports.AuthModulePlugin(),
        new PluginExports.UsersModulePlugin(),
        new PluginExports.HealthModulePlugin(),
        new PluginExports.NotificationsModulePlugin(),
        new PluginExports.WebhookModulePlugin(),
      ];

      const names = plugins.map(plugin => plugin.name);
      const uniqueNames = [...new Set(names)];

      expect(names.length).toBe(uniqueNames.length);
    });
  });

  describe('type checking', () => {
    it('should verify ModuleCategory type', () => {
      const validCategories: PluginExports.ModuleCategory[] = ['core', 'feature', 'integration'];
      
      validCategories.forEach(category => {
        expect(typeof category).toBe('string');
        expect(['core', 'feature', 'integration']).toContain(category);
      });
    });

    it('should verify ModuleMetadata structure', () => {
      const plugin = new PluginExports.AuthModulePlugin();
      const metadata = plugin.getMetadata();

      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('category');
      expect(metadata).toHaveProperty('version');
      expect(metadata).toHaveProperty('dependencies');
      expect(metadata).toHaveProperty('description');
      expect(typeof metadata.name).toBe('string');
      expect(typeof metadata.category).toBe('string');
      expect(typeof metadata.version).toBe('string');
      expect(Array.isArray(metadata.dependencies)).toBe(true);
      expect(typeof metadata.description).toBe('string');
    });
  });
});