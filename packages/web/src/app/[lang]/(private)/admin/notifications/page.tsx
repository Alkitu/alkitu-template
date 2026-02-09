'use client';

import React from 'react';
import { useTranslations } from '@/context/TranslationsContext';
import {
  Check,
  Calendar,
  Info,
  Clock,
  CheckCheck,
  Mail,
  MailOpen
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { TabsAlianza } from '@/components/molecules-alianza/TabsAlianza';
import { Button } from '@/components/molecules-alianza/Button';
import { Heading, Typography } from '@/components/atoms-alianza/Typography';
import { Chip } from '@/components/atoms-alianza/Chip';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const utils = trpc.useContext();

  // Fetch User
  const { data: user } = trpc.user.me.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const userId = user?.id;

  // Fetch Notifications
  const { data: notifications = [], isLoading } = trpc.notification.getNotifications.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );

  // Mutations
  const invalidateQueries = () => {
    utils.notification.getNotifications.invalidate({ userId });
    utils.notification.getUnreadCount.invalidate({ userId });
  };

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({ onSuccess: invalidateQueries });
  const markAsUnreadMutation = trpc.notification.markAsUnread.useMutation({ onSuccess: invalidateQueries });
  const markAllReadMutation = trpc.notification.markAllAsRead.useMutation({ onSuccess: invalidateQueries });

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

  /* Helper to get icon based on notification content */
  const getIcon = (n: any) => {
    if (n.title?.toLowerCase().includes('servicio')) return <Check className="text-[#8B6D36]" />;
    if (n.title?.toLowerCase().includes('recordatorio')) return <Calendar className="text-[#8B6D36]" />;
    return <Info className="text-[#8B6D36]" />;
  };

  /* Derived Lists */
  const unreadList = notifications.filter((n: any) => !n.read);
  const readList = notifications.filter((n: any) => n.read);
  const unreadCount = unreadList.length;
  const hasUnread = unreadCount > 0;

  const NotificationItem = ({ notification }: { notification: any }) => {
    const isUnread = !notification.read;
    return (
      <div
        key={notification.id}
        className={cn(
          "relative flex items-center gap-5 p-6 rounded-[20px] transition-all duration-200",
          isUnread 
            ? "bg-[#F9F8F6] shadow-sm inner-border inner-border-[#E8E6E1]/50" 
            : "bg-background border border-border shadow-sm"
        )}
      >
        {/* Icon Circle */}
        <div className="h-12 w-12 rounded-full bg-[#FDE68A] flex items-center justify-center shrink-0 shadow-inner">
            {getIcon(notification)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-12 sm:pr-24">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <Heading level={4} className="text-base font-semibold text-foreground">
                    {notification.title || 'Notificación'}
                </Heading>
                <Typography variant="p" size="sm" className="text-muted-foreground/80 leading-relaxed max-w-2xl">
                  {notification.message}
                </Typography>
            </div>
          </div>
          
          {/* Footer / Meta */}
          <div className="flex items-center gap-2 mt-3">
              <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
              <Typography variant="caption" className="text-xs text-muted-foreground/60 font-medium">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
              </Typography>
          </div>
        </div>

        {/* Read/Unread Toggle & Tag - Bottom Right */}
        <div className="absolute bottom-5 right-5 flex items-center gap-3">
            {/* Tag - Hidden on mobile */}
            {isUnread && (
                <Chip 
                    className="bg-[#F59E0B] text-white border-none font-medium px-3 h-7 text-xs rounded-full shadow-sm shrink-0 hidden sm:flex"
                    variant="solid" 
                >
                    Nuevo
                </Chip>
            )}

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
        </div>
      </div>
    );
  };

  if (isLoading || !user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Heading level={2} className="font-bold text-3xl">Notificaciones</Heading>
        
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
            content: (
              notifications.length === 0 ? (
                 <div className="text-center py-12 bg-muted/5 rounded-2xl border border-dashed">
                   <Typography variant="caption" className="text-lg">No tienes notificaciones.</Typography>
                 </div>
              ) : (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                  {notifications.map((n: any) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </div>
              )
            )
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
            content: (
              unreadList.length === 0 ? (
                 <div className="text-center py-12 bg-muted/5 rounded-2xl border border-dashed">
                   <Typography variant="caption" className="text-lg">¡Estás al día! No tienes notificaciones nuevas.</Typography>
                 </div>
              ) : (
                <div className="space-y-4 animate-in fade-in-50 duration-500">
                  {unreadList.map((n: any) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </div>
              )
            )
          },
          {
            value: 'read',
            label: 'Leídas',
            content: (
               readList.length === 0 ? (
                   <div className="text-center py-12 bg-muted/5 rounded-2xl border border-dashed">
                     <Typography variant="caption" className="text-lg">No tienes notificaciones leídas.</Typography>
                   </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {readList.map((n: any) => (
                      <NotificationItem key={n.id} notification={n} />
                    ))}
                  </div>
                )
            )
          }
        ]}
      />
    </div>
  );
}
