'use client';

import React from 'react';

export interface SpinnerProps {
  /**
   * Size variant
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
   * Animation speed
   */
  speed?: 'slow' | 'normal' | 'fast';
  
  /**
   * Spinner style type
   */
  type?: 'circular' | 'dots' | 'pulse';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * Accessibility label
   */
  'aria-label'?: string;
}

/**
 * Spinner Atom Component
 * Loading indicator with various styles and animations
 * Integrates with theme system for consistent coloring
 */
export function Spinner({
  size = 'md',
  customSize,
  variant = 'primary',
  customColor,
  speed = 'normal',
  type = 'circular',
  className = '',
  style = {},
  'aria-label': ariaLabel = 'Loading...',
  ...props
}: SpinnerProps) {

  // Get size value
  const getSizeValue = (): number => {
    if (customSize) return customSize;
    
    const sizeMap = {
      'xs': 16,
      'sm': 20,
      'md': 24,
      'lg': 32,
      'xl': 40,
      '2xl': 48
    };
    
    return sizeMap[size];
  };

  // Get color value
  const getColorValue = (): string => {
    if (customColor) return customColor;
    
    switch (variant) {
      case 'primary':
        return 'var(--color-primary)';
      case 'secondary':
        return 'var(--color-secondary)';
      case 'accent':
        return 'var(--color-accent)';
      case 'muted':
        return 'var(--color-muted-foreground)';
      case 'destructive':
        return 'var(--color-destructive)';
      case 'warning':
        return 'var(--color-warning)';
      case 'success':
        return 'var(--color-success)';
      case 'default':
      default:
        return 'var(--color-foreground)';
    }
  };

  // Get animation duration
  const getAnimationDuration = (): string => {
    const speedMap = {
      'slow': '2s',
      'normal': '1s',
      'fast': '0.5s'
    };
    return speedMap[speed];
  };

  const spinnerSize = getSizeValue();
  const spinnerColor = getColorValue();
  const animationDuration = getAnimationDuration();

  // Circular spinner (default)
  if (type === 'circular') {
    return (
      <div
        className={`spinner-atom ${className}`}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          ...style
        }}
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        <svg
          width={spinnerSize}
          height={spinnerSize}
          viewBox="0 0 24 24"
          fill="none"
          style={{
            animation: `spin ${animationDuration} linear infinite`
          }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="var(--color-border)"
            strokeWidth="2"
            opacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke={spinnerColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    );
  }

  // Dots spinner
  if (type === 'dots') {
    const dotSize = spinnerSize / 6;
    
    return (
      <div
        className={`spinner-dots ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: dotSize / 2,
          ...style
        }}
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: spinnerColor,
              animation: `pulse-dot ${animationDuration} infinite ease-in-out`,
              animationDelay: `${index * 0.16}s`
            }}
          />
        ))}
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse-dot {
              0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
              }
              40% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `
        }} />
      </div>
    );
  }

  // Pulse spinner
  if (type === 'pulse') {
    return (
      <div
        className={`spinner-pulse ${className}`}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderRadius: '50%',
          backgroundColor: spinnerColor,
          animation: `pulse-scale ${animationDuration} infinite ease-in-out`,
          ...style
        }}
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse-scale {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.2);
                opacity: 0.7;
              }
            }
          `
        }} />
      </div>
    );
  }

  return null;
}

export default Spinner;