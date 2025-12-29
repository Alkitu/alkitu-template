'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BackToLoginButtonProps } from './BackToLoginButton.types';

/**
 * BackToLoginButton - Atom Component
 *
 * A modern, stylized button for navigating back to the login page.
 * Features a left arrow icon and consistent styling across auth pages.
 *
 * @example
 * ```tsx
 * <BackToLoginButton label="Back to Login" href="/auth/login" />
 * ```
 */
export const BackToLoginButton = React.forwardRef<
  HTMLAnchorElement,
  BackToLoginButtonProps
>(({ label, href = '/auth/login', className, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        // Base styles
        'inline-flex items-center gap-2',
        'text-sm font-medium',
        'text-muted-foreground hover:text-foreground',
        'transition-all duration-200',
        // Hover effects
        'hover:gap-3',
        // Focus styles
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'rounded-md px-2 py-1',
        className
      )}
      {...props}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </Link>
  );
});

BackToLoginButton.displayName = 'BackToLoginButton';

export default BackToLoginButton;
