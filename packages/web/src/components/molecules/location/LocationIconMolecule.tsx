'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Icons } from '@/lib/icons';
import { getDynamicBackgroundColor } from '@/lib/utils/color';

export interface LocationIconMoleculeProps {
  icon?: string;
  iconColor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isDefault?: boolean;
}

/**
 * LocationIconMolecule
 *
 * A reusable component that renders the location icon (emoji, lucide icon, or image)
 * with the correct dynamic background color and sizing.
 */
export const LocationIconMolecule: React.FC<LocationIconMoleculeProps> = ({
  icon,
  iconColor = '#000000',
  className = '',
  size = 'md',
  isDefault = false,
}) => {
  const backgroundColor = getDynamicBackgroundColor(iconColor);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const renderIcon = () => {
    const style = { color: iconColor };
    const iconClass = iconSizeClasses[size];

    if (!icon) return <MapPin className={iconClass} style={style} />;

    if (icon.startsWith('http') || icon.startsWith('/api/')) {
      return (
        <img
          src={icon}
          alt="Location Icon"
          className="h-full w-full object-cover"
        />
      );
    }

    const IconComponent = (Icons as any)[icon];
    if (IconComponent) {
      return <IconComponent className={iconClass} style={style} />;
    }

    // Emoji
    return (
      <span
        className="text-xl leading-none"
        style={{ fontSize: size === 'lg' ? '1.5rem' : '1.25rem' }}
      >
        {icon}
      </span>
    );
  };

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full transition-colors overflow-hidden',
        sizeClasses[size],
        isDefault && 'ring-2 ring-blue-100 ring-offset-2',
        className,
      )}
      style={{ backgroundColor }}
    >
      {renderIcon()}
    </div>
  );
};
