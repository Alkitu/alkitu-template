/**
 * AdminUserDistributionCard - User distribution by role with progress bars
 * Atomic Design: Organism
 *
 * @example
 * <AdminUserDistributionCard
 *   title="User Distribution"
 *   subtitle="By role type"
 *   roles={[
 *     { label: 'Clients', count: 80, color: 'green' },
 *     { label: 'Employees', count: 50, color: 'purple' },
 *     { label: 'Admins', count: 5, color: 'red' }
 *   ]}
 *   totalUsers={135}
 *   isLoading={false}
 * />
 */

import { Card } from '@/components/primitives/Card';
import { Users } from 'lucide-react';
import { AdminUserDistributionCardProps } from './AdminUserDistributionCard.types';

const colorMap: Record<string, string> = {
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
};

export function AdminUserDistributionCard({
  title,
  subtitle,
  roles,
  totalUsers,
  isLoading,
}: AdminUserDistributionCardProps) {
  const calculatePercentage = (count: number): number => {
    return totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
          <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-3">
        {roles.map((role, index) => {
          const percentage = calculatePercentage(role.count);
          const colorClass = colorMap[role.color] || 'bg-gray-500';

          return (
            <div key={`${role.label}-${index}`} className="flex items-center justify-between">
              <span className="text-sm">{role.label}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  {isLoading ? (
                    <div className="animate-pulse h-full bg-muted"></div>
                  ) : (
                    <div
                      className={`h-full ${colorClass}`}
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                </div>
                {isLoading ? (
                  <div className="animate-pulse h-4 bg-muted rounded w-12"></div>
                ) : (
                  <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
