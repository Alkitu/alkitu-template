'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface IconProps {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  
  /**
   * Icon size preset
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /**
   * Custom size in pixels (overrides size preset)
   */
  customSize?: number;
  
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted' | 'destructive' | 'warning' | 'success';
  
  /**
   * Custom color (overrides variant)
   */
  customColor?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Accessibility label
   */
  'aria-label'?: string;
}

/**
 * Icon Atom Component
 * Provides consistent icon rendering with theme integration
 * Supports Lucide icons with size presets and color variants
 */
export function Icon({
  icon: IconComponent,
  size = 'md',
  customSize,
  variant = 'default',
  customColor,
  className = '',
  style = {},
  onClick,
  'aria-label': ariaLabel,
  ...props
}: IconProps) {
  // Size mapping (in pixels)
  const getSizeValue = (): number => {
    if (customSize) return customSize;
    
    const sizeMap = {
      'xs': 12,
      'sm': 16,
      'md': 20,
      'lg': 24,
      'xl': 28,
      '2xl': 32
    };
    
    return sizeMap[size];
  };

  // Color variant class mapping (use CSS classes instead of direct color)
  const getColorClass = (): string => {
    if (customColor) return ''; // Use direct color only when custom color is provided

    switch (variant) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-secondary';
      case 'accent':
        return 'text-accent';
      case 'muted':
        return 'text-muted-foreground';
      case 'destructive':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      case 'success':
        return 'text-success';
      case 'default':
      default:
        return 'text-foreground';
    }
  };

  const iconSize = getSizeValue();
  const colorClass = getColorClass();

  return (
    <IconComponent
      size={iconSize}
      color={customColor} // Only use direct color for custom colors
      className={`icon-atom ${colorClass} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      style={{
        flexShrink: 0, // Prevent icon from shrinking in flex containers
        ...style
      }}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    />
  );
}

export default Icon;