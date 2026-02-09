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
