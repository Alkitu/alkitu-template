import { Icons, IconKeys } from '@/components/primitives/icons';
import { cn } from '@/lib/utils';
import React from 'react';
import type { IconProps, IconSize, IconVariant } from './Icon.types';

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const variantClasses: Record<IconVariant, string> = {
  default: 'text-current',
  primary: 'text-primary',
  secondary: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  variant = 'default',
  color,
  className,
  'aria-label': ariaLabel,
  useSystemColors = true,
  themeOverride,
  ...props
}) => {
  // Handle both "iconName" and "iconNameIcon" formats
  const iconKey = (name.endsWith('Icon') ? name : `${name}Icon`) as IconKeys;
  const LucideIcon = Icons[iconKey];

  if (!LucideIcon) {
    console.warn(
      `Icon "${name}" (looking for "${iconKey}") not found in Icons collection`,
    );
    return null;
  }

  const iconSize = sizeMap[size];
  const variantClass = useSystemColors ? variantClasses[variant] : '';

  return (
    <LucideIcon
      size={iconSize}
      color={color}
      className={cn(variantClass, className)}
      aria-label={ariaLabel || name}
      style={themeOverride}
      {...props}
    />
  );
};

export default Icon;
