/**
 * Freemium Module Flags System
 *
 * Sistema granular de flags para activar/desactivar funcionalidades
 * basado en el nivel de licencia del usuario/organización
 */

export type LicenseLevel = "free" | "premium" | "enterprise";

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  licenseRequired: LicenseLevel;
  rolloutPercentage: number;
  dependencies: string[];
  metadata: {
    category: string;
    priority: "low" | "medium" | "high" | "critical";
    beta: boolean;
    deprecatedAt?: Date;
  };
}

export interface ModuleConfig {
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  licenseLevel: LicenseLevel;
  features: FeatureFlag[];
  dependencies: string[];
  pricing: {
    monthlyPrice: number;
    yearlyPrice: number;
    currency: string;
  };
}

// ================================
// AUTHENTICATION & AUTHORIZATION
// ================================

export const AUTH_FLAGS: Record<string, FeatureFlag> = {
  // Basic Auth (Free)
  EMAIL_PASSWORD_AUTH: {
    key: "auth.email_password",
    name: "Email/Password Authentication",
    description: "Basic email and password authentication",
    enabled: true,
    licenseRequired: "free",
    rolloutPercentage: 100,
    dependencies: [],
    metadata: {
      category: "authentication",
      priority: "critical",
      beta: false,
    },
  },

  // Premium Auth Features
  TWO_FACTOR_AUTH: {
    key: "auth.two_factor",
    name: "Two-Factor Authentication",
    description: "SMS and TOTP 2FA support",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["auth.email_password"],
    metadata: {
      category: "authentication",
      priority: "high",
      beta: false,
    },
  },

  SOCIAL_AUTH: {
    key: "auth.social",
    name: "Social Authentication",
    description: "Google, Facebook, GitHub login",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["auth.email_password"],
    metadata: {
      category: "authentication",
      priority: "medium",
      beta: false,
    },
  },

  // Enterprise Auth Features
  SAML_SSO: {
    key: "auth.saml_sso",
    name: "SAML Single Sign-On",
    description: "Enterprise SAML SSO integration",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["auth.email_password"],
    metadata: {
      category: "authentication",
      priority: "high",
      beta: false,
    },
  },

  LDAP_INTEGRATION: {
    key: "auth.ldap",
    name: "LDAP Integration",
    description: "Active Directory and LDAP support",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["auth.email_password"],
    metadata: {
      category: "authentication",
      priority: "high",
      beta: false,
    },
  },
};

// ================================
// USER MANAGEMENT
// ================================

export const USER_FLAGS: Record<string, FeatureFlag> = {
  // Basic User Management (Free)
  BASIC_USER_CRUD: {
    key: "users.basic_crud",
    name: "Basic User Management",
    description: "Create, read, update, delete users",
    enabled: true,
    licenseRequired: "free",
    rolloutPercentage: 100,
    dependencies: [],
    metadata: {
      category: "user_management",
      priority: "critical",
      beta: false,
    },
  },

  // Premium User Features
  BULK_USER_OPERATIONS: {
    key: "users.bulk_operations",
    name: "Bulk User Operations",
    description: "Import/export users in bulk",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["users.basic_crud"],
    metadata: {
      category: "user_management",
      priority: "medium",
      beta: false,
    },
  },

  USER_GROUPS: {
    key: "users.groups",
    name: "User Groups",
    description: "Organize users in groups",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["users.basic_crud"],
    metadata: {
      category: "user_management",
      priority: "medium",
      beta: false,
    },
  },

  // Enterprise User Features
  ADVANCED_PERMISSIONS: {
    key: "users.advanced_permissions",
    name: "Advanced Permissions",
    description: "Granular role-based access control",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["users.basic_crud", "users.groups"],
    metadata: {
      category: "user_management",
      priority: "high",
      beta: false,
    },
  },

  USER_AUDIT_LOG: {
    key: "users.audit_log",
    name: "User Audit Log",
    description: "Track all user activities",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["users.basic_crud"],
    metadata: {
      category: "user_management",
      priority: "high",
      beta: false,
    },
  },
};

// ================================
// NOTIFICATIONS
// ================================

