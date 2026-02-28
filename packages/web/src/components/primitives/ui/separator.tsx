'use client';

/**
 * Separator Component - Re-export from atoms-alianza
 *
 * This file re-exports the canonical Separator from atoms-alianza to ensure
 * a single implementation across the app. This prevents hydration mismatches
 * caused by two different Separator components producing different DOM structures
 * during SSR vs client rendering.
 *
 * @see @/components/atoms-alianza/Separator for the full implementation
 */

export { Separator, default } from '@/components/atoms-alianza/Separator';
