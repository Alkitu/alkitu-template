'use client';

import React from 'react';
import { X, LucideIcon } from 'lucide-react';
import type { ChipMoleculeProps } from './ChipMolecule.types';

// Simple Icon wrapper for lucide icons
interface SimpleIconProps {
  icon: LucideIcon;
  size: 'xs' | 'sm' | 'md';
  style?: React.CSSProperties;
  className?: string;
}

const SimpleIcon: React.FC<SimpleIconProps> = ({ icon: IconComponent, size, style, className = '' }) => {
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
  };

  return (
    <IconComponent
      size={sizeMap[size]}
      className={`icon-atom flex-shrink-0 ${className}`}
      style={style}
    />
  );
};

/**
 * ChipMolecule - Atomic Design Molecule
 *
 * Compact elements that represent input, attribute, or action.
 * Combines Icon atoms with typography and interaction logic.
 * Can be clickable, removable, and have icons or avatars.
 *
 * @example
 * ```tsx
 * <ChipMolecule variant="primary">Primary Chip</ChipMolecule>
 * <ChipMolecule variant="primary" removable onRemove={handleRemove}>Removable</ChipMolecule>
 * <ChipMolecule startIcon={User} variant="secondary">User</ChipMolecule>
 * <ChipMolecule selected onClick={handleClick}>Selected</ChipMolecule>
 * ```
 */
export const ChipMolecule = React.forwardRef<HTMLDivElement, ChipMoleculeProps>(
  (
    {
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
    },
    ref,
  ) => {
    // Get variant styles using only CSS variables
    const getVariantStyles = () => {
      const baseStyles = {
        transition: 'all 0.15s ease-in-out',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? ('none' as const) : ('auto' as const),
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
        case 'sm':
          return 'xs';
        case 'lg':
          return 'sm';
        default:
          return 'xs';
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
        ref={ref}
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
              marginRight: sizeStyles.gap,
            }}
          >
            {avatar}
          </div>
        )}

        {/* Start Icon */}
        {StartIcon && (
          <SimpleIcon icon={StartIcon} size={iconSize} style={{ color: 'currentColor' }} />
        )}

        {/* Content */}
        <span className="truncate">{children}</span>

        {/* End Icon */}
        {EndIcon && <SimpleIcon icon={EndIcon} size={iconSize} style={{ color: 'currentColor' }} />}

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
            <SimpleIcon icon={X} size={iconSize} style={{ color: 'currentColor' }} />
          </button>
        )}
      </div>
    );
  },
);

ChipMolecule.displayName = 'ChipMolecule';

export default ChipMolecule;
