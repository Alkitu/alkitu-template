'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/molecules-alianza/Card';
import { Badge } from '@/components/atoms-alianza/Badge';
import type { StatCardProps, TrendDirection } from './StatCard.types';

/**
 * StatCard - Statistical Information Card
 * Atomic Design: Molecule
 *
 * A card component for displaying key metrics and statistics with trend indicators,
 * icons, and comparison data. Perfect for dashboard views and analytics displays.
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Total Users"
 *   value={1234}
 *   icon={Users}
 *   trend="+12%"
 *   trendDirection="up"
 *   comparison="vs last month"
 *   formatNumber
 * />
 * ```
 */
export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      icon: Icon,
      iconColor = 'text-primary',
      subtitle,
      trend,
      trendDirection,
      comparison,
      isLoading = false,
      variant = 'default',
      badge,
      badgeVariant = 'default',
      formatNumber = false,
      decimals = 1,
      onClick,
      clickable = false,
      chart,
      className,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    // Determine if card should be clickable
    const isClickable = clickable || !!onClick;

    // Format number if enabled and value is numeric
    const formatValue = (val: number | string): string => {
      if (!formatNumber || typeof val === 'string') {
        return String(val);
      }

      const num = Number(val);
      if (isNaN(num)) return String(val);

      const abs = Math.abs(num);
      const sign = num < 0 ? '-' : '';

      if (abs >= 1_000_000_000) {
        return `${sign}${(abs / 1_000_000_000).toFixed(decimals)}B`;
      }
      if (abs >= 1_000_000) {
        return `${sign}${(abs / 1_000_000).toFixed(decimals)}M`;
      }
      if (abs >= 1_000) {
        return `${sign}${(abs / 1_000).toFixed(decimals)}K`;
      }
      return String(num);
    };

    // Get trend icon based on direction
    const getTrendIcon = (direction?: TrendDirection) => {
      switch (direction) {
        case 'up':
          return <ArrowUp className="h-4 w-4" aria-label="Trending up" />;
        case 'down':
          return <ArrowDown className="h-4 w-4" aria-label="Trending down" />;
        case 'neutral':
          return <Minus className="h-4 w-4" aria-label="Neutral trend" />;
        default:
          return null;
      }
    };

    // Get trend color based on direction
    const getTrendColor = (direction?: TrendDirection) => {
      switch (direction) {
        case 'up':
          return 'text-success';
        case 'down':
          return 'text-error';
        case 'neutral':
          return 'text-muted-foreground';
        default:
          return 'text-primary';
      }
    };

    // Variant-based styling
    const variantClasses = {
      default: '',
      success: 'border-l-4 border-l-success',
      warning: 'border-l-4 border-l-warning',
      error: 'border-l-4 border-l-error',
      neutral: 'border-l-4 border-l-muted',
    }[variant];

    const displayValue = formatValue(value);

    return (
      <Card
        ref={ref}
        variant="default"
        padding="md"
        className={cn(
          'transition-all duration-200',
          variantClasses,
          isClickable && [
            'cursor-pointer',
            'hover:shadow-md',
            'hover:scale-[1.02]',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
          ],
          className,
        )}
        onClick={onClick}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? 'button' : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        data-testid={dataTestId}
        data-variant={variant}
        data-clickable={isClickable}
        {...props}
      >
        {/* Header: Label + Icon + Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
            {badge && (
              <Badge variant={badgeVariant} size="sm" data-testid="stat-card-badge">
                {badge}
              </Badge>
            )}
          </div>
          <Icon className={cn('h-5 w-5', iconColor)} aria-hidden="true" />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3">
            <div
              className="animate-pulse h-9 bg-muted rounded w-24"
              data-testid="stat-card-skeleton"
            />
            {(trend || subtitle) && (
              <div className="animate-pulse h-4 bg-muted rounded w-32" />
            )}
          </div>
        ) : (
          <>
            {/* Value */}
            <p className="text-3xl font-bold mb-1" data-testid="stat-card-value">
              {displayValue}
            </p>

            {/* Trend + Comparison */}
            {(trend || trendDirection) && (
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium',
                  getTrendColor(trendDirection),
                )}
                data-testid="stat-card-trend"
              >
                {getTrendIcon(trendDirection)}
                {trend && <span>{trend}</span>}
              </div>
            )}

            {/* Comparison */}
            {comparison && (
              <p
                className="text-xs text-muted-foreground mt-1"
                data-testid="stat-card-comparison"
              >
                {comparison}
              </p>
            )}

            {/* Subtitle */}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-2" data-testid="stat-card-subtitle">
                {subtitle}
              </p>
            )}

            {/* Chart/Sparkline */}
            {chart && (
              <div className="mt-4" data-testid="stat-card-chart">
                {chart}
              </div>
            )}
          </>
        )}
      </Card>
    );
  },
);

StatCard.displayName = 'StatCard';

export default StatCard;
