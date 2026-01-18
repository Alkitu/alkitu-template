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

  const sizeClasses = {
    1: 'text-heading-xl',
    2: 'text-heading-lg',
    3: 'text-heading-md',
    4: 'text-heading-sm',
    5: 'text-heading-sm',
    6: 'text-heading-sm',
  };

  return (
    <Tag className={cn(sizeClasses[level], className)}>
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
