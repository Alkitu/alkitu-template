'use client';

import React from 'react';
import { ViewportSize } from '../../types/viewport.types';
import { ViewportButton } from './ViewportButton';
import { ViewportIndicator } from './ViewportIndicator';

interface ViewportSelectorProps {
  currentViewport: ViewportSize;
  onViewportChange: (viewport: ViewportSize) => void;
  showIndicator?: boolean;
  className?: string;
}

const VIEWPORTS: ViewportSize[] = ['tv', 'desktop', 'tablet', 'smartphone'];

export function ViewportSelector({ 
  currentViewport, 
  onViewportChange,
  showIndicator = false,
  className = ""
}: ViewportSelectorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Viewport Buttons */}
      <div className="flex gap-1">
        {VIEWPORTS.map((viewport) => (
          <ViewportButton
            key={viewport}
            viewport={viewport}
            isActive={currentViewport === viewport}
            onClick={() => onViewportChange(viewport)}
          />
        ))}
      </div>
      
      {/* Viewport Indicator */}
      {showIndicator && (
        <ViewportIndicator currentViewport={currentViewport} />
      )}
    </div>
  );
}