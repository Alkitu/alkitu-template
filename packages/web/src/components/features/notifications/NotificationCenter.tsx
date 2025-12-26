import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { Bell, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/primitives/ui/popover';
import { ScrollArea } from '@/components/primitives/ui/scroll-area';
import { Badge } from '@/components/primitives/ui/badge';
import { Separator } from '@/components/primitives/ui/separator';

interface NotificationCenterProps {
  userId?: string;
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const queryClient = useQueryClient();
  const { data: notifications = [] } = trpc.notification.getNotifications.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getNotifications'] });
      // Also invalidate summary stats if needed
      queryClient.invalidateQueries({ queryKey: ['notification'] }); 
    },
  });
  
  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate({ notificationId: id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 bg-muted/50">
          <h4 className="font-semibold leading-none">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} unread
            </span>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 mt-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`relative flex flex-col gap-1 p-4 text-sm transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'bg-muted/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-none">
                      {notification.title || 'Notification'}
                    </p>
                    {!notification.read && (
                       <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        title="Mark as read"
                      >
                       <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
