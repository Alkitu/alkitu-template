'use client';

import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AlertProps } from './Alert.types';

/**
 * Alert - Atomic Design Atom
 *
 * Displays contextual information to users with different severity levels.
 * Supports multiple variants (info, success, warning, error), optional icons,
 * titles, and dismissible functionality.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Success!">
 *   Your changes have been saved.
 * </Alert>
 * ```
 *
 * @example
 * ```tsx
 * <Alert variant="error" dismissible onDismiss={() => console.log('dismissed')}>
 *   Something went wrong!
 * </Alert>
 * ```
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      variant = 'default',
      title,
      icon: CustomIcon,
      showIcon = true,
      dismissible = false,
      onDismiss,
      size = 'md',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // Get variant configuration with icon and styles
    const getVariantConfig = () => {
      switch (variant) {
        case 'info':
          return {
            icon: Info,
            containerClasses: 'bg-primary/10 border-primary',
            iconClasses: 'text-primary',
            textClasses: 'text-foreground',
          };
        case 'success':
          return {
            icon: CheckCircle,
            containerClasses: 'bg-success/10 border-success',
            iconClasses: 'text-success',
            textClasses: 'text-foreground',
          };
        case 'warning':
          return {
            icon: AlertTriangle,
            containerClasses: 'bg-warning/10 border-warning',
            iconClasses: 'text-warning',
            textClasses: 'text-foreground',
          };
        case 'error':
          return {
            icon: AlertCircle,
            containerClasses: 'bg-destructive/10 border-destructive',
            iconClasses: 'text-destructive',
            textClasses: 'text-foreground',
          };
        default:
          return {
            icon: Info,
            containerClasses: 'bg-muted border-border',
            iconClasses: 'text-muted-foreground',
            textClasses: 'text-foreground',
          };
      }
    };

    // Get size configuration
    const getSizeConfig = () => {
      switch (size) {
        case 'sm':
          return {
            padding: 'p-3',
            gap: 'gap-2',
            fontSize: 'text-sm',
            iconSize: 16,
          };
        case 'lg':
          return {
            padding: 'p-5',
            gap: 'gap-3',
            fontSize: 'text-base',
            iconSize: 20,
          };
        default: // md
          return {
            padding: 'p-4',
            gap: 'gap-2.5',
            fontSize: 'text-sm',
            iconSize: 16,
          };
      }
    };

    const variantConfig = getVariantConfig();
    const sizeConfig = getSizeConfig();
    const IconComponent = CustomIcon || variantConfig.icon;

    // Handle dismiss
    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          // Base styles
          'relative flex items-start rounded-[var(--radius-card)] border',
          // Variant styles
          variantConfig.containerClasses,
          variantConfig.textClasses,
          // Size styles
          sizeConfig.padding,
          sizeConfig.gap,
          sizeConfig.fontSize,
          // User classes
          className,
        )}
        style={style}
        {...props}
      >
        {/* Icon */}
        {showIcon && IconComponent && (
          <div className="flex-shrink-0">
            <IconComponent
              size={sizeConfig.iconSize}
              className={variantConfig.iconClasses}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <div className={cn('font-semibold mb-1', sizeConfig.fontSize)}>
              {title}
            </div>
          )}
          <div className="leading-relaxed">{children}</div>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 hover:opacity-70 transition-opacity',
              'bg-transparent border-0 p-0.5 cursor-pointer rounded',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              variantConfig.iconClasses,
            )}
            aria-label="Dismiss alert"
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';

/**
 * AlertDescription - Sub-component for Alert content
 * Maintains compatibility with shadcn/ui patterns
 */
export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('text-sm leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  );
});

AlertDescription.displayName = 'AlertDescription';

export default Alert;
