'use client';

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { useThemeEditor } from '../../context/ThemeEditorContext';
import { COLOR_SECTIONS, COLOR_LABELS } from '../../types/color-sections.types';
import { ColorInput } from './ColorInput';
import { ThemeColors } from '../../types/theme.types';

export function ColorEditor() {
  const { state, updateCurrentModeColors } = useThemeEditor();
  
  // Get current theme colors based on active mode
  const currentColors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  if (!currentColors) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No theme colors available
      </div>
    );
  }

  // Get default expanded sections (Primary Colors by default)
  const defaultExpandedSections = COLOR_SECTIONS
    .filter(section => section.defaultExpanded)
    .map(section => section.id);

  // Handle color updates - this will automatically apply CSS variables
  const handleColorChange = (colorKey: keyof ThemeColors, newColorToken: import('../../types/theme.types').ColorToken) => {
    if (!currentColors) return;
    
    // Update the specific color in the current mode
    const updatedColors = {
      ...currentColors,
      [colorKey]: newColorToken
    };

    // If this color has linked colors, update them too
    if (newColorToken.linkedColors && newColorToken.linkedColors.length > 0) {
      newColorToken.linkedColors.forEach(linkedColorKey => {
        if (updatedColors[linkedColorKey as keyof ThemeColors]) {
          updatedColors[linkedColorKey as keyof ThemeColors] = {
            ...updatedColors[linkedColorKey as keyof ThemeColors],
            ...newColorToken,
            name: updatedColors[linkedColorKey as keyof ThemeColors].name,
            linkedTo: colorKey
          };
        }
      });
    }

    // This will automatically apply CSS variables for live preview
    updateCurrentModeColors(updatedColors);
  };

  // Handle link changes
  const handleLinkChange = (colorName: string, linkedColors: string[]) => {
    if (!currentColors) return;
    
    const colorKey = Object.keys(currentColors).find(key => key === colorName) as keyof ThemeColors;
    if (!colorKey) return;
    
    const colorToken = currentColors[colorKey];
    if (!colorToken) return;
    
    // Update the color token with new linked colors
    const updatedColorToken = {
      ...colorToken,
      linkedColors
    };
    
    handleColorChange(colorKey, updatedColorToken);
  };

  return (
    <div className="space-y-4">
      <Accordion 
        type="multiple" 
        defaultValue={defaultExpandedSections}
        className="w-full"
      >
        {COLOR_SECTIONS.map((section) => (
          <AccordionItem 
            key={section.id} 
            value={section.id}
            className="border-border"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex flex-col items-start">
                <span className="font-medium text-foreground">{section.title}</span>
                {section.description && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {section.description}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="pb-4">
              <div className="space-y-4 pt-2">
                {section.colorKeys.map((colorKey) => {
                  const colorToken = currentColors[colorKey];
                  const label = COLOR_LABELS[colorKey];
                  
                  if (!colorToken) {
                    // Create a default color token if it doesn't exist
                    const defaultColorToken: import('../../types/theme.types').ColorToken = {
                      name: colorKey,
                      value: 'oklch(0.5 0 0)',
                      oklch: { l: 0.5, c: 0, h: 0 },
                      oklchString: 'oklch(0.5000 0.0000 0.00)',
                      hex: '#808080',
                      rgb: { r: 128, g: 128, b: 128 },
                      hsv: { h: 0, s: 0, v: 50 },
                      description: `Default ${label} color`
                    };
                    
                    return (
                      <div key={colorKey} className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          {label}
                        </label>
                        <ColorInput
                          color={defaultColorToken}
                          onChange={(newColor) => handleColorChange(colorKey, newColor)}
                          allColors={currentColors}
                          onLinkChange={handleLinkChange}
                          mode={state.themeMode}
                        />
                      </div>
                    );
                  }
                  
                  return (
                    <div key={colorKey} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {label}
                      </label>
                      <ColorInput
                        color={colorToken}
                        onChange={(newColor) => handleColorChange(colorKey, newColor)}
                        allColors={currentColors}
                        onLinkChange={handleLinkChange}
                        mode={state.themeMode}
                      />
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}