'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, MapPin, FileText, Clock, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import { QuickActionCard } from '@/components/molecules/dashboard';
import { StatsCardGrid } from '@/components/organisms/dashboard';
import { RequestListOrganism } from '@/components/organisms/dashboard';
import type { StatCardData } from '@/components/organisms/dashboard';
import type { RequestItem } from '@/components/organisms/dashboard';

/**
 * Employee Dashboard Page
 *
 * Main dashboard for EMPLOYEE role users.
 * Displays assigned requests, work metrics, and quick actions.
 */

interface Stats {
  assigned: number;
  inProgress: number;
  completed: number;
  completionRate: number;
}

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    assigned: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0,
  });
  const [assignedRequests, setAssignedRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch assigned requests and stats in parallel
        const [requestsResponse, statsResponse] = await Promise.all([
          fetch('/api/requests?limit=10&sort=createdAt:desc'),
          fetch('/api/requests/stats/count'),
        ]);

        // Parse assigned requests
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          const requests = Array.isArray(requestsData) ? requestsData : [];
          setAssignedRequests(requests.slice(0, 10));

          // Calculate stats from requests
          const inProgress = requests.filter(
            (r: RequestItem) => r.status === 'ONGOING'
          ).length;
          const completed = requests.filter(
            (r: RequestItem) => r.status === 'COMPLETED'
          ).length;
          const total = requests.length;
          const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

          setStats({
            assigned: total,
            inProgress,
            completed,
            completionRate,
          });
        }

        // Use stats API if available for more accurate data
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          const inProgress = statsData.ONGOING || 0;
          const completed = statsData.COMPLETED || 0;
          const assigned = (statsData.PENDING || 0) + inProgress + completed;
          const completionRate =
            assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

          setStats({
            assigned,
            inProgress,
            completed,
            completionRate,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      icon: ClipboardList,
      label: 'Solicitudes',
      subtitle: 'Mis',
      href: '/employee/requests',
      variant: 'primary' as const,
    },
    {
      icon: MapPin,
      label: 'de Trabajo',
      subtitle: 'Ubicaciones',
      href: '/locations',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: FileText,
      label: 'Notificaciones',
      subtitle: 'Ver',
      href: '/employee/notifications',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: Users,
      label: 'Perfil',
      subtitle: 'Mi',
      href: '/profile',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  const statsData: StatCardData[] = [
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
      <StatsCardGrid stats={statsData} isLoading={isLoading} columns={4} />

      {/* Assigned Requests */}
      <RequestListOrganism
        requests={assignedRequests}
        isLoading={isLoading}
        baseHref="/employee/requests"
        emptyMessage="No tienes solicitudes asignadas"
        title="Solicitudes Asignadas"
        showClientName={true}
      />
    </div>
  );
}
