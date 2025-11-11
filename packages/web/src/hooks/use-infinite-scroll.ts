'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  rootMargin?: string; // Intersection observer root margin
  enabled?: boolean; // Whether infinite scroll is enabled
}

interface UseInfiniteScrollReturn {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
}

export function useInfiniteScroll({
  threshold = 100,
  rootMargin = '0px',
  enabled = true,
}: UseInfiniteScrollOptions = {}): UseInfiniteScrollReturn {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold: 0.1,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enabled, rootMargin]);

  return {
    loadMoreRef,
    isIntersecting,
  };
}

interface UseInfiniteNotificationsOptions {
  userId: string;
  limit?: number;
  search?: string;
  types?: string[];
  status?: 'all' | 'read' | 'unread';
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'newest' | 'oldest' | 'type';
  enabled?: boolean;
}

interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseInfiniteNotificationsReturn {
  notifications: NotificationItem[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteNotifications({
  userId,
  limit = 20,
  search,
  types,
  status,
  dateFrom,
  dateTo,
  sortBy,
  enabled = true,
}: UseInfiniteNotificationsOptions): UseInfiniteNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  const { loadMoreRef, isIntersecting } = useInfiniteScroll({
    enabled: enabled && hasMore && !loading,
  });

  const fetchNotifications = useCallback(
    async (reset = false) => {
      if (!enabled || (!reset && !hasMore) || loading) return;

      try {
        setLoading(true);
        setError(null);

        const params = {
          userId,
          cursor: reset ? undefined : cursor,
          limit,
          search,
          types,
          status: status !== 'all' ? status : undefined,
          dateFrom: dateFrom?.toISOString(),
          dateTo: dateTo?.toISOString(),
          sortBy,
        };

        const encodedInput = encodeURIComponent(JSON.stringify(params));
        const response = await fetch(
          `http://localhost:3001/trpc/notification.getNotificationsWithCursor?input=${encodedInput}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        const result = data.result.data;

        if (reset) {
          setNotifications(result.notifications || []);
        } else {
          setNotifications((prev) => [
            ...prev,
            ...(result.notifications || []),
          ]);
        }

        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    },
    [
      enabled,
      hasMore,
      loading,
      userId,
      cursor,
      limit,
      search,
      types,
      status,
      dateFrom,
      dateTo,
      sortBy,
    ],
  );

  const loadMore = useCallback(() => {
    fetchNotifications(false);
  }, [fetchNotifications]);

  const refresh = useCallback(() => {
    setCursor(null);
    setHasMore(true);
    fetchNotifications(true);
  }, [fetchNotifications]);

  // Load more when intersecting
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  // Use a ref to track previous options to prevent unnecessary refetches
  const previousOptionsRef = useRef<string>('');
  
  // Initial load and refresh when dependencies change
  useEffect(() => {
    const currentOptions = JSON.stringify({
      userId,
      search,
      types,
      status,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
      sortBy,
    });
    
    // Only refetch if options actually changed
    if (previousOptionsRef.current !== currentOptions) {
      setCursor(null);
      setHasMore(true);
      fetchNotifications(true);
      previousOptionsRef.current = currentOptions;
    }
  }, [userId, search, types, status, dateFrom, dateTo, sortBy, fetchNotifications]);

  return {
    notifications,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    loadMoreRef,
  };
}
