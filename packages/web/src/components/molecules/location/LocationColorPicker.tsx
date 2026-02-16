'use client';

import React, { useMemo, useCallback } from 'react';
import { HsvColorPicker } from '@/components/features/theme-editor-3.0/theme-editor/editor/colors/HsvColorPicker';
import { createPreciseColorToken } from '@/components/features/theme-editor-3.0/lib/utils/color/color-conversions-v2';
import { ColorToken } from '@/components/features/theme-editor-3.0/core/types/theme.types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/primitives/ui/popover';
import { Button } from '@/components/primitives/ui/button';
import { Label } from '@/components/primitives/ui/label';

interface LocationColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  label?: string;
}

export function LocationColorPicker({
  color,
  onChange,
  className = '',
  label = 'Icon Color',
}: LocationColorPickerProps) {
  // Create a precise ColorToken from the hex string
  // HsvColorPicker requires a full ColorToken object
  const colorToken = useMemo(() => {
    try {
      const token = createPreciseColorToken('icon-color', color || '#000000');
      return { ...token, value: token.oklchString };
    } catch (e) {
      // Fallback for invalid colors
      const token = createPreciseColorToken('icon-color', '#000000');
      return { ...token, value: token.oklchString };
    }
  }, [color]);

  // Handle color changes from the HsvColorPicker
  const handleColorChange = useCallback(
    (newToken: ColorToken) => {
      onChange(newToken.hex);
    },
    [onChange],
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color || '#000000' }}
              />
              <span>{color || '#000000'}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
                <div className="space-y-2">
                <h4 className="font-medium leading-none">Pick a color</h4>
                <p className="text-sm text-muted-foreground">
                    Customize the icon color for this location.
                </p>
                </div>
                <HsvColorPicker
                    colorToken={colorToken}
                    onChange={handleColorChange}
                />
            </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
