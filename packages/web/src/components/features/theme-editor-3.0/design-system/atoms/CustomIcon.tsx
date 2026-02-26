'use client';

import React from 'react';

export interface CustomIconProps {
  /**
   * SVG string content
   */
  svg: string;

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
 * CustomIcon Component
 * Renders custom uploaded SVG icons with the same behavior as system icons
 * Matches Icon.tsx functionality exactly
 */
export function CustomIcon({
  svg,
  size = 'md',
  customSize,
  variant = 'default',
  customColor,
  className = '',
  style = {},
  onClick,
  'aria-label': ariaLabel,
  ...props
}: CustomIconProps) {
  // Size mapping (in pixels) - same as Icon.tsx
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

  // Color variant class mapping (use CSS classes instead of direct color) - same as Icon.tsx
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
        return 'text-current';
    }
  };

  const sizeValue = getSizeValue();
  const colorClass = getColorClass();

  // Process SVG to ensure it works with our styling
  const processedSVG = React.useMemo(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        return null;
      }

      // Set size attributes
      svgElement.setAttribute('width', sizeValue.toString());
      svgElement.setAttribute('height', sizeValue.toString());

      // Ensure currentColor inheritance works
      if (!svgElement.getAttribute('fill') || svgElement.getAttribute('fill') === 'currentColor') {
        svgElement.setAttribute('fill', 'currentColor');
      }

      return new XMLSerializer().serializeToString(svgElement);
    } catch (error) {
      console.error('Failed to process custom SVG:', error);
      return null;
    }
  }, [svg, sizeValue]);

  if (!processedSVG) {
    // Fallback for invalid SVG - same style as Icon.tsx
    return (
      <span
        className={`inline-flex items-center justify-center ${colorClass} ${className}`}
        style={{
          width: sizeValue,
          height: sizeValue,
          color: customColor || undefined,
          cursor: onClick ? 'pointer' : undefined,
          ...style
        }}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        aria-label={ariaLabel}
      >
        <span className="text-xs">?</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${colorClass} ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        color: customColor || undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: processedSVG }}
      {...props}
    />
  );
}

/**
 * Wrapper component that mimics LucideIcon interface for compatibility
 */
export function createCustomIconComponent(svg: string) {
  return React.forwardRef<HTMLSpanElement, any>((props, ref) => {
    const {
      size = 'md',
      variant = 'default',
      customSize,
      customColor,
      ...rest
    } = props;

    return (
      <CustomIcon
        svg={svg}
        size={size}
        variant={variant}
        customSize={customSize}
        customColor={customColor}
        {...rest}
      />
    );
  });
}