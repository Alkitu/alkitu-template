'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Icons, IconKeys } from '@/components/primitives/icons';
import { cn } from '@/lib/utils';
import type { IconProps, IconSize, IconVariant, IconSizeMap, IconVariantMap } from './Icon.types';

/**
 * Icon - Atomic Design Atom
 *
 * Universal icon component that wraps Lucide React icons with consistent sizing,
 * theming, and accessibility features.
 *
 * Features:
 * - 6 size presets (xs to 2xl) with pixel-perfect dimensions
 * - 6 color variants (default, primary, secondary, success, warning, error)
 * - Dark mode support with automatic color adjustments
 * - Loading state with spinner
 * - Full accessibility support (aria-label, aria-hidden)
 * - Interactive mode with click handlers
 * - Custom color override support
 * - Theme integration with CSS variables
 * - Supports all 100+ Lucide icons
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Icon name="heart" size="md" variant="primary" />
 *
 * // With custom color
 * <Icon name="star" color="#FFD700" />
 *
 * // Loading state
 * <Icon name="check" loading />
 *
 * // Interactive icon
 * <Icon
 *   name="trash"
 *   variant="error"
 *   onClick={() => handleDelete()}
 *   aria-label="Delete item"
 * />
 *
 * // Decorative icon
 * <Icon name="sparkles" aria-hidden />
 * ```
 */

const sizeMap: IconSizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
};

const variantClasses: IconVariantMap = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-muted-foreground',
  muted: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
};

export const Icon = React.forwardRef<HTMLElement, IconProps>(
  (
    {
      name,
      component,
      size = 'md',
      variant = 'default',
      color,
      className,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      useSystemColors = true,
      themeOverride,
      loading = false,
      onClick,
      role,
      tabIndex,
      'data-testid': dataTestId,
      position: _position,
      ...props
    },
    ref
  ) => {
    // Show spinner when loading
    if (loading) {
      const iconSize = sizeMap[size];
      const variantClass = useSystemColors ? variantClasses[variant] : '';

      return (
        <Loader2
          ref={ref as any}
          size={iconSize}
          color={color}
          className={cn(variantClass, 'animate-spin', className)}
          aria-label={ariaLabel || 'Loading'}
          aria-hidden={ariaHidden as boolean | undefined}
          data-testid={dataTestId}
          style={themeOverride}
        />
      );
    }

    // Resolve the icon: either from direct component or name lookup
    let LucideIcon: React.ComponentType<any> | undefined = component;

    if (!LucideIcon && name) {
      let normalizedName = name.endsWith('Icon') ? name : `${name}Icon`;
      normalizedName = normalizedName.charAt(0).toLowerCase() + normalizedName.slice(1);
      const iconKey = normalizedName as IconKeys;
      LucideIcon = Icons[iconKey];

      if (!LucideIcon) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `Icon "${name}" (looking for "${iconKey}") not found in Icons collection. Available icons: ${Object.keys(Icons).join(', ')}`
          );
        }
        return null;
      }
    }

    if (!LucideIcon) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Icon: either "name" or "component" prop must be provided');
      }
      return null;
    }

    const iconSize = sizeMap[size];
    const variantClass = useSystemColors ? variantClasses[variant] : '';

    const composedClassName = cn(
      variantClass,
      {
        'cursor-pointer': onClick,
        'hover:opacity-80 transition-opacity': onClick,
      },
      className
    );

    // Wrap in a container for interactive icons to support tabIndex and keyboard events
    if (onClick) {
      return (
        <span
          ref={ref as any}
          role={role || 'button'}
          tabIndex={tabIndex !== undefined ? tabIndex : 0}
          onClick={onClick}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
          aria-label={ariaLabel || name || 'icon'}
          aria-hidden={ariaHidden as boolean | undefined}
          data-testid={dataTestId}
          className="inline-flex items-center justify-center outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[var(--radius-tooltip)]"
        >
          <LucideIcon
            size={iconSize}
            color={color}
            className={composedClassName}
            style={themeOverride}
          />
        </span>
      );
    }

    return (
      <LucideIcon
        ref={ref as any}
        size={iconSize}
        color={color}
        className={composedClassName}
        aria-label={ariaLabel || name}
        aria-hidden={ariaHidden as boolean | undefined}
        role={role}
        data-testid={dataTestId}
        style={themeOverride}
      />
    );
  }
);

Icon.displayName = 'Icon';

export default Icon;
