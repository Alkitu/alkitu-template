'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TooltipProps } from './Tooltip.types';

/**
 * Tooltip - Atomic Design Atom
 *
 * Displays contextual information on hover, focus, or click.
 * Automatically positions itself to stay within the viewport.
 *
 * @example
 * ```tsx
 * <Tooltip content="Helpful information" placement="top">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      placement = 'top',
      trigger = 'hover',
      delay = 300,
      disabled = false,
      showArrow = true,
      offset = 8,
      className = '',
      themeOverride,
      style = {},
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>(undefined);

    // Calculate tooltip position
    const calculatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = triggerRect.top + scrollY - tooltipRect.height - offset;
          left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + scrollY + offset;
          left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left + scrollX - tooltipRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + scrollX + offset;
          break;
      }

      // Keep tooltip within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left < 0) left = 8;
      if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 8;
      if (top < 0) top = 8;
      if (top + tooltipRect.height > viewportHeight + scrollY) {
        top = viewportHeight + scrollY - tooltipRect.height - 8;
      }

      setPosition({ top, left });
    };

    // Show tooltip
    const showTooltip = () => {
      if (disabled) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    // Hide tooltip
    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    // Toggle tooltip (for click trigger)
    const toggleTooltip = () => {
      if (disabled) return;
      setIsVisible(!isVisible);
    };

    // Update position when visible
    useEffect(() => {
      if (isVisible) {
        calculatePosition();

        const handleResize = () => calculatePosition();
        const handleScroll = () => calculatePosition();

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('scroll', handleScroll);
        };
      }
    }, [isVisible, placement, offset]);

    // Cleanup timeout
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    // Get arrow styles
    const getArrowStyles = () => {
      const arrowSize = 6;
      const arrowColor = 'hsl(var(--popover))';
      const borderColor = 'hsl(var(--border))';

      const baseArrow = {
        position: 'absolute' as const,
        width: 0,
        height: 0,
      };

      switch (placement) {
        case 'top':
          return {
            ...baseArrow,
            bottom: -arrowSize,
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid transparent`,
            borderTop: `${arrowSize}px solid ${arrowColor}`,
          };
        case 'bottom':
          return {
            ...baseArrow,
            top: -arrowSize,
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid ${arrowColor}`,
          };
        case 'left':
          return {
            ...baseArrow,
            right: -arrowSize,
            top: '50%',
            transform: 'translateY(-50%)',
            borderTop: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid transparent`,
            borderLeft: `${arrowSize}px solid ${arrowColor}`,
          };
        case 'right':
          return {
            ...baseArrow,
            left: -arrowSize,
            top: '50%',
            transform: 'translateY(-50%)',
            borderTop: `${arrowSize}px solid transparent`,
            borderBottom: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid ${arrowColor}`,
          };
        default:
          return baseArrow;
      }
    };

    // Clone children with event handlers
    const childElement = children as React.ReactElement<Record<string, unknown>>;
    const childProps = childElement.props;
    const triggerElement = React.cloneElement(childElement, {
      ref: triggerRef,
      onMouseEnter: trigger === 'hover' ? showTooltip : childProps.onMouseEnter,
      onMouseLeave: trigger === 'hover' ? hideTooltip : childProps.onMouseLeave,
      onFocus: trigger === 'focus' ? showTooltip : childProps.onFocus,
      onBlur: trigger === 'focus' ? hideTooltip : childProps.onBlur,
      onClick: trigger === 'click' ? toggleTooltip : childProps.onClick,
    });

    // Compose tooltip classes
    const tooltipClasses = cn(
      // Base styles
      'fixed z-[999] max-w-[300px]',
      'rounded-[var(--radius-tooltip)] border px-3 py-2',
      'text-sm font-medium leading-tight',
      'shadow-md',
      'transition-all duration-150 ease-in-out',
      'pointer-events-none break-words',

      // Theme colors
      'bg-popover text-popover-foreground border-border',

      // Animation states
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',

      // Click trigger z-index
      trigger === 'click' && isVisible && 'z-[1000]',

      // User-provided classes
      className,
    );

    // Merge styles
    const mergedStyle = {
      top: position.top,
      left: position.left,
      ...themeOverride,
      ...style,
    };

    return (
      <>
        {triggerElement}

        {isVisible && !disabled && (
          <>
            {/* Backdrop for click trigger */}
            {trigger === 'click' && (
              <div
                className="fixed inset-0 z-[998]"
                onClick={hideTooltip}
                aria-hidden="true"
              />
            )}

            {/* Tooltip */}
            <div
              ref={tooltipRef}
              className={tooltipClasses}
              style={mergedStyle}
              role="tooltip"
              aria-hidden={!isVisible}
              {...props}
            >
              {content}

              {/* Arrow */}
              {showArrow && <div style={getArrowStyles()} aria-hidden="true" />}
            </div>
          </>
        )}
      </>
    );
  },
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
