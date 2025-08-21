'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { ColorSection as ColorSectionType } from '../../types/color-sections.types';
import { ThemeColors, ColorToken } from '../../types/theme.types';
import { COLOR_LABELS } from '../../types/color-sections.types';
import { ColorInput } from './ColorInput';

interface ColorSectionProps {
  section: ColorSectionType;
  colors: ThemeColors;
  onColorChange: (colorKey: keyof ThemeColors, newColor: ColorToken) => void;
  className?: string;
}

export function ColorSection({
  section,
  colors,
  onColorChange,
  className = ""
}: ColorSectionProps) {
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded || false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={`border border-border ${className}`}>
      {/* Section Header */}
      <Button
        variant="ghost"
        onClick={toggleExpanded}
        className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="font-medium text-sm text-foreground">
            {section.title}
          </span>
          {section.description && (
            <span className="text-xs text-muted-foreground">
              {section.description}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {section.colorKeys.map((colorKey) => {
            const color = colors[colorKey];
            const label = COLOR_LABELS[colorKey];
            
            if (!color) return null;

            return (
              <div key={colorKey} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    {label}
                  </label>
                </div>
                
                <ColorInput
                  color={color}
                  onChange={(newColor) => onColorChange(colorKey, newColor)}
                  allColors={colors}
                  mode="light"
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}