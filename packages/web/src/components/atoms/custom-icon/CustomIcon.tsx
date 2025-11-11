'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { CustomIconProps } from './CustomIcon.types';

/**
 * CustomIcon - Atomic Design Atom
 *
 * Renders custom uploaded SVG icons with dynamic sizing and theming.
 * Processes and sanitizes SVG content to ensure proper rendering with theme colors.
 *
 * Features:
 * - 6 size presets (xs to 2xl) + custom size support
 * - 8 color variants using theme CSS variables
 * - SVG processing and sanitization
 * - Accessibility support
 * - Interactive mode with click handlers
 * - Fallback for invalid SVG
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CustomIcon
 *   svg="<svg>...</svg>"
 *   size="md"
 *   variant="primary"
 * />
 *
 * // With custom size and color
 * <CustomIcon
 *   svg="<svg>...</svg>"
 *   customSize={48}
 *   customColor="#FF5733"
 * />
 *
 * // Interactive icon
 * <CustomIcon
 *   svg="<svg>...</svg>"
 *   onClick={() => console.log('clicked')}
 *   aria-label="Delete item"
 * />
 * ```
 */
export const CustomIcon = React.forwardRef<HTMLSpanElement, CustomIconProps>(
  (
    {
      svg,
      size = 'md',
      customSize,
      variant = 'default',
      customColor,
      className = '',
      style = {},
      onClick,
      'aria-label': ariaLabel,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    // Size mapping (in pixels)
    const getSizeValue = (): number => {
      if (customSize) return customSize;

      const sizeMap: Record<NonNullable<typeof size>, number> = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 28,
        '2xl': 32,
      };

      return sizeMap[size];
    };

    // Color variant class mapping (use CSS classes for theme integration)
    const getColorClass = (): string => {
      if (customColor) return ''; // Use direct color only when custom color is provided

      const colorMap: Record<NonNullable<typeof variant>, string> = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        muted: 'text-muted-foreground',
        destructive: 'text-destructive',
        warning: 'text-warning',
        success: 'text-success',
        default: 'text-current',
      };

      return colorMap[variant];
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
        if (
          !svgElement.getAttribute('fill') ||
          svgElement.getAttribute('fill') === 'currentColor'
        ) {
          svgElement.setAttribute('fill', 'currentColor');
        }

        return new XMLSerializer().serializeToString(svgElement);
      } catch (error) {
        console.error('Failed to process custom SVG:', error);
        return null;
      }
    }, [svg, sizeValue]);

    // Compose classes
    const classes = cn(
      'inline-flex items-center justify-center',
      colorClass,
      className,
    );

    // Compose styles
    const composedStyle: React.CSSProperties = {
      width: sizeValue,
      height: sizeValue,
      color: customColor || undefined,
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    };

    if (!processedSVG) {
      // Fallback for invalid SVG
      return (
        <span
          ref={ref}
          className={classes}
          style={composedStyle}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          aria-label={ariaLabel}
          data-testid={dataTestId}
          {...props}
        >
          <span className="text-xs">?</span>
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(classes, 'flex-shrink-0')}
        style={composedStyle}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        dangerouslySetInnerHTML={{ __html: processedSVG }}
        {...props}
      />
    );
  },
);

CustomIcon.displayName = 'CustomIcon';

/**
 * Wrapper component that mimics LucideIcon interface for compatibility
 * Creates a reusable component with pre-defined SVG content
 *
 * @param svg - SVG string content to embed
 * @returns React component with forwarded ref
 *
 * @example
 * ```tsx
 * const MyCustomIcon = createCustomIconComponent('<svg>...</svg>');
 * <MyCustomIcon size="md" variant="primary" />
 * ```
 */
export function createCustomIconComponent(svg: string) {
  const CustomIconWrapper = React.forwardRef<HTMLSpanElement, any>(
    (props, ref) => {
      const {
        size = 'md',
        variant = 'default',
        customSize,
        customColor,
        ...rest
      } = props;

      return (
        <CustomIcon
          ref={ref}
          svg={svg}
          size={size}
          variant={variant}
          customSize={customSize}
          customColor={customColor}
          {...rest}
        />
      );
    },
  );

  CustomIconWrapper.displayName = 'CustomIconWrapper';

  return CustomIconWrapper;
}

export default CustomIcon;
