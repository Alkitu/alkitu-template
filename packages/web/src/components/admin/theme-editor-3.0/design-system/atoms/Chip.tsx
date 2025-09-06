'use client';

import React from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { Icon } from './Icon';
import { X } from 'lucide-react';

export interface ChipProps {
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
 * Chip Atom Component
 * Compact elements that represent input, attribute, or action
 * Can be clickable, removable, and have icons or avatars
 */
export function Chip({
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
}: ChipProps) {
  const { state } = useThemeEditor();
  const colors = state.themeMode === 'dark' ? state.currentTheme?.darkColors : state.currentTheme?.lightColors;
  const borders = state.currentTheme?.borders;

  // Get variant styles
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
            backgroundColor: colors?.primary?.hex || 'var(--color-primary)',
            color: colors?.primaryForeground?.hex || 'var(--color-primary-foreground)',
            border: `1px solid ${colors?.primary?.hex || 'var(--color-primary)'}`,
          };
        case 'secondary':
          return {
            ...baseStyles,
            backgroundColor: colors?.secondary?.hex || 'var(--color-secondary)',
            color: colors?.secondaryForeground?.hex || 'var(--color-secondary-foreground)',
            border: `1px solid ${colors?.secondary?.hex || 'var(--color-secondary)'}`,
          };
        case 'accent':
          return {
            ...baseStyles,
            backgroundColor: colors?.accent?.hex || 'var(--color-accent)',
            color: colors?.accentForeground?.hex || 'var(--color-accent-foreground)',
            border: `1px solid ${colors?.accent?.hex || 'var(--color-accent)'}`,
          };
        case 'destructive':
          return {
            ...baseStyles,
            backgroundColor: colors?.destructive?.hex || 'var(--color-destructive)',
            color: colors?.destructiveForeground?.hex || 'var(--color-destructive-foreground)',
            border: `1px solid ${colors?.destructive?.hex || 'var(--color-destructive)'}`,
          };
        case 'warning':
          return {
            ...baseStyles,
            backgroundColor: colors?.warning?.hex || 'var(--color-warning)',
            color: colors?.warningForeground?.hex || 'var(--color-warning-foreground)',
            border: `1px solid ${colors?.warning?.hex || 'var(--color-warning)'}`,
          };
        case 'success':
          return {
            ...baseStyles,
            backgroundColor: colors?.success?.hex || 'var(--color-success)',
            color: colors?.successForeground?.hex || 'var(--color-success-foreground)',
            border: `1px solid ${colors?.success?.hex || 'var(--color-success)'}`,
          };
        default:
          return {
            ...baseStyles,
            backgroundColor: colors?.foreground?.hex || 'var(--color-foreground)',
            color: colors?.background?.hex || 'var(--color-background)',
            border: `1px solid ${colors?.foreground?.hex || 'var(--color-foreground)'}`,
          };
      }
    }

    // Non-selected states
    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: colors?.primary?.hex ? `${colors.primary.hex}20` : 'var(--color-primary/20)',
          color: colors?.primary?.hex || 'var(--color-primary)',
          border: `1px solid ${colors?.primary?.hex || 'var(--color-primary)'}`,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: colors?.secondary?.hex ? `${colors.secondary.hex}20` : 'var(--color-secondary/20)',
          color: colors?.secondary?.hex || 'var(--color-secondary)',
          border: `1px solid ${colors?.secondary?.hex || 'var(--color-secondary)'}`,
        };
      case 'accent':
        return {
          ...baseStyles,
          backgroundColor: colors?.accent?.hex ? `${colors.accent.hex}20` : 'var(--color-accent/20)',
          color: colors?.accent?.hex || 'var(--color-accent)',
          border: `1px solid ${colors?.accent?.hex || 'var(--color-accent)'}`,
        };
      case 'destructive':
        return {
          ...baseStyles,
          backgroundColor: colors?.destructive?.hex ? `${colors.destructive.hex}20` : 'var(--color-destructive/20)',
          color: colors?.destructive?.hex || 'var(--color-destructive)',
          border: `1px solid ${colors?.destructive?.hex || 'var(--color-destructive)'}`,
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: colors?.warning?.hex ? `${colors.warning.hex}20` : 'var(--color-warning/20)',
          color: colors?.warning?.hex || 'var(--color-warning)',
          border: `1px solid ${colors?.warning?.hex || 'var(--color-warning)'}`,
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: colors?.success?.hex ? `${colors.success.hex}20` : 'var(--color-success/20)',
          color: colors?.success?.hex || 'var(--color-success)',
          border: `1px solid ${colors?.success?.hex || 'var(--color-success)'}`,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: colors?.foreground?.hex || 'var(--color-foreground)',
          border: `1px solid ${colors?.border?.hex || 'var(--color-border)'}`,
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: colors?.muted?.hex || 'var(--color-muted)',
          color: colors?.mutedForeground?.hex || 'var(--color-muted-foreground)',
          border: `1px solid ${colors?.border?.hex || 'var(--color-border)'}`,
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
      className={`chip-atom inline-flex items-center ${className}`}
      style={{
        borderRadius: borders?.radius || '6px',
        fontWeight: '500',
        lineHeight: '1',
        userSelect: 'none',
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
          icon={StartIcon} 
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
          icon={EndIcon} 
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

export default Chip;