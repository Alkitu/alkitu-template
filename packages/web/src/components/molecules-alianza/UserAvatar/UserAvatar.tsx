import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { UserAvatarProps } from './UserAvatar.types';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

/**
 * UserAvatar - Molecule for displaying user avatar with initials or image
 *
 * Displays initials in a golden/amber circle following the Alianza design.
 * When imageUrl is provided, shows the image instead of initials.
 * Falls back to initials if the image fails to load.
 *
 * @example
 * ```tsx
 * <UserAvatar name="Ana" lastName="Martínez" />
 * <UserAvatar name="Luis" imageUrl="https://..." size="lg" />
 * ```
 */
export function UserAvatar({
  name,
  lastName,
  imageUrl,
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

  const showImage = imageUrl && !imgError;

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
      {showImage ? (
        <img
          src={imageUrl}
          alt={`${name}${lastName ? ` ${lastName}` : ''}`}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        getInitials()
      )}
    </div>
  );
}

UserAvatar.displayName = 'UserAvatar';