export const NOTIFICATION_FLAGS: Record<string, FeatureFlag> = {
  // Basic Notifications (Free)
  EMAIL_NOTIFICATIONS: {
    key: "notifications.email",
    name: "Email Notifications",
    description: "Basic email notifications",
    enabled: true,
    licenseRequired: "free",
    rolloutPercentage: 100,
    dependencies: [],
    metadata: {
      category: "notifications",
      priority: "medium",
      beta: false,
    },
  },

  // Premium Notifications
  PUSH_NOTIFICATIONS: {
    key: "notifications.push",
    name: "Push Notifications",
    description: "Mobile and browser push notifications",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["notifications.email"],
    metadata: {
      category: "notifications",
      priority: "medium",
      beta: false,
    },
  },

  SMS_NOTIFICATIONS: {
    key: "notifications.sms",
    name: "SMS Notifications",
    description: "Text message notifications",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["notifications.email"],
    metadata: {
      category: "notifications",
      priority: "medium",
      beta: false,
    },
  },

  // Enterprise Notifications
  WEBHOOK_NOTIFICATIONS: {
    key: "notifications.webhooks",
    name: "Webhook Notifications",
    description: "Custom webhook integrations",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["notifications.email"],
    metadata: {
      category: "notifications",
      priority: "medium",
      beta: false,
    },
  },

  NOTIFICATION_TEMPLATES: {
    key: "notifications.templates",
    name: "Custom Templates",
    description: "Customizable notification templates",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["notifications.email"],
    metadata: {
      category: "notifications",
      priority: "low",
      beta: false,
    },
  },
};

// ================================
// ANALYTICS & REPORTING
// ================================

export const ANALYTICS_FLAGS: Record<string, FeatureFlag> = {
  // Basic Analytics (Free)
  BASIC_METRICS: {
    key: "analytics.basic_metrics",
    name: "Basic Metrics",
    description: "Basic user and system metrics",
    enabled: true,
    licenseRequired: "free",
    rolloutPercentage: 100,
    dependencies: [],
    metadata: {
      category: "analytics",
      priority: "medium",
      beta: false,
    },
  },

  // Premium Analytics
  ADVANCED_REPORTS: {
    key: "analytics.advanced_reports",
    name: "Advanced Reports",
    description: "Detailed analytics and reports",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["analytics.basic_metrics"],
    metadata: {
      category: "analytics",
      priority: "medium",
      beta: false,
    },
  },

  CUSTOM_DASHBOARDS: {
    key: "analytics.custom_dashboards",
    name: "Custom Dashboards",
    description: "Build custom analytics dashboards",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["analytics.basic_metrics"],
    metadata: {
      category: "analytics",
      priority: "medium",
      beta: false,
    },
  },

  // Enterprise Analytics
  DATA_EXPORT: {
    key: "analytics.data_export",
    name: "Data Export",
    description: "Export analytics data to external systems",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["analytics.advanced_reports"],
    metadata: {
      category: "analytics",
      priority: "medium",
      beta: false,
    },
  },

  REAL_TIME_ANALYTICS: {
    key: "analytics.real_time",
    name: "Real-time Analytics",
    description: "Live analytics and monitoring",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["analytics.advanced_reports"],
    metadata: {
      category: "analytics",
      priority: "high",
      beta: false,
    },
  },
};

// ================================
// INTEGRATION & API
// ================================

export const INTEGRATION_FLAGS: Record<string, FeatureFlag> = {
  // Basic API (Free)
  BASIC_API: {
    key: "api.basic",
    name: "Basic API Access",
    description: "Basic REST API with rate limiting",
    enabled: true,
    licenseRequired: "free",
    rolloutPercentage: 100,
    dependencies: [],
    metadata: {
      category: "api",
      priority: "critical",
      beta: false,
    },
  },

  // Premium API
  ADVANCED_API: {
    key: "api.advanced",
    name: "Advanced API Features",
    description: "Higher rate limits and advanced endpoints",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["api.basic"],
    metadata: {
      category: "api",
      priority: "high",
      beta: false,
    },
  },

  GRAPHQL_API: {
    key: "api.graphql",
    name: "GraphQL API",
    description: "GraphQL query interface",
    enabled: true,
    licenseRequired: "premium",
    rolloutPercentage: 100,
    dependencies: ["api.basic"],
    metadata: {
      category: "api",
      priority: "medium",
      beta: false,
    },
  },

  // Enterprise API
  UNLIMITED_API: {
    key: "api.unlimited",
    name: "Unlimited API Access",
    description: "No rate limits, priority support",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["api.advanced"],
    metadata: {
      category: "api",
      priority: "high",
      beta: false,
    },
  },

  CUSTOM_INTEGRATIONS: {
    key: "api.custom_integrations",
    name: "Custom Integrations",
    description: "Build custom third-party integrations",
    enabled: true,
    licenseRequired: "enterprise",
    rolloutPercentage: 100,
    dependencies: ["api.advanced"],
    metadata: {
      category: "api",
      priority: "medium",
      beta: false,
    },
  },
};

// ================================
// MODULE CONFIGURATIONS
// ================================

