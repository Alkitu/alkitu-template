'use client';

import { useParams } from 'next/navigation';
import { ClipboardList, MapPin, FileText, Clock, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { QuickActionCard } from '@/components/molecules-alianza/QuickActionCard';
import { StatsCardGrid } from '@/components/organisms/dashboard';
import { RequestListOrganism } from '@/components/organisms/dashboard';
import type { StatCardData } from '@/components/organisms/dashboard';
import type { RequestItem } from '@/components/organisms/dashboard';

/**
 * Employee Dashboard Page
 *
 * Main dashboard for EMPLOYEE role users.
 * Displays assigned requests, work metrics, and quick actions.
 *
 * Features:
 * - Real-time stats using tRPC with React Query caching
 * - Role-based filtering (only shows assigned requests)
 * - Quick action cards for common tasks
 * - Recent requests list
 *
 * Migration Note: Converted from fetch() to tRPC for type safety and better error handling
 */
export default function EmployeeDashboardPage() {
  const { lang } = useParams();

  // Fetch assigned requests with tRPC (backend automatically filters by role)
  const { data: requestsData, isLoading: requestsLoading } = trpc.request.getFilteredRequests.useQuery({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Fetch request stats with tRPC (backend automatically filters by role)
  const { data: statsData, isLoading: statsLoading } = trpc.request.getRequestStats.useQuery({});

  // Extract data
  const assignedRequests = requestsData?.requests || [];
  const isLoading = requestsLoading || statsLoading;

  // Calculate stats from API response
  const stats = {
    assigned: statsData?.total || 0,
    inProgress: statsData?.byStatus?.ONGOING || 0,
    completed: statsData?.byStatus?.COMPLETED || 0,
    completionRate:
      statsData?.total && statsData?.total > 0
        ? Math.round(((statsData?.byStatus?.COMPLETED || 0) / statsData.total) * 100)
        : 0,
  };

  // Quick actions configuration
  const quickActions = [
    {
      icon: ClipboardList,
      label: 'Solicitudes',
      subtitle: 'Mis',
      href: `/${lang}/employee/requests`,
      variant: 'primary' as const,
    },
    {
      icon: MapPin,
      label: 'de Trabajo',
      subtitle: 'Ubicaciones',
      href: `/${lang}/locations`,
      customIconColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: FileText,
      label: 'Notificaciones',
      subtitle: 'Ver',
      href: `/${lang}/employee/notifications`,
      customIconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: Users,
      label: 'Perfil',
      subtitle: 'Mi',
      href: `/${lang}/profile`,
      customIconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  // Stats cards configuration
  const statsCardsData: StatCardData[] = [
    {
      label: 'Solicitudes Asignadas',
      value: stats.assigned,
      icon: ClipboardList,
      iconColor: 'text-blue-500',
      subtitle: 'Total de solicitudes',
    },
    {
      label: 'En Proceso',
      value: stats.inProgress,
      icon: Clock,
      iconColor: 'text-orange-500',
      subtitle: 'Trabajando actualmente',
    },
    {
      label: 'Completadas',
      value: stats.completed,
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      subtitle: 'Finalizadas exitosamente',
    },
    {
      label: 'Tasa de Completitud',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      iconColor: 'text-primary',
      subtitle: 'Rendimiento general',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Empleado</h1>
        <p className="text-muted-foreground">Gestiona tus solicitudes asignadas y métricas de trabajo</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => (
          <QuickActionCard key={action.href} {...action} />
        ))}
      </div>

      {/* Statistics Cards */}
      <StatsCardGrid stats={statsCardsData} isLoading={isLoading} columns={4} />

      {/* Assigned Requests */}
      <RequestListOrganism
        requests={assignedRequests as RequestItem[]}
        isLoading={isLoading}
        baseHref={`/${lang}/employee/requests`}
        emptyMessage="No tienes solicitudes asignadas"
        title="Solicitudes Asignadas"
        showClientName={true}
      />
    </div>
  );
}
