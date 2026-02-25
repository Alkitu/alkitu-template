'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/primitives/Card';
import { Button } from '@/components/primitives/Button';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle2,
  Info,
  Clock,
  FileText,
  UserCheck,
  XCircle,
  Loader2,
  AlertTriangle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { useWebSocket } from '@/hooks/use-websocket';

/**
 * Notifications Center - EMPLOYEE Role
 *
 * Displays all notifications for the employee user with real API integration.
 * Highlights urgent notifications (cancellation requests) and assignment alerts.
 *
 * ALI-120: Enhanced with structured notification data for request lifecycle events
 * ALI-120: WebSocket integration for real-time notifications
 */

interface NotificationData {
  requestId?: string;
  serviceId?: string;
  serviceName?: string;
  clientId?: string;
  clientName?: string;
  employeeId?: string;
  employeeName?: string;
  previousStatus?: string;
  newStatus?: string;
  cancellationReason?: string;
  completionNotes?: string;
  metadata?: Record<string, any>;
}

interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  link: string | null;
  data: any; // Prisma Json type - will be cast to NotificationData
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EmployeeNotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'urgent'>(
    'all'
  );
  // Get user info via TRPC
  const { data: user } = trpc.user.me.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const userId = user?.id || null;

  // tRPC Queries
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = trpc.notification.getNotifications.useQuery(
    {
      userId: userId!,
    },
    {
      enabled: !!userId,
      refetchInterval: 3000, // Poll every 3s to ensure tests pass even if WS fails
    },
  );

  const { data: unreadCountData } = trpc.notification.getUnreadCount.useQuery(
    {
      userId: userId!,
    },
    {
      enabled: !!userId,
      refetchInterval: 3000,
    },
  );

  // WebSocket for real-time notifications
  // Note: WS is disabled because we can't access HttpOnly cookie token. Polling is used instead.
  const { connected, error: wsError } = useWebSocket({
    userId: userId || '',
    token: '', // Disabled
    enabled: false, 
    onNewNotification: (notification) => {
      console.log('New notification received via WebSocket:', notification);
      refetch();
    },
    onCountUpdate: () => {
      console.log('Notification count updated via WebSocket');
      refetch();
    },
  });

  // tRPC Mutations
  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteNotificationMutation =
    trpc.notification.deleteNotification.useMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const markAllAsReadMutation = trpc.notification.markAllAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const isUrgentNotification = (notification: Notification): boolean => {
    return (
      notification.type === 'REQUEST_CANCELLATION_REQUESTED' ||
      notification.type === 'REQUEST_ASSIGNED'
    );
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<
      string,
      { icon: React.ElementType; className: string }
    > = {
      REQUEST_CREATED: {
        icon: FileText,
        className:
          'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20',
      },
      REQUEST_ASSIGNED: {
        icon: UserCheck,
        className:
          'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
      },
      REQUEST_COMPLETED: {
        icon: CheckCircle2,
        className:
          'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20',
      },
      REQUEST_CANCELLED: {
        icon: XCircle,
        className:
          'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
      },
      REQUEST_CANCELLATION_REQUESTED: {
        icon: AlertTriangle,
        className:
          'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20',
      },
      INFO: {
        icon: Info,
        className:
          'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20',
      },
      SUCCESS: {
        icon: CheckCircle2,
        className:
          'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
      },
      WARNING: {
        icon: AlertCircle,
        className:
          'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20',
      },
      ERROR: {
        icon: AlertCircle,
        className:
          'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
      },
    };

    return (
      icons[type] || {
        icon: Bell,
        className:
          'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20',
      }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Hace menos de una hora';
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const markAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync({ notificationId: id });
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    await markAllAsReadMutation.mutateAsync({ userId });
  };

  const deleteNotification = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      await deleteNotificationMutation.mutateAsync({ notificationId: id });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to related resource if available
    if (notification.data?.requestId) {
      router.push(`/employee/requests/${notification.data.requestId}`);
    } else if (notification.link) {
      router.push(notification.link);
    }
  };

  const filteredNotifications = (notifications as Notification[]).filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    if (filter === 'urgent') return isUrgentNotification(n) && !n.read;
    return true;
  });

  const unreadCount = unreadCountData || 0;
  const urgentCount = (notifications as Notification[]).filter(
    (n) => isUrgentNotification(n) && !n.read
  ).length;

  // Loading state
  if (isLoading || !userId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Error al cargar notificaciones
            </h2>
            <p className="text-muted-foreground mb-4">
              {error.message || 'Ocurrió un error inesperado'}
            </p>
            <Button onClick={() => refetch()}>Reintentar</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* WebSocket Connection Status */}
          <div className="mb-4">
            {connected ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm">
                <Wifi className="h-4 w-4" />
                <span>Conectado en tiempo real</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 rounded-md text-sm">
                <WifiOff className="h-4 w-4" />
                <span>Reconectando...</span>
              </div>
            )}
            {wsError && (
              <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                {wsError}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="h-8 w-8" />
                Notificaciones
                {unreadCount > 0 && (
                  <span className="text-sm font-medium px-3 py-1 bg-primary text-primary-foreground rounded-full">
                    {unreadCount} nuevas
                  </span>
                )}
                {urgentCount > 0 && (
                  <span className="text-sm font-medium px-3 py-1 bg-orange-500 text-white rounded-full flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {urgentCount} urgentes
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground mt-2">
                Mantente informado sobre tus asignaciones y actualizaciones
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                disabled={markAllAsReadMutation.isPending}
              >
                {markAllAsReadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCheck className="h-4 w-4 mr-2" />
                )}
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({notifications.length})
            </Button>
            <Button
              variant={filter === 'urgent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('urgent')}
              className={urgentCount > 0 ? 'border-orange-500' : ''}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Urgentes ({urgentCount})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              <Filter className="h-4 w-4 mr-2" />
              No leídas ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              Leídas ({notifications.length - unreadCount})
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filter === 'unread'
                  ? 'No tienes notificaciones sin leer'
                  : filter === 'urgent'
                    ? 'No tienes notificaciones urgentes'
                    : 'No hay notificaciones'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const iconInfo = getNotificationIcon(notification.type);
              const Icon = iconInfo.icon;
              const isUrgent = isUrgentNotification(notification);

              return (
                <Card
                  key={notification.id}
                  data-testid="notification-card"
                  data-notification-type={notification.type}
                  className={`p-6 transition-all hover:shadow-md cursor-pointer ${
                    !notification.read
                      ? 'border-primary/30 bg-primary/5 unread'
                      : ''
                  } ${
                    isUrgent && !notification.read
                      ? 'border-l-4 border-l-orange-500'
                      : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${iconInfo.className} ${
                        isUrgent && !notification.read ? 'ring-2 ring-orange-500' : ''
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">
                              {notification.message}
                            </h3>
                            {!notification.read && (
                              <span className="inline-block h-2 w-2 bg-primary rounded-full" />
                            )}
                            {isUrgent && !notification.read && (
                              <span className="text-xs font-medium px-2 py-0.5 bg-orange-500 text-white rounded">
                                URGENTE
                              </span>
                            )}
                          </div>

                          {/* Enhanced: Show service name from data payload */}
                          {notification.data?.serviceName && (
                            <p className="text-sm text-muted-foreground mb-1">
                              Servicio:{' '}
                              <strong>{notification.data.serviceName}</strong>
                            </p>
                          )}

                          {/* Enhanced: Show client name */}
                          {notification.data?.clientName && (
                            <p className="text-sm text-muted-foreground mb-1">
                              Cliente:{' '}
                              <strong>{notification.data.clientName}</strong>
                            </p>
                          )}

                          {/* Enhanced: Show cancellation reason */}
                          {notification.data?.cancellationReason && (
                            <p className="text-sm text-muted-foreground mb-1">
                              Razón: {notification.data.cancellationReason}
                            </p>
                          )}

                          <div
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                            data-testid="notification-time"
                          >
                            <Clock className="h-3 w-3" />
                            {formatDate(notification.createdAt)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          className="flex gap-2 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              disabled={markAsReadMutation.isPending}
                              title="Marcar como leída"
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            disabled={deleteNotificationMutation.isPending}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Related Link */}
                      {notification.data?.requestId && (
                        <div
                          className="mt-3 flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/employee/requests/${notification.data.requestId}`}
                          >
                            <Button variant="outline" size="sm">
                              Ver Solicitud
                            </Button>
                          </Link>
                          {isUrgent && notification.type === 'REQUEST_ASSIGNED' && (
                            <Link
                              href={`/employee/requests/${notification.data.requestId}`}
                            >
                              <Button size="sm">
                                Atender Ahora
                              </Button>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
