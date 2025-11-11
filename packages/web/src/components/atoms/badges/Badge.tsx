import { cn } from '@/lib/utils';
import React from 'react';
import type { BadgeProps, BadgeVariant, BadgeSize } from './Badge.types';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  outline: 'border border-input bg-background text-foreground',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  themeOverride,
  useSystemColors = true,
  ...props
}) => {
  const variantClass = useSystemColors ? variantClasses[variant] : '';
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={cn(baseClasses, variantClass, sizeClass, className)}
      style={themeOverride}
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;