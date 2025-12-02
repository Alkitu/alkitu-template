'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/primitives/Card';
import {
  ClipboardList,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

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

interface AssignedRequest {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  client?: {
    name: string;
  };
}

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    assigned: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0,
  });
  const [assignedRequests, setAssignedRequests] = useState<AssignedRequest[]>([]);
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
            (r: AssignedRequest) => r.status === 'ONGOING'
          ).length;
          const completed = requests.filter(
            (r: AssignedRequest) => r.status === 'COMPLETED'
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      PENDING: {
        text: 'Pendiente',
        className:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      },
      ONGOING: {
        text: 'En Proceso',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      },
      COMPLETED: {
        text: 'Completada',
        className:
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      },
      CANCELLED: {
        text: 'Cancelada',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      },
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
          Panel de Empleado
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus solicitudes asignadas y métricas de trabajo
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/employee/requests">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary" />
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

        <Link href="/employee/notifications">
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

        <Link href="/profile">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mi
                </p>
                <p className="text-lg font-semibold">Perfil</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Solicitudes Asignadas
            </h3>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{stats.assigned}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Total de solicitudes
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              En Proceso
            </h3>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{stats.inProgress}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Trabajando actualmente
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Completadas
            </h3>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{stats.completed}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Finalizadas exitosamente
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Tasa de Completitud
            </h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
          ) : (
            <p className="text-3xl font-bold">{stats.completionRate}%</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Rendimiento general
          </p>
        </Card>
      </div>

      {/* Assigned Requests */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Solicitudes Asignadas</h2>

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
        ) : assignedRequests.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div>
              <ClipboardList className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No tienes solicitudes asignadas
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Las nuevas solicitudes aparecerán aquí
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {assignedRequests.map((request) => (
              <Link key={request.id} href={`/employee/requests/${request.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-muted hover:border-primary/30">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      {getPriorityIcon(request.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{request.title}</h3>
                          {request.client && (
                            <p className="text-xs text-muted-foreground">
                              Cliente: {request.client.name}
                            </p>
                          )}
                        </div>
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
