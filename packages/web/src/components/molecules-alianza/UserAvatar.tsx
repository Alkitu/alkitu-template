import React from 'react';
import { cn } from '@/lib/utils';

export interface UserAvatarProps {
  name: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

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
  className 
}: UserAvatarProps) {
  // Generate initials
  const getInitials = (): string => {
    const firstName = name.trim().split(' ')[0] || '';
    const lastNamePart = lastName?.trim() || name.trim().split(' ')[1] || '';
    
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
    >
      {getInitials()}
    </div>
  );
}
