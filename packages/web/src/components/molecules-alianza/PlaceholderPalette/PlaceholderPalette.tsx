'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { Tooltip } from '@/components/atoms-alianza/Tooltip';
import { Typography } from '@/components/atoms-alianza/Typography';
import { Badge } from '@/components/atoms-alianza/Badge';
import type {
  PlaceholderPaletteProps,
  ColorData,
  PaletteName,
} from './PlaceholderPalette.types';

/**
 * Predefined color palettes
 */
const PREDEFINED_PALETTES: Record<PaletteName, ColorData[]> = {
  material: [
    { value: '#F44336', name: 'Red' },
    { value: '#E91E63', name: 'Pink' },
    { value: '#9C27B0', name: 'Purple' },
    { value: '#673AB7', name: 'Deep Purple' },
    { value: '#3F51B5', name: 'Indigo' },
    { value: '#2196F3', name: 'Blue' },
    { value: '#03A9F4', name: 'Light Blue' },
    { value: '#00BCD4', name: 'Cyan' },
    { value: '#009688', name: 'Teal' },
    { value: '#4CAF50', name: 'Green' },
    { value: '#8BC34A', name: 'Light Green' },
    { value: '#CDDC39', name: 'Lime' },
    { value: '#FFEB3B', name: 'Yellow' },
    { value: '#FFC107', name: 'Amber' },
    { value: '#FF9800', name: 'Orange' },
    { value: '#FF5722', name: 'Deep Orange' },
  ],
  tailwind: [
    { value: '#EF4444', name: 'Red' },
    { value: '#F59E0B', name: 'Amber' },
    { value: '#EAB308', name: 'Yellow' },
    { value: '#84CC16', name: 'Lime' },
    { value: '#10B981', name: 'Green' },
    { value: '#14B8A6', name: 'Teal' },
    { value: '#06B6D4', name: 'Cyan' },
    { value: '#3B82F6', name: 'Blue' },
    { value: '#6366F1', name: 'Indigo' },
    { value: '#8B5CF6', name: 'Violet' },
    { value: '#A855F7', name: 'Purple' },
    { value: '#D946EF', name: 'Fuchsia' },
    { value: '#EC4899', name: 'Pink' },
    { value: '#F43F5E', name: 'Rose' },
    { value: '#64748B', name: 'Slate' },
    { value: '#6B7280', name: 'Gray' },
  ],
  grayscale: [
    { value: '#000000', name: 'Black' },
    { value: '#1A1A1A', name: 'Gray 900' },
    { value: '#333333', name: 'Gray 800' },
    { value: '#4D4D4D', name: 'Gray 700' },
    { value: '#666666', name: 'Gray 600' },
    { value: '#808080', name: 'Gray 500' },
    { value: '#999999', name: 'Gray 400' },
    { value: '#B3B3B3', name: 'Gray 300' },
    { value: '#CCCCCC', name: 'Gray 200' },
    { value: '#E6E6E6', name: 'Gray 100' },
    { value: '#F5F5F5', name: 'Gray 50' },
    { value: '#FFFFFF', name: 'White' },
  ],
  rainbow: [
    { value: '#FF0000', name: 'Red' },
    { value: '#FF7F00', name: 'Orange' },
    { value: '#FFFF00', name: 'Yellow' },
    { value: '#7FFF00', name: 'Chartreuse' },
    { value: '#00FF00', name: 'Green' },
    { value: '#00FF7F', name: 'Spring Green' },
    { value: '#00FFFF', name: 'Cyan' },
    { value: '#007FFF', name: 'Azure' },
    { value: '#0000FF', name: 'Blue' },
    { value: '#7F00FF', name: 'Violet' },
    { value: '#FF00FF', name: 'Magenta' },
    { value: '#FF007F', name: 'Rose' },
  ],
  custom: [],
};

/**
 * Convert hex color to RGB string
 */
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Convert hex color to HSL string
 */
const hexToHsl = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

/**
 * PlaceholderPalette Component
 *
 * A color palette component for selecting and displaying colors.
 * Supports predefined palettes (Material, Tailwind, Grayscale, Rainbow)
 * and custom color arrays with features like color names, values display,
 * copy to clipboard, and keyboard navigation.
 *
 * @example
 * ```tsx
 * <PlaceholderPalette
 *   palette="material"
 *   selectedColor="#F44336"
 *   onSelect={(color) => console.log(color)}
 *   showColorNames
 * />
 * ```
 */
