'use client';

import { cn } from '@/lib/utils';
import type { CharacterCountProps } from './CharacterCount.types';

/**
 * CharacterCount Atom Component
 *
 * Displays the current character count and optional maximum limit.
 * Changes color based on usage:
 * - Default: muted foreground
 * - Near limit (>80%): orange
 * - Over limit: destructive (red)
 *
 * @component
 * @example
 * ```tsx
 * <CharacterCount current={42} max={100} />
 * ```
 */
export function CharacterCount({ current, max, className }: CharacterCountProps) {
  if (!max) return null;

  const percentage = (current / max) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = current > max;

  return (
    <p
      className={cn(
        'text-xs text-right mt-1',
        isOverLimit && 'text-destructive font-medium',
        isNearLimit && !isOverLimit && 'text-orange-500',
        !isNearLimit && 'text-muted-foreground',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={`${current} of ${max} characters used`}
    >
      {current} / {max}
    </p>
  );
}
