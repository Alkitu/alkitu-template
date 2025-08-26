'use client';

import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  shape?: 'circle' | 'rounded' | 'square';
  className?: string;
}

const getAvatarSizeClasses = (size: string) => {
  switch (size) {
    case 'xs':
      return {
        container: 'h-6 w-6',
        text: 'text-xs',
        icon: 'h-3 w-3',
        status: 'h-2 w-2 border border-background'
      };
    case 'sm':
      return {
        container: 'h-8 w-8',
        text: 'text-xs',
        icon: 'h-4 w-4',
        status: 'h-2.5 w-2.5 border-2 border-background'
      };
    case 'lg':
      return {
        container: 'h-12 w-12',
        text: 'text-base',
        icon: 'h-6 w-6',
        status: 'h-3.5 w-3.5 border-2 border-background'
      };
    case 'xl':
      return {
        container: 'h-16 w-16',
        text: 'text-lg',
        icon: 'h-8 w-8',
        status: 'h-4 w-4 border-2 border-background'
      };
    case '2xl':
      return {
        container: 'h-20 w-20',
        text: 'text-xl',
        icon: 'h-10 w-10',
        status: 'h-5 w-5 border-2 border-background'
      };
    default: // md
      return {
        container: 'h-10 w-10',
        text: 'text-sm',
        icon: 'h-5 w-5',
        status: 'h-3 w-3 border-2 border-background'
      };
  }
};

const getShapeClasses = (shape: string) => {
  switch (shape) {
    case 'square':
      return 'rounded-none';
    case 'rounded':
      return 'rounded-lg';
    default: // circle
      return 'rounded-full';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-success';
    case 'away':
      return 'bg-warning';
    case 'busy':
      return 'bg-destructive';
    case 'offline':
      return 'bg-muted';
    default:
      return '';
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  status = 'none',
  shape = 'circle',
  className = ''
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  const sizeClasses = getAvatarSizeClasses(size);
  const shapeClasses = getShapeClasses(shape);
  const statusColorClasses = getStatusColor(status);

  const showImage = src && !imageError && imageLoaded;
  const showFallback = fallback && (!src || imageError || !imageLoaded);
  const showIcon = !src && !fallback;

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Avatar container */}
      <div
        className={`
          ${sizeClasses.container} ${shapeClasses}
          bg-muted flex items-center justify-center overflow-hidden
          relative
        `}
      >
        {/* Image */}
        {src && (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className={`
              h-full w-full object-cover transition-opacity duration-200
              ${showImage ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Fallback text */}
        {showFallback && (
          <span 
            className={`
              ${sizeClasses.text} font-medium text-muted-foreground
              absolute inset-0 flex items-center justify-center
            `}
            style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontWeight: 'var(--typography-emphasis-font-weight)',
              letterSpacing: 'var(--typography-emphasis-letter-spacing)'
            }}
          >
            {getInitials(fallback)}
          </span>
        )}
        
        {/* Default icon */}
        {showIcon && (
          <User 
            className={`${sizeClasses.icon} text-muted-foreground`}
          />
        )}
      </div>
      
      {/* Status indicator */}
      {status !== 'none' && (
        <span
          className={`
            ${sizeClasses.status} ${statusColorClasses}
            absolute -bottom-0 -right-0 rounded-full
          `}
        />
      )}
    </div>
  );
}