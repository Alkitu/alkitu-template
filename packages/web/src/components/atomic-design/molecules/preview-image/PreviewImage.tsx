'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CustomIcon } from '@/components/atomic-design/atoms';
import { Image, ImageOff, Loader2 } from 'lucide-react';
import type { PreviewImageProps } from './PreviewImage.types';

/**
 * PreviewImage - Atomic Design Molecule
 *
 * Enhanced image preview component with loading states, error handling, and interactive features.
 * Composes CustomIcon atom for placeholder states and uses CSS variables for theming.
 *
 * Features:
 * - 7 aspect ratio presets (square, 4:3, 16:9, 3:2, 2:1, 1:1, auto)
 * - 6 size variants (xs, sm, md, lg, xl, 2xl)
 * - 5 border radius options (none, sm, md, lg, full)
 * - 5 object-fit modes (cover, contain, fill, scale-down, none)
 * - Loading, error, and success states
 * - Interactive hover effects
 * - Custom overlay support
 * - Theme integration via CSS variables
 *
 * @example
 * ```tsx
 * <PreviewImage
 *   src="https://example.com/image.jpg"
 *   alt="Example image"
 *   aspectRatio="16:9"
 *   size="lg"
 *   interactive
 *   showOverlay
 *   overlayContent="View Image"
 * />
 * ```
 */
export const PreviewImage = React.forwardRef<HTMLDivElement, PreviewImageProps>(
  (
    {
      src,
      alt = '',
      aspectRatio = 'auto',
      customRatio,
      size = 'md',
      radius = 'md',
      loading = false,
      placeholder,
      objectFit = 'cover',
      className = '',
      style = {},
      onClick,
      onError,
      onLoad,
      showOverlay = false,
      overlayContent,
      interactive = false,
      ...props
    },
    ref,
  ) => {
    // Internal state for image loading management
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    /**
     * Get aspect ratio CSS value from preset or custom ratio
     */
    const getAspectRatio = (): string => {
      if (customRatio) return customRatio;

      const ratioMap: Record<string, string> = {
        square: '1',
        '1:1': '1',
        '4:3': '4/3',
        '16:9': '16/9',
        '3:2': '3/2',
        '2:1': '2/1',
        auto: 'auto',
      };

      return ratioMap[aspectRatio];
    };

    /**
     * Get size dimensions for auto aspect ratio mode
     */
    const getSizeDimensions = () => {
      const sizeMap: Record<string, { width: string; height: string }> = {
        xs: { width: '64px', height: '64px' },
        sm: { width: '96px', height: '96px' },
        md: { width: '128px', height: '128px' },
        lg: { width: '192px', height: '192px' },
        xl: { width: '256px', height: '256px' },
        '2xl': { width: '384px', height: '384px' },
      };

      return sizeMap[size];
    };

    /**
     * Get border radius using CSS variables
     */
    const getBorderRadius = (): string => {
      if (radius === 'none') return '0';
      if (radius === 'full') return '50%';

      const radiusMap: Record<string, string> = {
        sm: 'var(--radius-sm, 4px)',
        md: 'var(--radius, 8px)',
        lg: 'var(--radius-lg, 12px)',
      };

      return radiusMap[radius] || 'var(--radius, 8px)';
    };

    // Handle image load start
    const handleLoadStart = () => {
      setImageLoading(true);
      setImageError(false);
      setImageLoaded(false);
    };

    // Handle image load success
    const handleLoad = () => {
      setImageLoading(false);
      setImageLoaded(true);
      setImageError(false);
      onLoad?.();
    };

    // Handle image load error
    const handleError = () => {
      setImageLoading(false);
      setImageError(true);
      setImageLoaded(false);
      onError?.();
    };

    // Handle mouse enter (molecule-specific)
    const handleMouseEnter = () => {
      if (interactive) {
        setIsHovered(true);
      }
    };

    // Handle mouse leave (molecule-specific)
    const handleMouseLeave = () => {
      if (interactive) {
        setIsHovered(false);
      }
    };

    const dimensions = getSizeDimensions();
    const ratio = getAspectRatio();
    const borderRadius = getBorderRadius();

    // Container styles with CSS variables
    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: aspectRatio === 'auto' ? dimensions.width : '100%',
      height: aspectRatio === 'auto' ? dimensions.height : 'auto',
      aspectRatio: aspectRatio !== 'auto' ? ratio : undefined,
      borderRadius,
      overflow: 'hidden',
      backgroundColor: 'var(--color-muted)',
      border: '1px solid var(--color-border)',
      cursor: onClick ? 'pointer' : 'default',
      transition: interactive
        ? 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
        : 'none',
      transform: interactive && isHovered ? 'scale(1.02)' : 'scale(1)',
      boxShadow:
        interactive && isHovered
          ? 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))'
          : 'none',
      ...style,
    };

    // Image styles
    const imageStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      objectFit,
      transition: 'opacity 0.2s ease-in-out',
    };

    // Overlay styles (molecule-specific)
    const overlayStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%)',
      opacity:
        (showOverlay && isHovered) || loading || imageLoading ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: 'var(--spacing-4, 1rem)',
      borderRadius,
    };

    // Show loading or error state
    const showPlaceholder = loading || imageLoading || imageError || !src;

    return (
      <div
        ref={ref}
        className={cn(
          'preview-image-molecule',
          interactive && 'interactive',
          className,
        )}
        style={containerStyle}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {/* Main Image */}
        {src && !imageError && (
          <img
            src={src}
            alt={alt}
            style={{
              ...imageStyle,
              opacity: imageLoaded ? 1 : 0,
            }}
            onLoadStart={handleLoadStart}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}

        {/* Placeholder/Loading/Error State */}
        {showPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center">
            {loading || imageLoading ? (
              <div className="flex flex-col items-center gap-2">
                <CustomIcon
                  icon={Loader2}
                  variant="muted"
                  size="lg"
                  className="animate-spin"
                />
                <span
                  className="text-xs"
                  style={{
                    color: 'var(--color-muted-foreground)',
                  }}
                >
                  Cargando...
                </span>
              </div>
            ) : imageError ? (
              <div className="flex flex-col items-center gap-2">
                <CustomIcon icon={ImageOff} variant="muted" size="lg" />
                <span
                  className="text-xs text-center px-2"
                  style={{
                    color: 'var(--color-muted-foreground)',
                  }}
                >
                  Error al cargar
                </span>
              </div>
            ) : !src ? (
              placeholder || (
                <div className="flex flex-col items-center gap-2">
                  <CustomIcon icon={Image} variant="muted" size="lg" />
                  <span
                    className="text-xs text-center px-2"
                    style={{
                      color: 'var(--color-muted-foreground)',
                    }}
                  >
                    Sin imagen
                  </span>
                </div>
              )
            ) : null}
          </div>
        )}

        {/* Interactive Overlay (molecule-specific feature) */}
        {(showOverlay || overlayContent) && (
          <div style={overlayStyle}>
            {overlayContent && (
              <div
                className="text-white text-sm font-medium text-center"
                style={{
                  color: 'var(--color-primary-foreground, white)',
                }}
              >
                {overlayContent}
              </div>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {(loading || imageLoading) && (
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{
              backgroundColor: 'var(--color-background, rgba(0, 0, 0, 0.2))',
              borderRadius,
            }}
          />
        )}
      </div>
    );
  },
);

PreviewImage.displayName = 'PreviewImage';

export default PreviewImage;
