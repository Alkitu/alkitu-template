import type { HTMLAttributes } from 'react';

/**
 * Aspect ratio options for PreviewImage
 */
export type PreviewImageAspectRatio =
  | 'square'
  | '1:1'
  | '4:3'
  | '16:9'
  | '3:2'
  | '2:1'
  | 'auto';

/**
 * Size options for PreviewImage
 */
export type PreviewImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Border radius options for PreviewImage
 */
export type PreviewImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Object fit options for PreviewImage
 */
export type PreviewImageObjectFit =
  | 'cover'
  | 'contain'
  | 'fill'
  | 'scale-down'
  | 'none';

/**
 * Props for PreviewImage molecule
 */
export interface PreviewImageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'placeholder'> {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alternative text for accessibility
   * @default ''
   */
  alt?: string;

  /**
   * Aspect ratio preset
   * @default 'auto'
   */
  aspectRatio?: PreviewImageAspectRatio;

  /**
   * Custom aspect ratio (overrides preset)
   * Example: '21/9', '5/4'
   */
  customRatio?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: PreviewImageSize;

  /**
   * Border radius variant
   * @default 'md'
   */
  radius?: PreviewImageRadius;

  /**
   * Show loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Placeholder content when no image
   */
  placeholder?: React.ReactNode;

  /**
   * Object fit behavior
   * @default 'cover'
   */
  objectFit?: PreviewImageObjectFit;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Error handler for failed image loads
   */
  onError?: () => void;

  /**
   * Success handler for successful image loads
   */
  onLoad?: () => void;

  /**
   * Show image overlay on hover (molecule-specific feature)
   * @default false
   */
  showOverlay?: boolean;

  /**
   * Custom overlay content (molecule-specific feature)
   */
  overlayContent?: React.ReactNode;

  /**
   * Enable interactive states (molecule-specific feature)
   * @default false
   */
  interactive?: boolean;
}
