/**
 * AdminRecentActivityCard - Recent activity card with progress bar
 * Atomic Design: Organism
 *
 * @example
 * <AdminRecentActivityCard
 *   title="Recent Activity"
 *   subtitle="Last 30 days"
 *   newUsersLabel="New users"
 *   newUsersCount={12}
 *   totalUsers={150}
 *   isLoading={false}
 * />
 */

import { Card } from '@/components/primitives/ui/card';
import { TrendingUp } from 'lucide-react';
import { AdminRecentActivityCardProps } from './AdminRecentActivityCard.types';

export function AdminRecentActivityCard({
  title,
  subtitle,
  newUsersLabel,
  newUsersCount,
  totalUsers,
  isLoading,
}: AdminRecentActivityCardProps) {
  const percentage = totalUsers > 0 ? Math.min((newUsersCount / totalUsers) * 100, 100) : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{newUsersLabel}</span>
          {isLoading ? (
            <div className="animate-pulse h-6 bg-muted rounded w-8"></div>
          ) : (
            <span className="text-lg font-semibold">{newUsersCount}</span>
          )}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
