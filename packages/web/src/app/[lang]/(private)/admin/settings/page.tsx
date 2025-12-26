'use client';

import Link from 'next/link';
import { useTranslations } from '@/context/TranslationsContext';
import { Typography } from '@/components/atoms/typography';
import { Card } from '@/components/primitives/Card';
import { Badge } from '@/components/atoms/badge';
import { Icon } from '@/components/atoms/icons/Icon';
import { cn } from '@/lib/utils';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

const settingsOptions = [
  {
    title: 'Theme Editor 3.0',
    description:
      'Advanced theme customization with OKLCH colors, typography, spacing, and more',
    href: '/dashboard/settings/themes',
    icon: 'palette' as const,
    badge: 'New',
  },
  {
    title: 'Theme Configuration',
    description:
      'Customize your application colors and appearance with Clean Architecture',
    href: '/dashboard/settings/themes',
    icon: 'zap' as const,
  },
  {
    title: 'Chatbot Settings',
    description: 'Configure chatbot behavior and appearance',
    href: '/dashboard/settings/chatbot',
    icon: 'Bot' as const,
  },
  {
    title: 'General Settings',
    description: 'Application preferences and configuration',
    href: '/dashboard/settings/general',
    icon: 'Settings' as const,
  },
];

export default function SettingsPage() {
  const t = useTranslations('dashboard.settings');

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Manage your application preferences and configuration"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsOptions.map((option) => (
          <Link key={option.href} href={option.href}>
            <Card
              className={cn(
                'p-6 h-full transition-all duration-200',
                'hover:shadow-md hover:scale-[1.02] cursor-pointer',
                'border-2 hover:border-primary/20',
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                  <Icon name={option.icon} size="md" color="primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {option.title}
                    </h3>
                    {'badge' in option && (
                      <Badge variant="secondary" className="text-xs">
                        {option.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
