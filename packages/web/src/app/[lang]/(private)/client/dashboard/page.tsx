'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, MapPin, Plus, FileText, Clock, CheckCircle2 } from 'lucide-react';
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
 */

interface Stats {
  active: number;
  completed: number;
  locations: number;
}

export default function ClientDashboardPage() {
  const [stats, setStats] = useState<Stats>({ active: 0, completed: 0, locations: 0 });
  const [recentRequests, setRecentRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats in parallel
        const [statsResponse, locationsResponse, requestsResponse] = await Promise.all([
          fetch('/api/requests/stats/count'),
          fetch('/api/locations'),
          fetch('/api/requests?limit=5&sort=createdAt:desc'),
        ]);

        // Parse stats
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          const active = (statsData.PENDING || 0) + (statsData.ONGOING || 0);
          const completed = statsData.COMPLETED || 0;

          // Parse locations
          let locationsCount = 0;
          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json();
            locationsCount = Array.isArray(locationsData) ? locationsData.length : 0;
          }

          setStats({ active, completed, locations: locationsCount });
        }

        // Parse recent requests
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          setRecentRequests(Array.isArray(requestsData) ? requestsData.slice(0, 5) : []);
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
      icon: Plus,
      label: 'Solicitud',
      subtitle: 'Nueva',
      href: '/client/requests/new',
      variant: 'primary' as const,
    },
    {
      icon: ClipboardList,
      label: 'Solicitudes',
      subtitle: 'Mis',
      href: '/client/requests',
      customIconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: MapPin,
      label: 'de Trabajo',
      subtitle: 'Ubicaciones',
      href: '/locations',
      customIconColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: FileText,
      label: 'Notificaciones',
      subtitle: 'Ver',
      href: '/client/notifications',
      customIconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  const statsData: StatCardData[] = [
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
      <StatsCardGrid stats={statsData} isLoading={isLoading} columns={3} />

      {/* Recent Activity */}
      <RequestListOrganism
        requests={recentRequests}
        isLoading={isLoading}
        baseHref="/client/requests"
        emptyMessage="No hay actividad reciente"
        emptyActionLabel="Nueva Solicitud"
        emptyActionHref="/client/requests/new"
        title="Actividad Reciente"
        showClientName={false}
      />
    </div>
  );
}
