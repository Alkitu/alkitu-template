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

    // Determine the final right icon
    const finalRightIcon = showPasswordToggle ? (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
          }}
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

