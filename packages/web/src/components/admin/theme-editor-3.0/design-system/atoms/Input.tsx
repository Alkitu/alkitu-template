'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success' | 'warning' | 'ghost' | 'filled';
  inputSize?: 'sm' | 'default' | 'lg';
  isInvalid?: boolean;
  isValid?: boolean;
  isWarning?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  // Accessibility props (NEW - additive only)
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    variant = 'default', 
    inputSize = 'default', 
    isInvalid = false,
    isValid = false,
    isWarning = false,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    type,
    style,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Determine the final type based on password toggle
    const finalType = showPasswordToggle 
      ? (showPassword ? 'text' : 'password')
      : type;
    
    // Determine variant based on validation states (priority: error > warning > success > default)
    const finalVariant = isInvalid ? 'error' 
      : isWarning ? 'warning'
      : isValid ? 'success' 
      : variant;
    
    // Estilos base del input
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      outline: 'none',
      transition: 'all 0.15s ease-in-out',
      position: 'relative',
      
      // Variables globales del Theme Editor
      fontFamily: 'var(--typography-paragraph-font-family)',
      fontSize: 'var(--typography-paragraph-font-size)',
      letterSpacing: 'var(--typography-paragraph-letter-spacing)',
      borderRadius: 'var(--radius-input, var(--radius))', // Usa --radius-input si está disponible
      borderWidth: 'var(--border-width, 1px)',
      
      // Tamaños
      ...(inputSize === 'sm' && {
        height: '36px',
        paddingLeft: leftIcon ? '36px' : '12px',
        paddingRight: (rightIcon || showPasswordToggle) ? '36px' : '12px',
        fontSize: '14px',
      }),
      ...(inputSize === 'default' && {
        height: '40px',
        paddingLeft: leftIcon ? '40px' : '16px',
        paddingRight: (rightIcon || showPasswordToggle) ? '40px' : '16px',
        fontSize: '14px',
      }),
      ...(inputSize === 'lg' && {
        height: '48px',
        paddingLeft: leftIcon ? '48px' : '20px',
        paddingRight: (rightIcon || showPasswordToggle) ? '48px' : '20px',
        fontSize: '16px',
      }),
      
      // Estados disabled
      ...(props.disabled && {
        opacity: 0.5,
        cursor: 'not-allowed',
      }),
    };

    // Clases CSS para variantes usando el sistema de colores globales
    const getVariantClasses = (): string => {
      switch (finalVariant) {
        case 'default':
          return 'bg-background text-foreground border-input placeholder:text-muted-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20';
        
        case 'error':
          return 'bg-background text-foreground border-destructive placeholder:text-muted-foreground hover:border-destructive/70 focus:border-destructive focus:ring-2 focus:ring-destructive/20';
        
        case 'success':
          return 'bg-background text-foreground border-success placeholder:text-muted-foreground hover:border-success/70 focus:border-success focus:ring-2 focus:ring-success/20';
          
        case 'warning':
          return 'bg-background text-foreground border-warning placeholder:text-muted-foreground hover:border-warning/70 focus:border-warning focus:ring-2 focus:ring-warning/20';
        
        case 'ghost':
          return 'bg-transparent text-foreground border-transparent placeholder:text-muted-foreground hover:bg-muted focus:bg-background focus:border-input focus:ring-2 focus:ring-primary/20';
          
        case 'filled':
          return 'bg-muted text-foreground border-transparent placeholder:text-muted-foreground hover:bg-muted/80 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20';
        
        default:
          return 'bg-background text-foreground border-input placeholder:text-muted-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20';
      }
    };

    // Estilos para los iconos
    const getIconStyles = (position: 'left' | 'right'): React.CSSProperties => ({
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      ...(position === 'left' && { left: inputSize === 'sm' ? '8px' : inputSize === 'lg' ? '16px' : '12px' }),
      ...(position === 'right' && { right: inputSize === 'sm' ? '8px' : inputSize === 'lg' ? '16px' : '12px' }),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    });

    // Accessibility enhancements (NEW - additive only)
    const getAccessibilityProps = () => {
      const accessibilityProps: Record<string, any> = {
        // Enhanced focus indicators
        'data-focus-visible': true,
        // Validation state accessibility
        'aria-invalid': isInvalid || props['aria-invalid'] ? 'true' : 'false',
        'aria-required': props.required || props['aria-required'] ? 'true' : undefined,
      };

      // Auto-generate aria-label for common input types
      if (!props['aria-label'] && !props.placeholder) {
        if (type === 'email') accessibilityProps['aria-label'] = 'Email address';
        else if (type === 'password') accessibilityProps['aria-label'] = 'Password';
        else if (type === 'search') accessibilityProps['aria-label'] = 'Search';
        else if (type === 'tel') accessibilityProps['aria-label'] = 'Phone number';
        else if (type === 'url') accessibilityProps['aria-label'] = 'Website URL';
        else accessibilityProps['aria-label'] = 'Text input';
      }

      return accessibilityProps;
    };

    // Determine the final right icon with accessibility
    const finalRightIcon = showPasswordToggle ? (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1} // Remove from tab order, focus should stay on input
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    ) : rightIcon;

    return (
      <div className="relative w-full">
        {/* Left Icon */}
        {leftIcon && (
          <div 
            style={getIconStyles('left')}
            className="text-muted-foreground pointer-events-none"
          >
            {leftIcon}
          </div>
        )}
        
        {/* Input Element */}
        <input
          ref={ref}
          type={finalType}
          className={`${getVariantClasses()} ${className}`}
          style={{
            ...baseStyles,
            ...style,
            // Enhanced focus indicators (CSS only) - NEW accessibility enhancement
            '--focus-ring-color': isInvalid
              ? 'var(--colors-destructive, #DC2626)'
              : isWarning
              ? 'var(--colors-warning, #D97706)'
              : isValid
              ? 'var(--colors-success, #16A34A)'
              : 'var(--colors-primary, #0066CC)',
          }}
          // Enhanced focus handlers (additive enhancement)
          onFocus={(e) => {
            // Enhanced focus ring for accessibility
            e.currentTarget.style.outline = '2px solid var(--focus-ring-color)';
            e.currentTarget.style.outlineOffset = '2px';
            // Call original onFocus if provided
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            // Remove focus ring
            e.currentTarget.style.outline = 'none';
            // Call original onBlur if provided
            if (props.onBlur) props.onBlur(e);
          }}
          {...getAccessibilityProps()}
          {...props}
        />
        
        {/* Right Icon */}
        {finalRightIcon && (
          <div 
            style={getIconStyles('right')}
            className="text-muted-foreground pointer-events-auto"
          >
            {finalRightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Performance Optimization Wrapper (NEW - ETAPA 3: Performance Optimization)
// React.memo wrapper optimizado para Input component
export const MemoizedInput = React.memo(Input, (prevProps, nextProps) => {
  // Optimización específica para inputs - evitar re-renders por cambios mínimos

  // Props críticas que requieren re-render
  const criticalProps = [
    'type', 'value', 'defaultValue', 'placeholder', 'disabled',
    'variant', 'inputSize', 'isInvalid', 'isValid', 'isWarning'
  ];

  // Verificar cambios en props críticas
  for (const prop of criticalProps) {
    if (prevProps[prop] !== nextProps[prop]) return false;
  }

  // Verificar cambios en iconos (pueden ser ReactNode complejos)
  if (prevProps.leftIcon !== nextProps.leftIcon) return false;
  if (prevProps.rightIcon !== nextProps.rightIcon) return false;
  if (prevProps.showPasswordToggle !== nextProps.showPasswordToggle) return false;

  // Verificar handlers de eventos (cambios de referencia)
  if (prevProps.onChange !== nextProps.onChange) return false;
  if (prevProps.onFocus !== nextProps.onFocus) return false;
  if (prevProps.onBlur !== nextProps.onBlur) return false;

  return true; // Props iguales, evitar re-render
});

MemoizedInput.displayName = 'MemoizedInput';

export default Input;

