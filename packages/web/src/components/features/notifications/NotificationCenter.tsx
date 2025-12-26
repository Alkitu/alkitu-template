import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { Bell, Check, Trash2, MailOpen, Mail } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/primitives/ui/popover';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { Badge } from '@/components/primitives/ui/badge';
import { Separator } from '@/components/primitives/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/primitives/ui/tabs';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationCenterProps {
  userId?: string;
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const utils = trpc.useContext(); // Use trpc context for invalidation if preferred, or queryClient

  const { data: notifications = [] } = trpc.notification.getNotifications.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const invalidateNotifications = () => {
     queryClient.invalidateQueries({ queryKey: [['notification', 'getNotifications']] }); // Match trpc query key structure structure
     // Or easier:
     utils.notification.getNotifications.invalidate({ userId });
     utils.notification.getUnreadCount.invalidate({ userId });
  };

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: invalidateNotifications,
  });

  const markAsUnreadMutation = trpc.notification.markAsUnread.useMutation({
    onSuccess: invalidateNotifications,
  });

  const deleteMutation = trpc.notification.deleteNotification.useMutation({
    onSuccess: invalidateNotifications,
  });
  
  const markAllReadMutation = trpc.notification.markAllAsRead.useMutation({
    onSuccess: invalidateNotifications,
  });

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

  const renderNotificationList = (list: any[]) => {
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
          <Bell className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">No notifications found</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        {list.map((notification: any) => (
          <div
            key={notification.id}
            className={`group relative flex flex-col gap-1 p-4 text-sm transition-colors hover:bg-muted/50 border-b last:border-0 ${
              !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-1">
                <p className={`font-medium leading-none ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {notification.title || 'Notification'}
                </p>
                <p className="text-muted-foreground line-clamp-2 text-xs">
                  {notification.message}
                </p>
                <span className="text-[10px] text-muted-foreground block">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                </span>
              </div>
              
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                 {!notification.read ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                 ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleMarkAsUnread(notification.id, e)}
                      title="Mark as unread"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                 )}
                 <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDelete(notification.id, e)}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const unreadList = notifications.filter((n: any) => !n.read);
  const readList = notifications.filter((n: any) => n.read);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <h4 className="font-semibold text-sm">Notifications</h4>
            {unreadCount > 0 && (
               <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-primary hover:text-primary/80" 
                onClick={handleMarkAllRead}
               >
                 Mark all read
               </Button>
            )}
          </div>
          
          <div className="px-4 py-2 border-b bg-muted/10">
             <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="read" className="text-xs">Read</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="m-0 border-none outline-none data-[state=active]:block hidden">
              {renderNotificationList(notifications)}
            </TabsContent>
            <TabsContent value="unread" className="m-0 border-none outline-none data-[state=active]:block hidden">
              {renderNotificationList(unreadList)}
            </TabsContent>
             <TabsContent value="read" className="m-0 border-none outline-none data-[state=active]:block hidden">
              {renderNotificationList(readList)}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