export const MODULES: Record<string, ModuleConfig> = {
  AUTHENTICATION: {
    name: "Authentication Module",
    description: "User authentication and authorization",
    version: "1.0.0",
    enabled: true,
    licenseLevel: "free",
    features: Object.values(AUTH_FLAGS),
    dependencies: [],
    pricing: {
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "USD",
    },
  },

  USER_MANAGEMENT: {
    name: "User Management Module",
    description: "Advanced user management features",
    version: "1.0.0",
    enabled: true,
    licenseLevel: "free",
    features: Object.values(USER_FLAGS),
    dependencies: ["AUTHENTICATION"],
    pricing: {
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "USD",
    },
  },

  NOTIFICATIONS: {
    name: "Notification Module",
    description: "Multi-channel notification system",
    version: "1.0.0",
    enabled: true,
    licenseLevel: "free",
    features: Object.values(NOTIFICATION_FLAGS),
    dependencies: ["AUTHENTICATION"],
    pricing: {
      monthlyPrice: 19,
      yearlyPrice: 190,
      currency: "USD",
    },
  },

  ANALYTICS: {
    name: "Analytics Module",
    description: "Advanced analytics and reporting",
    version: "1.0.0",
    enabled: true,
    licenseLevel: "premium",
    features: Object.values(ANALYTICS_FLAGS),
    dependencies: ["AUTHENTICATION", "USER_MANAGEMENT"],
    pricing: {
      monthlyPrice: 49,
      yearlyPrice: 490,
      currency: "USD",
    },
  },

  INTEGRATIONS: {
    name: "Integration Module",
    description: "API and third-party integrations",
    version: "1.0.0",
    enabled: true,
    licenseLevel: "free",
    features: Object.values(INTEGRATION_FLAGS),
    dependencies: ["AUTHENTICATION"],
    pricing: {
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "USD",
    },
  },
};

// ================================
// LICENSE PACKAGES
// ================================

export const LICENSE_PACKAGES = {
  FREE: {
    name: "Free",
    description: "Basic features for individuals",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "USD",
    features: [
      "Up to 5 users",
      "Basic authentication",
      "Email notifications",
      "Basic API access",
      "Community support",
    ],
    limits: {
      users: 5,
      apiCallsPerMonth: 1000,
      storageGB: 1,
    },
  },

  PREMIUM: {
    name: "Premium",
    description: "Advanced features for small teams",
    monthlyPrice: 29,
    yearlyPrice: 290,
    currency: "USD",
    features: [
      "Up to 50 users",
      "Two-factor authentication",
      "Social login",
      "Push notifications",
      "Advanced analytics",
      "Priority support",
    ],
    limits: {
      users: 50,
      apiCallsPerMonth: 10000,
      storageGB: 10,
    },
  },

  ENTERPRISE: {
    name: "Enterprise",
    description: "Full features for large organizations",
    monthlyPrice: 99,
    yearlyPrice: 990,
    currency: "USD",
    features: [
      "Unlimited users",
      "SAML SSO",
      "LDAP integration",
      "Custom integrations",
      "Real-time analytics",
      "Dedicated support",
    ],
    limits: {
      users: -1, // Unlimited
      apiCallsPerMonth: -1, // Unlimited
      storageGB: -1, // Unlimited
    },
  },
};

// ================================
// FEATURE FLAG UTILITIES
// ================================

export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: Map<string, FeatureFlag> = new Map();

  private constructor() {
    this.initializeFlags();
  }

  static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  private initializeFlags(): void {
    const allFlags = [
      ...Object.values(AUTH_FLAGS),
      ...Object.values(USER_FLAGS),
      ...Object.values(NOTIFICATION_FLAGS),
      ...Object.values(ANALYTICS_FLAGS),
      ...Object.values(INTEGRATION_FLAGS),
    ];

    allFlags.forEach((flag) => {
      this.flags.set(flag.key, flag);
    });
  }

  isFeatureEnabled(featureKey: string, userLicense: LicenseLevel): boolean {
    const flag = this.flags.get(featureKey);
    if (!flag) return false;

    // Check if feature is enabled
    if (!flag.enabled) return false;

    // Check license requirement
    if (!this.hasRequiredLicense(userLicense, flag.licenseRequired)) {
      return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage < 100) {
      // Simple hash-based rollout (in production, use more sophisticated logic)
      const hash = this.simpleHash(featureKey + userLicense) % 100;
      return hash < flag.rolloutPercentage;
    }

    return true;
  }

  private hasRequiredLicense(
    userLicense: LicenseLevel,
    requiredLicense: LicenseLevel
  ): boolean {
    const licenseHierarchy = { free: 0, premium: 1, enterprise: 2 };
    return licenseHierarchy[userLicense] >= licenseHierarchy[requiredLicense];
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getEnabledFeatures(userLicense: LicenseLevel): string[] {
    return Array.from(this.flags.keys()).filter((key) =>
      this.isFeatureEnabled(key, userLicense)
    );
  }

  getModuleFeatures(
    moduleName: string,
    userLicense: LicenseLevel
  ): FeatureFlag[] {
    const module = MODULES[moduleName];
    if (!module) return [];

    return module.features.filter((flag) =>
      this.isFeatureEnabled(flag.key, userLicense)
    );
  }
}

export default FeatureFlagManager;
