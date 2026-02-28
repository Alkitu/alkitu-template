'use client';

import React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { ViewportSize } from '../../../core/types/viewport.types';
import { Icon } from '@/components/atoms-alianza/Icon';
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
  const IconComponent = VIEWPORT_ICONS[viewport];
  const label = VIEWPORT_LABELS[viewport];

  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      className={`p-0 flex items-center justify-center ${className}`}
      style={{
        width: '32px',
        height: '32px',
        minWidth: '32px',
        minHeight: '32px',
        maxWidth: '32px',
        maxHeight: '32px'
      }}
      onClick={onClick}
      title={`Switch to ${label} view`}
    >
      <Icon
        component={IconComponent}
        size="sm"
        variant={isActive ? 'default' : 'muted'}
        className={isActive ? 'text-primary-foreground' : ''}
      />
    </Button>
  );
}