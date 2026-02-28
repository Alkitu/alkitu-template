import * as React from 'react';

import { cn } from './utils';

function Input({
  className,
  type,
  style,
  ...props
}: React.ComponentProps<'input'>) {
  const baseStyles: React.CSSProperties = {
    fontFamily: 'var(--typography-input-family, var(--font-sans))',
    fontSize: 'var(--typography-input-size, 0.875rem)',
    fontWeight: 'var(--typography-input-weight, 400)',
    lineHeight: 'var(--typography-input-line-height, 1.25rem)',
    borderRadius: 'var(--radius-input, var(--radius, 0.375rem))',
    transition:
      'all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))',
  };

  return (
    <input
      type={type}
      data-slot="input"
      style={{ ...baseStyles, ...style }}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 border px-3 py-1 text-base bg-input-background outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
