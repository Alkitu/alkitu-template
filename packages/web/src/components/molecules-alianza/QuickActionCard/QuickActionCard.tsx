/**
 * QuickActionCard - Quick action card with icon
 * Atomic Design: Molecule
 *
 * @example
 * // As link
 * <QuickActionCard
 *   icon={Plus}
 *   label="New Request"
 *   description="Create a new service request"
 *   href="/requests/new"
 *   iconColor="success"
 * />
 *
 * // As button with badge
 * <QuickActionCard
 *   icon={Bell}
 *   label="Notifications"
 *   badge={5}
 *   onClick={() => openNotifications()}
 *   iconColor="info"
 * />
 *
 * // Loading state
 * <QuickActionCard
 *   icon={Save}
 *   label="Saving..."
 *   loading
 * />
 */

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/molecules-alianza/Card';
import { Badge } from '@/components/atoms-alianza/Badge';
import { Spinner } from '@/components/atoms-alianza/Spinner';
import type { QuickActionCardProps } from './QuickActionCard.types';

/**
 * Icon background color mapping
 */
const iconBgColors = {
  primary: 'bg-primary/10',
  secondary: 'bg-secondary/10',
  success: 'bg-green-100 dark:bg-green-900/20',
  warning: 'bg-orange-100 dark:bg-orange-900/20',
  error: 'bg-red-100 dark:bg-red-900/20',
  info: 'bg-blue-100 dark:bg-blue-900/20',
} as const;

/**
 * Icon text color mapping
 */
const iconTextColors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-600 dark:text-orange-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
} as const;

export function QuickActionCard({
  icon: Icon,
  label,
  description,
  subtitle,
  href,
  onClick,
  variant = 'default',
  iconColor = 'primary',
  customIconColor,
  badge,
  badgePosition = 'top-right',
  loading = false,
  disabled = false,
  asChild = false,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  'aria-disabled': ariaDisabled,
  ...rest
}: QuickActionCardProps) {
  const isPrimary = variant === 'primary';

  // Icon styling
  const iconBgClass = customIconColor
    ? // Extract color from custom class for background
      customIconColor.includes('blue')
      ? iconBgColors.info
      : customIconColor.includes('green')
        ? iconBgColors.success
        : customIconColor.includes('purple')
          ? 'bg-purple-100 dark:bg-purple-900/20'
          : customIconColor.includes('orange')
            ? iconBgColors.warning
            : customIconColor.includes('red')
              ? iconBgColors.error
              : iconBgColors.primary
    : iconBgColors[iconColor];

  const iconColorClass = customIconColor || iconTextColors[iconColor];

  // Card styling
  const cardClass = cn(
    'relative p-6 transition-all cursor-pointer',
    'hover:shadow-lg hover:scale-[1.02]',
    isPrimary && 'border-primary/20 hover:border-primary/40',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  // Content rendering
  const content = (
    <Card className={cardClass} data-testid={dataTestId} {...rest}>
      {/* Badge */}
      {badge && !loading && (
        <div
          className={cn(
            'absolute',
            badgePosition === 'top-right' ? 'top-2 right-2' : 'top-2 left-2'
          )}
        >
          {typeof badge === 'number' || typeof badge === 'string' ? (
            <Badge variant="primary" size="sm">
              {badge}
            </Badge>
          ) : (
            badge
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div
          className={cn(
            'h-12 w-12 rounded-[var(--radius-card)] flex items-center justify-center flex-shrink-0',
            iconBgClass
          )}
        >
          {loading ? (
            <Spinner size="md" variant="primary" aria-label="Loading" />
          ) : (
            <Icon className={cn('h-6 w-6', iconColorClass)} aria-hidden="true" />
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {subtitle && (
            <p className="text-sm font-medium text-muted-foreground mb-0.5">
              {subtitle}
            </p>
          )}
          <p className="text-lg font-semibold truncate">{label}</p>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  // Render as link if href is provided and not disabled (href takes precedence over onClick)
  if (href && !disabled) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel || label}
        tabIndex={0}
      >
        {content}
      </Link>
    );
  }

  // Render as button if onClick is provided and not disabled (and no href)
  if (onClick && !disabled) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        aria-label={ariaLabel || label}
      >
        {content}
      </div>
    );
  }

  // Render as static card (disabled or no interaction)
  return (
    <div
      aria-label={ariaLabel || label}
      aria-disabled={disabled || ariaDisabled}
      tabIndex={-1}
    >
      {content}
    </div>
  );
}
