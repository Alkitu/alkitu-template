import type { HTMLAttributes, ReactNode } from 'react';

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
 * Image data for gallery mode
 */
export interface ImageData {
  /**
   * Image source URL
   */
  src: string;

  /**
   * Alternative text for accessibility
   */
  alt: string;

  /**
   * Optional caption/title for the image
   */
  caption?: string;
}

/**
 * Props for PreviewImage molecule
 */
export interface PreviewImageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'placeholder'> {
  /**
   * Image source URL (single image mode)
   */
  src?: string;

  /**
   * Alternative text for accessibility
   * @default ''
   */
  alt?: string;

  /**
   * Caption/title for the image (shown in lightbox)
   */
  caption?: string;

  /**
   * Multiple images for gallery mode
   */
  images?: ImageData[];

  /**
   * Initial index for gallery mode
   * @default 0
   */
  initialIndex?: number;

  /**
   * Aspect ratio preset for thumbnail
   * @default 'auto'
   */
  aspectRatio?: PreviewImageAspectRatio;

  /**
   * Custom aspect ratio (overrides preset)
   * Example: '21/9', '5/4'
   */
  customRatio?: string;

  /**
   * Size variant for thumbnail
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
  placeholder?: ReactNode;

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
   * Error handler for failed image loads
   */
  onError?: () => void;

  /**
   * Success handler for successful image loads
   */
  onLoad?: () => void;

  /**
   * Enable lightbox/modal on click
   * @default true
   */
  enableLightbox?: boolean;

  /**
   * Show download button in lightbox
   * @default true
   */
  showDownload?: boolean;

  /**
   * Custom download filename
   */
  downloadFilename?: string;

  /**
   * Disable lazy loading
   * @default false
   */
  disableLazyLoad?: boolean;

  /**
   * Callback when lightbox opens
   */
  onLightboxOpen?: () => void;

  /**
   * Callback when lightbox closes
   */
  onLightboxClose?: () => void;

  /**
   * Callback when download is triggered
   */
  onDownload?: (src: string) => void;
}
