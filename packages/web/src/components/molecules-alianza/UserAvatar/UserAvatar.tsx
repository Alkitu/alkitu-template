import React from 'react';
import { cn } from '@/lib/utils';
import type { UserAvatarProps } from './UserAvatar.types';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

/**
 * UserAvatar - Molecule for displaying user avatar with initials
 *
 * Displays initials in a golden/amber circle following the Alianza design.
 * Generates initials from first letter of name and last name.
 *
 * @example
 * ```tsx
 * <UserAvatar name="Ana" lastName="Martínez" />
 * <UserAvatar name="Luis Gómez" size="lg" />
 * ```
 */
export function UserAvatar({
  name,
  lastName,
  size = 'md',
  className,
  themeOverride
}: UserAvatarProps) {
  // Generate initials
  const getInitials = (): string => {
    // Split by whitespace (handles multiple spaces) and filter out empty strings
    const nameParts = name.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || '';
    const lastNamePart = lastName?.trim() || nameParts[1] || '';

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastNamePart.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`.slice(0, 2);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        "bg-primary text-primary-foreground font-semibold",
        "shrink-0",
        sizeClasses[size],
        className
      )}
      style={themeOverride}
    >
      {getInitials()}
    </div>
  );
}

UserAvatar.displayName = 'UserAvatar';
