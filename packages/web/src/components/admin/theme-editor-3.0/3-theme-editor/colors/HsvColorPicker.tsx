'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ColorToken } from '../../types/theme.types';
import { 
  // Legacy imports (still needed for some functions)
  hsvToHex, 
  hsvToRgb,
  type HSVColor,
  type RGBColor
} from '../../utils/color-conversions';

// New precise conversion imports
import {
  updateColorTokenFromHex,
  updateColorTokenFromRgb,
  updateColorTokenFromHsv,
  isValidHex as isValidHexV2,
  formatHexDisplay
} from '../../utils/color-conversions-v2';

interface HsvColorPickerProps {
  colorToken: ColorToken;
  onChange: (colorToken: ColorToken) => void;
  className?: string;
}

export function HsvColorPicker({ colorToken, onChange, className }: HsvColorPickerProps) {
  // Initialize state from current color token's precise values with safe defaults
  const [hsv, setHsv] = useState<HSVColor>(() => colorToken?.hsv || { h: 0, s: 0, v: 0 });
  const [rgb, setRgb] = useState<RGBColor>(() => colorToken?.rgb || { r: 0, g: 0, b: 0 });
  const [hexInput, setHexInput] = useState<string>(() => colorToken?.hex || '#000000');
  const [isEditingHex, setIsEditingHex] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingSatVal, setIsDraggingSatVal] = useState(false);
  
  const hueBarRef = useRef<HTMLDivElement>(null);
  const satValRef = useRef<HTMLDivElement>(null);

  // Update RGB and hex when HSV changes (but not when user is editing hex input)
  useEffect(() => {
    const newRgb = hsvToRgb(hsv);
    const newHex = hsvToHex(hsv);
    setRgb(newRgb);
    
    // Only update hexInput if user is not currently editing it
    if (!isEditingHex) {
      setHexInput(newHex);
    }
  }, [hsv, isEditingHex]);

  // Sync with external colorToken changes using precise values
  useEffect(() => {
    if (colorToken?.hsv && colorToken?.rgb && colorToken?.hex) {
      // Only update if values are actually different to avoid infinite loops
      if (Math.abs(colorToken.hsv.h - hsv.h) > 0.5 || 
          Math.abs(colorToken.hsv.s - hsv.s) > 0.5 || 
          Math.abs(colorToken.hsv.v - hsv.v) > 0.5) {
        setHsv(colorToken.hsv);
      }

      // Update RGB and hex when external color changes
      setRgb(colorToken.rgb);
      if (!isEditingHex) {
        setHexInput(colorToken.hex);
      }
    }
  }, [colorToken?.hsv?.h, colorToken?.hsv?.s, colorToken?.hsv?.v, colorToken?.rgb?.r, colorToken?.rgb?.g, colorToken?.rgb?.b, colorToken?.hex, isEditingHex]);

  // Notify parent of color changes using precise conversions
  const notifyChange = useCallback((newHsv: HSVColor) => {
    const newColorToken = updateColorTokenFromHsv(colorToken, newHsv);
    onChange(newColorToken);
  }, [colorToken, onChange]);

  // Handle hue bar interactions
  const handleHueInteraction = useCallback((clientX: number) => {
    if (!hueBarRef.current) return;
    
    const rect = hueBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newHue = (x / rect.width) * 360;
    
    const newHsv = { ...hsv, h: parseFloat(newHue.toFixed(1)) };
    setHsv(newHsv);
    notifyChange(newHsv);
  }, [hsv, notifyChange]);

  // Handle saturation/value area interactions
  const handleSatValInteraction = useCallback((clientX: number, clientY: number) => {
    if (!satValRef.current) return;
    
    const rect = satValRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    
    const newSat = (x / rect.width) * 100;
    const newVal = 100 - (y / rect.height) * 100;
    
    const newHsv = { 
      ...hsv, 
      s: parseFloat(newSat.toFixed(1)), 
      v: parseFloat(newVal.toFixed(1)) 
    };
    setHsv(newHsv);
    notifyChange(newHsv);
  }, [hsv, notifyChange]);

  // Mouse event handlers for hue bar
  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHue(true);
    handleHueInteraction(e.clientX);
  };

  // Mouse event handlers for saturation/value area
  const handleSatValMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSatVal(true);
    handleSatValInteraction(e.clientX, e.clientY);
  };

  // Global mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHue) {
        handleHueInteraction(e.clientX);
      }
      if (isDraggingSatVal) {
        handleSatValInteraction(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingHue(false);
      setIsDraggingSatVal(false);
    };

    if (isDraggingHue || isDraggingSatVal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingHue, isDraggingSatVal, handleHueInteraction, handleSatValInteraction]);

  // Handle hex input changes using precise conversions
  const handleHexChange = (value: string) => {
    setHexInput(value);
    setIsEditingHex(true);
    
    if (isValidHexV2(value)) {
      const newColorToken = updateColorTokenFromHex(colorToken, value);
      setHsv(newColorToken.hsv);
      onChange(newColorToken);
    }
  };

  // Handle hex input focus and blur
  const handleHexFocus = () => {
    setIsEditingHex(true);
  };

  const handleHexBlur = () => {
    setIsEditingHex(false);
    // Sync hex input with current color token when user stops editing
    setHexInput(colorToken?.hex || '#000000');
  };

  // Handle Enter key in hex input
  const handleHexKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // This will trigger handleHexBlur
    }
  };

  // Handle RGB input changes using precise conversions
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [component]: numValue };
    setRgb(newRgb);
    
    const newColorToken = updateColorTokenFromRgb(colorToken, newRgb);
    setHsv(newColorToken.hsv);
    setHexInput(newColorToken.hex);
    onChange(newColorToken);
  };

  // Calculate positions for indicators
  const huePosition = (hsv.h / 360) * 100;
  const satPosition = (hsv.s / 100) * 100;
  const valPosition = 100 - (hsv.v / 100) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Saturation/Value Area */}
      <div className="relative">
        <div
          ref={satValRef}
          className="w-full h-32 rounded-lg cursor-crosshair relative overflow-hidden"
          style={{
            background: `
              linear-gradient(to bottom, transparent, hsl(var(--foreground))),
              linear-gradient(to right, hsl(var(--background)), hsl(${hsv.h}, 100%, 50%))
            `
          }}
          onMouseDown={handleSatValMouseDown}
        >
          {/* Saturation/Value Indicator */}
          <div
            className="absolute w-3 h-3 border-2 border-background rounded-full shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${satPosition}%`,
              top: `${valPosition}%`,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      </div>

      {/* Hue Bar */}
      <div className="relative">
        <div
          ref={hueBarRef}
          className="w-full h-4 rounded-full cursor-pointer relative overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)'
          }}
          onMouseDown={handleHueMouseDown}
        >
          {/* Hue Indicator */}
          <div
            className="absolute w-3 h-6 bg-background border border-border rounded-sm shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1"
            style={{
              left: `${huePosition}%`,
              top: '50%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      </div>

      {/* Color Preview with OKLCH */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-8 rounded border border-border shadow-inner"
          style={{ backgroundColor: colorToken?.hex || '#000000' }}
        />
        <div className="flex-1 space-y-1">
          <Label className="text-xs text-muted-foreground">Current Color</Label>
          <div className="text-sm font-mono text-foreground">
            {colorToken?.hex || '#000000'}
          </div>
          {/* 🆕 NUEVA SECCIÓN OKLCH */}
          <div className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">
            {colorToken?.oklchString || 'oklch(0 0 0)'}
          </div>
        </div>
      </div>

      {/* Hex Input */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Hex Color
        </Label>
        <Input
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          onFocus={handleHexFocus}
          onBlur={handleHexBlur}
          onKeyDown={handleHexKeyDown}
          className="font-mono text-sm text-foreground bg-input border-border"
          placeholder="#000000"
        />
      </div>

      {/* RGB Inputs */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          RGB Values
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-center block">R</Label>
            <Input
              type="number"
              min="0"
              max="255"
              value={rgb?.r || 0}
              onChange={(e) => handleRgbChange('r', e.target.value)}
              className="text-center text-sm text-foreground bg-input border-border"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-center block">G</Label>
            <Input
              type="number"
              min="0"
              max="255"
              value={rgb?.g || 0}
              onChange={(e) => handleRgbChange('g', e.target.value)}
              className="text-center text-sm text-foreground bg-input border-border"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-center block">B</Label>
            <Input
              type="number"
              min="0"
              max="255"
              value={rgb?.b || 0}
              onChange={(e) => handleRgbChange('b', e.target.value)}
              className="text-center text-sm text-foreground bg-input border-border"
            />
          </div>
        </div>
      </div>

      {/* HSV Values (Read-only display) */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          HSV Values
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <Label className="text-xs block">H</Label>
            <div className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
              {(hsv?.h || 0).toFixed(1)}°
            </div>
          </div>
          <div className="text-center">
            <Label className="text-xs block">S</Label>
            <div className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
              {(hsv?.s || 0).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <Label className="text-xs block">V</Label>
            <div className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
              {(hsv?.v || 0).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 🆕 NUEVA SECCIÓN: OKLCH Values (Source of Truth) */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          OKLCH Values (Source of Truth)
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <Label className="text-xs block">L</Label>
            <div className="text-sm font-mono text-foreground bg-primary/10 px-2 py-1 rounded border border-primary/20">
              {(colorToken?.oklch?.l || 0).toFixed(4)}
            </div>
          </div>
          <div className="text-center">
            <Label className="text-xs block">C</Label>
            <div className="text-sm font-mono text-foreground bg-primary/10 px-2 py-1 rounded border border-primary/20">
              {(colorToken?.oklch?.c || 0).toFixed(4)}
            </div>
          </div>
          <div className="text-center">
            <Label className="text-xs block">H</Label>
            <div className="text-sm font-mono text-foreground bg-primary/10 px-2 py-1 rounded border border-primary/20">
              {(colorToken?.oklch?.h || 0).toFixed(2)}°
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}