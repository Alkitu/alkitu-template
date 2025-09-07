'use client';

import React, { useState } from 'react';

export interface ToggleGroupItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ComponentType<any>;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  /**
   * Toggle group items
   */
  items: ToggleGroupItem[];
  
  /**
   * Selection type
   */
  type?: 'single' | 'multiple';
  
  /**
   * Selected values (controlled)
   */
  value?: string | string[];
  
  /**
   * Default selected values
   */
  defaultValue?: string | string[];
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  
  /**
   * Orientation
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Whether toggle group is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether to connect buttons visually
   */
  connected?: boolean;
  
  /**
   * Change handler
   */
  onChange?: (value: string | string[]) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * ARIA label for the group
   */
  'aria-label'?: string;
}

/**
 * ToggleGroup Atom Component
 * Group of toggle buttons for single or multiple selection
 * Supports different orientations and visual connections
 */
export function ToggleGroup({
  items,
  type = 'single',
  value: controlledValue,
  defaultValue,
  size = 'md',
  variant = 'default',
  orientation = 'horizontal',
  disabled = false,
  connected = true,
  onChange,
  className = '',
  style = {},
  'aria-label': ariaLabel,
  ...props
}: ToggleGroupProps) {
  
  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(() => {
    if (defaultValue !== undefined) return defaultValue;
    return type === 'single' ? '' : [];
  });
  
  // Use controlled or uncontrolled value
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: '12px',
          gap: '6px',
          iconSize: '14px',
          height: '32px',
        };
      case 'lg':
        return {
          padding: '12px 20px',
          fontSize: '16px',
          gap: '8px',
          iconSize: '20px',
          height: '44px',
        };
      default: // md
        return {
          padding: '8px 16px',
          fontSize: '14px',
          gap: '6px',
          iconSize: '16px',
          height: '36px',
        };
    }
  };
  
  // Get variant colors
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--color-card)',
          backgroundHover: 'var(--color-accent)',
          backgroundActive: 'var(--color-primary)',
          border: 'var(--color-primary)',
          text: 'var(--color-card-foreground)',
          textActive: 'var(--color-primary-foreground)',
        };
      case 'secondary':
        return {
          background: 'var(--color-card)',
          backgroundHover: 'var(--color-accent)',
          backgroundActive: 'var(--color-secondary)',
          border: 'var(--color-secondary)',
          text: 'var(--color-card-foreground)',
          textActive: 'var(--color-secondary-foreground)',
        };
      case 'outline':
        return {
          background: 'transparent',
          backgroundHover: 'var(--color-accent)',
          backgroundActive: 'var(--color-accent)',
          border: 'var(--color-border)',
          text: 'var(--color-foreground)',
          textActive: 'var(--color-accent-foreground)',
        };
      default:
        return {
          background: 'var(--color-muted)',
          backgroundHover: 'var(--color-accent)',
          backgroundActive: 'var(--color-accent)',
          border: 'var(--color-border)',
          text: 'var(--color-muted-foreground)',
          textActive: 'var(--color-accent-foreground)',
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  const variantColors = getVariantColors();
  
  // Check if item is selected
  const isSelected = (itemValue: string) => {
    if (type === 'single') {
      return currentValue === itemValue;
    }
    return Array.isArray(currentValue) && currentValue.includes(itemValue);
  };
  
  // Handle item selection
  const handleItemToggle = (itemValue: string) => {
    if (disabled) return;
    
    let newValue: string | string[];
    
    if (type === 'single') {
      // Single selection - toggle off if same item, otherwise select new item
      newValue = currentValue === itemValue ? '' : itemValue;
    } else {
      // Multiple selection - toggle item in array
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (currentArray.includes(itemValue)) {
        newValue = currentArray.filter(v => v !== itemValue);
      } else {
        newValue = [...currentArray, itemValue];
      }
    }
    
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  };
  
  // Get item button styles
  const getItemStyles = (item: ToggleGroupItem, index: number) => {
    const isItemSelected = isSelected(item.value);
    const isItemDisabled = disabled || item.disabled;
    
    let borderRadius = 'var(--radius, 6px)';
    
    // Handle connected borders
    if (connected && items.length > 1) {
      if (orientation === 'horizontal') {
        if (index === 0) {
          borderRadius = `var(--radius, 6px) 0 0 var(--radius, 6px)`;
        } else if (index === items.length - 1) {
          borderRadius = `0 var(--radius, 6px) var(--radius, 6px) 0`;
        } else {
          borderRadius = '0';
        }
      } else {
        if (index === 0) {
          borderRadius = `var(--radius, 6px) var(--radius, 6px) 0 0`;
        } else if (index === items.length - 1) {
          borderRadius = `0 0 var(--radius, 6px) var(--radius, 6px)`;
        } else {
          borderRadius = '0';
        }
      }
    }
    
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sizeStyles.gap,
      padding: sizeStyles.padding,
      height: sizeStyles.height,
      fontSize: sizeStyles.fontSize,
      fontWeight: '500',
      borderRadius,
      border: `1px solid ${variantColors.border}`,
      backgroundColor: isItemSelected ? variantColors.backgroundActive : variantColors.background,
      color: isItemSelected ? variantColors.textActive : variantColors.text,
      cursor: isItemDisabled ? 'not-allowed' : 'pointer',
      opacity: isItemDisabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap' as const,
      userSelect: 'none' as const,
      // Handle connected borders - remove borders between items
      ...(connected && orientation === 'horizontal' && index > 0 && {
        marginLeft: '-1px',
      }),
      ...(connected && orientation === 'vertical' && index > 0 && {
        marginTop: '-1px',
      }),
    };
  };
  
  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    alignItems: 'stretch',
    gap: connected ? '0' : '4px',
    ...style,
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, itemValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemToggle(itemValue);
    }
  };
  
  return (
    <div
      className={`toggle-group-atom ${className}`}
      style={containerStyles}
      role="group"
      aria-label={ariaLabel}
      {...props}
    >
      {items.map((item, index) => {
        const isItemSelected = isSelected(item.value);
        const isItemDisabled = disabled || item.disabled;
        
        return (
          <button
            key={item.value}
            type="button"
            style={getItemStyles(item, index)}
            onClick={() => handleItemToggle(item.value)}
            onKeyDown={(e) => handleKeyDown(e, item.value)}
            disabled={isItemDisabled}
            aria-pressed={isItemSelected}
            aria-disabled={isItemDisabled}
            onMouseEnter={(e) => {
              if (!isItemDisabled && !isItemSelected) {
                e.currentTarget.style.backgroundColor = variantColors.backgroundHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!isItemDisabled && !isItemSelected) {
                e.currentTarget.style.backgroundColor = variantColors.background;
              }
            }}
          >
            {item.icon && (
              <item.icon 
                style={{
                  width: sizeStyles.iconSize,
                  height: sizeStyles.iconSize,
                  flexShrink: 0,
                }}
              />
            )}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default ToggleGroup;