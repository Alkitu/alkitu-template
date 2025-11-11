'use client';

import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarSimpleProps,
} from './Avatar.types';

/**
 * Avatar size and variant classes using CVA
 */
const avatarVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden bg-muted',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-20 w-20 text-xl',
      },
      variant: {
        circular: 'rounded-full',
        rounded: 'rounded-lg',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'circular',
    },
  }
);

const statusVariants = cva('absolute -bottom-0 -right-0 rounded-full', {
  variants: {
    size: {
      xs: 'h-2 w-2 border border-background',
      sm: 'h-2.5 w-2.5 border-2 border-background',
      md: 'h-3 w-3 border-2 border-background',
      lg: 'h-3.5 w-3.5 border-2 border-background',
      xl: 'h-4 w-4 border-2 border-background',
      '2xl': 'h-5 w-5 border-2 border-background',
    },
    status: {
      online: 'bg-success',
      offline: 'bg-muted',
      away: 'bg-warning',
      busy: 'bg-destructive',
      none: 'hidden',
    },
  },
  defaultVariants: {
    size: 'md',
    status: 'none',
  },
});

const iconSizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
};

/**
 * Generates initials from a name
 */
const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Avatar - Atomic Design Atom (PHASE 2 CONSOLIDATION)
 *
 * A versatile avatar component supporting both primitive and simplified APIs.
 * Consolidated from UI, Theme Editor, and Atomic Design implementations.
 *
 * Features:
 * - 6 size variants (xs, sm, md, lg, xl, 2xl)
 * - 3 shape variants (circular, rounded, square)
 * - Status indicator with 5 states (online, offline, away, busy, none)
 * - Image with automatic fallback handling
 * - Initials generation from names
 * - Icon fallback (User icon)
 * - Typography CSS variables support
 * - Theme override capability
 * - Full Radix UI accessibility
 * - ForwardRef support
 * - Both primitive and simplified APIs
 *
 * @example Primitive API
 * ```tsx
 * <Avatar size="lg" variant="rounded" status="online">
 *   <AvatarImage src="/user.jpg" alt="John Doe" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * ```
 *
 * @example Simplified API
 * ```tsx
 * <Avatar
 *   src="/user.jpg"
 *   alt="John Doe"
 *   fallback="John Doe"
 *   size="lg"
 *   status="online"
 * />
 * ```
 */
export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps | AvatarSimpleProps
>(
  (
    {
      size = 'md',
      variant = 'circular',
      status = 'none',
      className,
      children,
      themeOverride,
      useSystemColors = true,
      ...props
    },
    ref
  ) => {
    // Check if simplified API is being used (has src/alt/fallback props AND no children)
    const isSimplifiedAPI =
      ('src' in props || 'alt' in props || 'fallback' in props) && !children;

    // Extract simplified API props if present
    const simplifiedProps = isSimplifiedAPI
      ? (props as AvatarSimpleProps)
      : null;

    // Status indicator component
    const StatusIndicator = status !== 'none' && (
      <span
        className={statusVariants({ size, status })}
        role="status"
        title={`Status: ${status}`}
      />
    );

    // Simplified API rendering
    if (isSimplifiedAPI && simplifiedProps) {
      const {
        src,
        alt,
        fallback,
        showIconFallback = true,
        ...restProps
      } = simplifiedProps;

      const [imageError, setImageError] = React.useState(false);
      const [imageLoaded, setImageLoaded] = React.useState(false);

      const showImage = src && !imageError && imageLoaded;
      const showFallback = fallback && (!src || imageError || !imageLoaded);
      const showIcon = !src && !fallback && showIconFallback;

      return (
        <span
          className={cn(avatarVariants({ size, variant }), className)}
          style={themeOverride}
          data-use-system-colors={useSystemColors}
          data-slot="avatar"
        >
          <AvatarPrimitive.Root
            ref={ref}
            className="h-full w-full"
            {...restProps}
          >
            {/* Image */}
            {src && (
              <AvatarPrimitive.Image
                src={src}
                alt={alt}
                className={cn(
                  'aspect-square h-full w-full object-cover transition-opacity duration-200',
                  showImage ? 'opacity-100' : 'opacity-0'
                )}
                onLoadingStatusChange={(status) => {
                  if (status === 'loaded') setImageLoaded(true);
                  if (status === 'error') setImageError(true);
                }}
                data-slot="avatar-image"
              />
            )}

            {/* Fallback with initials */}
            {(showFallback || showIcon) && (
              <AvatarPrimitive.Fallback
                className="flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground"
                style={{
                  fontFamily:
                    'var(--typography-emphasis-font-family, inherit)',
                  fontWeight:
                    'var(--typography-emphasis-font-weight, 500)',
                  letterSpacing:
                    'var(--typography-emphasis-letter-spacing, normal)',
                }}
                data-slot="avatar-fallback"
              >
                {showFallback && getInitials(fallback!)}
                {showIcon && (
                  <User
                    className={cn(
                      iconSizeClasses[size],
                      'text-muted-foreground'
                    )}
                    aria-label="User icon"
                  />
                )}
              </AvatarPrimitive.Fallback>
            )}
          </AvatarPrimitive.Root>

          {/* Status indicator */}
          {StatusIndicator}
        </span>
      );
    }

    // Primitive API rendering
    return (
      <span className="relative inline-flex">
        <AvatarPrimitive.Root
          ref={ref}
          className={cn(avatarVariants({ size, variant }), className)}
          style={themeOverride}
          data-use-system-colors={useSystemColors}
          data-slot="avatar"
          {...props}
        >
          {children}
        </AvatarPrimitive.Root>

        {/* Status indicator */}
        {StatusIndicator}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';

/**
 * AvatarImage - Image component for primitive API
 *
 * @example
 * ```tsx
 * <AvatarImage src="/user.jpg" alt="John Doe" />
 * ```
 */
export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('aspect-square h-full w-full object-cover', className)}
      data-slot="avatar-image"
      {...props}
    />
  );
});

AvatarImage.displayName = 'AvatarImage';

/**
 * AvatarFallback - Fallback component for primitive API
 *
 * Supports both text content and icon rendering.
 *
 * @example With text
 * ```tsx
 * <AvatarFallback>JD</AvatarFallback>
 * ```
 *
 * @example With icon
 * ```tsx
 * <AvatarFallback>
 *   <User className="h-5 w-5" />
 * </AvatarFallback>
 * ```
 */
export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, children, ...props }, ref) => {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground',
        className
      )}
      style={{
        fontFamily: 'var(--typography-emphasis-font-family, inherit)',
        fontWeight: 'var(--typography-emphasis-font-weight, 500)',
        letterSpacing:
          'var(--typography-emphasis-letter-spacing, normal)',
      }}
      data-slot="avatar-fallback"
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
});

AvatarFallback.displayName = 'AvatarFallback';

export default Avatar;
