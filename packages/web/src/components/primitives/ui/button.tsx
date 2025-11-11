/**
 * MIGRATION NOTE: This file now re-exports from the unified design system
 * All Button functionality has been consolidated into design-system/primitives/Button
 * This re-export maintains backward compatibility with existing imports
 */

import { cn } from '@/lib/utils';

export {
  Button,
  MemoizedButton,
} from '@/components/features/theme-editor-3.0/design-system/primitives/Button';
export type { ButtonProps } from '@/components/features/theme-editor-3.0/design-system/primitives/Button';

/**
 * buttonVariants utility function for consistent button styling
 * Used primarily with Link components that need button-like appearance
 */
export const buttonVariants = ({
  variant = 'default',
  size = 'default',
  className = '',
}: {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
} = {}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
    destructive:
      'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
    outline:
      'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
    secondary:
      'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  };

  return cn(baseStyles, variants[variant], sizes[size], className);
};
