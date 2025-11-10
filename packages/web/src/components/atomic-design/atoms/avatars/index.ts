/**
 * Avatar - Atomic Design Atom (PHASE 2 CONSOLIDATION)
 *
 * Consolidated from:
 * - components/ui/avatar.tsx (Radix UI primitive wrapper)
 * - theme-editor-3.0/design-system/atoms/Avatar.tsx (Feature-rich implementation)
 * - atomic-design/atoms/avatars/Avatar.tsx (Previous implementation)
 *
 * Features consolidated:
 * - 6 size variants (xs, sm, md, lg, xl, 2xl)
 * - 3 shape variants (circular, rounded, square)
 * - Status indicator (online, offline, away, busy, none)
 * - Both primitive and simplified APIs
 * - Full Radix UI accessibility
 * - Typography CSS variables
 * - Theme override capability
 */

export { Avatar, AvatarImage, AvatarFallback } from './Avatar';
export type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarSimpleProps,
  AvatarSize,
  AvatarVariant,
  AvatarStatus,
} from './Avatar.types';