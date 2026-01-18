import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'main' | 'active' | 'outline' | 'nude' | 'solid' | 'ghost';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  iconOnly?: boolean;
}

export function Button({ variant = 'main', className = '', children, iconLeft, iconRight, iconOnly, ...props }: ButtonProps) {
  // Map legacy variants
  const variantMap = {
    solid: 'main',
    ghost: 'nude',
    main: 'main',
    active: 'active',
    outline: 'outline',
    nude: 'nude'
  };
  const finalVariant = variantMap[variant as keyof typeof variantMap] || 'main';

  // Base styles
  const base = "cursor-pointer inline-flex items-center justify-center px-4 rounded-[var(--radius-button)] h-10 transition-all duration-200 text-sm whitespace-nowrap gap-2 font-medium border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    // Main: Primary color
    main: "bg-primary text-primary-foreground border-transparent hover:bg-primary/90 shadow-sm",
    
    // Active: Accent color
    active: "bg-accent text-accent-foreground border-transparent hover:opacity-90",
    
    // Outline: Primary border
    outline: "border-primary text-primary bg-background hover:bg-primary/10",
    
    // Nude: Transparent, no border
    nude: "text-primary bg-transparent border-transparent hover:bg-primary/10",
  };

  const disabledStyles = ""; 
  
  // Icon Only logic: Aspect square, no horizontal padding to ensure symmetry
  const iconOnlyStyles = iconOnly ? "aspect-square px-0 w-10" : "";

  return (
    <button 
      className={`${base} ${variants[finalVariant as keyof typeof variants]} ${disabledStyles} ${iconOnlyStyles} ${className}`} 
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
