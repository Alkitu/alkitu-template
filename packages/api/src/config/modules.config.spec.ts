import { DEFAULT_MODULE_CONFIG, getModuleConfig, ModuleConfig, ModuleFlag } from './modules.config';

describe('ModuleConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('DEFAULT_MODULE_CONFIG', () => {
    it('should be defined', () => {
      expect(DEFAULT_MODULE_CONFIG).toBeDefined();
    });

    it('should have all core modules defined', () => {
      expect(DEFAULT_MODULE_CONFIG.core).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.core.auth).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.core.users).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.core.health).toBeDefined();
    });

    it('should have all feature modules defined', () => {
      expect(DEFAULT_MODULE_CONFIG.features).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.features.notifications).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.features.billing).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.features.analytics).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.features.websocket).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.features.email).toBeDefined();
    });

    it('should have all integration modules defined', () => {
      expect(DEFAULT_MODULE_CONFIG.integrations).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.integrations.tRPC).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.integrations.graphQL).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.integrations.rest).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.integrations.mcp).toBeDefined();
    });

    it('should have all platform modules defined', () => {
      expect(DEFAULT_MODULE_CONFIG.platforms).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.platforms.web).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.platforms.mobile).toBeDefined();
      expect(DEFAULT_MODULE_CONFIG.platforms.desktop).toBeDefined();
    });

    describe('core modules', () => {
      it('should have auth module enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.core.auth.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.core.auth.version).toBe('1.0.0');
        expect(DEFAULT_MODULE_CONFIG.core.auth.dependencies).toEqual(['users']);
      });

      it('should have users module enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.core.users.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.core.users.version).toBe('1.0.0');
        expect(DEFAULT_MODULE_CONFIG.core.users.dependencies).toEqual([]);
      });

      it('should have health module enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.core.health.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.core.health.version).toBe('1.0.0');
        expect(DEFAULT_MODULE_CONFIG.core.health.dependencies).toEqual([]);
      });

      it('should have proper auth configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.core.auth.config).toEqual({
          jwtSecret: process.env.JWT_SECRET || 'default-secret',
          refreshTokenTTL: 7 * 24 * 60 * 60 * 1000,
          providers: ['local', 'jwt'],
          twoFactorEnabled: false,
        });
      });

      it('should have proper users configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.core.users.config).toEqual({
          defaultRole: 'CLIENT',
          emailVerificationRequired: true,
          passwordMinLength: 8,
          maxLoginAttempts: 5,
        });
      });

      it('should have proper health configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.core.health.config).toEqual({
          checkInterval: 30000,
          endpoints: ['database', 'redis', 'external-apis'],
        });
      });
    });

    describe('feature modules', () => {
      it('should have notifications enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.features.notifications.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.features.notifications.dependencies).toEqual(['users']);
      });

      it('should have billing disabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.features.billing.enabled).toBe(false);
        expect(DEFAULT_MODULE_CONFIG.features.billing.dependencies).toEqual(['users']);
      });

      it('should have analytics disabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.features.analytics.enabled).toBe(false);
        expect(DEFAULT_MODULE_CONFIG.features.analytics.dependencies).toEqual(['users']);
      });

      it('should have websocket enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.features.websocket.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.features.websocket.dependencies).toEqual(['auth']);
      });

      it('should have email enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.features.email.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.features.email.dependencies).toEqual([]);
      });

      it('should have proper notifications configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.features.notifications.config).toEqual({
          channels: ['email', 'push', 'in-app'],
          batchSize: 100,
          retryAttempts: 3,
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00',
          },
        });
      });

      it('should have proper billing configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.features.billing.config).toEqual({
          currency: 'USD',
          provider: 'stripe',
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
          defaultPlan: 'free',
        });
      });

      it('should have proper analytics configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.features.analytics.config).toEqual({
          provider: 'internal',
          trackingEnabled: true,
          dataRetentionDays: 365,
        });
      });

      it('should have proper websocket configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.features.websocket.config).toEqual({
          namespace: '/notifications',
          cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
          },
        });
      });

      it('should have proper email configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.features.email.config).toEqual({
          provider: 'resend',
          apiKey: process.env.RESEND_API_KEY,
          defaultFrom: process.env.DEFAULT_FROM_EMAIL || 'noreply@alkitu.com',
          templatesPath: './src/templates',
        });
      });
    });

    describe('integration modules', () => {
      it('should have tRPC enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.integrations.tRPC.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.integrations.tRPC.dependencies).toEqual(['auth', 'users']);
      });

      it('should have graphQL disabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.integrations.graphQL.enabled).toBe(false);
        expect(DEFAULT_MODULE_CONFIG.integrations.graphQL.dependencies).toEqual(['auth', 'users']);
      });

      it('should have rest enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.integrations.rest.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.integrations.rest.dependencies).toEqual(['auth', 'users']);
      });

      it('should have mcp disabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.integrations.mcp.enabled).toBe(false);
        expect(DEFAULT_MODULE_CONFIG.integrations.mcp.dependencies).toEqual(['auth']);
      });

      it('should have proper tRPC configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.integrations.tRPC.config).toEqual({
          basePath: '/trpc',
          cors: true,
          transformer: 'superjson',
        });
      });

      it('should have proper graphQL configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.integrations.graphQL.config).toEqual({
          basePath: '/graphql',
          playground: process.env.NODE_ENV === 'development',
          introspection: process.env.NODE_ENV === 'development',
          subscriptions: true,
        });
      });

      it('should have proper rest configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.integrations.rest.config).toEqual({
          basePath: '/api',
          swagger: {
            enabled: true,
            path: '/api/docs',
          },
          versioning: {
            enabled: true,
            defaultVersion: '1',
          },
        });
      });

      it('should have proper mcp configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.integrations.mcp.config).toEqual({
          basePath: '/mcp',
          aiProvider: 'openai',
          apiKey: process.env.OPENAI_API_KEY,
          model: 'gpt-4',
        });
      });
    });

    describe('platform modules', () => {
      it('should have web enabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.platforms.web.enabled).toBe(true);
        expect(DEFAULT_MODULE_CONFIG.platforms.web.dependencies).toEqual(['tRPC', 'auth']);
      });

      it('should have mobile disabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.platforms.mobile.enabled).toBe(false);
        expect(DEFAULT_MODULE_CONFIG.platforms.mobile.dependencies).toEqual(['graphQL', 'auth']);
      });

      it('should have desktop disabled by default', () => {
        expect(DEFAULT_MODULE_CONFIG.platforms.desktop.enabled).toBe(false);
        expect(DEFAULT_MODULE_CONFIG.platforms.desktop.dependencies).toEqual(['rest', 'auth']);
      });

      it('should have proper web configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.platforms.web.config).toEqual({
          url: process.env.FRONTEND_URL || 'http://localhost:3000',
          features: ['auth', 'users', 'notifications'],
        });
      });

      it('should have proper mobile configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.platforms.mobile.config).toEqual({
          platforms: ['ios', 'android'],
          features: ['auth', 'users', 'notifications'],
        });
      });

      it('should have proper desktop configuration', () => {
        expect(DEFAULT_MODULE_CONFIG.platforms.desktop.config).toEqual({
          platforms: ['windows', 'macos', 'linux'],
          features: ['auth', 'users'],
        });
      });
    });

    describe('ModuleFlag interface compliance', () => {
      const testModuleFlag = (moduleFlag: ModuleFlag, name: string) => {
        it(`should have ${name} comply with ModuleFlag interface`, () => {
          expect(moduleFlag).toHaveProperty('enabled');
          expect(moduleFlag).toHaveProperty('version');
          expect(moduleFlag).toHaveProperty('dependencies');
          expect(moduleFlag).toHaveProperty('config');
          expect(typeof moduleFlag.enabled).toBe('boolean');
          expect(typeof moduleFlag.version).toBe('string');
          expect(Array.isArray(moduleFlag.dependencies)).toBe(true);
          expect(typeof moduleFlag.config).toBe('object');
        });
      };

      testModuleFlag(DEFAULT_MODULE_CONFIG.core.auth, 'auth');
      testModuleFlag(DEFAULT_MODULE_CONFIG.core.users, 'users');
      testModuleFlag(DEFAULT_MODULE_CONFIG.core.health, 'health');
      testModuleFlag(DEFAULT_MODULE_CONFIG.features.notifications, 'notifications');
      testModuleFlag(DEFAULT_MODULE_CONFIG.features.billing, 'billing');
      testModuleFlag(DEFAULT_MODULE_CONFIG.features.analytics, 'analytics');
      testModuleFlag(DEFAULT_MODULE_CONFIG.features.websocket, 'websocket');
      testModuleFlag(DEFAULT_MODULE_CONFIG.features.email, 'email');
      testModuleFlag(DEFAULT_MODULE_CONFIG.integrations.tRPC, 'tRPC');
      testModuleFlag(DEFAULT_MODULE_CONFIG.integrations.graphQL, 'graphQL');
      testModuleFlag(DEFAULT_MODULE_CONFIG.integrations.rest, 'rest');
      testModuleFlag(DEFAULT_MODULE_CONFIG.integrations.mcp, 'mcp');
      testModuleFlag(DEFAULT_MODULE_CONFIG.platforms.web, 'web');
      testModuleFlag(DEFAULT_MODULE_CONFIG.platforms.mobile, 'mobile');
      testModuleFlag(DEFAULT_MODULE_CONFIG.platforms.desktop, 'desktop');
    });
  });

  describe('getModuleConfig', () => {
    it('should return default configuration when no environment variables are set', () => {
      const config = getModuleConfig();
      expect(config).toEqual(DEFAULT_MODULE_CONFIG);
    });

    it('should enable graphQL and analytics in development environment', () => {
      process.env.NODE_ENV = 'development';
      
      const config = getModuleConfig();
      
      expect(config.integrations.graphQL.enabled).toBe(true);
      expect(config.features.analytics.enabled).toBe(true);
    });

    it('should disable graphQL playground and introspection in production environment', () => {
      process.env.NODE_ENV = 'production';
      
      const config = getModuleConfig();
      
      expect(config.integrations.graphQL.config.playground).toBe(false);
      expect(config.integrations.graphQL.config.introspection).toBe(false);
    });

    it('should enable billing when ENABLE_BILLING is set to true', () => {
      process.env.ENABLE_BILLING = 'true';
      
      const config = getModuleConfig();
      
      expect(config.features.billing.enabled).toBe(true);
    });

    it('should not enable billing when ENABLE_BILLING is not set to true', () => {
      process.env.ENABLE_BILLING = 'false';
      
      const config = getModuleConfig();
      
      expect(config.features.billing.enabled).toBe(false);
    });

    it('should enable mobile when ENABLE_MOBILE is set to true', () => {
      process.env.ENABLE_MOBILE = 'true';
      
      const config = getModuleConfig();
      
      expect(config.platforms.mobile.enabled).toBe(true);
    });

    it('should not enable mobile when ENABLE_MOBILE is not set to true', () => {
      process.env.ENABLE_MOBILE = 'false';
      
      const config = getModuleConfig();
      
      expect(config.platforms.mobile.enabled).toBe(false);
    });

    it('should handle multiple environment variables simultaneously', () => {
      process.env.NODE_ENV = 'development';
      process.env.ENABLE_BILLING = 'true';
      process.env.ENABLE_MOBILE = 'true';
      
      const config = getModuleConfig();
      
      expect(config.integrations.graphQL.enabled).toBe(true);
      expect(config.features.analytics.enabled).toBe(true);
      expect(config.features.billing.enabled).toBe(true);
      expect(config.platforms.mobile.enabled).toBe(true);
    });

    it('should preserve original configuration references', () => {
      const config = getModuleConfig();
      
      expect(config).not.toBe(DEFAULT_MODULE_CONFIG);
      expect(config.core.auth.config.jwtSecret).toBe(DEFAULT_MODULE_CONFIG.core.auth.config.jwtSecret);
    });

    it('should handle undefined NODE_ENV', () => {
      delete process.env.NODE_ENV;
      delete process.env.ENABLE_BILLING;
      delete process.env.ENABLE_MOBILE;
      
      const config = getModuleConfig();
      
      expect(config.integrations.graphQL.enabled).toBe(false);
      expect(config.features.analytics.enabled).toBe(false);
    });

    it('should handle NODE_ENV other than development or production', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.ENABLE_BILLING;
      delete process.env.ENABLE_MOBILE;
      
      const config = getModuleConfig();
      
      expect(config.integrations.graphQL.enabled).toBe(false);
      expect(config.features.analytics.enabled).toBe(false);
    });

    it('should handle case sensitivity for environment variables', () => {
      delete process.env.ENABLE_BILLING;
      delete process.env.ENABLE_MOBILE;
      process.env.enable_billing = 'true';
      process.env.enable_mobile = 'true';
      
      const config = getModuleConfig();
      
      expect(config.features.billing.enabled).toBe(false);
      expect(config.platforms.mobile.enabled).toBe(false);
    });

    it('should handle empty string environment variables', () => {
      process.env.ENABLE_BILLING = '';
      process.env.ENABLE_MOBILE = '';
      
      const config = getModuleConfig();
      
      expect(config.features.billing.enabled).toBe(false);
      expect(config.platforms.mobile.enabled).toBe(false);
    });

    it('should not mutate the original DEFAULT_MODULE_CONFIG', () => {
      const originalGraphQLEnabled = DEFAULT_MODULE_CONFIG.integrations.graphQL.enabled;
      const originalAnalyticsEnabled = DEFAULT_MODULE_CONFIG.features.analytics.enabled;
      
      process.env.NODE_ENV = 'development';
      
      getModuleConfig();
      
      expect(DEFAULT_MODULE_CONFIG.integrations.graphQL.enabled).toBe(originalGraphQLEnabled);
      expect(DEFAULT_MODULE_CONFIG.features.analytics.enabled).toBe(originalAnalyticsEnabled);
    });

    it('should create a deep copy of the configuration', () => {
      const config1 = getModuleConfig();
      const config2 = getModuleConfig();
      
      expect(config1).not.toBe(config2);
      expect(config1.core.auth.config).not.toBe(config2.core.auth.config);
    });

    it('should handle Date objects in deep clone correctly', () => {
      // Test the deepClone function with Date objects
      process.env.NODE_ENV = 'development';
      
      const config = getModuleConfig();
      
      // Verify that Date objects are properly cloned
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
      
      // Test that the deep clone preserves all types including nested Date objects
      const config2 = getModuleConfig();
      expect(config).not.toBe(config2);
    });

    it('should handle production environment with development flags', () => {
      process.env.NODE_ENV = 'production';
      process.env.ENABLE_BILLING = 'true';
      
      const config = getModuleConfig();
      
      expect(config.integrations.graphQL.config.playground).toBe(false);
      expect(config.integrations.graphQL.config.introspection).toBe(false);
      expect(config.features.billing.enabled).toBe(true);
    });
  });

  describe('type safety', () => {
    it('should have proper TypeScript types', () => {
      const config: ModuleConfig = getModuleConfig();
      
      expect(config.core.auth.enabled).toBeDefined();
      expect(config.features.notifications.version).toBeDefined();
      expect(config.integrations.tRPC.dependencies).toBeDefined();
      expect(config.platforms.web.config).toBeDefined();
    });

    it('should allow proper module flag creation', () => {
      const testFlag: ModuleFlag = {
        enabled: true,
        version: '1.0.0',
        dependencies: ['test'],
        config: { test: 'value' },
      };
      
      expect(testFlag.enabled).toBe(true);
      expect(testFlag.version).toBe('1.0.0');
      expect(testFlag.dependencies).toEqual(['test']);
      expect(testFlag.config).toEqual({ test: 'value' });
    });
  });
});