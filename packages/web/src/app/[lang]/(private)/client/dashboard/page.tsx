'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/primitives/Card';
import {
  ClipboardList,
  MapPin,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/primitives/Button';

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

interface RecentRequest {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function ClientDashboardPage() {
  const [stats, setStats] = useState<Stats>({ active: 0, completed: 0, locations: 0 });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      PENDING: { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      ONGOING: { text: 'En Proceso', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      COMPLETED: { text: 'Completada', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      CANCELLED: { text: 'Cancelada', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const getPriorityIcon = (priority: string) => {
    const icons: Record<string, { icon: typeof AlertCircle; className: string }> = {
      HIGH: { icon: AlertCircle, className: 'text-red-500' },
      MEDIUM: { icon: Clock, className: 'text-orange-500' },
      LOW: { icon: Clock, className: 'text-blue-500' },
    };
    const config = icons[priority] || icons.MEDIUM;
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.className}`} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Panel de Cliente
        </h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel principal
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/client/requests/new">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nueva
                </p>
                <p className="text-lg font-semibold">Solicitud</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/client/requests">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mis
                </p>
                <p className="text-lg font-semibold">Solicitudes</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/locations">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ubicaciones
                </p>
                <p className="text-lg font-semibold">de Trabajo</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/client/notifications">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ver
                </p>
                <p className="text-lg font-semibold">Notificaciones</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Solicitudes Activas
            </h3>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{stats.active}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            En proceso o pendientes
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Solicitudes Completadas
            </h3>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{stats.completed}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Finalizadas este mes
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Ubicaciones de Trabajo
            </h3>
            <MapPin className="h-4 w-4 text-blue-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{stats.locations}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Ubicaciones registradas
          </p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-lg">
                <div className="h-10 w-10 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentRequests.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div>
              <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No hay actividad reciente
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Crea tu primera solicitud para comenzar
              </p>
              <Link href="/client/requests/new">
                <Button className="mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Solicitud
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <Link key={request.id} href={`/client/requests/${request.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-muted hover:border-primary/30">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      {getPriorityIcon(request.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-semibold truncate">{request.title}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
