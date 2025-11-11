'use client';

import React from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

interface SpacerProps {
  /** Size of the spacer based on spacing system hierarchy */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Direction of spacing */
  direction?: 'horizontal' | 'vertical' | 'both';
  /** Custom spacing value (overrides size) */
  spacing?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Spacer Atom
 * Provides consistent spacing based on the theme's spacing system
 * Connected to Theme Editor spacing tokens
 */
export function Spacer({
  size = 'md',
  direction = 'vertical',
  spacing,
  className = '',
  style = {}
}: SpacerProps) {
  const { state } = useThemeEditor();
  
  // Get spacing from theme system
  const themeSpacing = state.currentTheme?.spacing;
  const baseSpacing = themeSpacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16; // Convert to px

  // Calculate spacing values based on size
  const getSpacingValue = () => {
    if (spacing) return spacing; // Custom spacing overrides size
    
    const spacingMap = {
      'xs': `${baseValue * 0.5}px`,      // 0.5x base
      'sm': `${baseValue}px`,            // 1x base (small spacing)
      'md': `${baseValue * 2}px`,        // 2x base (medium spacing)
      'lg': `${baseValue * 4}px`,        // 4x base (large spacing)
      'xl': `${baseValue * 6}px`,        // 6x base (extra large)
      '2xl': `${baseValue * 8}px`        // 8x base (2x extra large)
    };
    
    return spacingMap[size];
  };

  const spacingValue = getSpacingValue();

  // Calculate dimensions based on direction
  const dimensions = React.useMemo(() => {
    switch (direction) {
      case 'horizontal':
        return {
          width: spacingValue,
          height: '1px',
          minWidth: spacingValue
        };
      case 'vertical':
        return {
          width: '1px',
          height: spacingValue,
          minHeight: spacingValue
        };
      case 'both':
        return {
          width: spacingValue,
          height: spacingValue,
          minWidth: spacingValue,
          minHeight: spacingValue
        };
      default:
        return {
          width: '1px',
          height: spacingValue,
          minHeight: spacingValue
        };
    }
  }, [direction, spacingValue]);

  return (
    <div
      className={`spacer ${className}`}
      style={{
        ...dimensions,
        flexShrink: 0, // Prevent spacer from shrinking
        ...style
      }}
      aria-hidden="true" // Spacer is decorative, hide from screen readers
      data-spacing-size={size}
      data-spacing-direction={direction}
      data-spacing-value={spacingValue}
    />
  );
}