'use client';

import { Card, CardContent, CardHeader } from '@/components/atomic-design/molecules/Card';
import { Skeleton } from '@/components/ui/skeleton';

interface NotificationSkeletonProps {
  count?: number;
}

export function NotificationSkeleton({ count = 5 }: NotificationSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Checkbox skeleton */}
                <Skeleton className="h-4 w-4" />

                {/* Unread indicator */}
                <Skeleton className="h-2 w-2 rounded-full" />

                {/* Type badge */}
                <Skeleton className="h-6 w-16" />

                {/* Date */}
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="flex items-center gap-1">
                {/* Action buttons */}
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Message content */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function NotificationListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      {/* Filters skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-36" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications skeleton */}
      <NotificationSkeleton count={5} />

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

export function InfiniteScrollSkeleton() {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <NotificationSkeleton count={3} />
    </div>
  );
}
