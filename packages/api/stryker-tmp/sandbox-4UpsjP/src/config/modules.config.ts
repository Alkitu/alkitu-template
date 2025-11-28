/**
 * Module Configuration System
 * Allows enabling/disabling modules and features dynamically
 */
// @ts-nocheck


export interface ModuleFlag {
  enabled: boolean;
  version: string;
  dependencies: string[];
  config: Record<string, any>;
}

export interface ModuleConfig {
  core: {
    auth: ModuleFlag;
    users: ModuleFlag;
    health: ModuleFlag;
  };
  features: {
    notifications: ModuleFlag;
    billing: ModuleFlag;
    analytics: ModuleFlag;
    websocket: ModuleFlag;
    email: ModuleFlag;
  };
  integrations: {
    tRPC: ModuleFlag;
    graphQL: ModuleFlag;
    rest: ModuleFlag;
    mcp: ModuleFlag;
  };
  platforms: {
    web: ModuleFlag;
    mobile: ModuleFlag;
    desktop: ModuleFlag;
  };
}

// Default configuration
export const DEFAULT_MODULE_CONFIG: ModuleConfig = {
  core: {
    auth: {
      enabled: true,
      version: '1.0.0',
      dependencies: ['users'],
      config: {
        jwtSecret: process.env.JWT_SECRET || 'default-secret',
        refreshTokenTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
        providers: ['local', 'jwt'],
        twoFactorEnabled: false,
      },
    },
    users: {
      enabled: true,
      version: '1.0.0',
      dependencies: [],
      config: {
        defaultRole: 'CLIENT',
        emailVerificationRequired: true,
        passwordMinLength: 8,
        maxLoginAttempts: 5,
      },
    },
    health: {
      enabled: true,
      version: '1.0.0',
      dependencies: [],
      config: {
        checkInterval: 30000, // 30 seconds
        endpoints: ['database', 'redis', 'external-apis'],
      },
    },
  },
  features: {
    notifications: {
      enabled: true,
      version: '1.0.0',
      dependencies: ['users'],
      config: {
        channels: ['email', 'push', 'in-app'],
        batchSize: 100,
        retryAttempts: 3,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
        },
      },
    },
    billing: {
      enabled: false,
      version: '1.0.0',
      dependencies: ['users'],
      config: {
        currency: 'USD',
        provider: 'stripe',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        defaultPlan: 'free',
      },
    },
    analytics: {
      enabled: false,
      version: '1.0.0',
      dependencies: ['users'],
      config: {
        provider: 'internal',
        trackingEnabled: true,
        dataRetentionDays: 365,
      },
    },
    websocket: {
      enabled: true,
      version: '1.0.0',
      dependencies: ['auth'],
      config: {
        namespace: '/notifications',
        cors: {
          origin: process.env.FRONTEND_URL || 'http://localhost:3000',
          credentials: true,
        },
      },
    },
    email: {
      enabled: true,
      version: '1.0.0',
      dependencies: [],
      config: {
        provider: 'resend',
        apiKey: process.env.RESEND_API_KEY,
        defaultFrom: process.env.DEFAULT_FROM_EMAIL || 'noreply@alkitu.com',
        templatesPath: './src/templates',
      },
    },
  },
  integrations: {
    tRPC: {
      enabled: true,
      version: '1.0.0',
      dependencies: ['auth', 'users'],
      config: {
        basePath: '/trpc',
        cors: true,
        transformer: 'superjson',
      },
    },
    graphQL: {
      enabled: false,
      version: '1.0.0',
      dependencies: ['auth', 'users'],
      config: {
        basePath: '/graphql',
        playground: process.env.NODE_ENV === 'development',
        introspection: process.env.NODE_ENV === 'development',
        subscriptions: true,
      },
    },
    rest: {
      enabled: true,
      version: '1.0.0',
      dependencies: ['auth', 'users'],
      config: {
        basePath: '/api',
        swagger: {
          enabled: true,
          path: '/api/docs',
        },
        versioning: {
          enabled: true,
          defaultVersion: '1',
        },
      },
    },
    mcp: {
      enabled: false,
      version: '1.0.0',
      dependencies: ['auth'],
      config: {
        basePath: '/mcp',
        aiProvider: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4',
      },
    },
  },
  platforms: {
    web: {
      enabled: true,
      version: '1.0.0',
      dependencies: ['tRPC', 'auth'],
      config: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
        features: ['auth', 'users', 'notifications'],
      },
    },
    mobile: {
      enabled: false,
      version: '1.0.0',
      dependencies: ['graphQL', 'auth'],
      config: {
        platforms: ['ios', 'android'],
        features: ['auth', 'users', 'notifications'],
      },
    },
    desktop: {
      enabled: false,
      version: '1.0.0',
      dependencies: ['rest', 'auth'],
      config: {
        platforms: ['windows', 'macos', 'linux'],
        features: ['auth', 'users'],
      },
    },
  },
};

// Environment-specific overrides
export const getModuleConfig = (): ModuleConfig => {
  const config = { ...DEFAULT_MODULE_CONFIG };

  // Override with environment-specific settings
  if (process.env.NODE_ENV === 'development') {
    config.integrations.graphQL.enabled = true;
    config.features.analytics.enabled = true;
  }

  if (process.env.NODE_ENV === 'production') {
    config.integrations.graphQL.config.playground = false;
    config.integrations.graphQL.config.introspection = false;
  }

  // Override with environment variables
  if (process.env.ENABLE_BILLING === 'true') {
    config.features.billing.enabled = true;
  }

  if (process.env.ENABLE_MOBILE === 'true') {
    config.platforms.mobile.enabled = true;
  }

  return config;
};
