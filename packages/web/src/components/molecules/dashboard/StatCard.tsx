/**
 * StatCard - Statistical information card
 * Atomic Design: Molecule
 *
 * @example
 * <StatCard
 *   label="Solicitudes Activas"
 *   value={12}
 *   icon={Clock}
 *   iconColor="text-orange-500"
 *   subtitle="En proceso o pendientes"
 *   isLoading={false}
 * />
 */

import { Card } from '@/components/primitives/Card';
import { StatCardProps } from './StatCard.types';

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  subtitle,
  trend,
  isLoading = false,
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>

      {isLoading ? (
        <div className="animate-pulse h-8 bg-muted rounded w-16"></div>
      ) : (
        <>
          <p className="text-3xl font-bold">{value}</p>
          {trend && <p className="text-sm font-medium text-primary mt-1">{trend}</p>}
        </>
      )}

      {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
    </Card>
  );
}
