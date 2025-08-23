'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'loading' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
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
      
      // Tamaños
      ...(size === 'sm' && {
        height: '36px',
        paddingLeft: '12px',
        paddingRight: '12px',
        fontSize: '14px',
      }),
      ...(size === 'default' && {
        height: '40px',
        paddingLeft: '16px',
        paddingRight: '16px',
        fontSize: '14px',
      }),
      ...(size === 'lg' && {
        height: '44px',
        paddingLeft: '20px',
        paddingRight: '20px',
        fontSize: '16px',
      }),
      ...(size === 'icon' && {
        height: '40px',
        width: '40px',
        padding: '0',
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

        case 'icon': // Icon button
          return 'bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground';
        
        default:
          return 'bg-primary text-primary-foreground border-primary hover:bg-primary/90';
      }
    };

    return (
      <button
        ref={ref}
        className={`${getVariantClasses()} ${className} border`}
        style={{
          ...baseStyles,
          ...style,
        }}
        disabled={props.disabled || loading}
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