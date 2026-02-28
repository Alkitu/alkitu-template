import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/lib/icons';
import { isEmoji } from '@/lib/emojis';
import type { UserAvatarProps } from './UserAvatar.types';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

/**
 * UserAvatar - Molecule for displaying user avatar with initials, icon, emoji, or image
 *
 * Displays initials in a golden/amber circle following the Alianza design.
 * Supports multiple content types via the `image` prop:
 * - Emoji character -> rendered centered
 * - Icon name (from Icons map) -> rendered as icon component
 * - URL -> rendered as image
 * - Fallback -> initials
 *
 * The `imageUrl` prop takes priority over `image` for backward compatibility.
 *
 * @example
 * ```tsx
 * <UserAvatar name="Ana" lastName="Martinez" />
 * <UserAvatar name="Luis" image="UserCircle" size="lg" />
 * <UserAvatar name="Ana" image="😊" />
 * <UserAvatar name="Luis" imageUrl="https://..." size="lg" />
 * ```
 */
export function UserAvatar({
  name,
  lastName,
  imageUrl,
  image,
  size = 'md',
  className,
  themeOverride
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Generate initials
  const getInitials = (): string => {
    const nameParts = name.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || '';
    const lastNamePart = lastName?.trim() || nameParts[1] || '';

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastNamePart.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`.slice(0, 2);
  };

  const altText = `${name}${lastName ? ` ${lastName}` : ''}`;

  // Priority 1: explicit imageUrl prop (backward compat)
  if (imageUrl && !imgError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full overflow-hidden",
          "bg-primary text-primary-foreground font-semibold",
          "shrink-0",
          sizeClasses[size],
          className
        )}
        style={themeOverride}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Priority 2: detect type from `image` prop
  let content: React.ReactNode = getInitials();

  if (image) {
    if (isEmoji(image)) {
      // Emoji
      content = <span className="leading-none">{image}</span>;
    } else if (image in Icons) {
      // Icon name
      const IconComponent = Icons[image as keyof typeof Icons];
      content = <IconComponent className={iconSizeClasses[size]} />;
    } else if (image.startsWith('http') || image.startsWith('/api/')) {
      // URL — render as image
      if (!imgError) {
        return (
          <div
            className={cn(
              "flex items-center justify-center rounded-full overflow-hidden",
              "bg-primary text-primary-foreground font-semibold",
              "shrink-0",
              sizeClasses[size],
              className
            )}
            style={themeOverride}
          >
            <img
              src={image}
              alt={altText}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        );
      }
      // If image URL failed, content stays as initials (default)
    }
    // Otherwise: unknown value, fall back to initials
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full overflow-hidden",
        "bg-primary text-primary-foreground font-semibold",
        "shrink-0",
        sizeClasses[size],
        className
      )}
      style={themeOverride}
    >
      {content}
    </div>
  );
}

UserAvatar.displayName = 'UserAvatar';
