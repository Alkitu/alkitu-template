'use client';

import React from 'react';
import { useThemeEditor } from '../../context/ThemeEditorContext';
import { COLOR_SECTIONS } from '../../types/color-sections.types';
import { ColorSection } from './ColorSection';
import { ColorToken, ThemeColors } from '../../types/theme.types';

export function ColorsEditor() {
  const { state, updateCurrentModeColors } = useThemeEditor();

  if (!state.currentTheme) {
    return (
      <div className="h-full bg-card flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">No theme loaded</div>
        </div>
      </div>
    );
  }

  const handleColorChange = (colorKey: keyof ThemeColors, newColor: ColorToken) => {
    const updatedColors = {
      ...state.currentTheme.colors,
      [colorKey]: newColor
    };
    
    // Update colors for current mode and apply to CSS immediately
    updateCurrentModeColors(updatedColors);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Colors</h2>
          <p className="text-sm text-muted-foreground">
            Configure your theme colors using the OKLCH color space for modern, perceptually uniform colors.
          </p>
        </div>

        {/* Color Sections */}
        <div className="space-y-3">
          {COLOR_SECTIONS.map((section) => (
            <ColorSection
              key={section.id}
              section={section}
              colors={state.currentTheme.colors}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}