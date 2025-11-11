'use client';

import React from 'react';
import { Slider } from '../../../design-system/primitives/slider';
import { Label } from '../../../design-system/primitives/label';
import { Input } from '../../../design-system/primitives/input';
import { Button } from '../../../design-system/primitives/Button';
import { OklchColor } from '../../../core/types/theme.types';

interface OklchColorPickerProps {
  oklch: OklchColor;
  onChange: (oklch: OklchColor) => void;
  className?: string;
}

export function OklchColorPicker({
  oklch,
  onChange,
  className = ""
}: OklchColorPickerProps) {
  
  const handleLightnessChange = (value: number[]) => {
    onChange({ ...oklch, l: value[0] / 100 });
  };

  const handleChromaChange = (value: number[]) => {
    onChange({ ...oklch, c: value[0] / 100 });
  };

  const handleHueChange = (value: number[]) => {
    onChange({ ...oklch, h: value[0] });
  };

  const handleAlphaChange = (value: number[]) => {
    onChange({ ...oklch, a: value[0] / 100 });
  };

  const handleInputChange = (property: keyof OklchColor, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onChange({ ...oklch, [property]: numValue });
    }
  };

  const addAlpha = () => {
    onChange({ ...oklch, a: 1 });
  };

  const removeAlpha = () => {
    const { a, ...rest } = oklch;
    onChange(rest);
  };

  // Generate hue gradient for slider background
  const hueGradient = () => {
    const steps = 12;
    const colors = [];
    for (let i = 0; i <= steps; i++) {
      const hue = (i / steps) * 360;
      colors.push(`oklch(${oklch.l} ${oklch.c} ${hue})`);
    }
    return `linear-gradient(to right, ${colors.join(', ')})`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Lightness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Lightness</Label>
          <span className="text-xs text-muted-foreground">
            {(oklch.l * 100).toFixed(1)}%
          </span>
        </div>
        <Slider
          value={[oklch.l * 100]}
          onValueChange={handleLightnessChange}
          min={0}
          max={100}
          step={0.1}
          className="w-full"
        />
        <Input
          type="number"
          value={oklch.l.toFixed(4)}
          onChange={(e) => handleInputChange('l', e.target.value)}
          min={0}
          max={1}
          step={0.0001}
          className="h-7 text-xs font-mono"
        />
      </div>

      {/* Chroma */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Chroma</Label>
          <span className="text-xs text-muted-foreground">
            {oklch.c.toFixed(4)}
          </span>
        </div>
        <Slider
          value={[oklch.c * 100]}
          onValueChange={handleChromaChange}
          min={0}
          max={40}
          step={0.1}
          className="w-full"
        />
        <Input
          type="number"
          value={oklch.c.toFixed(4)}
          onChange={(e) => handleInputChange('c', e.target.value)}
          min={0}
          max={0.4}
          step={0.0001}
          className="h-7 text-xs font-mono"
        />
      </div>

      {/* Hue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Hue</Label>
          <span className="text-xs text-muted-foreground">
            {oklch.h.toFixed(1)}°
          </span>
        </div>
        <div className="relative">
          <Slider
            value={[oklch.h]}
            onValueChange={handleHueChange}
            min={0}
            max={360}
            step={0.1}
            className="w-full"
            style={{
              background: hueGradient()
            }}
          />
        </div>
        <Input
          type="number"
          value={oklch.h.toFixed(4)}
          onChange={(e) => handleInputChange('h', e.target.value)}
          min={0}
          max={360}
          step={0.0001}
          className="h-7 text-xs font-mono"
        />
      </div>

      {/* Alpha (if present) */}
      {oklch.a !== undefined ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Alpha</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {(oklch.a * 100).toFixed(1)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeAlpha}
                className="h-6 px-2 text-xs"
              >
                Remove
              </Button>
            </div>
          </div>
          <Slider
            value={[oklch.a * 100]}
            onValueChange={handleAlphaChange}
            min={0}
            max={100}
            step={0.1}
            className="w-full"
          />
          <Input
            type="number"
            value={oklch.a.toFixed(4)}
            onChange={(e) => handleInputChange('a', e.target.value)}
            min={0}
            max={1}
            step={0.0001}
            className="h-7 text-xs font-mono"
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={addAlpha}
            className="text-xs"
          >
            Add Alpha Channel
          </Button>
        </div>
      )}

      {/* Color Preview */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Preview</Label>
        <div 
          className="w-full h-16 rounded border border-input shadow-sm"
          style={{
            backgroundColor: `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(4)}${oklch.a !== undefined ? ` / ${oklch.a.toFixed(2)}` : ''})`
          }}
        />
        <div className="text-xs font-mono text-center text-muted-foreground bg-muted/30 rounded px-2 py-1">
          oklch({oklch.l.toFixed(4)} {oklch.c.toFixed(4)} {oklch.h.toFixed(4)}{oklch.a !== undefined ? ` / ${oklch.a.toFixed(2)}` : ''})
        </div>
      </div>
    </div>
  );
}