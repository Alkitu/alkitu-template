'use client';

import React, { useState } from 'react';
import { Label } from '../../../design-system/primitives/label';
import { Slider } from '../../../design-system/primitives/slider';
import { Input } from '../../../design-system/primitives/input';
import { Button } from '../../../design-system/primitives/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../design-system/primitives/select';
import { RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../design-system/primitives/tooltip';

interface ShadowControllerProps {
  label: string;
  description: string;
  value: string; // e.g., "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
  shadowKey: string; // e.g., "xs", "sm", "md"
  onValueChange: (value: string) => void;
  className?: string;
}

interface ShadowParts {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

export function ShadowController({
  label,
  description,
  value,
  shadowKey,
  onValueChange,
  className = ""
}: ShadowControllerProps) {

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Parse shadow string into parts
  const parseShadow = (shadowValue: string): ShadowParts => {
    // Handle "none" case
    if (shadowValue === 'none' || !shadowValue) {
      return {
        offsetX: 0,
        offsetY: 0,
        blur: 0,
        spread: 0,
        color: '#000000',
        opacity: 0.1
      };
    }

    // Parse pattern like "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
    const match = shadowValue.match(/(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    
    if (match) {
      return {
        offsetX: parseFloat(match[1]),
        offsetY: parseFloat(match[2]),
        blur: parseFloat(match[3]),
        spread: parseFloat(match[4]),
        color: `rgb(${match[5]}, ${match[6]}, ${match[7]})`,
        opacity: parseFloat(match[8])
      };
    }

    // Fallback
    return {
      offsetX: 0,
      offsetY: 1,
      blur: 3,
      spread: 0,
      color: '#000000',
      opacity: 0.1
    };
  };

  // Build shadow string from parts
  const buildShadow = (parts: ShadowParts): string => {
    if (parts.blur === 0 && parts.offsetX === 0 && parts.offsetY === 0 && parts.spread === 0) {
      return 'none';
    }

    const rgb = parts.color === '#000000' ? '0, 0, 0' : parts.color.match(/rgb\((.+)\)/)?.[1] || '0, 0, 0';
    return `${parts.offsetX}px ${parts.offsetY}px ${parts.blur}px ${parts.spread}px rgba(${rgb}, ${parts.opacity})`;
  };

  const currentShadow = parseShadow(value);

  const updateShadow = (updates: Partial<ShadowParts>) => {
    const newShadow = { ...currentShadow, ...updates };
    const shadowString = buildShadow(newShadow);
    onValueChange(shadowString);
  };

  const handleReset = () => {
    // Default shadow values based on key
    const defaults: Record<string, string> = {
      'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      'none': 'none'
    };
    
    const defaultValue = defaults[shadowKey] || defaults['sm'];
    onValueChange(defaultValue);
  };

  const presets = [
    { label: 'None', value: 'none' },
    { label: 'Small', value: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
    { label: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    { label: 'Large', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
  ];

  // Map shadowKey to preset values directly
  const getPresetValueByKey = (key: string) => {
    const mapping: Record<string, string> = {
      'small': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    };
    return mapping[key] || mapping['small'];
  };

  const selectValue = getPresetValueByKey(shadowKey);
  
  // Get the display text for the selected value
  const getDisplayText = () => {
    const selectedPreset = presets.find(preset => preset.value === selectValue);
    return selectedPreset?.label || shadowKey.charAt(0).toUpperCase() + shadowKey.slice(1);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 style={{
              fontFamily: 'var(--typography-h5-font-family)',
              fontSize: 'var(--typography-h5-font-size)',
              fontWeight: 'var(--typography-h5-font-weight)',
              lineHeight: 'var(--typography-h5-line-height)',
              letterSpacing: 'var(--typography-h5-letter-spacing)'
            }} className="text-foreground">
              {label}
            </h5>
          </div>
          
        </div>

        {/* ACTION_BUTTONS */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="h-6 w-6 p-0 text-foreground hover:text-foreground/80"
                >
                  {showAdvanced ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p style={{
                  fontFamily: 'var(--typography-emphasis-font-family)',
                  fontSize: 'var(--typography-emphasis-font-size)',
                  fontWeight: 'var(--typography-emphasis-font-weight)',
                  letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                }} className="text-xs">
                  {showAdvanced ? 'Ocultar controles' : 'Mostrar controles'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-6 w-6 p-0 text-foreground hover:text-foreground/80"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p style={{
                  fontFamily: 'var(--typography-emphasis-font-family)',
                  fontSize: 'var(--typography-emphasis-font-size)',
                  fontWeight: 'var(--typography-emphasis-font-weight)',
                  letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                }} className="text-xs">
                  Resetear a valor por defecto
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* QUICK PRESETS */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Presets</Label>
        <Select value={selectValue} onValueChange={onValueChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder={getDisplayText()} />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value} className="text-xs">
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ADVANCED CONTROLS */}
      {showAdvanced && (
        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-3">
            {/* Blur */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Blur</Label>
              <Slider
                value={[currentShadow.blur]}
                onValueChange={(values) => updateShadow({ blur: values[0] })}
                min={0}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-center text-muted-foreground">
                {currentShadow.blur}px
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Opacity</Label>
              <Slider
                value={[currentShadow.opacity * 100]}
                onValueChange={(values) => updateShadow({ opacity: values[0] / 100 })}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-center text-muted-foreground">
                {Math.round(currentShadow.opacity * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      <div className="flex items-center gap-3 pt-2">
        <div 
          className="w-16 h-16 border border-border flex items-center justify-center rounded-md bg-background"
          style={{ 
            boxShadow: value === 'none' ? 'none' : value
          }}
        >
          <span className="text-xs font-mono text-foreground font-medium">
            {shadowKey}
          </span>
        </div>
        
        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className="h-8 text-xs bg-background border-border text-foreground"
            placeholder="CSS box-shadow value"
          />
        </div>
      </div>
    </div>
  );
}