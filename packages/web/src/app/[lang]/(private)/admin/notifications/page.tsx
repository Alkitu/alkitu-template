'use client';

import React, { useState } from 'react';
import { useTranslations } from '@/context/TranslationsContext';
import { Button } from '@/components/primitives/ui/button';
import { Checkbox } from '@/components/primitives/ui/checkbox';
import {
  Bell,
  Check,
  ExternalLink,
  Trash2,
  Loader2,
  Mail,
  MailOpen,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';
import { trpc } from '@/lib/trpc';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card'; 
import { Badge } from '@/components/primitives/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const utils = trpc.useContext(); // Use trpc context for invalidation

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
    setSelectedNotifications([]);
  };

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({ onSuccess: invalidateQueries });
  const markAsUnreadMutation = trpc.notification.markAsUnread.useMutation({ onSuccess: invalidateQueries });
  const deleteMutation = trpc.notification.deleteNotification.useMutation({ onSuccess: invalidateQueries });
  const markAllReadMutation = trpc.notification.markAllAsRead.useMutation({ onSuccess: invalidateQueries });
  const bulkMarkReadMutation = trpc.notification.bulkMarkAsRead.useMutation({ onSuccess: invalidateQueries });
  const bulkDeleteMutation = trpc.notification.bulkDelete.useMutation({ onSuccess: invalidateQueries });

  // Handlers
  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    markAsReadMutation.mutate({ notificationId: id });
  };

  const handleMarkAsUnread = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    markAsUnreadMutation.mutate({ notificationId: id });
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    deleteMutation.mutate({ notificationId: id });
  };

  const handleSelectAll = (checked: boolean, list: any[]) => {
    if (checked) {
      setSelectedNotifications(list.map((n) => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications((prev) => [...prev, id]);
    } else {
      setSelectedNotifications((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleBulkRead = () => {
    if (selectedNotifications.length) {
      bulkMarkReadMutation.mutate({ notificationIds: selectedNotifications });
    }
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.length) {
      bulkDeleteMutation.mutate({ notificationIds: selectedNotifications });
    }
  };

  // Derived Lists
  const unreadList = notifications.filter((n: any) => !n.read);
  const readList = notifications.filter((n: any) => n.read);
  const unreadCount = unreadList.length;

  // Render Item Helper
  const NotificationItem = ({ notification }: { notification: any }) => (
    <div
      data-testid="notification-card"
      className={`group flex items-start gap-4 p-4 border rounded-lg transition-all hover:shadow-sm ${
        !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900' : 'bg-card border-border'
      }`}
    >
      <Checkbox
        checked={selectedNotifications.includes(notification.id)}
        onCheckedChange={(checked) => handleSelect(notification.id, checked as boolean)}
        className="mt-1"
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className={`font-medium ${!notification.read ? 'text-primary' : 'text-foreground'}`}>
            {notification.title || 'Notification'}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 pt-2">
            {notification.link && (
                 <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary underline hover:bg-transparent">
                    <Link href={notification.link}>
                        Ver detalles <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                 </Button>
            )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {!notification.read ? (
            <Button variant="ghost" size="icon" onClick={(e) => handleMarkAsRead(notification.id, e)} title="Mark as read">
                <Check className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
        ) : (
             <Button variant="ghost" size="icon" onClick={(e) => handleMarkAsUnread(notification.id, e)} title="Mark as unread">
                <Mail className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
        )}
        <Button variant="ghost" size="icon" onClick={(e) => handleDelete(notification.id, e)} title="Delete">
            <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
        </Button>
      </div>
    </div>
  );

  const renderContent = (list: any[], tabValue: string) => {
    if (list.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/5">
                <div className="bg-muted/50 p-4 rounded-full mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium">No hay notificaciones</h3>
                <p className="text-sm text-muted-foreground mt-1 text-balance max-w-xs">
                    {tabValue === 'all' ? 'No tienes notificaciones en este momento.' : 
                     tabValue === 'unread' ? 'Estás al día. No tienes notificaciones sin leer.' :
                     'No tienes notificaciones leídas.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in-50 duration-500">
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                     <Checkbox 
                        checked={list.length > 0 && selectedNotifications.length === list.length}
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean, list)}
                     />
                     <span className="text-sm text-muted-foreground">Seleccionar todo</span>
                </div>
                {selectedNotifications.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{selectedNotifications.length} seleccionado(s)</span>
                        <Button variant="outline" size="sm" onClick={handleBulkRead}>Marcar leídos</Button>
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Eliminar</Button>
                    </div>
                )}
            </div>
            {list.map((n) => (
                <NotificationItem key={n.id} notification={n} />
            ))}
        </div>
    );
  };

  if (isLoading || !user) {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
             <AdminPageHeader title={t('title')} description={t('subtitle')} />
             <div className="flex items-center justify-center py-12">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          unreadCount > 0 && (
            <Button onClick={() => markAllReadMutation.mutate({ userId: userId! })} variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Marcar todo como leído
            </Button>
          )
        }
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            No leídas
            {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {unreadCount}
                </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Leídas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {renderContent(notifications, 'all')}
        </TabsContent>
        <TabsContent value="unread" className="mt-0">
          {renderContent(unreadList, 'unread')}
        </TabsContent>
        <TabsContent value="read" className="mt-0">
          {renderContent(readList, 'read')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
