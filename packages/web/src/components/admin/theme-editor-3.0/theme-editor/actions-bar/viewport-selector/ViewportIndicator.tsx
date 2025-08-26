'use client';

import React from 'react';
import { Badge } from '../../../design-system/primitives/badge';
import { ViewportSize, VIEWPORT_CONFIGS } from '../../../core/types/viewport.types';

interface ViewportIndicatorProps {
  currentViewport: ViewportSize;
  className?: string;
}

export function ViewportIndicator({ currentViewport, className = '' }: ViewportIndicatorProps) {
  const config = VIEWPORT_CONFIGS[currentViewport];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="secondary" className="text-xs">
        {config.name}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {config.width}×{config.height}
      </span>
    </div>
  );
}