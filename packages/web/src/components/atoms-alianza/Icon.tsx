import React from 'react';

export type Density = 'sm' | 'md' | 'lg';

export interface IconProps {
  d?: string;
  paths?: string[]; // For multi-path icons
  viewBox?: string;
  className?: string;
  color?: string;
  size?: number | string;
  strokeWidth?: number | string;
  component?: React.ComponentType<{ className?: string; strokeWidth?: string | number; stroke?: string }>;
  transform?: string;
  density?: Density;
}

export function Icon({ d, paths, viewBox = "0 0 10 10", className, color = "currentColor", size, strokeWidth, component: Component, transform, density = 'md' }: IconProps) {

  // Target box size based on density (Icon-size)
  const boxSize = React.useMemo(() => {
    switch(density) {
      case 'sm': return 10;
      case 'lg': return 20;
      case 'md': default: return 16;
    }
  }, [density]);

  // Target stroke width based on density (Icon-stroke)
  const targetStroke = React.useMemo(() => {
    switch(density) {
      case 'sm': return 1.33;
      case 'lg': return 2.33;
      case 'md': default: return 2;
    }
  }, [density]);

  // Calculate stroke scaling ratio to maintain visual weight
  const currentStrokeWidth = React.useMemo(() => {
    if (strokeWidth) return strokeWidth;
    
    // Parse viewBox to determine logical size
    const parts = viewBox.split(' ').map(parseFloat);
    let maxDim = 10; // Default
    if (parts.length === 4) {
      maxDim = Math.max(parts[2], parts[3]);
    }
    
    // Ratio = LogicalSize / RenderedSize
    // If logical size is 11.33 and rendered size is 10, we scale down (0.88x).
    // To keep visual stroke constant, we must increase the SVG stroke width.
    const ratio = maxDim / boxSize;
    
    return (targetStroke * ratio).toFixed(3);
  }, [viewBox, boxSize, targetStroke, strokeWidth]);

  const actualSize = size ?? boxSize;
  const sizeStyle = typeof actualSize === 'number' ? { width: actualSize, height: actualSize } : { width: actualSize, height: actualSize };

  // If a Figma component is provided, render it.
  if (Component) {
    return (
       <div 
        className={`content-stretch flex items-center justify-center relative shrink-0 ${className}`}
        style={sizeStyle}
      >
        <Component className="size-full" strokeWidth={currentStrokeWidth} stroke={color} />
      </div>
    );
  }

  return (
    <div 
      className={`content-stretch flex items-center justify-center relative shrink-0 ${className}`}
      style={sizeStyle}
    >
      <div className="relative shrink-0 w-full h-full">
        {/* We allow the SVG to scale to fit the box. overflow-visible ensures caps don't get cut if they extend slightly beyond viewBox */}
        <svg 
          className="block w-full h-full overflow-visible" 
          fill="none" 
          preserveAspectRatio="xMidYMid meet" 
          viewBox={viewBox}
          style={transform ? { transform } : undefined}
        >
          {paths ? (
            paths.map((p, i) => (
              <path 
                key={i} 
                d={p} 
                stroke={color} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={currentStrokeWidth} 
              />
            ))
          ) : (
            <path 
              d={d} 
              stroke={color} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={currentStrokeWidth} 
            />
          )}
        </svg>
      </div>
    </div>
  );
}
