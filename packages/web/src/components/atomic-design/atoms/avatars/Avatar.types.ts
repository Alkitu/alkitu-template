import type * as AvatarPrimitive from '@radix-ui/react-avatar';
import type React from 'react';

/**
 * Avatar size variants
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Avatar shape variants
 */
export type AvatarVariant = 'circular' | 'rounded' | 'square';

/**
 * Avatar status states for status indicator
 */
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

/**
 * Base Avatar props (Primitive API)
 *
 * Extends Radix UI Avatar.Root props
 */
export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Shape variant of the avatar
   * @default 'circular'
   */
  variant?: AvatarVariant;

  /**
   * Status indicator
   * @default 'none'
   */
  status?: AvatarStatus;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme variable overrides for custom styling
   */
  themeOverride?: React.CSSProperties;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * Children elements (AvatarImage, AvatarFallback for primitive API)
   */
  children?: React.ReactNode;
}

/**
 * AvatarImage props (Primitive API)
 *
 * Extends Radix UI Avatar.Image props
 */
export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * AvatarFallback props (Primitive API)
 *
 * Extends Radix UI Avatar.Fallback props
 */
export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Fallback content (text or icon)
   */
  children?: React.ReactNode;
}

/**
 * Simplified Avatar props (All-in-one API)
 *
 * For simplified usage without composition
 */
export interface AvatarSimpleProps extends Omit<AvatarProps, 'children'> {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alternative text for the image
   * Required for accessibility
   */
  alt: string;

  /**
   * Fallback text (will be converted to initials)
   * Example: "John Doe" becomes "JD"
   */
  fallback?: string;

  /**
   * Show icon fallback if no image or fallback text
   * @default true
   */
  showIconFallback?: boolean;
}
