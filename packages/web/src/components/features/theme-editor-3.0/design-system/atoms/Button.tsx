'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'loading' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  // Accessibility props (NEW - additive only)
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-live'?: 'off' | 'polite' | 'assertive';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', loading = false, icon, style, ...props }, ref) => {
    
    // Estilos base del botón
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
      outline: 'none',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease-in-out',
      
      // Variables globales del Theme Editor
      fontFamily: 'var(--typography-paragraph-font-family)',
      fontSize: 'var(--typography-paragraph-font-size)',
      letterSpacing: 'var(--typography-paragraph-letter-spacing)',
      borderRadius: 'var(--radius-button, var(--radius))', // Usa --radius-button si está disponible, fallback a --radius
      
      // Tamaños (sin override de fontSize para que use el CSS variable)
      ...(size === 'sm' && {
        height: '36px',
        paddingLeft: '12px',
        paddingRight: '12px',
        // fontSize se mantiene del CSS variable
      }),
      ...(size === 'default' && {
        height: '40px',
        paddingLeft: '16px',
        paddingRight: '16px',
        // fontSize se mantiene del CSS variable
      }),
      ...(size === 'lg' && {
        height: '44px',
        paddingLeft: '20px',
        paddingRight: '20px',
        // fontSize podría ser ligeramente mayor pero basado en variable
        fontSize: 'calc(var(--typography-paragraph-font-size) * 1.1)',
      }),
      ...(size === 'icon' && {
        height: '40px',
        width: '40px',
        padding: '0',
        // fontSize se mantiene del CSS variable para iconos también
      }),
      
      // Estados disabled
      ...(props.disabled && {
        opacity: 0.5,
        cursor: 'not-allowed',
      }),
    };

    // Clases CSS para variantes usando el sistema de colores globales
    const getVariantClasses = (): string => {
      switch (variant) {
        case 'default': // Primary button
          return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90';
        
        case 'outline': // Outline button
          return 'bg-transparent text-primary border-primary hover:bg-primary/10';
        
        case 'ghost': // Ghost button
          return 'bg-transparent text-primary border-transparent hover:bg-muted';
        
        case 'destructive': // Destructive button
          return 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90';
        
        case 'secondary': // Secondary button
          return 'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80';

        case 'loading': // Loading button
          return 'bg-primary text-primary-foreground border-primary opacity-70 cursor-not-allowed';

        case 'icon': // Icon button - same as primary
          return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90';
        
        default:
          return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90';
      }
    };

    // Accessibility enhancements (NEW - additive only)
    const getAccessibilityProps = () => {
      const accessibilityProps: Record<string, any> = {
        // Enhanced focus indicators
        'data-focus-visible': true,
        // Loading state accessibility
        'aria-busy': loading ? 'true' : undefined,
        'aria-disabled': (props.disabled || loading) ? 'true' : undefined,
      };

      // Add aria-label for icon-only buttons
      if (variant === 'icon' && !props.children && !props['aria-label']) {
        accessibilityProps['aria-label'] = 'Button';
      }

      // Add aria-live for loading state changes
      if (loading && !props['aria-live']) {
        accessibilityProps['aria-live'] = 'polite';
      }

      return accessibilityProps;
    };

    return (
      <button
        ref={ref}
        className={`${getVariantClasses()} ${className} border`}
        style={{
          ...baseStyles,
          ...style,
          // Enhanced focus indicators (CSS only) - NEW accessibility enhancement
          outline: '2px solid transparent',
          outlineOffset: '2px',
          // Focus ring with high contrast for accessibility
          '--focus-ring-color': 'var(--colors-primary, #0066CC)',
          // Enhanced focus visibility
          boxShadow: loading ? 'none' : undefined,
        }}
        // CSS focus-visible handler (additive enhancement)
        onFocus={(e) => {
          // Enhanced focus ring for accessibility
          e.currentTarget.style.outline = '2px solid var(--focus-ring-color)';
          e.currentTarget.style.outlineOffset = '2px';
          // Call original onFocus if provided
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          // Remove focus ring
          e.currentTarget.style.outline = '2px solid transparent';
          // Call original onBlur if provided
          if (props.onBlur) props.onBlur(e);
        }}
        // Keyboard accessibility (additive enhancement)
        onKeyDown={(e) => {
          // Support Enter and Space key activation for enhanced accessibility
          if ((e.key === 'Enter' || e.key === ' ') && !props.disabled && !loading) {
            e.preventDefault();
            if (props.onClick) {
              props.onClick(e as any); // Type cast needed for keyboard to mouse event
            }
          }
          // Call original onKeyDown if provided
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        disabled={props.disabled || loading}
        {...getAccessibilityProps()}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24"
            style={{ marginRight: props.children ? '8px' : '0' }}
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && (
          <span style={{ marginRight: props.children ? '8px' : '0' }}>
            {icon}
          </span>
        )}
        {props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Performance Optimization Wrapper (NEW - ETAPA 3: Performance Optimization)
// React.memo wrapper para prevenir re-renders innecesarios
// NO modifica el componente original - solo añade optimización como wrapper
export const MemoizedButton = React.memo(Button, (prevProps, nextProps) => {
  // Custom comparison para optimizar re-renders específicos del Button

  // Si el loading state cambia, siempre re-renderizar
  if (prevProps.loading !== nextProps.loading) return false;

  // Si el disabled state cambia, siempre re-renderizar
  if (prevProps.disabled !== nextProps.disabled) return false;

  // Si las props básicas cambian, re-renderizar
  if (prevProps.variant !== nextProps.variant) return false;
  if (prevProps.size !== nextProps.size) return false;
  if (prevProps.className !== nextProps.className) return false;

  // Comparación profunda para children (puede ser ReactNode complejo)
  if (JSON.stringify(prevProps.children) !== JSON.stringify(nextProps.children)) return false;

  // Si todas las props críticas son iguales, evitar re-render
  return true;
});

MemoizedButton.displayName = 'MemoizedButton';

// Mantener exportación original para compatibilidad total
// Los usuarios pueden optar por usar MemoizedButton para mejor rendimiento
export default Button;