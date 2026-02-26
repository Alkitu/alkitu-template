'use client';

import React from 'react';
import {
  Check,
  Calendar,
  Info,
  Clock,
  CheckCheck,
  Mail,
  MailOpen,
  ExternalLink,
  Trash2,
  Loader2,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useWebSocket } from '@/hooks/use-websocket';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { TabsAlianza } from '@/components/molecules-alianza/TabsAlianza';
import { Button } from '@/components/molecules-alianza/Button';
import { Heading, Typography } from '@/components/atoms-alianza/Typography';
import { Chip } from '@/components/atoms-alianza/Chip';
import { cn } from '@/lib/utils';
import type {
  Notification,
  NotificationsPageOrganismProps,
} from './NotificationsPageOrganism.types';

export function NotificationsPageOrganism({
  requestsBasePath,
}: NotificationsPageOrganismProps) {
  const utils = trpc.useContext();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  // Fetch User
  const { data: user } = trpc.user.me.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const userId = user?.id;

  // Fetch Notifications
  const {
    data: notifications = [],
    isLoading,
    error,
  } = trpc.notification.getNotifications.useQuery(
    { userId: userId! },
    { enabled: !!userId },
  );

  // Mutations
  const invalidateQueries = () => {
    utils.notification.getNotifications.invalidate({ userId });
    utils.notification.getUnreadCount.invalidate({ userId });
  };

  // WebSocket for real-time updates (invisible — no UI indicator)
  useWebSocket({
    userId: userId || '',
    enabled: !!userId,
    onNewNotification: invalidateQueries,
    onCountUpdate: invalidateQueries,
  });

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: invalidateQueries,
  });
  const markAsUnreadMutation = trpc.notification.markAsUnread.useMutation({
    onSuccess: invalidateQueries,
  });
  const markAllReadMutation = trpc.notification.markAllAsRead.useMutation({
    onSuccess: invalidateQueries,
  });
  const deleteNotificationMutation =
    trpc.notification.deleteNotification.useMutation({
      onSuccess: invalidateQueries,
    });

  // Handlers
  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate({ notificationId: id });
  };

  const handleMarkAsUnread = (id: string) => {
    markAsUnreadMutation.mutate({ notificationId: id });
  };

  const handleMarkAllRead = () => {
    if (userId) {
      markAllReadMutation.mutate({ userId });
    }
  };

  const handleDelete = (id: string) => {
    deleteNotificationMutation.mutate({ notificationId: id });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) handleMarkAsRead(notification.id);
    if (notification.data?.requestId) {
      router.push(
        `/${lang}${requestsBasePath}/${notification.data.requestId}`,
      );
    } else if (notification.link) {
      router.push(notification.link);
    }
  };

  // Icon helper
  const getIcon = (n: Notification) => {
    if (n.title?.toLowerCase().includes('servicio'))
      return <Check className="text-[#8B6D36]" />;
    if (n.title?.toLowerCase().includes('recordatorio'))
      return <Calendar className="text-[#8B6D36]" />;
    return <Info className="text-[#8B6D36]" />;
  };

  // Derived lists
  const typedNotifications = notifications as unknown as Notification[];
  const unreadList = typedNotifications.filter((n) => !n.read);
  const readList = typedNotifications.filter((n) => n.read);
  const unreadCount = unreadList.length;
  const hasUnread = unreadCount > 0;

  const NotificationItem = ({
    notification,
  }: {
    notification: Notification;
  }) => {
    const isUnread = !notification.read;
    return (
      <div
        className={cn(
          'relative flex items-start gap-5 p-6 rounded-[var(--radius-xl)] transition-all duration-200 cursor-pointer',
          isUnread
            ? 'bg-primary/5 border border-primary/10 shadow-sm'
            : 'bg-background border border-border shadow-sm',
        )}
        onClick={() => handleNotificationClick(notification)}
      >
        {/* Icon Circle */}
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 shadow-inner mt-1">
          {getIcon(notification)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-12 sm:pr-28">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Heading
                level={4}
                className="text-base font-semibold text-foreground"
              >
                {notification.title || 'Notificación'}
              </Heading>
              <Typography
                variant="p"
                size="sm"
                className="text-muted-foreground/80 leading-relaxed max-w-2xl"
              >
                {notification.message}
              </Typography>
            </div>
          </div>

          {/* Enhanced data display */}
          {notification.data?.serviceName && (
            <Typography
              variant="p"
              size="sm"
              className="text-muted-foreground/80 mt-1"
            >
              Servicio: <strong>{notification.data.serviceName}</strong>
            </Typography>
          )}
          {notification.data?.clientName && (
            <Typography
              variant="p"
              size="sm"
              className="text-muted-foreground/80 mt-0.5"
            >
              Cliente: <strong>{notification.data.clientName}</strong>
            </Typography>
          )}
          {notification.data?.employeeName && (
            <Typography
              variant="p"
              size="sm"
              className="text-muted-foreground/80 mt-0.5"
            >
              Empleado: <strong>{notification.data.employeeName}</strong>
            </Typography>
          )}

          {/* Footer / Meta */}
          <div className="flex items-center gap-2 mt-3">
            <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
            <Typography
              variant="caption"
              className="text-xs text-muted-foreground/60 font-medium"
            >
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </Typography>
          </div>

          {/* "Ver Solicitud" Button */}
          {notification.data?.requestId && (
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <Link
                href={`/${lang}${requestsBasePath}/${notification.data.requestId}`}
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver Solicitud
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Actions - Top Right */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          {/* "Nuevo" chip - hidden on mobile */}
          {isUnread && (
            <Chip
              className="bg-[#F59E0B] text-white border-none font-medium px-3 h-7 text-xs rounded-full shadow-sm shrink-0 hidden sm:flex"
              variant="solid"
            >
              Nuevo
            </Chip>
          )}

          {/* Read / Unread toggle */}
          {isUnread ? (
            <button
              className="flex items-center justify-center h-9 w-9 rounded-full text-foreground hover:text-primary hover:bg-primary/10 transition-colors focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead(notification.id);
              }}
              title="Marcar como leído"
              type="button"
            >
              <Mail className="h-5 w-5" />
            </button>
          ) : (
            <button
              className="flex items-center justify-center h-9 w-9 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-primary/10 transition-colors focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsUnread(notification.id);
              }}
              title="Marcar como no leído"
              type="button"
            >
              <MailOpen className="h-5 w-5" />
            </button>
          )}

          {/* Delete button */}
          <button
            className="flex items-center justify-center h-9 w-9 rounded-full text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(notification.id);
            }}
            title="Eliminar"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="text-center py-12 bg-muted/5 rounded-2xl border border-dashed">
          <Typography variant="p" className="text-muted-foreground">
            Error al cargar notificaciones. Intenta recargar la página.
          </Typography>
        </div>
      </div>
    );
  }

  const renderList = (list: Notification[], emptyMessage: string) =>
    list.length === 0 ? (
      <div className="text-center py-12 bg-muted/5 rounded-2xl border border-dashed">
        <Typography variant="caption" className="text-lg">
          {emptyMessage}
        </Typography>
      </div>
    ) : (
      <div className="space-y-4 animate-in fade-in-50 duration-500">
        {list.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Heading level={2} className="font-bold text-3xl">
          Notificaciones
        </Heading>

        {hasUnread && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Marcar todas como leídas</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <TabsAlianza
        defaultValue="all"
        tabs={[
          {
            value: 'all',
            label: 'Todas',
            content: renderList(
              typedNotifications,
              'No tienes notificaciones.',
            ),
          },
          {
            value: 'unread',
            label: (
              <div className="flex items-center gap-2">
                <span>No leídas</span>
                {unreadCount > 0 && (
                  <span className="flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold h-5 min-w-5 rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </div>
            ),
            content: renderList(
              unreadList,
              '¡Estás al día! No tienes notificaciones nuevas.',
            ),
          },
          {
            value: 'read',
            label: 'Leídas',
            content: renderList(
              readList,
              'No tienes notificaciones leídas.',
            ),
          },
        ]}
      />
    </div>
  );
}
