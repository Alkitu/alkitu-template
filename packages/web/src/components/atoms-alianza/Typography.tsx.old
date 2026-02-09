import React, { JSX } from 'react';
import { cn } from '@/lib/utils';

// Heading Component
interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level = 1, children, className }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  // Map levels to CSS variables defined in the theme system
  // If the level is 6 and not defined in theme, it will rely on inherited/default styles or can be extended later.
  const style = {
    fontFamily: `var(--typography-h${level}-font-family)`,
    fontSize: `var(--typography-h${level}-font-size)`,
    fontWeight: `var(--typography-h${level}-font-weight)`,
    lineHeight: `var(--typography-h${level}-line-height)`,
    letterSpacing: `var(--typography-h${level}-letter-spacing)`,
  } as React.CSSProperties;

  return (
    <Tag 
      style={style}
      className={cn("text-foreground", className)}
    >
      {children}
    </Tag>
  );
}

// Body Component
interface BodyProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function Body({ size = 'md', children, className, as = 'p' }: BodyProps) {
  const Tag = as;

  const sizeClasses = {
    xs: 'body-xs',
    sm: 'body-sm',
    md: 'body-md',
    lg: 'body-lg',
  };

  return (
    <Tag className={cn(sizeClasses[size], className)}>
      {children}
    </Tag>
  );
}

// Caption Component
interface CaptionProps {
  children: React.ReactNode;
  className?: string;
}

export function Caption({ children, className }: CaptionProps) {
  return (
    <span className={cn('body-xs text-muted-foreground-m', className)}>
      {children}
    </span>
  );
}
