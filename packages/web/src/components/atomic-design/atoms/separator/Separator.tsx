'use client';

import React from 'react';
import type { SeparatorProps } from './Separator.types';

/**
 * Separator - Atomic Design Atom
 *
 * A visual divider component to separate content sections.
 * Supports horizontal and vertical orientations with multiple variants and styles.
 *
 * @example
 * ```tsx
 * // Basic horizontal separator
 * <Separator />
 *
 * // Vertical separator with custom length
 * <Separator orientation="vertical" length="40px" />
 *
 * // Decorative separator with label
 * <Separator decorative label="OR" variant="primary" />
 *
 * // Thick dashed separator
 * <Separator size="thick" borderStyle="dashed" />
 * ```
 */
export function Separator({
  orientation = 'horizontal',
  size = 'thin',
  length,
  variant = 'default',
  borderStyle = 'solid',
  decorative = false,
  label,
  className = '',
  customStyle = {},
  ...props
}: SeparatorProps) {
  /**
   * Get color CSS variable based on variant
   */
  const getColor = (): string => {
    switch (variant) {
      case 'muted':
        return 'var(--color-muted)';
      case 'primary':
        return 'var(--color-primary)';
      case 'secondary':
        return 'var(--color-secondary)';
      default:
        return 'var(--color-border)';
    }
  };

  /**
   * Get thickness based on size
   */
  const getThickness = (): string => {
    switch (size) {
      case 'medium':
        return '2px';
      case 'thick':
        return '4px';
      default: // thin
        return '1px';
    }
  };

  /**
   * Get border style
   */
  const getBorderStyleValue = (): string => {
    return borderStyle;
  };

  const color = getColor();
  const thickness = getThickness();
  const borderStyleValue = getBorderStyleValue();

  /**
   * Base styles for separator
   */
  const getBaseStyles = (): React.CSSProperties => {
    if (orientation === 'vertical') {
      return {
        width: thickness,
        height: length || '100%',
        borderLeft: `${thickness} ${borderStyleValue} ${color}`,
        display: 'inline-block',
        verticalAlign: 'top',
        ...customStyle,
      };
    }

    // Horizontal separator
    return {
      width: '100%',
      height: thickness,
      borderTop: `${thickness} ${borderStyleValue} ${color}`,
      ...customStyle,
    };
  };

  /**
   * Decorative separator with label
   */
  if (decorative && label) {
    return (
      <div
        className={`separator-decorative ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          ...customStyle,
        }}
        role="separator"
        aria-label={`Section separator: ${label}`}
        {...props}
      >
        <div
          style={{
            flex: 1,
            height: thickness,
            borderTop: `${thickness} ${borderStyleValue} ${color}`,
          }}
        />
        <span
          style={{
            color: 'var(--color-muted-foreground)',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: thickness,
            borderTop: `${thickness} ${borderStyleValue} ${color}`,
          }}
        />
      </div>
    );
  }

  /**
   * Simple decorative separator (three centered dots)
   */
  if (decorative && !label) {
    return (
      <div
        className={`separator-decorative ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '8px 0',
          ...customStyle,
        }}
        role="separator"
        aria-hidden="true"
        {...props}
      >
        <div
          style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  /**
   * Standard separator
   */
  return (
    <div
      className={`separator-atom ${className}`}
      style={getBaseStyles()}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
}

export default Separator;
