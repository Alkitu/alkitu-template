'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { Bell } from 'lucide-react';

interface NotificationCenterProps {
  userId: string;
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const queryClient = useQueryClient();
  const { data: notifications = [] } =
    trpc.notification.getNotifications.useQuery(
      { userId },
      { enabled: !!userId }
    );

  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <div>
      <Bell />
      <span>{notifications.filter((n: any) => !n.read).length}</span>
      <ul>
        {notifications.map((notification: any) => (
          <li key={notification.id}>
            <p>{notification.message}</p>
            {!notification.read && (
              <Button
                onClick={() => markAsReadMutation.mutate(notification.id)}
              >
                Mark as Read
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
