'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Shuffle } from 'lucide-react';
import { ColorLinkButton } from './ColorLinkButton';
import { ColorToken, OklchColor, ThemeColors } from '../../types/theme.types';
import { oklchToString, parseOklchString } from '../../utils/css-variables';
import { createPreciseColorToken } from '../../utils/color-conversions-v2';
import { OklchColorPicker } from './OklchColorPicker';
import { HsvColorPicker } from './HsvColorPicker';
import { oklchToHex, isValidHex, hexToOklch } from '../../utils/color-conversions';
import { updateColorTokenFromHex } from '../../utils/color-conversions-v2';

interface ColorInputProps {
  color: ColorToken;
  onChange: (color: ColorToken) => void;
  allColors: ThemeColors;
  onLinkChange?: (colorName: string, linkedColors: string[]) => void;
  mode: 'light' | 'dark';
  className?: string;
}

export function ColorInput({
  color,
  onChange,
  allColors,
  onLinkChange,
  mode,
  className = ""
}: ColorInputProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const DEFAULT_COLOR = 'hsl(var(--foreground))';
  const [inputValue, setInputValue] = useState(() => color?.hex || DEFAULT_COLOR);
  const [isEditingInput, setIsEditingInput] = useState(false);

  // Update input value when color prop changes (show hex) but not when user is editing
  useEffect(() => {
    if (!isEditingInput && color?.hex) {
      setInputValue(color.hex);
    }
  }, [color?.hex, isEditingInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsEditingInput(true);
    // Don't call onChange on every keystroke to avoid infinite loops
    // Wait for blur or enter key for validation
  };

  const handleInputFocus = () => {
    setIsEditingInput(true);
  };

  const handleInputBlur = () => {
    setIsEditingInput(false);
    // Try to parse as hex input on blur using precise conversions
    if (isValidHex(inputValue)) {
      const newColorToken = updateColorTokenFromHex(color, inputValue);
      onChange(newColorToken);
    } else {
      // Revert to current color's hex value if invalid
      setInputValue(color?.hex || DEFAULT_COLOR);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handlePickerChange = (newColorToken: ColorToken) => {
    // Update input value only if not currently editing
    if (!isEditingInput && newColorToken?.hex) {
      setInputValue(newColorToken.hex);
    }
    onChange(newColorToken);
  };

  const handleLinkChange = (linkedColors: string[]) => {
    if (onLinkChange) {
      onLinkChange(color.name, linkedColors);
    }
  };

  // Get color for preview swatch (always show as hex)
  const getColorPreview = (): string => {
    return color?.hex || DEFAULT_COLOR;
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Color Swatch Button */}
      <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-8 h-8 p-0 rounded border border-input"
            style={{
              backgroundColor: getColorPreview()
            }}
          >
            <span className="sr-only">Pick color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            {/* 🆕 HEADER CON OKLCH */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Color Picker</div>
              <div className="p-2 bg-muted/30 rounded">
                <div className="text-xs text-muted-foreground">OKLCH Source</div>
                <div className="text-xs font-mono text-foreground">
                  {color?.oklchString || 'oklch(0 0 0)'}
                </div>
              </div>
            </div>
            <HsvColorPicker
              colorToken={color}
              onChange={handlePickerChange}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Color Value Input */}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        placeholder="Color hex value"
        className="flex-1 font-mono text-xs text-foreground bg-input border-border"
      />

      {/* Color Link Button */}
      <ColorLinkButton
        currentColor={color}
        allColors={allColors}
        onLinkChange={handleLinkChange}
        mode={mode}
      />
    </div>
  );
}