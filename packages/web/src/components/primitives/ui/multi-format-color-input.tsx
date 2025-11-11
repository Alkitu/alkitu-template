'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/primitives/Input';
import { Button } from '@/components/primitives/ui/button';
import { Label } from '@/components/primitives/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/primitives/ui/popover';
import { ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  hexToRgb,
  rgbToHex,
  hexToOklch,
  oklchToHex,
  rgbToOklch,
  oklchToRgb,
} from '@/lib/themeUtils';

export type ColorFormat = 'oklch' | 'rgb' | 'hex';

interface MultiFormatColorInputProps {
  name: string;
  color: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  className?: string;
  defaultFormat?: ColorFormat;
}

// Convert any color format to OKLCH
function convertToOklch(color: string, currentFormat: ColorFormat): string {
  try {
    switch (currentFormat) {
      case 'hex':
        return hexToOklch(color);
      case 'rgb':
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);
          const oklch = rgbToOklch(r, g, b);
          return `${(oklch.l * 100).toFixed(1)}% ${oklch.c.toFixed(3)} ${Math.round(oklch.h)}`;
        }
        return color;
      case 'oklch':
        // If it's already oklch function format, extract values
        if (color.includes('oklch(')) {
          const match = color.match(
            /oklch\(([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\)/,
          );
          if (match) {
            return `${match[1]} ${match[2]} ${match[3]}`;
          }
        }
        return color;
      default:
        return color;
    }
  } catch (error) {
    console.warn('Failed to convert color to OKLCH:', error);
    return color;
  }
}

