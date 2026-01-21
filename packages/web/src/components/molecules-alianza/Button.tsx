import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'main' | 'active' | 'outline' | 'nude' | 'solid' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean;
}

export function Button({ 
  variant = 'main', 
  size = 'md',
  className = '', 
  children, 
  iconLeft, 
  iconRight, 
  iconOnly, 
  ...props 
}: ButtonProps) {
  // Map legacy variants
  const variantMap = {
    solid: 'main',
    ghost: 'nude',
    main: 'main',
    active: 'active',
    outline: 'outline',
    nude: 'nude',
    destructive: 'destructive'
  };
  const finalVariant = variantMap[variant as keyof typeof variantMap] || 'main';

  // Base styles
  const base = "cursor-pointer inline-flex items-center justify-center rounded-[var(--radius-button)] transition-all duration-200 text-sm whitespace-nowrap gap-2 font-medium border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-base"
  };

  const variants = {
    // Main: Primary color
    main: "bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-sm",
    
    // Active: Accent color
    active: "bg-accent text-accent-foreground border-transparent hover:opacity-90",
    
    // Outline: Primary border
    outline: "border-primary text-primary bg-background hover:bg-primary/10",
    
    // Nude: Transparent, no border
    nude: "text-primary bg-transparent border-transparent hover:bg-primary/10 shadow-none",

    // Destructive: Red
    destructive: "bg-destructive text-destructive-foreground border-transparent hover:bg-destructive/90 shadow-sm"
  };

  const disabledStyles = ""; 
  
  // Icon Only logic: Aspect square, no horizontal padding to ensure symmetry
  const iconOnlyStyles = iconOnly ? {
    sm: "aspect-square px-0 w-8",
    md: "aspect-square px-0 w-10",
    lg: "aspect-square px-0 w-12"
  }[size] : "";

  return (
    <button 
      className={`${base} ${sizes[size]} ${variants[finalVariant as keyof typeof variants]} ${disabledStyles} ${iconOnlyStyles} ${className}`} 
      {...props}
    >
      {iconLeft && <span className={`${size === 'sm' ? '[&>svg]:size-3.5' : '[&>svg]:size-4'} shrink-0 flex items-center justify-center`}>{iconLeft}</span>}
      {children}
      {iconRight && <span className={`${size === 'sm' ? '[&>svg]:size-3.5' : '[&>svg]:size-4'} shrink-0 flex items-center justify-center`}>{iconRight}</span>}
    </button>
  );
}
