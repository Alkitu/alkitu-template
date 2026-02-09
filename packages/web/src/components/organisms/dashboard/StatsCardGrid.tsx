/**
 * StatsCardGrid - Grid of stat cards
 * Atomic Design: Organism
 *
 * @example
 * <StatsCardGrid
 *   stats={[
 *     { label: 'Active', value: 12, icon: Clock, iconColor: 'text-orange-500', subtitle: 'In progress' },
 *     { label: 'Completed', value: 45, icon: CheckCircle, iconColor: 'text-green-500' }
 *   ]}
 *   isLoading={false}
 *   columns={3}
 * />
 */

import { StatCard } from '@/components/molecules-alianza/StatCard';
import { StatsCardGridProps } from './StatsCardGrid.types';

export function StatsCardGrid({
  stats,
  isLoading,
  columns,
  className = '',
}: StatsCardGridProps) {
  const gridCols = columns
    ? `grid-cols-1 md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`
    : 'grid-cols-1 md:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-6 mb-8 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={`${stat.label}-${index}`}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          subtitle={stat.subtitle}
          trend={stat.trend}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
