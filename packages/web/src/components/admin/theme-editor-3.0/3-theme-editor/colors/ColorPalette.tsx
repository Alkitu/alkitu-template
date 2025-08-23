'use client';

import React from 'react';
import { Card } from '../../ui/card';
import { ThemeColors, ColorToken } from '../../types/theme.types';

interface ColorPaletteProps {
  colors: ThemeColors;
  onColorSelect: (colorKey: string, token: ColorToken) => void;
  selectedColorKey?: string;
  className?: string;
}

const COLOR_GROUPS = [
  {
    title: 'Base Colors',
    colors: ['background', 'foreground', 'border', 'input', 'ring'] as const
  },
  {
    title: 'Semantic Colors',
    colors: ['primary', 'primaryForeground', 'secondary', 'secondaryForeground'] as const
  },
  {
    title: 'State Colors',
    colors: ['muted', 'mutedForeground', 'accent', 'accentForeground'] as const
  },
  {
    title: 'UI Colors',
    colors: ['destructive', 'destructiveForeground', 'card', 'cardForeground'] as const
  },
  {
    title: 'Overlay Colors', 
    colors: ['popover', 'popoverForeground'] as const
  }
];

export function ColorPalette({ 
  colors, 
  onColorSelect, 
  selectedColorKey,
  className = ""
}: ColorPaletteProps) {
  
  const formatColorName = (key: string): string => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {COLOR_GROUPS.map(({ title, colors: groupColors }) => (
        <Card key={title} className="p-4">
          <h5 style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)'
          }} className="text-foreground mb-3">{title}</h5>
          <div className="grid grid-cols-2 gap-2">
            {groupColors.map((colorKey) => {
              const colorToken = colors[colorKey];
              if (!colorToken) return null;
              
              const isSelected = selectedColorKey === colorKey;
              
              return (
                <div
                  key={colorKey}
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors hover:bg-muted/50 ${
                    isSelected ? 'bg-primary/10 border-primary' : 'border-border'
                  }`}
                  onClick={() => onColorSelect(colorKey, colorToken)}
                >
                  <div 
                    className="w-6 h-6 rounded border shadow-sm flex-shrink-0"
                    style={{ backgroundColor: colorToken.value }}
                    title={colorToken.value}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium truncate">
                      {formatColorName(colorKey)}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {colorToken.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}