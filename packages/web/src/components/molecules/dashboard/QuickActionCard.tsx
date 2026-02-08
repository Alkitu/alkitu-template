/**
 * QuickActionCard - Reusable quick action card
 * Atomic Design: Molecule
 *
 * @example
 * <QuickActionCard
 *   icon={Plus}
 *   label="Nueva Solicitud"
 *   href="/client/requests/new"
 *   variant="primary"
 * />
 *
 * <QuickActionCard
 *   icon={ClipboardList}
 *   label="Solicitudes"
 *   subtitle="Mis"
 *   href="/client/requests"
 *   iconColor="text-blue-600 dark:text-blue-400"
 * />
 */

import Link from 'next/link';
import { Card } from '@/components/primitives/Card';
import { QuickActionCardProps } from './QuickActionCard.types';

export function QuickActionCard({
  icon: Icon,
  label,
  subtitle,
  href,
  variant = 'default',
  iconColor,
}: QuickActionCardProps) {
  const isPrimary = variant === 'primary';

  const iconBgClass = isPrimary
    ? 'bg-primary/10'
    : iconColor
      ? iconColor.includes('blue')
        ? 'bg-blue-100 dark:bg-blue-900/20'
        : iconColor.includes('green')
          ? 'bg-green-100 dark:bg-green-900/20'
          : iconColor.includes('purple')
            ? 'bg-purple-100 dark:bg-purple-900/20'
            : iconColor.includes('orange')
              ? 'bg-orange-100 dark:bg-orange-900/20'
              : 'bg-primary/10'
      : 'bg-primary/10';

  const iconColorClass = isPrimary ? 'text-primary' : iconColor || 'text-primary';

  const cardClass = isPrimary
    ? 'p-6 hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40'
    : 'p-6 hover:shadow-lg transition-shadow cursor-pointer';

  return (
    <Link href={href}>
      <Card className={cardClass}>
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 ${iconBgClass} rounded-lg flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColorClass}`} />
          </div>
          <div>
            {subtitle && (
              <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
            )}
            <p className="text-lg font-semibold">{label}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
