'use client';

import React from 'react';
import { Icon } from './Icon';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps {
  /**
   * Alert content
   */
  children: React.ReactNode;
  
  /**
   * Alert variant/type
   */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default';
  
  /**
   * Alert title (optional)
   */
  title?: string;
  
  /**
   * Custom icon (overrides default variant icon)
   */
  icon?: React.ComponentType<any>;
  
  /**
   * Whether to show icon
   */
  showIcon?: boolean;
  
  /**
   * Whether alert can be dismissed
   */
  dismissible?: boolean;
  
  /**
   * Dismiss handler
   */
  onDismiss?: () => void;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
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
 * Alert Atom Component
 * Displays important information with contextual styling
 * Supports different variants (info, success, warning, error)
 */
export function Alert({
  children,
  variant = 'default',
  title,
  icon: CustomIcon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  size = 'md',
  className = '',
  style = {},
  ...props
}: AlertProps) {
  // Get variant config using only CSS variables
  const getVariantConfig = () => {
    switch (variant) {
      case 'info':
        return {
          icon: Info,
          backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
          borderColor: 'var(--color-primary)',
          textColor: 'var(--color-foreground)',
          iconColor: 'var(--color-primary)',
        };
      case 'success':
        return {
          icon: CheckCircle,
          backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)',
          borderColor: 'var(--color-success)',
          textColor: 'var(--color-foreground)',
          iconColor: 'var(--color-success)',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          backgroundColor: 'color-mix(in srgb, var(--color-warning) 10%, transparent)',
          borderColor: 'var(--color-warning)',
          textColor: 'var(--color-foreground)',
          iconColor: 'var(--color-warning)',
        };
      case 'error':
        return {
          icon: AlertCircle,
          backgroundColor: 'color-mix(in srgb, var(--color-destructive) 10%, transparent)',
          borderColor: 'var(--color-destructive)',
          textColor: 'var(--color-foreground)',
          iconColor: 'var(--color-destructive)',
        };
      default:
        return {
          icon: Info,
          backgroundColor: 'var(--color-muted)',
          borderColor: 'var(--color-border)',
          textColor: 'var(--color-foreground)',
          iconColor: 'var(--color-muted-foreground)',
        };
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '12px',
          gap: '8px',
          fontSize: '14px',
          iconSize: 'sm' as const,
        };
      case 'lg':
        return {
          padding: '20px',
          gap: '12px',
          fontSize: '16px',
          iconSize: 'md' as const,
        };
      default: // md
        return {
          padding: '16px',
          gap: '10px',
          fontSize: '14px',
          iconSize: 'sm' as const,
        };
    }
  };

  const variantConfig = getVariantConfig();
  const sizeStyles = getSizeStyles();
  const IconComponent = CustomIcon || variantConfig.icon;

  // Handle dismiss
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.();
  };

  return (
    <div
      className={`alert-atom ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        backgroundColor: variantConfig.backgroundColor,
        border: `1px solid ${variantConfig.borderColor}`,
        borderRadius: 'var(--radius-alert, var(--radius, 8px))',
        color: variantConfig.textColor,
        fontSize: sizeStyles.fontSize,
        lineHeight: '1.5',
        ...style,
      }}
      role="alert"
      {...props}
    >
      {/* Icon */}
      {showIcon && (
        <div className="flex-shrink-0">
          <Icon
            icon={IconComponent}
            size={sizeStyles.iconSize}
            style={{ color: variantConfig.iconColor }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div
            className="font-semibold mb-1"
            style={{
              color: variantConfig.textColor,
              fontSize: sizeStyles.fontSize === '16px' ? '16px' : '14px',
            }}
          >
            {title}
          </div>
        )}
        
        <div style={{ color: variantConfig.textColor }}>
          {children}
        </div>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: 'pointer',
            borderRadius: '2px',
            color: variantConfig.iconColor,
            marginTop: '2px',
          }}
          aria-label="Dismiss alert"
        >
          <Icon
            icon={X}
            size="xs"
            style={{ color: 'currentColor' }}
          />
        </button>
      )}
    </div>
  );
}

export default Alert;