'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  startTransition,
} from 'react';
import { useTranslations } from '@/context/TranslationContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/atomic-design/atoms/typography';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Bell,
  BellOff,
  Check,
  ExternalLink,
  Trash2,
  Settings,
  Download,
  BarChart3,
  Zap,
  Loader2,
} from 'lucide-react';
import { BulkActions } from '@/components/notifications/bulk-actions';
import { NotificationFilters } from '@/components/notifications/notification-filters';
import {
  useNotificationFiltersStore,
  type NotificationFilters as NotificationFiltersType,
} from '@/stores/notification-filters';
import { EnhancedPagination } from '@/components/notifications/enhanced-pagination';
import {
  NotificationSkeleton,
  NotificationListSkeleton,
  InfiniteScrollSkeleton,
} from '@/components/notifications/notification-skeleton';
import { useInfiniteNotifications } from '@/hooks/use-infinite-scroll';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const TEST_USER_ID = '6861ea1a1c0cf932169adce4';

interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
  pageSize: number;
}

// Memoized Notification Card with optimized props
const NotificationCard = React.memo(function NotificationCard({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'report':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'feature':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'security':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'system':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'info':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));

  return (
    <Card
      className={`transition-all duration-200 ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/20' : 'hover:shadow-md'}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onSelect(notification.id, checked as boolean)
              }
            />
            <div
              className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`}
            />
            <Badge
              className={getTypeColor(notification.type)}
              variant="secondary"
            >
              {notification.type}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(notification.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="h-8 px-2"
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            {notification.link && (
              <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                <Link href={notification.link}>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed">{notification.message}</p>
      </CardContent>
    </Card>
  );
});

// Memoized Header Section
const NotificationHeader = React.memo(function NotificationHeader({
  t,
  totalCount,
  isFilteredFetch,
  infiniteScrollEnabled,
  currentNotifications,
  infiniteHasMore,
  pagination,
  performanceMode,
  setPerformanceMode,
  performanceModeRef,
  unreadCount,
  isQuickFilterLoading,
  handleExport,
  markAllAsRead,
}: {
  t: any;
  totalCount: number;
  isFilteredFetch: boolean;
  infiniteScrollEnabled: boolean;
  currentNotifications: Notification[];
  infiniteHasMore: boolean;
  pagination: PaginationInfo;
  performanceMode: boolean;
  setPerformanceMode: (mode: boolean) => void;
  performanceModeRef: React.MutableRefObject<boolean>;
  unreadCount: number;
  isQuickFilterLoading: boolean;
  handleExport: () => void;
  markAllAsRead: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Typography variant="h1" className="text-3xl font-bold">
          {t('title')}
        </Typography>
        <Typography variant="p" className="text-muted-foreground mt-1">
          {t('subtitle')}
        </Typography>
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {isFilteredFetch ? t('filteredResults') : t('allNotifications')} •
            {infiniteScrollEnabled
              ? `${currentNotifications.length} ${t('loaded')}${infiniteHasMore ? ` (${t('moreAvailable')})` : ''}`
              : `Page ${pagination.currentPage} of ${pagination.totalPages} • ${pagination.totalCount} ${t('total')}`}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm">
            <Zap className="w-4 h-4 inline mr-1" />
            {t('fastMode')}
          </Label>
          <Switch
            checked={performanceMode}
            onCheckedChange={(v) => {
              setPerformanceMode(v);
              performanceModeRef.current = v;
            }}
          />
        </div>
        <Badge
          variant="secondary"
          className={cn(
            'transition-all duration-200',
            isQuickFilterLoading && 'opacity-70',
          )}
        >
          {isQuickFilterLoading ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Bell className="w-4 h-4 mr-1" />
          )}
          {unreadCount} {t('unread')}{' '}
          {infiniteScrollEnabled ? t('loaded') : t('onPage')}
        </Badge>
        <Button asChild variant="outline" size="sm">
          <Link
            href="/dashboard/notifications/analytics"
            className="flex items-center gap-1"
          >
            <BarChart3 className="w-4 h-4" />
            {t('analytics')}
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!totalCount}
          className="flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          {t('exportCsv')}
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link
            href="/dashboard/notifications/preferences"
            className="flex items-center gap-1"
          >
            <Settings className="w-4 h-4" />
            {t('preferencesButton')}
          </Link>
        </Button>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <Check className="w-4 h-4 mr-1" />
            {infiniteScrollEnabled
              ? t('markLoadedAsRead')
              : t('markPageAsRead')}
          </Button>
        )}
      </div>
    </div>
  );
});

