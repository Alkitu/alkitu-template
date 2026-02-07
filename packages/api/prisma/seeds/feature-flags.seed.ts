import { PrismaClient, FeatureStatus } from '@prisma/client';

const prisma = new PrismaClient();

const defaultFeatureFlags = [
  {
    key: 'support-chat',
    name: 'Support Chat',
    description: 'Chat de soporte con clientes - Tickets y conversaciones públicas',
    category: 'addon',
    status: FeatureStatus.ENABLED, // ✅ Enabled by default (backward compatible)
    icon: 'MessageSquare',
    badge: 'Core',
    sortOrder: 1,
    config: {
      enableWidget: true,
      enableAnalytics: true,
      autoAssignment: true,
    },
  },
  {
    key: 'team-channels',
    name: 'Team Channels',
    description: 'Canales de comunicación interna del equipo (Slack-style)',
    category: 'addon',
    status: FeatureStatus.ENABLED,
    icon: 'Hash',
    badge: 'Core',
    sortOrder: 2,
    config: {
      enablePublicChannels: true,
      enablePrivateChannels: true,
      enableDirectMessages: true,
    },
  },
  {
    key: 'request-collaboration',
    name: 'Request Collaboration',
    description: 'Chat interno para colaboración del equipo en solicitudes específicas',
    category: 'addon',
    status: FeatureStatus.ENABLED,
    icon: 'Users',
    badge: 'Core',
    sortOrder: 3,
    config: {
      autoCreateConversation: true,
      notifyAssignee: true,
    },
  },
  {
    key: 'analytics',
    name: 'Analytics & Reporting',
    description: 'Advanced analytics and reporting dashboards',
    category: 'addon',
    status: FeatureStatus.DISABLED,
    icon: 'BarChart',
    badge: 'Pro',
    sortOrder: 4,
    config: {},
  },
  {
    key: 'notifications',
    name: 'Notifications',
    description: 'Push notifications and email alerts',
    category: 'addon',
    status: FeatureStatus.ENABLED,
    icon: 'Bell',
    badge: 'Core',
    sortOrder: 5,
    config: {
      enablePush: true,
      enableEmail: true,
      enableInApp: true,
    },
  },
];

export async function seedFeatureFlags() {
  console.log('🚀 Seeding feature flags...');

  for (const flag of defaultFeatureFlags) {
    const existing = await prisma.featureFlag.findUnique({
      where: { key: flag.key },
    });

    if (existing) {
      console.log(`  ✓ Feature flag "${flag.key}" already exists, skipping...`);
      continue;
    }

    await prisma.featureFlag.create({
      data: {
        ...flag,
        enabledAt: flag.status === FeatureStatus.ENABLED ? new Date() : null,
      },
    });

    console.log(`  ✓ Created feature flag: ${flag.name}`);
  }

  console.log('✅ Feature flags seeded successfully!\n');
}

// Run directly if this file is executed
if (require.main === module) {
  seedFeatureFlags()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
