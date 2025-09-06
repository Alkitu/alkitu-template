'use client';

import React, { useState } from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { Icon } from './Icon';
import { Image, ImageOff, Loader2 } from 'lucide-react';

export interface PreviewImageProps {
  /**
   * Image source URL
   */
  src?: string;
  
  /**
   * Alternative text for accessibility
   */
  alt?: string;
  
  /**
   * Aspect ratio preset
   */
  aspectRatio?: 'square' | '4:3' | '16:9' | '3:2' | '2:1' | '1:1' | 'auto';
  
  /**
   * Custom aspect ratio (overrides preset)
   */
  customRatio?: string;
  
  /**
   * Size variant
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /**
   * Border radius variant
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  
  /**
   * Show loading state
   */
  loading?: boolean;
  
  /**
   * Placeholder content when no image
   */
  placeholder?: React.ReactNode;
  
  /**
   * Object fit behavior
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Custom styles
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
}

/**
 * Preview Image Atom Component
 * Displays images with configurable aspect ratios and responsive behavior
 * Includes loading states, error handling, and theme integration
 */
export function PreviewImage({
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
  ...props
}: PreviewImageProps) {
  const { state } = useThemeEditor();
  const colors = state.themeMode === 'dark' ? state.currentTheme?.darkColors : state.currentTheme?.lightColors;
  const borders = state.currentTheme?.borders;
  
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get aspect ratio value
  const getAspectRatio = (): string => {
    if (customRatio) return customRatio;
    
    const ratioMap = {
      'square': '1',
      '1:1': '1',
      '4:3': '4/3',
      '16:9': '16/9',
      '3:2': '3/2',
      '2:1': '2/1',
      'auto': 'auto'
    };
    
    return ratioMap[aspectRatio];
  };

  // Get size dimensions
  const getSizeDimensions = () => {
    const sizeMap = {
      'xs': { width: '64px', height: '64px' },
      'sm': { width: '96px', height: '96px' },
      'md': { width: '128px', height: '128px' },
      'lg': { width: '192px', height: '192px' },
      'xl': { width: '256px', height: '256px' },
      '2xl': { width: '384px', height: '384px' }
    };
    
    return sizeMap[size];
  };

  // Get border radius
  const getBorderRadius = (): string => {
    if (radius === 'none') return '0';
    if (radius === 'full') return '50%';
    
    const radiusMap = {
      'sm': borders?.radiusSm || '4px',
      'md': borders?.radius || '8px', 
      'lg': borders?.radiusLg || '12px'
    };
    
    return radiusMap[radius] || borders?.radius || '8px';
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

  const dimensions = getSizeDimensions();
  const ratio = getAspectRatio();
  const borderRadius = getBorderRadius();

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: aspectRatio === 'auto' ? dimensions.width : '100%',
    height: aspectRatio === 'auto' ? dimensions.height : 'auto',
    aspectRatio: aspectRatio !== 'auto' ? ratio : undefined,
    borderRadius,
    overflow: 'hidden',
    backgroundColor: colors?.muted?.hex || 'var(--color-muted)',
    border: `1px solid ${colors?.border?.hex || 'var(--color-border)'}`,
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  // Image styles
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    transition: 'opacity 0.2s ease-in-out'
  };

  // Show loading or error state
  const showPlaceholder = loading || imageLoading || imageError || !src;

  return (
    <div
      className={`preview-image-atom ${className}`}
      style={containerStyle}
      onClick={onClick}
      {...props}
    >
      {/* Main Image */}
      {src && !imageError && (
        <img
          src={src}
          alt={alt}
          style={{
            ...imageStyle,
            opacity: imageLoaded ? 1 : 0
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
              <Icon 
                icon={Loader2} 
                variant="muted" 
                size="lg"
                className="animate-spin"
              />
              <span 
                className="text-xs text-muted-foreground"
                style={{
                  color: colors?.mutedForeground?.hex || 'var(--color-muted-foreground)'
                }}
              >
                Cargando...
              </span>
            </div>
          ) : imageError ? (
            <div className="flex flex-col items-center gap-2">
              <Icon 
                icon={ImageOff} 
                variant="muted" 
                size="lg"
              />
              <span 
                className="text-xs text-muted-foreground text-center px-2"
                style={{
                  color: colors?.mutedForeground?.hex || 'var(--color-muted-foreground)'
                }}
              >
                Error al cargar
              </span>
            </div>
          ) : !src ? (
            placeholder || (
              <div className="flex flex-col items-center gap-2">
                <Icon 
                  icon={Image} 
                  variant="muted" 
                  size="lg"
                />
                <span 
                  className="text-xs text-muted-foreground text-center px-2"
                  style={{
                    color: colors?.mutedForeground?.hex || 'var(--color-muted-foreground)'
                  }}
                >
                  Sin imagen
                </span>
              </div>
            )
          ) : null}
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || imageLoading) && (
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          style={{
            borderRadius
          }}
        />
      )}
    </div>
  );
}

export default PreviewImage;