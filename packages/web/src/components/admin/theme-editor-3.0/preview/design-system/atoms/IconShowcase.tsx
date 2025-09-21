'use client';

import React, { useState } from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Icon } from '../../../design-system/atoms/Icon';
import { SystemIcons } from '../../../design-system/atoms/IconLibrary';

/**
 * Icon Showcase Component
 * Displays custom icon library in a 20x20 grid with primary color
 */
export function IconShowcase() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  
  // Get all 80 icons for grid layout  
  const iconEntries = Object.entries(SystemIcons);

  return (
    <ShowcaseContainer name="Icon Library" tokenId="icon-library">
      <div className="w-full">
        <p className="text-sm text-muted-foreground mb-4">
          {iconEntries.length} essential system icons • 16px standard size • Theme Editor icons included
        </p>
        
        {/* Responsive Icon Grid */}
        <div 
          className="grid gap-1 max-w-full overflow-hidden"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
            width: '100%'
          }}
        >
          {iconEntries.map(([name, IconComponent]) => (
            <div
              key={name}
              className="relative group"
              onMouseEnter={() => setHoveredIcon(name)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <div 
                className="aspect-square flex items-center justify-center p-1.5 rounded hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <Icon 
                  icon={IconComponent as any} 
                  size="sm"
                  variant="primary"
                />
              </div>
              
              {/* Tooltip */}
              {hoveredIcon === name && (
                <div 
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg border border-border whitespace-nowrap z-10"
                  style={{ pointerEvents: 'none' }}
                >
                  {name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ShowcaseContainer>
  );
}

export default IconShowcase;