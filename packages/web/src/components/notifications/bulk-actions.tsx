'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atomic-design/molecules/Card';
import { Badge } from '@/components/atomic-design/atoms/badge';
import { Separator } from '@/components/atomic-design/atoms/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
// Removed Select imports to avoid Radix UI ref composition issues
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Trash2, CheckCheck, Eye, BarChart3, Filter, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface BulkActionsProps {
  userId: string;
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>;
  selectedNotifications: string[];
  onSelectionChange: (selected: string[]) => void;
  onNotificationsUpdate: () => void;
}

export function BulkActions({
  userId,
  notifications,
  selectedNotifications,
  onSelectionChange,
  onNotificationsUpdate,
}: BulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // tRPC mutations
  const markAllAsReadMutation = trpc.notification.markAllAsRead.useMutation(); // TODO: Implement this
  const deleteAllMutation =
    trpc.notification.deleteAllNotifications.useMutation(); // TODO: Implement this
  const deleteReadMutation =
    trpc.notification.deleteReadNotifications.useMutation(); // TODO: Implement this
  const bulkMarkAsReadMutation = trpc.notification.bulkMarkAsRead.useMutation(); // TODO: Implement this
  const bulkDeleteMutation = trpc.notification.bulkDelete.useMutation(); // TODO: Implement this
  const deleteByTypeMutation =
    trpc.notification.deleteNotificationsByType.useMutation(); // TODO: Implement this

  // tRPC queries
  const { data: stats, refetch: refetchStats } =
    trpc.notification.getNotificationStats.useQuery(
      { userId }, // TODO: Implement this
      { enabled: showStats },
    );

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      const result = await markAllAsReadMutation.mutateAsync({ userId });
      toast({
        title: 'Success',
        description: `Marked ${result.count} notifications as read`,
      });
      onNotificationsUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsLoading(true);
    try {
      const result = await deleteAllMutation.mutateAsync({ userId });
      toast({
        title: 'Success',
        description: `Deleted ${result.count} notifications`,
      });
      onNotificationsUpdate();
      onSelectionChange([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete all notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRead = async () => {
    setIsLoading(true);
    try {
      const result = await deleteReadMutation.mutateAsync({ userId });
      toast({
        title: 'Success',
        description: `Deleted ${result.count} read notifications`,
      });
      onNotificationsUpdate();
      onSelectionChange([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete read notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;

    setIsLoading(true);
    try {
      const result = await bulkMarkAsReadMutation.mutateAsync({
        notificationIds: selectedNotifications,
      });
      toast({
        title: 'Success',
        description: `Marked ${result.count} notifications as read`,
      });
      onNotificationsUpdate();
      onSelectionChange([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark selected notifications as read',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;

    setIsLoading(true);
    try {
      const result = await bulkDeleteMutation.mutateAsync({
        notificationIds: selectedNotifications,
      });
      toast({
        title: 'Success',
        description: `Deleted ${result.count} notifications`,
      });
      onNotificationsUpdate();
      onSelectionChange([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete selected notifications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteByType = async (type: string) => {
    setIsLoading(true);
    try {
      const result = await deleteByTypeMutation.mutateAsync({ userId, type });
      toast({
        title: 'Success',
        description: `Deleted ${result.count} ${type} notifications`,
      });
      onNotificationsUpdate();
      onSelectionChange([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to delete ${type} notifications`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(notifications.map((n) => n.id));
    }
  };

  const handleSelectUnread = () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    onSelectionChange(unreadIds);
  };

  const handleSelectByType = (type: string) => {
    const typeIds = notifications
      .filter((n) => n.type === type)
      .map((n) => n.id);
    onSelectionChange(typeIds);
  };

  const getUniqueTypes = () => {
    return [...new Set(notifications.map((n) => n.type))];
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCheck className="h-5 w-5" />
          Bulk Actions
        </CardTitle>
        <CardDescription>
          Manage multiple notifications at once. {selectedNotifications.length}{' '}
          selected.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex flex-wrap gap-2">
          <div
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
            onClick={handleSelectAll}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectAll();
              }
            }}
          >
            <Checkbox
              checked={
                selectedNotifications.length === notifications.length &&
                notifications.length > 0
              }
              className="mr-2"
              disabled
            />
            Select All ({notifications.length})
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectUnread}
            disabled={unreadCount === 0}
          >
            Select Unread ({unreadCount})
          </Button>

          <select
            className="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => {
              if (e.target.value) {
                handleSelectByType(e.target.value);
                e.target.value = ''; // Reset selection
              }
            }}
          >
            <option value="">Select by type</option>
            {getUniqueTypes().map((type) => (
              <option key={type} value={type}>
                {type} ({notifications.filter((n) => n.type === type).length})
              </option>
            ))}
          </select>

          {selectedNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange([])}
            >
              <X className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          )}
        </div>

        <Separator />

        {/* Bulk Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Selected Actions */}
          {selectedNotifications.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Selected Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkMarkAsRead}
                  disabled={isLoading}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Mark as Read
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isLoading}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete Selected Notifications
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        {selectedNotifications.length} selected notifications?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* All Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">All Notifications</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isLoading || unreadCount === 0}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || notifications.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete All Notifications
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all {notifications.length}{' '}
                      notifications? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAll}>
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Clean Up Actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Clean Up</h4>
            <div className="flex flex-wrap gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || readCount === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Read ({readCount})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete Read Notifications
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all {readCount} read
                      notifications? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRead}>
                      Delete Read
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <select
                className="flex h-9 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) => {
                  if (e.target.value) {
                    const type = e.target.value;
                    const count = notifications.filter(
                      (n) => n.type === type,
                    ).length;
                    if (
                      window.confirm(
                        `Delete all ${count} ${type} notifications?`,
                      )
                    ) {
                      handleDeleteByType(type);
                    }
                    e.target.value = ''; // Reset selection
                  }
                }}
              >
                <option value="">Delete by type</option>
                {getUniqueTypes().map((type) => (
                  <option key={type} value={type}>
                    {type} (
                    {notifications.filter((n) => n.type === type).length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Badge variant="secondary">Total: {notifications.length}</Badge>
            <Badge variant="default">Unread: {unreadCount}</Badge>
            <Badge variant="outline">Read: {readCount}</Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowStats(!showStats);
              if (!showStats) refetchStats();
            }}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            {showStats ? 'Hide' : 'Show'} Stats
          </Button>
        </div>

        {/* Detailed Statistics */}
        {showStats && stats && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.unread}
                  </div>
                  <div className="text-sm text-muted-foreground">Unread</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.read}
                  </div>
                  <div className="text-sm text-muted-foreground">Read</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {stats.byType.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Types</div>
                </div>
              </div>

              {stats.byType.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">By Type:</h5>
                  <div className="flex flex-wrap gap-2">
                    {stats.byType.map(
                      (item: { type: string; count: number }) => (
                        <Badge key={item.type} variant="outline">
                          {item.type}: {item.count}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
