'use client';

import React from 'react';
import { Icon } from '../atoms/Icon';
import { X } from 'lucide-react';

export interface ChipMoleculeProps {
  /**
   * Chip content/label
   */
  children: React.ReactNode;
  
  /**
   * Visual variant
   */
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'destructive' | 'warning' | 'success' | 'outline';
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether chip is removable
   */
  removable?: boolean;
  
  /**
   * Whether chip is selected/active
   */
  selected?: boolean;
  
  /**
   * Whether chip is disabled
   */
  disabled?: boolean;
  
  /**
   * Icon to display at the start
   */
  startIcon?: React.ComponentType<any>;
  
  /**
   * Icon to display at the end (before remove button if removable)
   */
  endIcon?: React.ComponentType<any>;
  
  /**
   * Avatar/image to display at the start
   */
  avatar?: React.ReactNode;
  
  /**
   * Click handler for the chip
   */
  onClick?: () => void;
  
  /**
   * Remove handler (only works if removable=true)
   */
  onRemove?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

/**
 * ChipMolecule Component
 * Compact elements that represent input, attribute, or action
 * Combines Icon atoms with typography and interaction logic
 * Can be clickable, removable, and have icons or avatars
 */
export function ChipMolecule({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  selected = false,
  disabled = false,
  startIcon: StartIcon,
  endIcon: EndIcon,
  avatar,
  onClick,
  onRemove,
  className = '',
  style = {},
  ...props
}: ChipMoleculeProps) {
  // Get variant styles using only CSS variables
  const getVariantStyles = () => {
    const baseStyles = {
      transition: 'all 0.15s ease-in-out',
      cursor: onClick && !disabled ? 'pointer' : 'default',
      opacity: disabled ? 0.6 : 1,
      pointerEvents: disabled ? 'none' as const : 'auto' as const,
    };

    if (selected) {
      switch (variant) {
        case 'primary':
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            border: '1px solid var(--color-primary)',
          };
        case 'secondary':
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-secondary-foreground)',
            border: '1px solid var(--color-secondary)',
          };
        case 'accent':
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-foreground)',
            border: '1px solid var(--color-accent)',
          };
        case 'destructive':
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-destructive)',
            color: 'var(--color-destructive-foreground)',
            border: '1px solid var(--color-destructive)',
          };
        case 'warning':
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-warning)',
            color: 'var(--color-warning-foreground)',
            border: '1px solid var(--color-warning)',
          };
        case 'success':
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-success)',
            color: 'var(--color-success-foreground)',
            border: '1px solid var(--color-success)',
          };
        default:
          return {
            ...baseStyles,
            backgroundColor: 'var(--color-foreground)',
            color: 'var(--color-background)',
            border: '1px solid var(--color-foreground)',
          };
      }
    }

    // Non-selected states using CSS variables with alpha
    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary)',
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'color-mix(in srgb, var(--color-secondary) 20%, transparent)',
          color: 'var(--color-secondary)',
          border: '1px solid var(--color-secondary)',
        };
      case 'accent':
        return {
          ...baseStyles,
          backgroundColor: 'color-mix(in srgb, var(--color-accent) 20%, transparent)',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-accent)',
        };
      case 'destructive':
        return {
          ...baseStyles,
          backgroundColor: 'color-mix(in srgb, var(--color-destructive) 20%, transparent)',
          color: 'var(--color-destructive)',
          border: '1px solid var(--color-destructive)',
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: 'color-mix(in srgb, var(--color-warning) 20%, transparent)',
          color: 'var(--color-warning)',
          border: '1px solid var(--color-warning)',
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: 'color-mix(in srgb, var(--color-success) 20%, transparent)',
          color: 'var(--color-success)',
          border: '1px solid var(--color-success)',
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: 'var(--color-muted)',
          color: 'var(--color-muted-foreground)',
          border: '1px solid var(--color-border)',
        };
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: '24px',
          padding: '0 8px',
          fontSize: '12px',
          gap: '4px',
        };
      case 'lg':
        return {
          height: '40px',
          padding: '0 16px',
          fontSize: '16px',
          gap: '8px',
        };
      default: // md
        return {
          height: '32px',
          padding: '0 12px',
          fontSize: '14px',
          gap: '6px',
        };
    }
  };

  // Get icon size based on chip size
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'xs';
      case 'lg': return 'sm';
      default: return 'xs';
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const iconSize = getIconSize() as 'xs' | 'sm';

  // Handle remove click
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div
      className={`chip-molecule inline-flex items-center ${className}`}
      style={{
        borderRadius: 'var(--radius-chip, var(--radius, 6px))',
        fontWeight: '500',
        lineHeight: '1',
        userSelect: 'none',
        fontFamily: 'var(--typography-emphasis-font-family)',
        ...variantStyles,
        ...sizeStyles,
        ...style,
      }}
      onClick={onClick && !disabled ? onClick : undefined}
      {...props}
    >
      {/* Avatar */}
      {avatar && (
        <div 
          className="flex-shrink-0"
          style={{ 
            marginLeft: '-4px',
            marginRight: sizeStyles.gap 
          }}
        >
          {avatar}
        </div>
      )}

      {/* Start Icon */}
      {StartIcon && (
        <Icon
          icon={StartIcon as import('lucide-react').LucideIcon}
          size={iconSize}
          style={{ color: 'currentColor' }}
        />
      )}

      {/* Content */}
      <span className="truncate">
        {children}
      </span>

      {/* End Icon */}
      {EndIcon && (
        <Icon
          icon={EndIcon as import('lucide-react').LucideIcon}
          size={iconSize}
          style={{ color: 'currentColor' }}
        />
      )}

      {/* Remove Button */}
      {removable && (
        <button
          onClick={handleRemoveClick}
          disabled={disabled}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            marginLeft: '2px',
            marginRight: '-4px',
            cursor: 'pointer',
            borderRadius: '2px',
            color: 'currentColor',
          }}
          aria-label="Remove"
        >
          <Icon 
            icon={X} 
            size={iconSize}
            style={{ color: 'currentColor' }}
          />
        </button>
      )}
    </div>
  );
}

export default ChipMolecule;