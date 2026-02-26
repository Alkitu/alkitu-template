'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: React.ReactNode;
  
  /**
   * Children element that triggers the tooltip
   */
  children: React.ReactElement;
  
  /**
   * Tooltip placement
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Trigger type
   */
  trigger?: 'hover' | 'click' | 'focus';
  
  /**
   * Delay before showing tooltip (ms)
   */
  delay?: number;
  
  /**
   * Whether tooltip is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether to show arrow
   */
  showArrow?: boolean;
  
  /**
   * Custom offset from trigger element
   */
  offset?: number;
  
  /**
   * Additional CSS classes for tooltip
   */
  className?: string;
  
  /**
   * Custom styles for tooltip
   */
  style?: React.CSSProperties;
}

/**
 * Tooltip Atom Component
 * Shows contextual information on hover, focus, or click
 * Integrates with theme system for consistent styling
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  delay = 300,
  disabled = false,
  showArrow = true,
  offset = 8,
  className = '',
  style = {},
}: TooltipProps) {
  
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
    if (top + tooltipRect.height > viewportHeight + scrollY) top = viewportHeight + scrollY - tooltipRect.height - 8;

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
    const arrowColor = 'var(--color-popover)';
    const borderColor = 'var(--color-border)';

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
  const childProps = (children as React.ReactElement<Record<string, unknown>>).props as Record<string, unknown>;
  const triggerElement = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    ref: triggerRef,
    onMouseEnter: trigger === 'hover' ? showTooltip : childProps.onMouseEnter,
    onMouseLeave: trigger === 'hover' ? hideTooltip : childProps.onMouseLeave,
    onFocus: trigger === 'focus' ? showTooltip : childProps.onFocus,
    onBlur: trigger === 'focus' ? hideTooltip : childProps.onBlur,
    onClick: trigger === 'click' ? toggleTooltip : childProps.onClick,
  });

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
            />
          )}
          
          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className={`tooltip-atom ${className}`}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              zIndex: trigger === 'click' ? 1000 : 999,
              backgroundColor: 'var(--color-popover)',
              color: 'var(--color-popover-foreground)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '1.4',
              maxWidth: '300px',
              wordWrap: 'break-word',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              opacity: isVisible ? 1 : 0,
              transform: `scale(${isVisible ? 1 : 0.95})`,
              transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
              pointerEvents: 'none',
              ...style,
            }}
            role="tooltip"
            aria-hidden={!isVisible}
          >
            {content}
            
            {/* Arrow */}
            {showArrow && (
              <div style={getArrowStyles()} />
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Tooltip;