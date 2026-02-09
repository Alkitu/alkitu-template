'use client';

import { Users, Briefcase, UserCheck, UserCog } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useTranslations } from '@/context/TranslationsContext';

import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import {
  StatsCardGrid,
  AdminRecentActivityCard,
  AdminUserDistributionCard,
} from '@/components/organisms/dashboard';
import type { StatCardData, RoleDistribution } from '@/components/organisms/dashboard';

export default function AdminDashboardPage() {
  const t = useTranslations('admin.dashboard');
  const { data: stats, isLoading } = trpc.user.getUserStats.useQuery();

  // Configure stat cards data
  const statsData: StatCardData[] = [
    {
      label: t('stats.totalUsers'),
      value: stats?.total || 0,
      icon: Users,
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: t('stats.clients'),
      value: stats?.byRole?.CLIENT || 0,
      icon: Briefcase,
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: t('stats.employees'),
      value: stats?.byRole?.EMPLOYEE || 0,
      icon: UserCheck,
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: t('stats.admins'),
      value: stats?.byRole?.ADMIN || 0,
      icon: UserCog,
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ];

  // Configure role distribution data
  const roleDistributionData: RoleDistribution[] = [
    {
      label: t('stats.clients'),
      count: stats?.byRole?.CLIENT || 0,
      color: 'green',
    },
    {
      label: t('stats.employees'),
      count: stats?.byRole?.EMPLOYEE || 0,
      color: 'purple',
    },
    {
      label: t('stats.admins'),
      count: stats?.byRole?.ADMIN || 0,
      color: 'red',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <AdminPageHeader title={t('title')} description={t('description')} />

      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">{t('stats.title')}</h2>

        <StatsCardGrid stats={statsData} isLoading={isLoading} columns={4} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminRecentActivityCard
            title={t('recentActivity.title')}
            subtitle={t('recentActivity.subtitle')}
            newUsersLabel={t('recentActivity.newUsers')}
            newUsersCount={stats?.recentUsers || 0}
            totalUsers={stats?.total || 0}
            isLoading={isLoading}
          />

          <AdminUserDistributionCard
            title={t('userDistribution.title')}
            subtitle={t('userDistribution.subtitle')}
            roles={roleDistributionData}
            totalUsers={stats?.total || 0}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
