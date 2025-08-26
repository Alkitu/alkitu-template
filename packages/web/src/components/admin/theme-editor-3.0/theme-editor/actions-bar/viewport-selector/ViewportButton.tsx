'use client';

import React from 'react';
import { Button } from '../../../design-system/primitives/button';
import { ViewportSize } from '../../../core/types/viewport.types';
import { Monitor, Tv, Tablet, Smartphone } from 'lucide-react';

interface ViewportButtonProps {
  viewport: ViewportSize;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const VIEWPORT_ICONS = {
  tv: Tv,
  desktop: Monitor,
  tablet: Tablet,
  smartphone: Smartphone
} as const;

const VIEWPORT_LABELS = {
  tv: 'TV',
  desktop: 'Desktop', 
  tablet: 'Tablet',
  smartphone: 'Phone'
} as const;

export function ViewportButton({ viewport, isActive, onClick, className = '' }: ViewportButtonProps) {
  const Icon = VIEWPORT_ICONS[viewport];
  const label = VIEWPORT_LABELS[viewport];
  
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      className={`h-8 w-8 p-0 ${className}`}
      onClick={onClick}
      title={`Switch to ${label} view`}
    >
      <Icon className="h-3 w-3" />
    </Button>
  );
}