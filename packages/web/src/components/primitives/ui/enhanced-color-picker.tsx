'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Label } from '@/components/primitives/ui/label';
import { Input } from '@/components/primitives/ui/input';
import { Button } from '@/components/primitives/ui/button';
import { ColorSelectorPopover } from './color-selector-popover';
import { cn } from '@/lib/utils';
import { oklchToHex, hexToOklch } from '@/lib/themeUtils';
import { Pipette } from 'lucide-react';

interface EnhancedColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  className?: string;
}

export function EnhancedColorPicker({
  color,
  onChange,
  label,
  className,
}: EnhancedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const textInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Convert OKLCH to hex for native color input
  const convertOKLCHToHex = useCallback((oklchValue: string): string => {
    try {
      if (oklchValue.includes('oklch')) {
        // Extract values from oklch() format
        const match = oklchValue.match(/oklch\(([^)]+)\)/);
        if (match) {
          return oklchToHex(match[1]);
        }
      }
      // If it's already in the format "l c h"
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

  // Get the actual hex color for preview
  const previewHex = currentHex;

  return (
    <div className={cn('mb-3', className)}>
      <div className="mb-1.5 flex items-center justify-between">
        <Label
          htmlFor={`color-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xs font-medium"
        >
          {label}
        </Label>
      </div>

      <div className="flex items-center gap-2">
        {/* Color Preview */}
        <div
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-border hover:border-primary transition-colors"
          style={{ backgroundColor: previewHex }}
          onClick={() => setIsOpen(!isOpen)}
          title={displayColor}
        >
          {/* Native Color Picker Input (Hidden) */}
          <input
            ref={colorInputRef}
            type="color"
            id={`color-${label.replace(/\s+/g, '-').toLowerCase()}`}
            value={currentHex}
            onChange={handleColorChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          {/* Eye Dropper Icon */}
          <Pipette className="w-4 h-4 text-white opacity-0 hover:opacity-100 transition-opacity drop-shadow-sm" />
        </div>

        {/* Text Input */}
        <Input
          ref={textInputRef}
          type="text"
          defaultValue={color}
          onChange={handleTextInputChange}
          className="flex-1 font-mono text-sm"
          placeholder="Enter OKLCH (210 40% 50%) or hex (#3b82f6)"
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
