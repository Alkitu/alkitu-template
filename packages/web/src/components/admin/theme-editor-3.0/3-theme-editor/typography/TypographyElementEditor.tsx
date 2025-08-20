'use client';

import React from 'react';
import { Label } from '../../ui/label';
import { SelectItem } from '../../ui/select';
import { NumericInput } from './NumericInput';
import { KeyboardSelect } from './KeyboardSelect';
import { TypographyElement } from './types';
import { ALL_GOOGLE_FONTS } from './googleFonts';

interface TypographyElementEditorProps {
  element: TypographyElement;
  onChange: (element: TypographyElement) => void;
  label: string;
  previewText: string;
  className?: string;
}

// Font weight options
const FONT_WEIGHTS = [
  { value: '100', label: 'Thin (100)' },
  { value: '200', label: 'Extra Light (200)' },
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Regular (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semi Bold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
  { value: '900', label: 'Black (900)' }
];

// Text decoration options
const TEXT_DECORATIONS = [
  { value: 'none', label: 'None' },
  { value: 'underline', label: 'Underline' },
  { value: 'overline', label: 'Overline' },
  { value: 'line-through', label: 'Line Through' },
  { value: 'underline overline', label: 'Underline + Overline' }
];

export function TypographyElementEditor({
  element,
  onChange,
  label,
  previewText,
  className = ""
}: TypographyElementEditorProps) {

  const handleChange = (property: keyof TypographyElement, value: string) => {
    onChange({
      ...element,
      [property]: value
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Live preview */}
      <div 
        className="p-3 rounded-md bg-secondary text-secondary-foreground overflow-hidden"
        style={{
          fontFamily: element.fontFamily,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          lineHeight: element.lineHeight,
          letterSpacing: element.letterSpacing,
          wordSpacing: element.wordSpacing,
          textDecoration: element.textDecoration
        }}
      >
        {previewText}
      </div>

      {/* Controls Grid - Flexbox responsive design */}
      <div className="flex flex-wrap gap-3">
        
        {/* Font Family */}
        <div className="bg-muted/30 p-3 rounded-lg flex-1 min-w-[200px] flex flex-col justify-between">
          <Label className="text-xs font-medium text-foreground self-start">Familia</Label>
          <KeyboardSelect
            value={element.fontFamily}
            onValueChange={(value) => handleChange('fontFamily', value)}
            options={ALL_GOOGLE_FONTS.map(font => ({ value: font, label: font }))}
            className="w-full mt-auto"
          >
            {ALL_GOOGLE_FONTS.map(font => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </KeyboardSelect>
        </div>

        {/* Font Weight */}
        <div className="bg-muted/30 p-3 rounded-lg flex-1 min-w-[200px] flex flex-col justify-between">
          <Label className="text-xs font-medium text-foreground self-start">Peso</Label>
          <KeyboardSelect
            value={element.fontWeight}
            onValueChange={(value) => handleChange('fontWeight', value)}
            options={FONT_WEIGHTS}
            className="w-full mt-auto"
          />
        </div>

        {/* Font Size */}
        <div className="bg-muted/30 p-3 rounded-lg flex-1 min-w-[200px] flex flex-col justify-between">
          <Label className="text-xs font-medium text-foreground self-start">Tamaño</Label>
          <NumericInput
            value={element.fontSize}
            onChange={(value) => handleChange('fontSize', value)}
            placeholder="16"
            step={0.1}
            className="w-full mt-auto"
          />
        </div>

        {/* Line Height */}
        <div className="bg-muted/30 p-3 rounded-lg flex-1 min-w-[200px] flex flex-col justify-between">
          <Label className="text-xs font-medium text-foreground self-start">Altura Línea</Label>
          <NumericInput
            value={element.lineHeight}
            onChange={(value) => handleChange('lineHeight', value)}
            placeholder="1.5"
            step={0.1}
            className="w-full mt-auto"
            unit=""
          />
        </div>

        {/* Letter Spacing */}
        <div className="bg-muted/30 p-3 rounded-lg flex-1 min-w-[200px] flex flex-col justify-between">
          <Label className="text-xs font-medium text-foreground self-start">Espaciado Letras</Label>
          <NumericInput
            value={element.letterSpacing}
            onChange={(value) => handleChange('letterSpacing', value)}
            placeholder="0"
            step={0.01}
            className="w-full mt-auto"
          />
        </div>

        {/* Word Spacing */}
        <div className="bg-muted/30 p-3 rounded-lg flex-1 min-w-[200px] flex flex-col justify-between">
          <Label className="text-xs font-medium text-foreground self-start">Espaciado Palabras</Label>
          <NumericInput
            value={element.wordSpacing}
            onChange={(value) => handleChange('wordSpacing', value)}
            placeholder="0"
            step={0.1}
            className="w-full mt-auto"
          />
        </div>

        {/* Text Decoration */}
        <div className="bg-muted/30 p-3 rounded-lg flex-1 min-w-[200px] flex flex-col justify-between">
          <Label className="text-xs font-medium text-foreground self-start">Decoración</Label>
          <KeyboardSelect
            value={element.textDecoration}
            onValueChange={(value) => handleChange('textDecoration', value)}
            options={TEXT_DECORATIONS}
            className="w-full mt-auto"
          />
        </div>
      </div>
    </div>
  );
}