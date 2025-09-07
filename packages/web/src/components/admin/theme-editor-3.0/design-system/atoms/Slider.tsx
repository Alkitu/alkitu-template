'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SliderProps {
  /**
   * Current value
   */
  value?: number;
  
  /**
   * Default value
   */
  defaultValue?: number;
  
  /**
   * Minimum value
   */
  min?: number;
  
  /**
   * Maximum value
   */
  max?: number;
  
  /**
   * Step increment
   */
  step?: number;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'secondary';
  
  /**
   * Whether to show value label
   */
  showValue?: boolean;
  
  /**
   * Label position
   */
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Whether to show tick marks
   */
  showTicks?: boolean;
  
  /**
   * Tick mark positions
   */
  ticks?: number[];
  
  /**
   * Whether slider is disabled
   */
  disabled?: boolean;
  
  /**
   * Orientation
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Change handler
   */
  onChange?: (value: number) => void;
  
  /**
   * Commit handler (on mouse up)
   */
  onValueCommit?: (value: number) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * ARIA label
   */
  'aria-label'?: string;
}

/**
 * Slider Atom Component
 * Interactive slider for selecting numeric values
 * Supports horizontal/vertical orientations and multiple variants
 */
export function Slider({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  variant = 'default',
  showValue = false,
  labelPosition = 'top',
  showTicks = false,
  ticks,
  disabled = false,
  orientation = 'horizontal',
  onChange,
  onValueCommit,
  className = '',
  style = {},
  'aria-label': ariaLabel,
  ...props
}: SliderProps) {
  
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  // Use controlled or uncontrolled value
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Clamp value to bounds
  const clampedValue = Math.min(Math.max(currentValue, min), max);
  
  // Calculate percentage
  const percentage = ((clampedValue - min) / (max - min)) * 100;
  
  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          trackHeight: '4px',
          thumbSize: '14px',
          trackWidth: '200px',
          fontSize: '12px',
        };
      case 'lg':
        return {
          trackHeight: '8px',
          thumbSize: '22px',
          trackWidth: '300px',
          fontSize: '16px',
        };
      default: // md
        return {
          trackHeight: '6px',
          thumbSize: '18px',
          trackWidth: '250px',
          fontSize: '14px',
        };
    }
  };
  
  // Get variant colors
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          track: 'var(--color-primary)',
          thumb: 'var(--color-primary)',
          thumbBorder: 'var(--color-primary-foreground)',
        };
      case 'secondary':
        return {
          track: 'var(--color-secondary)',
          thumb: 'var(--color-secondary)',
          thumbBorder: 'var(--color-secondary-foreground)',
        };
      default:
        return {
          track: 'var(--color-accent)',
          thumb: 'var(--color-accent)',
          thumbBorder: 'var(--color-accent-foreground)',
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  const variantColors = getVariantColors();
  
  // Handle value update
  const updateValue = (newValue: number) => {
    const steppedValue = Math.round((newValue - min) / step) * step + min;
    const clampedSteppedValue = Math.min(Math.max(steppedValue, min), max);
    
    if (controlledValue === undefined) {
      setInternalValue(clampedSteppedValue);
    }
    
    onChange?.(clampedSteppedValue);
  };
  
  // Handle mouse/touch events
  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    let percentage: number;
    
    if (orientation === 'vertical') {
      percentage = ((rect.bottom - event.clientY) / rect.height) * 100;
    } else {
      percentage = ((event.clientX - rect.left) / rect.width) * 100;
    }
    
    percentage = Math.min(Math.max(percentage, 0), 100);
    const newValue = min + (percentage / 100) * (max - min);
    
    updateValue(newValue);
  };
  
  const handlePointerUp = () => {
    setIsDragging(false);
    onValueCommit?.(clampedValue);
  };
  
  const handlePointerDown = (event: React.PointerEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDragging(true);
    
    // Handle initial click position
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      let percentage: number;
      
      if (orientation === 'vertical') {
        percentage = ((rect.bottom - event.clientY) / rect.height) * 100;
      } else {
        percentage = ((event.clientX - rect.left) / rect.width) * 100;
      }
      
      percentage = Math.min(Math.max(percentage, 0), 100);
      const newValue = min + (percentage / 100) * (max - min);
      
      updateValue(newValue);
    }
  };
  
  // Add global event listeners for dragging
  useEffect(() => {
    if (!isDragging) return;
    
    const handleGlobalPointerMove = (event: PointerEvent) => {
      handlePointerMove(event);
    };
    
    const handleGlobalPointerUp = () => {
      handlePointerUp();
    };
    
    document.addEventListener('pointermove', handleGlobalPointerMove);
    document.addEventListener('pointerup', handleGlobalPointerUp);
    document.addEventListener('pointercancel', handleGlobalPointerUp);
    
    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove);
      document.removeEventListener('pointerup', handleGlobalPointerUp);
      document.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [isDragging]);
  
  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    let newValue = clampedValue;
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(clampedValue + step, max);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(clampedValue - step, min);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      case 'PageUp':
        newValue = Math.min(clampedValue + step * 10, max);
        break;
      case 'PageDown':
        newValue = Math.max(clampedValue - step * 10, min);
        break;
      default:
        return;
    }
    
    event.preventDefault();
    updateValue(newValue);
    onValueCommit?.(newValue);
  };
  
  // Generate tick marks
  const generateTicks = () => {
    if (!showTicks) return [];
    
    const tickPositions = ticks || [];
    if (tickPositions.length === 0) {
      // Generate default ticks
      const tickCount = Math.min(Math.floor((max - min) / step) + 1, 11);
      for (let i = 0; i < tickCount; i++) {
        tickPositions.push(min + (i * (max - min)) / (tickCount - 1));
      }
    }
    
    return tickPositions.map(tickValue => {
      const tickPercentage = ((tickValue - min) / (max - min)) * 100;
      return { value: tickValue, percentage: tickPercentage };
    });
  };
  
  const ticks_generated = generateTicks();
  
  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: '8px',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'default',
    ...style,
  };
  
  // Track styles
  const trackStyles: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'var(--color-muted)',
    borderRadius: 'var(--radius)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...(orientation === 'horizontal' ? {
      width: sizeStyles.trackWidth,
      height: sizeStyles.trackHeight,
    } : {
      width: sizeStyles.trackHeight,
      height: sizeStyles.trackWidth,
    }),
  };
  
  // Fill track styles
  const fillStyles: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: variantColors.track,
    borderRadius: 'inherit',
    ...(orientation === 'horizontal' ? {
      left: 0,
      top: 0,
      width: `${percentage}%`,
      height: '100%',
    } : {
      left: 0,
      bottom: 0,
      width: '100%',
      height: `${percentage}%`,
    }),
  };
  
  // Thumb styles
  const thumbStyles: React.CSSProperties = {
    position: 'absolute',
    width: sizeStyles.thumbSize,
    height: sizeStyles.thumbSize,
    backgroundColor: variantColors.thumb,
    border: `2px solid ${variantColors.thumbBorder}`,
    borderRadius: '50%',
    cursor: disabled ? 'not-allowed' : 'grab',
    transform: 'translate(-50%, -50%)',
    transition: isDragging ? 'none' : 'all 0.2s ease',
    boxShadow: isDragging ? '0 0 0 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.2)',
    ...(orientation === 'horizontal' ? {
      left: `${percentage}%`,
      top: '50%',
    } : {
      left: '50%',
      bottom: `${percentage}%`,
    }),
  };
  
  // Value label component
  const ValueLabel = () => {
    if (!showValue) return null;
    
    const labelStyles: React.CSSProperties = {
      fontSize: sizeStyles.fontSize,
      fontWeight: '500',
      color: 'var(--color-foreground)',
      minWidth: '40px',
      textAlign: 'center',
    };
    
    return <span style={labelStyles}>{clampedValue}</span>;
  };
  
  return (
    <div
      className={`slider-atom ${className}`}
      style={containerStyles}
      {...props}
    >
      {/* Value label - positioned based on labelPosition */}
      {(labelPosition === 'top' || labelPosition === 'left') && <ValueLabel />}
      
      {/* Slider track container */}
      <div style={{ position: 'relative' }}>
        {/* Track */}
        <div
          ref={trackRef}
          style={trackStyles}
          onPointerDown={handlePointerDown}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={clampedValue}
          aria-orientation={orientation}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
        >
          {/* Fill track */}
          <div style={fillStyles} />
          
          {/* Tick marks */}
          {ticks_generated.map((tick, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: '2px',
                height: orientation === 'horizontal' ? '8px' : '2px',
                backgroundColor: 'var(--color-border)',
                ...(orientation === 'horizontal' ? {
                  left: `${tick.percentage}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                } : {
                  left: '50%',
                  bottom: `${tick.percentage}%`,
                  transform: 'translate(-50%, 50%)',
                }),
              }}
            />
          ))}
          
          {/* Thumb */}
          <div
            ref={thumbRef}
            style={thumbStyles}
          />
        </div>
      </div>
      
      {/* Value label - positioned based on labelPosition */}
      {(labelPosition === 'bottom' || labelPosition === 'right') && <ValueLabel />}
    </div>
  );
}

export default Slider;