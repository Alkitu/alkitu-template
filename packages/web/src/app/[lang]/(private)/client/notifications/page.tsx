'use client';

import { useState } from 'react';
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
} from 'lucide-react';

/**
 * Notifications Center - CLIENT Role
 *
 * Displays all notifications for the client user.
 * Allows marking as read/unread and filtering by type.
 */

type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedTo?: {
    type: 'REQUEST';
    id: string;
  };
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Mock data - will be replaced with API call
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'SUCCESS',
      title: 'Solicitud asignada',
      message: 'Tu solicitud REQ-001 ha sido asignada a Juan Pérez',
      read: false,
      createdAt: '2025-12-02T14:30:00Z',
      relatedTo: { type: 'REQUEST', id: 'REQ-001' },
    },
    {
      id: '2',
      type: 'INFO',
      title: 'Técnico en camino',
      message: 'El técnico está en camino a tu ubicación',
      read: false,
      createdAt: '2025-12-02T10:15:00Z',
      relatedTo: { type: 'REQUEST', id: 'REQ-001' },
    },
    {
      id: '3',
      type: 'SUCCESS',
      title: 'Solicitud completada',
      message: 'Tu solicitud REQ-002 ha sido completada exitosamente',
      read: true,
      createdAt: '2025-12-01T16:45:00Z',
      relatedTo: { type: 'REQUEST', id: 'REQ-002' },
    },
  ]);

  const getNotificationIcon = (type: NotificationType) => {
    const icons = {
      INFO: { icon: Info, className: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20' },
      SUCCESS: { icon: CheckCircle2, className: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20' },
      WARNING: { icon: AlertCircle, className: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20' },
      ERROR: { icon: AlertCircle, className: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20' },
    };

    return icons[type];
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

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
              </h1>
              <p className="text-muted-foreground mt-2">
                Mantente al día con todas tus actualizaciones
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({notifications.length})
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
                  : 'No hay notificaciones'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const iconInfo = getNotificationIcon(notification.type);
              const Icon = iconInfo.icon;

              return (
                <Card
                  key={notification.id}
                  className={`p-6 transition-all hover:shadow-md ${
                    !notification.read ? 'border-primary/30 bg-primary/5' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${iconInfo.className}`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block h-2 w-2 bg-primary rounded-full" />
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(notification.createdAt)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Related Link */}
                      {notification.relatedTo && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/client/requests/${notification.relatedTo.id}`}>
                              Ver Solicitud
                            </a>
                          </Button>
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
