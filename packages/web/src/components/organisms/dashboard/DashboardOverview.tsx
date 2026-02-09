/**
 * DashboardOverview - Main dashboard overview organism
 * Atomic Design: Organism
 *
 * Displays welcome message, stats, and quick actions for the dashboard.
 * Can also show "under construction" state.
 *
 * This organism receives **translated text as props** from page components.
 * It does NOT use `useTranslations()` hook directly.
 *
 * @example
 * ```tsx
 * // In page.tsx
 * const t = useTranslations('dashboard');
 * const props = {
 *   userName: user?.name,
 *   welcomeMessage: t('welcome'),
 *   subtitle: t('subtitle'),
 *   statsLabels: {
 *     pending: t('stats.pending'),
 *     active: t('stats.active'),
 *     completed: t('stats.completed')
 *   },
 *   statsData: {
 *     pending: 5,
 *     active: 3,
 *     completed: 12
 *   },
 *   actions: [
 *     {
 *       label: t('actions.newRequest'),
 *       href: '/requests/new',
 *       icon: Plus,
 *       variant: 'primary'
 *     }
 *   ]
 * };
 *
 * <DashboardOverview {...props} />
 * ```
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/primitives/Card';
import { StatCard } from '@/components/molecules-alianza/StatCard';
import { QuickActionCard } from '@/components/molecules-alianza/QuickActionCard';
import { Construction, Settings, Wrench } from 'lucide-react';
import type { DashboardOverviewProps } from './DashboardOverview.types';

export const DashboardOverview = React.forwardRef<
  HTMLDivElement,
  DashboardOverviewProps
>(
  (
    {
      userName,
      welcomeMessage = 'Dashboard',
      subtitle,
      statsLabels,
      statsData,
      actions,
      isLoadingStats = false,
      isUnderConstruction = false,
      constructionTitle = 'Dashboard en Construcción',
      constructionMessage = 'Estamos trabajando en tu panel personalizado. Pronto tendrás acceso a todas tus herramientas y estadísticas.',
      constructionStatus = 'Sistema en desarrollo activo',
      className = '',
      ...props
    },
    ref,
  ) => {
    const containerClasses = cn('space-y-8', className);

    // If under construction, show construction state
    if (isUnderConstruction) {
      return (
        <div ref={ref} className={containerClasses} {...props}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {welcomeMessage}
              {userName && ` ${userName}`}
            </h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          {/* Under Construction Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center border-dashed border-2 border-muted-foreground/20">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Construction className="h-16 w-16 text-orange-500" />
                  <div className="absolute -top-2 -right-2">
                    <div className="h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Wrench className="h-3 w-3 text-yellow-800" />
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {constructionTitle}
              </h2>

              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {constructionMessage}
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span>{constructionStatus}</span>
              </div>
            </Card>

            {/* Quick Stats Preview with placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {statsLabels.pending}
                    </p>
                    <p className="text-lg font-semibold">---</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {statsLabels.active}
                    </p>
                    <p className="text-lg font-semibold">---</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {statsLabels.completed}
                    </p>
                    <p className="text-lg font-semibold">---</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    // Normal dashboard view
    return (
      <div ref={ref} className={containerClasses} {...props}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {welcomeMessage}
            {userName && ` ${userName}`}
          </h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Stats Section */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label={statsLabels.pending}
              value={statsData.pending}
              icon={Construction}
              iconColor="text-blue-500"
              isLoading={isLoadingStats}
            />
            <StatCard
              label={statsLabels.active}
              value={statsData.active}
              icon={Settings}
              iconColor="text-green-500"
              isLoading={isLoadingStats}
            />
            <StatCard
              label={statsLabels.completed}
              value={statsData.completed}
              icon={Wrench}
              iconColor="text-purple-500"
              isLoading={isLoadingStats}
            />
          </div>
        )}

        {/* Quick Actions Section */}
        {actions && actions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, index) => (
              <QuickActionCard
                key={`${action.label}-${index}`}
                icon={action.icon}
                label={action.label}
                subtitle={action.subtitle}
                href={action.href}
                variant={action.variant}
                iconColor={action.iconColor}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

DashboardOverview.displayName = 'DashboardOverview';

export default DashboardOverview;
