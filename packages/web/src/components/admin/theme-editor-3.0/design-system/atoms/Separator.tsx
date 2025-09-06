'use client';

import React from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface SeparatorProps {
  /**
   * Orientation of the separator
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Size/thickness of the separator
   */
  size?: 'thin' | 'medium' | 'thick';
  
  /**
   * Length of the separator (for vertical separators)
   */
  length?: string | number;
  
  /**
   * Color variant
   */
  variant?: 'default' | 'muted' | 'primary' | 'secondary';
  
  /**
   * Style variant
   */
  style?: 'solid' | 'dashed' | 'dotted';
  
  /**
   * Whether separator has decorative elements
   */
  decorative?: boolean;
  
  /**
   * Custom label for decorative separator
   */
  label?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
   */
  customStyle?: React.CSSProperties;
}

/**
 * Separator Atom Component
 * Visual divider to separate content sections
 * Supports horizontal/vertical orientations and various styles
 */
export function Separator({
  orientation = 'horizontal',
  size = 'thin',
  length,
  variant = 'default',
  style = 'solid',
  decorative = false,
  label,
  className = '',
  customStyle = {},
  ...props
}: SeparatorProps) {
  const { state } = useThemeEditor();
  const colors = state.themeMode === 'dark' ? state.currentTheme?.darkColors : state.currentTheme?.lightColors;

  // Get color based on variant
  const getColor = (): string => {
    switch (variant) {
      case 'muted':
        return colors?.muted?.hex || 'var(--color-muted)';
      case 'primary':
        return colors?.primary?.hex || 'var(--color-primary)';
      case 'secondary':
        return colors?.secondary?.hex || 'var(--color-secondary)';
      default:
        return colors?.border?.hex || 'var(--color-border)';
    }
  };

  // Get thickness based on size
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

  // Get border style
  const getBorderStyle = (): string => {
    return style;
  };

  const color = getColor();
  const thickness = getThickness();
  const borderStyle = getBorderStyle();

  // Base styles for separator
  const getBaseStyles = (): React.CSSProperties => {
    if (orientation === 'vertical') {
      return {
        width: thickness,
        height: length || '100%',
        borderLeft: `${thickness} ${borderStyle} ${color}`,
        display: 'inline-block',
        verticalAlign: 'top',
        ...customStyle,
      };
    }

    // Horizontal separator
    return {
      width: '100%',
      height: thickness,
      borderTop: `${thickness} ${borderStyle} ${color}`,
      ...customStyle,
    };
  };

  // Decorative separator with label
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
            borderTop: `${thickness} ${borderStyle} ${color}`,
          }}
        />
        <span
          style={{
            color: colors?.mutedForeground?.hex || 'var(--color-muted-foreground)',
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
            borderTop: `${thickness} ${borderStyle} ${color}`,
          }}
        />
      </div>
    );
  }

  // Simple decorative separator (just dots or line)
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

  // Standard separator
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