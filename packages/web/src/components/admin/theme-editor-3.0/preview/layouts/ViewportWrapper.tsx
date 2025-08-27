'use client';

import React, { ReactNode } from 'react';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { VIEWPORT_CONFIGS } from '../../core/types/viewport.types';

interface ViewportWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper que maneja el responsive y escalado según el viewport actual
 */
export function ViewportWrapper({ children, className = '' }: ViewportWrapperProps) {
  const { state } = useThemeEditor();
  const currentViewport = state.viewport.current;
  const viewportConfig = VIEWPORT_CONFIGS[currentViewport];

  // Calcular dimensiones y escala para el preview
  const getPreviewDimensions = () => {
    if (currentViewport === 'desktop') {
      return {
        width: '100%',
        height: '100%',
        scale: 1,
        needsScaling: false
      };
    }

    // Para otros viewports, calcular escala para que quepa en el contenedor
    const containerWidth = window.innerWidth * 0.6; // Aproximadamente 60% del ancho
    const containerHeight = window.innerHeight * 0.7; // Aproximadamente 70% del alto
    
    const scaleX = containerWidth / viewportConfig.width;
    const scaleY = containerHeight / viewportConfig.height;
    const scale = Math.min(scaleX, scaleY, 1);

    return {
      width: `${viewportConfig.width}px`,
      height: `${viewportConfig.height}px`,
      scale,
      needsScaling: true
    };
  };

  const dimensions = getPreviewDimensions();

  if (!dimensions.needsScaling) {
    // Desktop/Native view - no scaling needed
    return (
      <div className={`h-full w-full ${className}`}>
        {children}
      </div>
    );
  }

  // Mobile/Tablet/TV view - needs scaling and device frame
  return (
    <div className="h-full flex items-center justify-center">
      <div 
        className={`
          bg-background 
          border-4 
          border-border 
          overflow-hidden 
          ${currentViewport === 'smartphone' ? 'rounded-3xl' : 'rounded-2xl'}
          shadow-2xl
          ${className}
        `}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          transform: `scale(${dimensions.scale})`,
          transformOrigin: 'center'
        }}
      >
        {/* Device frame decorations */}
        {currentViewport === 'smartphone' && (
          <>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-border rounded-full" />
          </>
        )}
        
        {/* Content */}
        <div className="h-full w-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}