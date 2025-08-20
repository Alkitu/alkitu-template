'use client';

import React, { useEffect } from 'react';
import { Card } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { ThemeTypography } from '../../types/theme.types';
import { TypographySection } from './TypographySection';
import { DEFAULT_TYPOGRAPHY } from './types';
import { applyTypographyElements } from '../../utils/css-variables';

interface TypographyEditorProps {
  typography: ThemeTypography;
  onTypographyChange: (typography: ThemeTypography) => void;
  className?: string;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' }
];

const SERIF_FONTS = [
  { value: 'Source Serif 4', label: 'Source Serif 4' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' }
];

const MONO_FONTS = [
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Fira Code', label: 'Fira Code' },
  { value: 'Monaco', label: 'Monaco' },
  { value: 'Consolas', label: 'Consolas' },
  { value: 'Source Code Pro', label: 'Source Code Pro' }
];

export function TypographyEditor({ 
  typography, 
  onTypographyChange, 
  className = ""
}: TypographyEditorProps) {
  
  // Safety check - provide default values if typography is undefined/null
  if (!typography) {
    console.warn('Typography is undefined, using fallback');
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center p-8 text-muted-foreground">
          Typography data is not available. Please check the theme configuration.
        </div>
      </div>
    );
  }

  const handleFontFamilyChange = (type: 'sans' | 'serif' | 'mono', fontName: string) => {
    const updatedTypography = {
      ...typography,
      fontFamilies: {
        ...typography.fontFamilies,
        [type]: [fontName, type === 'sans' ? 'sans-serif' : type === 'serif' ? 'serif' : 'monospace']
      }
    };
    onTypographyChange(updatedTypography);
  };

  // Handle typography elements changes
  const handleTypographyElementsChange = (elements: TypographyElements) => {
    // Apply changes to CSS variables in real-time
    applyTypographyElements(elements);
    
    // Update the theme (this could be expanded to persist in the theme object)
    console.log('Typography elements updated:', elements);
    
    // In the future, you might want to:
    // onTypographyChange({ ...typography, elements });
  };

  // Apply initial typography elements on component mount
  useEffect(() => {
    applyTypographyElements(DEFAULT_TYPOGRAPHY);
  }, []);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* New Typography Elements Section */}
      <TypographySection />

      {/* Existing Font Families Section */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Font Families</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sans Serif */}
          <div className="space-y-2">
            <Label className="text-xs">Sans Serif</Label>
            <Select 
              value={Array.isArray(typography.fontFamilies?.sans) ? typography.fontFamilies.sans[0] : typography.fontFamilies?.sans?.split(',')[0]?.trim() || 'Inter'} 
              onValueChange={(value) => handleFontFamilyChange('sans', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className="text-sm p-2 border rounded"
              style={{ fontFamily: Array.isArray(typography.fontFamilies?.sans) ? typography.fontFamilies.sans[0] : typography.fontFamilies?.sans?.split(',')[0]?.trim() || 'var(--font-sans)' }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>

          {/* Serif */}
          <div className="space-y-2">
            <Label className="text-xs">Serif</Label>
            <Select 
              value={Array.isArray(typography.fontFamilies?.serif) ? typography.fontFamilies.serif[0] : typography.fontFamilies?.serif?.split(',')[0]?.trim() || 'Georgia'} 
              onValueChange={(value) => handleFontFamilyChange('serif', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERIF_FONTS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className="text-sm p-2 border rounded"
              style={{ fontFamily: Array.isArray(typography.fontFamilies?.serif) ? typography.fontFamilies.serif[0] : typography.fontFamilies?.serif?.split(',')[0]?.trim() || 'var(--font-serif)' }}
            >
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>

          {/* Monospace */}
          <div className="space-y-2">
            <Label className="text-xs">Monospace</Label>
            <Select 
              value={Array.isArray(typography.fontFamilies?.mono) ? typography.fontFamilies.mono[0] : typography.fontFamilies?.mono?.split(',')[0]?.trim() || 'JetBrains Mono'} 
              onValueChange={(value) => handleFontFamilyChange('mono', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONO_FONTS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div 
              className="text-sm p-2 border rounded"
              style={{ fontFamily: Array.isArray(typography.fontFamilies?.mono) ? typography.fontFamilies.mono[0] : typography.fontFamilies?.mono?.split(',')[0]?.trim() || 'var(--font-mono)' }}
            >
              const greeting = "Hello World";
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
}

// Re-export new components
export { TypographySection } from './TypographySection';
export { TypographyElementEditor } from './TypographyElementEditor';
export type { TypographyElements, TypographyElement } from './types';