import React from 'react';
import { Sparkles, Wrench, Package, Briefcase } from 'lucide-react';
import { Icons } from '@/lib/icons';
import { isEmoji } from '@/lib/emojis';
import type { ServiceIconProps } from './ServiceIcon.types';

/**
 * ServiceIcon Component (Alianza Design System - Atom)
 *
 * Renders a service icon with the following priority:
 * 1. If `thumbnail` is an emoji character → render as text
 * 2. If `thumbnail` is a valid Lucide icon name → render that icon
 * 3. Fallback: category-based icon mapping
 */

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  'Mantenimiento': Wrench,
  'Limpieza': Sparkles,
  'Reparación': Wrench,
  'Entrega': Package,
  'default': Briefcase,
};

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  category,
  thumbnail,
  className = '',
  color,
}) => {
  const style = color ? { color } : undefined;

  if (thumbnail) {
    // Priority 1: Emoji character
    if (isEmoji(thumbnail)) {
      return (
        <span className={className} role="img" aria-label="service icon" style={{ lineHeight: 1, ...style }}>
          {thumbnail}
        </span>
      );
    }

    // Priority 2: Lucide icon name from the Icons registry
    const ThumbnailIcon = Icons[thumbnail as keyof typeof Icons];
    if (ThumbnailIcon) {
      return <ThumbnailIcon className={className} style={style} />;
    }
  }

  // Priority 3: Category-based fallback
  const IconComponent = CATEGORY_ICON_MAP[category] || CATEGORY_ICON_MAP.default;

  return <IconComponent className={className} style={style} />;
};
