'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import { Label } from '@/components/primitives/ui/label';
import { ColorSelectorPopover } from './color-selector-popover';
import { oklchToHex, hexToOklch } from '@/lib/themeUtils';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  name: string;
  color: string;
  onChange: (color: string) => void;
  label: string;
  description?: string;
  className?: string;
}

export function ColorPicker({
  name,
  color,
  onChange,
  label,
  description,
  className,
}: ColorPickerProps) {
  const textInputRef = useRef<HTMLInputElement>(null);

  // Convert OKLCH to hex for native color input
  const convertOKLCHToHex = useCallback((oklchValue: string): string => {
    try {
      if (oklchValue.includes('oklch')) {
        const match = oklchValue.match(/oklch\(([^)]+)\)/);
        if (match) {
          return oklchToHex(match[1]);
        }
      }
      return oklchToHex(oklchValue);
    } catch (error) {
      console.error('Error converting OKLCH to hex:', error);
      return '#000000';
    }
  }, []);

  // Convert hex to OKLCH
  const convertHexToOKLCH = useCallback((hex: string): string => {
    try {
      return hexToOklch(hex);
    } catch (error) {
      console.error('Error converting hex to OKLCH:', error);
      return '0% 0 0';
    }
  }, []);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.value = color;
    }
  }, [color]);

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHex = e.target.value;
      const oklchValue = convertHexToOKLCH(newHex);
      onChange(oklchValue);
    },
    [onChange, convertHexToOKLCH],
  );

  const handleTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const colorString = e.target.value;
      onChange(colorString);
    },
    [onChange],
  );

  const currentHex = convertOKLCHToHex(color);
  const displayColor = color.includes('oklch') ? color : `oklch(${color})`;

  return (
    <div className={cn('mb-3', className)}>
      <div className="mb-1.5 flex items-center justify-between">
        <Label htmlFor={`color-${name}`} className="text-xs font-medium">
          {label}
        </Label>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
      )}

      <div className="relative flex items-center gap-1">
        {/* Color Preview */}
        <div
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded border"
          style={{ backgroundColor: currentHex }}
          title={displayColor}
        >
          {/* Native Color Picker Input (Hidden) */}
          <input
            type="color"
            id={`color-${name}`}
            value={currentHex}
            onChange={handleColorChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        {/* Text Input */}
        <input
          ref={textInputRef}
          type="text"
          defaultValue={color}
          onChange={handleTextInputChange}
          className="bg-input/25 border-border/20 h-8 flex-1 rounded border px-2 text-sm"
          placeholder="Enter OKLCH (210 40% 50%) or hex"
        />

        {/* Tailwind Color Selector */}
        <ColorSelectorPopover
          currentColor={displayColor}
          onChange={(newColor) => {
            const oklchValue = newColor.replace(/oklch\((.+)\)/, '$1');
            onChange(oklchValue);
          }}
        />
      </div>
    </div>
  );
}