// Convert OKLCH to other formats
function convertFromOklch(
  oklchValue: string,
  targetFormat: ColorFormat,
): string {
  try {
    const parts = oklchValue.trim().split(/\s+/);
    if (parts.length < 3) return oklchValue;

    let l = parseFloat(parts[0]);
    const c = parseFloat(parts[1]);
    const h = parseFloat(parts[2]);

    // Handle percentage notation for lightness
    if (parts[0].includes('%')) {
      l = l / 100;
    }

    const rgb = oklchToRgb(l, c, h);

    switch (targetFormat) {
      case 'hex':
        return rgbToHex(rgb.r, rgb.g, rgb.b);
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'oklch':
        return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${Math.round(h)})`;
      default:
        return oklchValue;
    }
  } catch (error) {
    console.warn('Failed to convert from OKLCH:', error);
    return oklchValue;
  }
}

// Detect the format of a color string
function detectColorFormat(color: string): ColorFormat {
  if (color.startsWith('#')) return 'hex';
  if (color.startsWith('rgb(')) return 'rgb';
  if (
    color.includes('oklch(') ||
    /^oklch\([\d.]+%?\s+[\d.]+\s+[\d.]+\)$/.test(color.trim())
  )
    return 'oklch';
  // Also detect raw OKLCH values like "0.62 0.19 259.81"
  if (/^[\d.]+%?\s+[\d.]+\s+[\d.]+$/.test(color.trim())) return 'oklch';
  return 'hex'; // default fallback
}

// Format color value for display
function formatColorValue(color: string, format: ColorFormat): string {
  try {
    const detectedFormat = detectColorFormat(color);

    if (detectedFormat === format) {
      return color;
    }

    // Convert to OKLCH first, then to target format
    const oklchValue = convertToOklch(color, detectedFormat);
    return convertFromOklch(oklchValue, format);
  } catch (error) {
    console.warn('Failed to format color value:', error);
    return color;
  }
}

// Get color for the color picker (always hex)
function getHexValue(color: string): string {
  try {
    const format = detectColorFormat(color);
    if (format === 'hex') return color;

    const oklchValue = convertToOklch(color, format);
    return convertFromOklch(oklchValue, 'hex');
  } catch (error) {
    console.warn('Failed to get hex value:', error);
    return '#000000';
  }
}

export function MultiFormatColorInput({
  name,
  color,
  onChange,
  label,
  description,
  className,
  defaultFormat = 'oklch',
}: MultiFormatColorInputProps) {
  const [currentFormat, setCurrentFormat] =
    useState<ColorFormat>(defaultFormat);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Update input value when color or format changes
  useEffect(() => {
    const formattedValue = formatColorValue(color, currentFormat);
    setInputValue(formattedValue);
  }, [color, currentFormat]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Convert to full OKLCH format and pass to parent
      try {
        const oklchValue = convertToOklch(newValue, currentFormat);
        // Ensure it's in full oklch() format for the theme system
        const fullOklchFormat = oklchValue.includes('oklch(')
          ? oklchValue
          : `oklch(${oklchValue})`;
        onChange(fullOklchFormat);
      } catch (error) {
        // If conversion fails, still pass the raw value
        onChange(newValue);
      }
    },
    [currentFormat, onChange],
  );

  // Handle color picker change
  const handleColorPickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hexValue = e.target.value;
      const oklchValue = convertToOklch(hexValue, 'hex');
      // Ensure it's in full oklch() format for the theme system
      const fullOklchFormat = oklchValue.includes('oklch(')
        ? oklchValue
        : `oklch(${oklchValue})`;
      onChange(fullOklchFormat);
    },
    [onChange],
  );

  // Cycle through formats: OKLCH → RGB → HEX → OKLCH
  const cycleFormat = useCallback(() => {
    const formatOrder: ColorFormat[] = ['oklch', 'rgb', 'hex'];
    const currentIndex = formatOrder.indexOf(currentFormat);
    const nextIndex = (currentIndex + 1) % formatOrder.length;
    setCurrentFormat(formatOrder[nextIndex]);
  }, [currentFormat]);

  // Get format label
  const getFormatLabel = (format: ColorFormat): string => {
    switch (format) {
      case 'oklch':
        return 'OKLCH';
      case 'rgb':
        return 'RGB';
      case 'hex':
        return 'HEX';
    }
  };

  // Get format example
  const getFormatExample = (format: ColorFormat): string => {
    switch (format) {
      case 'oklch':
        return '62.0% 0.190 259';
      case 'rgb':
        return 'rgb(64, 128, 192)';
      case 'hex':
        return '#4080c0';
    }
  };

  const hexValue = getHexValue(color);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={`color-${name}`} className="text-sm font-medium">
          {label}
        </Label>
      )}

      <div className="flex items-center gap-2">
        {/* Color Preview/Picker */}
        <div
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-input"
          style={{ backgroundColor: hexValue }}
        >
          <input
            type="color"
            id={`color-${name}`}
            value={hexValue}
            onChange={handleColorPickerChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <Palette className="h-4 w-4 text-white/80" />
        </div>

        {/* Format Input */}
        <div className="flex-1 relative">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={getFormatExample(currentFormat)}
            className="pr-20"
          />

          {/* Format Toggle Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs font-medium"
            onClick={cycleFormat}
          >
            {getFormatLabel(currentFormat)}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Advanced Options Popover */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Color Formats</h4>
                <p className="text-sm text-muted-foreground">
                  Switch between different color format representations
                </p>
              </div>

              <div className="space-y-2">
                {(['oklch', 'rgb', 'hex'] as ColorFormat[]).map((format) => (
                  <div
                    key={format}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors',
                      currentFormat === format
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50',
                    )}
                    onClick={() => {
                      setCurrentFormat(format);
                      setIsOpen(false);
                    }}
                  >
                    <div>
                      <div className="font-medium">
                        {getFormatLabel(format)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatColorValue(color, format)}
                      </div>
                    </div>
                    {currentFormat === format && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  <div className="mb-1">
                    <strong>OKLCH:</strong> Modern color space (default)
                  </div>
                  <div className="mb-1">
                    <strong>RGB:</strong> Red, Green, Blue values
                  </div>
                  <div>
                    <strong>HEX:</strong> Hexadecimal notation
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Format indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Format: {getFormatLabel(currentFormat)}</span>
        <span>•</span>
        <span>Click format button to cycle through options</span>
      </div>
    </div>
  );
}