export function PlaceholderPalette({
  palette = 'material',
  colors,
  selectedColor,
  onSelect,
  size = 'md',
  shape = 'square',
  showColorNames = false,
  showColorValues = false,
  valueFormat = 'hex',
  columns = 8,
  enableCopy = false,
  disabled = false,
  className,
  'data-testid': dataTestId,
  ...props
}: PlaceholderPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Determine which colors to display
  const displayColors = colors || PREDEFINED_PALETTES[palette];

  // Size mappings
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  // Shape mappings
  const shapeClasses = {
    square: 'rounded',
    circle: 'rounded-full',
  };

  // Handle color selection
  const handleColorSelect = async (color: ColorData) => {
    if (disabled) return;

    onSelect?.(color);

    // Copy to clipboard if enabled
    if (enableCopy) {
      try {
        await navigator.clipboard.writeText(color.value);
        setCopiedColor(color.value);
        setTimeout(() => setCopiedColor(null), 2000);
      } catch (error) {
        console.error('Failed to copy color:', error);
      }
    }
  };

  // Format color value based on valueFormat
  const formatColorValue = (value: string): string => {
    if (valueFormat === 'rgb') return hexToRgb(value);
    if (valueFormat === 'hsl') return hexToHsl(value);
    return value;
  };

  // Handle keyboard navigation
  const handleKeyDown = (
    event: React.KeyboardEvent,
    color: ColorData,
    index: number
  ) => {
    const totalColors = displayColors.length;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleColorSelect(color);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (index < totalColors - 1) {
          const nextButton = document.querySelector(
            `[data-color-index="${index + 1}"]`
          ) as HTMLButtonElement;
          nextButton?.focus();
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (index > 0) {
          const prevButton = document.querySelector(
            `[data-color-index="${index - 1}"]`
          ) as HTMLButtonElement;
          prevButton?.focus();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (index + columns < totalColors) {
          const downButton = document.querySelector(
            `[data-color-index="${index + columns}"]`
          ) as HTMLButtonElement;
          downButton?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (index - columns >= 0) {
          const upButton = document.querySelector(
            `[data-color-index="${index - columns}"]`
          ) as HTMLButtonElement;
          upButton?.focus();
        }
        break;
    }
  };

  return (
    <div
      className={cn('w-full', className)}
      data-testid={dataTestId}
      role="region"
      aria-label="Color palette"
      {...props}
    >
      <div
        className={cn('grid gap-2')}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        role="group"
        aria-label="Color swatches"
      >
        {displayColors.map((color, index) => {
          const isSelected = selectedColor === color.value;
          const isCopied = copiedColor === color.value;
          const colorId = color.id || `color-${index}`;

          const swatchButton = (
            <button
              key={colorId}
              type="button"
              onClick={() => handleColorSelect(color)}
              onKeyDown={(e) => handleKeyDown(e, color, index)}
              disabled={disabled}
              data-color-index={index}
              className={cn(
                'relative transition-all duration-200',
                sizeClasses[size],
                shapeClasses[shape],
                'border-2 border-transparent',
                'hover:scale-110 hover:shadow-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isSelected && 'ring-2 ring-primary ring-offset-2 scale-110',
                disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
                !disabled && 'cursor-pointer'
              )}
              style={{ backgroundColor: color.value }}
              aria-label={`${color.name || color.value}${isSelected ? ' (selected)' : ''}`}
              aria-pressed={isSelected}
              aria-disabled={disabled}
              title={enableCopy ? (isCopied ? 'Copied!' : 'Click to copy') : undefined}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check
                    className={cn(
                      'text-white drop-shadow-lg',
                      size === 'sm' && 'w-3 h-3',
                      size === 'md' && 'w-4 h-4',
                      size === 'lg' && 'w-6 h-6'
                    )}
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Copy indicator */}
              {enableCopy && isCopied && !isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Copy
                    className={cn(
                      'text-white drop-shadow-lg',
                      size === 'sm' && 'w-2 h-2',
                      size === 'md' && 'w-3 h-3',
                      size === 'lg' && 'w-5 h-5'
                    )}
                    aria-hidden="true"
                  />
                </div>
              )}
            </button>
          );

          // Wrap in Tooltip if we're showing names or values
          if ((showColorNames || showColorValues) && !disabled) {
            return (
              <div key={colorId} className="flex flex-col items-center gap-1">
                <Tooltip
                  content={
                    <div className="text-center">
                      {showColorNames && color.name && (
                        <Typography variant="span" size="sm" weight="medium">
                          {color.name}
                        </Typography>
                      )}
                      {showColorValues && (
                        <Typography
                          variant="span"
                          size="xs"
                          color="muted"
                          className="block font-mono"
                        >
                          {formatColorValue(color.value)}
                        </Typography>
                      )}
                    </div>
                  }
                  placement="top"
                >
                  {swatchButton}
                </Tooltip>

                {/* Color name/value below swatch */}
                {(showColorNames || showColorValues) && (
                  <div className="text-center w-full">
                    {showColorNames && color.name && (
                      <Typography
                        variant="span"
                        size="xs"
                        className="block truncate"
                      >
                        {color.name}
                      </Typography>
                    )}
                    {showColorValues && (
                      <Badge
                        variant="outline"
                        size="sm"
                        className="text-[10px] font-mono"
                      >
                        {formatColorValue(color.value)}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return swatchButton;
        })}
      </div>
    </div>
  );
}
