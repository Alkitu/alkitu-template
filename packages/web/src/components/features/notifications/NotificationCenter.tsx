import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Bell, Check, Trash2, MailOpen, Mail, Calendar, Info, Clock, CheckCheck } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/primitives/ui/popover';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/ui/tabs';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Typography, Heading } from '@/components/atoms-alianza/Typography';
import { Button } from '@/components/molecules-alianza/Button';
import { Chip } from '@/components/atoms-alianza/Chip';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  userId?: string;
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  const { data: notifications = [] } = trpc.notification.getNotifications.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );

  const unreadList = notifications.filter((n: any) => !n.read);
  const readList = notifications.filter((n: any) => n.read);
  const unreadCount = unreadList.length;

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({ queryKey: [['notification', 'getNotifications']] });
    utils.notification.getNotifications.invalidate({ userId });
    utils.notification.getUnreadCount.invalidate({ userId });
  };

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({ onSuccess: invalidateNotifications });
  const markAsUnreadMutation = trpc.notification.markAsUnread.useMutation({ onSuccess: invalidateNotifications });
  const deleteMutation = trpc.notification.deleteNotification.useMutation({ onSuccess: invalidateNotifications });
  const markAllReadMutation = trpc.notification.markAllAsRead.useMutation({ onSuccess: invalidateNotifications });

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

  const handleMarkAllRead = () => {
    if (userId) markAllReadMutation.mutate({ userId });
  };

  // Helper to get icon (Consistent with page.tsx)
  const getIcon = (n: any) => {
    if (n.title?.toLowerCase().includes('servicio')) return <Check className="w-4 h-4 text-[#8B6D36]" />;
    if (n.title?.toLowerCase().includes('recordatorio')) return <Calendar className="w-4 h-4 text-[#8B6D36]" />;
    return <Info className="w-4 h-4 text-[#8B6D36]" />;
  };

  const renderNotificationList = (list: any[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-8 w-8 mb-2 text-muted-foreground/30" />
          <Typography variant="caption">No hay notificaciones</Typography>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-2 p-2">
        {list.map((notification: any) => {
          const isUnread = !notification.read;
          return (
            <div
              key={notification.id}
              className={cn(
                "group relative flex items-start gap-3 p-3 rounded-[16px] transition-colors",
                isUnread
                  ? "bg-primary/5 border border-primary/10"
                  : "bg-background shadow-sm border border-border/40"
              )}
            >
              {/* Icon Circle */}
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                {getIcon(notification)}
              </div>

              <div className="flex-1 min-w-0 space-y-1 pr-6">
                <div className="flex items-start justify-between gap-2">
                  <Heading level={6} className="text-sm font-semibold text-foreground leading-tight">
                    {notification.title || 'Notificación'}
                  </Heading>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed pb-6">
                  {notification.message}
                </div>
              </div>

              {/* Read/Unread Toggle - Bottom Right */}
              <div className="absolute bottom-3 right-3">
                {isUnread ? (
                  <button
                    className="flex items-center justify-center h-8 w-8 rounded-full text-foreground hover:text-primary hover:bg-primary/10 transition-colors focus:outline-none"
                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                    title="Marcar como leído"
                    type="button"
                  >
                    <Mail className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-primary/10 transition-colors focus:outline-none"
                    onClick={(e) => handleMarkAsUnread(notification.id, e)}
                    title="Marcar como no leído"
                    type="button"
                  >
                    <MailOpen className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" iconOnly className="relative group w-12 h-12 rounded-full hover:bg-muted/50 p-0">
          <Bell className="h-7 w-7 text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 rounded-xl overflow-clip border-border shadow-lg" align="end">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
          <Heading level={5} className="font-bold text-sm">Notificaciones</Heading>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-xs text-[#F59E0B] hover:text-[#D97706] font-medium transition-colors"
            >
              <CheckCheck className="w-3 h-3" />
              Marcar todas leídas
            </button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 py-2 bg-muted/20 border-b">
            <TabsList className="grid w-full grid-cols-3 h-8 bg-muted/50 p-0.5 rounded-lg">
              <TabsTrigger value="all" className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Todas</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                No leídas {unreadCount > 0 && <span className="ml-1 text-[10px] bg-destructive text-white px-1 rounded-full">{unreadCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="read" className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Leídas</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="m-0 border-none outline-none">
              {renderNotificationList(notifications)}
            </TabsContent>
            <TabsContent value="unread" className="m-0 border-none outline-none">
              {renderNotificationList(unreadList)}
            </TabsContent>
            <TabsContent value="read" className="m-0 border-none outline-none">
              {renderNotificationList(readList)}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer Link */}
        <div className="p-2 border-t bg-muted/10 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs h-8"
            onClick={() => {
              setOpen(false);
              router.push('/admin/notifications');
            }}
          >
            Ver todas las notificaciones
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
