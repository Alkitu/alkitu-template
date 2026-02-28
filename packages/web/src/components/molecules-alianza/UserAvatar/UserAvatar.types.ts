import type { CSSProperties } from 'react';

/**
 * Size variants for UserAvatar
 */
export type UserAvatarSize = 'sm' | 'md' | 'lg';

/**
 * UserAvatar component props
 *
 * Molecule for displaying user avatar with initials following the Alianza design.
 * Displays initials in a golden/amber circle.
 */
export interface UserAvatarProps {
  /**
   * User's first name or full name (required)
   */
  name: string;

  /**
   * User's last name (optional)
   */
  lastName?: string;

  /**
   * URL of the user's profile image.
   * When provided, displays the image instead of initials.
   * Takes priority over `image` prop.
   */
  imageUrl?: string;

  /**
   * Raw DB image value: can be an icon name, emoji character, or URL.
   * Detected automatically:
   * - Emoji → renders emoji character
   * - Icon name (from Icons map) → renders icon component
   * - URL (http/https or /api/) → renders as image
   * - Otherwise → falls back to initials
   */
  image?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: UserAvatarSize;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme override CSS properties
   */
  themeOverride?: CSSProperties;
}
