import React from 'react';
import { Sparkles, Wrench, Package, Briefcase } from 'lucide-react';
import type { ServiceIconProps } from './ServiceIcon.types';

/**
 * ServiceIcon Component (Alianza Design System - Atom)
 *
 * Maps service categories to appropriate icons
 * Uses lucide-react icons for consistency with the design system
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
  className = '',
}) => {
  const IconComponent = CATEGORY_ICON_MAP[category] || CATEGORY_ICON_MAP.default;

  return <IconComponent className={className} />;
};
