'use client';

import { useParams } from 'next/navigation';
import { ClipboardList, MapPin, Plus, FileText, Clock, CheckCircle2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { QuickActionCard } from '@/components/molecules-alianza/QuickActionCard';
import { StatsCardGrid } from '@/components/organisms/dashboard';
import { RequestListOrganism } from '@/components/organisms/dashboard';
import type { StatCardData } from '@/components/organisms/dashboard';
import type { RequestItem } from '@/components/organisms/dashboard';

/**
 * Client Dashboard Page
 *
 * Main dashboard for CLIENT role users.
 * Displays active requests, quick actions, and key metrics.
 *
 * Migration Note: Converted from fetch() to tRPC for type safety and better error handling
 */
export default function ClientDashboardPage() {
  const { lang } = useParams();

  // Fetch recent requests with tRPC (backend automatically filters by role)
  const { data: requestsData, isLoading: requestsLoading } = trpc.request.getFilteredRequests.useQuery({
    page: 1,
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Fetch request stats with tRPC (backend automatically filters by role)
  const { data: statsData, isLoading: statsLoading } = trpc.request.getRequestStats.useQuery({});

  // Fetch current user to get locations
  const { data: user } = trpc.user.me.useQuery();

  // Fetch user locations
  const { data: locationsData } = trpc.location.getUserLocations.useQuery(
    { userId: user?.id! },
    { enabled: !!user?.id },
  );

  // Extract data
  const recentRequests = requestsData?.requests || [];
  const isLoading = requestsLoading || statsLoading;

  // Calculate stats from API response
  const stats = {
    active: (statsData?.byStatus?.PENDING || 0) + (statsData?.byStatus?.ONGOING || 0),
    completed: statsData?.byStatus?.COMPLETED || 0,
    locations: locationsData?.length ?? 0,
  };

  const quickActions = [
    {
      icon: Plus,
      label: 'Solicitud',
      subtitle: 'Nueva',
      href: `/${lang}/client/requests/new`,
      variant: 'primary' as const,
    },
    {
      icon: ClipboardList,
      label: 'Solicitudes',
      subtitle: 'Mis',
      href: `/${lang}/client/requests`,
      customIconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: MapPin,
      label: 'de Trabajo',
      subtitle: 'Ubicaciones',
      href: `/${lang}/client/locations`,
      customIconColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: FileText,
      label: 'Notificaciones',
      subtitle: 'Ver',
      href: `/${lang}/client/notifications`,
      customIconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  const statsCardsData: StatCardData[] = [
    {
      label: 'Solicitudes Activas',
      value: stats.active,
      icon: Clock,
      iconColor: 'text-orange-500',
      subtitle: 'En proceso o pendientes',
    },
    {
      label: 'Solicitudes Completadas',
      value: stats.completed,
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      subtitle: 'Finalizadas este mes',
    },
    {
      label: 'Ubicaciones de Trabajo',
      value: stats.locations,
      icon: MapPin,
      iconColor: 'text-blue-500',
      subtitle: 'Ubicaciones registradas',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Cliente</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel principal</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => (
          <QuickActionCard key={action.href} {...action} />
        ))}
      </div>

      {/* Statistics Cards */}
      <StatsCardGrid stats={statsCardsData} isLoading={isLoading} columns={3} />

      {/* Recent Activity */}
      <RequestListOrganism
        requests={recentRequests as unknown as RequestItem[]}
        isLoading={isLoading}
        baseHref={`/${lang}/client/requests`}
        emptyMessage="No hay actividad reciente"
        emptyActionLabel="Nueva Solicitud"
        emptyActionHref={`/${lang}/client/requests/new`}
        title="Actividad Reciente"
        showClientName={false}
      />
    </div>
  );
}