// Memoized Notifications List
const NotificationsList = React.memo(function NotificationsList({
  t,
  totalCount,
  currentLoading,
  currentNotifications,
  selectedNotifications,
  handleSelect,
  markAsRead,
  deleteNotification,
  isQuickFilterLoading,
  infiniteScrollEnabled,
  infiniteLoading,
  infiniteHasMore,
  loadMoreRef,
}: {
  t: any;
  totalCount: number;
  currentLoading: boolean;
  currentNotifications: Notification[];
  selectedNotifications: string[];
  handleSelect: (id: string, checked: boolean) => void;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => void;
  isQuickFilterLoading: boolean;
  infiniteScrollEnabled: boolean;
  infiniteLoading: boolean;
  infiniteHasMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="relative space-y-4">
      {/* Smooth loading overlay for quick filters */}
      {isQuickFilterLoading && currentNotifications.length > 0 && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-lg z-10 transition-all duration-300">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600">Actualizando...</span>
            </div>
          </div>
        </div>
      )}

      {totalCount === 0 && !currentLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BellOff className="w-16 h-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">
              {t('noNotifications')}
            </CardTitle>
            <CardDescription>{t('noNotificationsDescription')}</CardDescription>
          </CardContent>
        </Card>
      ) : currentNotifications.length === 0 && !currentLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BellOff className="w-16 h-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">
              {t('noMatchingFilters')}
            </CardTitle>
            <CardDescription>
              {t('noMatchingFiltersDescription')}
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            'space-y-4 transition-all duration-300',
            isQuickFilterLoading && 'opacity-90 scale-[0.99]',
          )}
        >
          {currentNotifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              isSelected={selectedNotifications.includes(n.id)}
              onSelect={handleSelect}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}
      {infiniteScrollEnabled && infiniteLoading && <InfiniteScrollSkeleton />}
      {infiniteScrollEnabled && infiniteHasMore && (
        <div ref={loadMoreRef} className="h-10" />
      )}
    </div>
  );
});

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const { filters, isQuickFilterLoading } = useNotificationFiltersStore();

  // State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
    pageSize: 20,
  });
  const [isFilteredFetch, setIsFilteredFetch] = useState(false);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const performanceModeRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Infinite scroll hook
  const {
    notifications: infiniteNotifications,
    loading: infiniteLoading,
    hasMore: infiniteHasMore,
    error: infiniteError,
    loadMore: infiniteLoadMore,
    refresh: infiniteRefresh,
    loadMoreRef,
  } = useInfiniteNotifications({
    userId: TEST_USER_ID,
    limit: pagination.pageSize,
    search: filters.search,
    types: filters.types.length > 0 ? filters.types : undefined,
    status: filters.status,
    dateFrom: filters.dateRange?.from,
    dateTo: filters.dateRange?.to,
    sortBy: filters.sortBy,
    enabled: infiniteScrollEnabled,
  });

  // Derived state
  const currentNotifications = useMemo(
    () => (infiniteScrollEnabled ? infiniteNotifications : notifications),
    [infiniteScrollEnabled, infiniteNotifications, notifications],
  );
  const currentLoading = useMemo(
    () => (infiniteScrollEnabled ? infiniteLoading : loading),
    [infiniteScrollEnabled, infiniteLoading, loading],
  );
  const currentError = useMemo(
    () => (infiniteScrollEnabled ? infiniteError : error),
    [infiniteScrollEnabled, infiniteError, error],
  );
  const unreadCount = useMemo(
    () => currentNotifications.filter((n) => !n.read).length,
    [currentNotifications],
  );
  const totalCount = useMemo(
    () =>
      infiniteScrollEnabled
        ? currentNotifications.length
        : pagination.totalCount,
    [infiniteScrollEnabled, currentNotifications.length, pagination.totalCount],
  );

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (targetFilters: NotificationFiltersType = filters, page = 1) => {
      if (infiniteScrollEnabled || !mountedRef.current) return;
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const hasActiveFilters =
          targetFilters.search ||
          targetFilters.types.length > 0 ||
          targetFilters.status !== 'all' ||
          targetFilters.dateRange ||
          targetFilters.sortBy !== 'newest';
        let endpoint =
          performanceModeRef.current && !hasActiveFilters
            ? 'getRecentNotifications'
            : hasActiveFilters
              ? 'getNotificationsWithFilters'
              : 'getNotifications';
        const limit = pagination.pageSize;
        const offset = (page - 1) * limit;
        let input: any = { userId: TEST_USER_ID, limit, offset };

        if (endpoint === 'getNotificationsWithFilters') {
          setIsFilteredFetch(true);
          input = {
            ...input,
            search: targetFilters.search || undefined,
            types:
              targetFilters.types.length > 0 ? targetFilters.types : undefined,
            status:
              targetFilters.status !== 'all' ? targetFilters.status : undefined,
            dateFrom: targetFilters.dateRange?.from?.toISOString(),
            dateTo: targetFilters.dateRange?.to?.toISOString(),
            sortBy: targetFilters.sortBy,
          };
        }

        const url = `http://localhost:3001/trpc/notification.${endpoint}?input=${encodeURIComponent(JSON.stringify(input))}`;
        const res = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();

        if (!mountedRef.current) return;

        if (endpoint === 'getRecentNotifications') {
          setNotifications(data.result.data || []);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalCount: (data.result.data || []).length,
            hasMore: false,
            pageSize: limit,
          });
        } else {
          const result = data.result.data;
          setNotifications(result.notifications || result);
          setPagination({
            currentPage: page,
            totalPages: Math.ceil((result.totalCount || result.total) / limit),
            totalCount: result.totalCount || result.total,
            hasMore: result.hasMore,
            pageSize: limit,
          });
        }
        setHasFetchedOnce(true);
      } catch (err: any) {
        if (err.name !== 'AbortError' && mountedRef.current)
          setError(err.message);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [filters, infiniteScrollEnabled, pagination.pageSize],
  );

  // Debounced fetch
  const debouncedFetch = useMemo(() => {
    let timer: NodeJS.Timeout;
    return (newFilters: NotificationFiltersType, page = 1, quick = false) => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          if (!infiniteScrollEnabled) fetchNotifications(newFilters, page);
        },
        quick ? 50 : 150,
      );
    };
  }, [fetchNotifications, infiniteScrollEnabled]);

  // Filter changes
  const handleFiltersChange = useCallback(
    (newFilters: NotificationFiltersType, quick = false) => {
      if (quick) return debouncedFetch(newFilters, 1, true);
      setIsTransitioning(true);
      startTransition(() => {
        debouncedFetch(newFilters, 1);
        setTimeout(() => setIsTransitioning(false), 100);
      });
    },
    [debouncedFetch],
  );

  // Page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (!infiniteScrollEnabled) {
        // Access current filters directly to avoid dependency issues
        const currentFilters = useNotificationFiltersStore.getState().filters;
        fetchNotifications(currentFilters, page);
      }
    },
    [infiniteScrollEnabled, fetchNotifications],
  );

  // Effects
  useEffect(() => {
    mountedRef.current = true;
    if (!infiniteScrollEnabled) {
      // Call fetchNotifications directly without dependencies to avoid infinite loops
      fetchNotifications(filters, 1);
    }
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [infiniteScrollEnabled, fetchNotifications, filters]); // Only depend on infiniteScrollEnabled

  // Toggle infinite scroll
  const toggleInfiniteScroll = useCallback(() => {
    setInfiniteScrollEnabled((v) => {
      const next = !v;
      if (next) {
        infiniteRefresh();
      } else {
        // Access current filters directly to avoid dependency issues
        const currentFilters = useNotificationFiltersStore.getState().filters;
        fetchNotifications(currentFilters, 1);
      }
      return next;
    });
  }, [infiniteRefresh, fetchNotifications]);

  // Actions
  const markAsRead = async (id: string) => {
    await fetch(
      `http://localhost:3001/trpc/notification.markAsRead?input=${encodeURIComponent(JSON.stringify({ notificationIds: [id] }))}`,
      { method: 'POST' },
    );
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };
  const markAllAsRead = async () => {
    const ids = currentNotifications.filter((n) => !n.read).map((n) => n.id);
    if (!ids.length) return;
    await fetch(
      `http://localhost:3001/trpc/notification.markAsRead?input=${encodeURIComponent(JSON.stringify({ notificationIds: ids }))}`,
      { method: 'POST' },
    );
    setNotifications((ns) =>
      ns.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)),
    );
  };
  const deleteNotification = (id: string) =>
    setNotifications((ns) => ns.filter((n) => n.id !== id));
  const handleSelect = (id: string, checked: boolean) =>
    setSelectedNotifications((s) =>
      checked ? [...s, id] : s.filter((i) => i !== id),
    );
  const handleBulkUpdate = () => {
    if (infiniteScrollEnabled) {
      infiniteRefresh();
    } else {
      // Access current state directly to avoid dependency issues
      const currentFilters = useNotificationFiltersStore.getState().filters;
      fetchNotifications(currentFilters, pagination.currentPage);
    }
    setSelectedNotifications([]);
  };
  const handleExport = () => {
    const rows = currentNotifications.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.message.replace(/"/g, '""'),
      status: n.read ? 'Read' : 'Unread',
      createdAt: new Date(n.createdAt).toLocaleString(),
      link: n.link || '',
    }));
    const csv = [
      ['ID', 'Type', 'Message', 'Status', 'Created At', 'Link'],
      ...rows.map((r) => [
        r.id,
        r.type,
        `"${r.message}"`,
        r.status,
        r.createdAt,
        r.link,
      ]),
    ]
      .map((r) => r.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notifications.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Render
  if (!hasFetchedOnce && currentLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <NotificationListSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {isFilteredFetch ? t('filteredResults') : t('allNotifications')} •{' '}
              {infiniteScrollEnabled
                ? `${currentNotifications.length} ${t('loaded')}${infiniteHasMore ? ` (${t('moreAvailable')})` : ''}`
                : `Page ${pagination.currentPage} of ${pagination.totalPages} • ${pagination.totalCount} ${t('total')}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm">
              <Zap className="w-4 h-4 inline mr-1" />
              {t('fastMode')}
            </Label>
            <Switch
              checked={performanceMode}
              onCheckedChange={(v) => {
                setPerformanceMode(v);
                performanceModeRef.current = v;
              }}
            />
          </div>
          <Badge
            variant="secondary"
            className={cn(
              'transition-all duration-200',
              isQuickFilterLoading && 'opacity-70',
            )}
          >
            {isQuickFilterLoading ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Bell className="w-4 h-4 mr-1" />
            )}
            {unreadCount} {t('unread')}{' '}
            {infiniteScrollEnabled ? t('loaded') : t('onPage')}
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link
              href="/dashboard/notifications/analytics"
              className="flex items-center gap-1"
            >
              <BarChart3 className="w-4 h-4" />
              {t('buttomAnalytics')}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!totalCount || currentLoading}
            className="flex items-center gap-1"
            title="Exportar notificaciones en formato CSV"
          >
            <Download className="w-4 h-4" />
            {t('exportCsv')}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href="/dashboard/notifications/preferences"
              className="flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              {t('preferencesButton')}
            </Link>
          </Button>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              title="Marcar todas las notificaciones como leídas"
            >
              <Check className="w-4 h-4 mr-1" />
              {infiniteScrollEnabled
                ? t('markLoadedAsRead')
                : t('markPageAsRead')}
            </Button>
          )}
          <Button
            onClick={() => {
              // Marcar notificaciones no leídas
              const unreadNotifications = currentNotifications.filter(
                (n) => n.read,
              );
              unreadNotifications.forEach((n) => {
                setNotifications((prev) =>
                  prev.map((notification) =>
                    notification.id === n.id
                      ? { ...notification, read: false }
                      : notification,
                  ),
                );
              });
            }}
            variant="outline"
            size="sm"
            disabled={unreadCount === currentNotifications.length}
            title="Marcar notificaciones como no leídas"
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <Bell className="w-4 h-4 mr-1" />
            Marcar como no leídas
          </Button>
        </div>
      </div>

      <NotificationFilters
        onFiltersChange={handleFiltersChange}
        totalCount={totalCount}
        filteredCount={currentNotifications.length}
      />
      {currentNotifications.length > 0 && (
        <BulkActions
          userId={TEST_USER_ID}
          notifications={currentNotifications.map((n) => ({
            id: n.id,
            type: n.type,
            title: n.message,
            message: n.message,
            read: n.read,
            createdAt: new Date(n.createdAt),
          }))}
          selectedNotifications={selectedNotifications}
          onSelectionChange={setSelectedNotifications}
          onNotificationsUpdate={handleBulkUpdate}
        />
      )}
      {currentLoading &&
        currentNotifications.length > 0 &&
        !infiniteScrollEnabled && (
          <div className="flex items-center justify-center py-4 mb-4">
            <NotificationSkeleton count={2} />
          </div>
        )}

      <div className="relative space-y-4">
        {/* Smooth loading overlay for quick filters */}
        {isQuickFilterLoading && currentNotifications.length > 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-lg z-10 transition-all duration-300">
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-lg">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">Actualizando...</span>
              </div>
            </div>
          </div>
        )}

        {/* Regular loading overlay for complex operations */}
        {currentLoading && hasFetchedOnce && !isQuickFilterLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <NotificationSkeleton count={2} />
          </div>
        )}

        {totalCount === 0 && !currentLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BellOff className="w-16 h-16 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">
                {t('noNotifications')}
              </CardTitle>
              <CardDescription>
                {t('noNotificationsDescription')}
              </CardDescription>
            </CardContent>
          </Card>
        ) : currentNotifications.length === 0 && !currentLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BellOff className="w-16 h-16 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">
                {t('noMatchingFilters')}
              </CardTitle>
              <CardDescription>
                {t('noMatchingFiltersDescription')}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div
            className={cn(
              'space-y-4 transition-all duration-300',
              isQuickFilterLoading && 'opacity-90 scale-[0.99]',
            )}
          >
            {currentNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                isSelected={selectedNotifications.includes(n.id)}
                onSelect={handleSelect}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
        {infiniteScrollEnabled && infiniteLoading && <InfiniteScrollSkeleton />}
        {infiniteScrollEnabled && infiniteHasMore && (
          <div ref={loadMoreRef} className="h-10" />
        )}
      </div>

      {currentError && (
        <Card className="mt-4">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-red-600 mb-4">Error: {currentError}</p>
            <Button
              onClick={() =>
                infiniteScrollEnabled
                  ? infiniteRefresh()
                  : fetchNotifications(filters, pagination.currentPage)
              }
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {!infiniteScrollEnabled && totalCount > 0 && (
        <div className="mt-6">
          <EnhancedPagination
            pagination={pagination}
            loading={currentLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={(size) => {
              setPagination((p) => ({ ...p, pageSize: size }));
              fetchNotifications(filters, 1);
            }}
            infiniteScrollEnabled={infiniteScrollEnabled}
            onInfiniteScrollToggle={toggleInfiniteScroll}
          />
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={toggleInfiniteScroll}>
          {infiniteScrollEnabled
            ? 'Switch to Traditional Pagination'
            : 'Switch to Infinite Scroll'}
        </Button>
      </div>
    </div>
  );
}
