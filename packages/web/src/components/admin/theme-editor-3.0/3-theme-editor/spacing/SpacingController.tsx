'use client';

import React from 'react';
import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface SpacingControllerProps {
  label: string;
  description: string;
  value: string; // e.g., "1rem", "24px", "0.5rem"
  spacingKey: string; // e.g., "1", "2", "4", "8"
  onValueChange: (value: string) => void;
  className?: string;
}

export function SpacingController({
  label,
  description,
  value,
  spacingKey,
  onValueChange,
  className = ""
}: SpacingControllerProps) {

  // Convert value to pixels for slider (assuming 1rem = 16px)
  const getPixelValue = (val: string): number => {
    if (val === '0' || val === '0px') return 0;
    if (val === '1px') return 1;
    if (val.endsWith('rem')) {
      return parseFloat(val) * 16;
    }
    if (val.endsWith('px')) {
      return parseFloat(val);
    }
    // Fallback for raw numbers
    return parseFloat(val) * 16;
  };

  // Convert pixels back to rem
  const getRemValue = (pixels: number): string => {
    if (pixels === 0) return '0';
    if (pixels === 1) return '1px';
    return `${(pixels / 16).toFixed(3)}rem`;
  };

  const currentPixels = getPixelValue(value);

  const handleSliderChange = (values: number[]) => {
    const newPixels = values[0];
    const newValue = getRemValue(newPixels);
    onValueChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let newValue = inputValue;
    
    // If it's a number, convert to rem
    if (/^\d+(\.\d+)?$/.test(inputValue)) {
      newValue = getRemValue(parseFloat(inputValue));
    }
    
    onValueChange(newValue);
  };

  const handleReset = () => {
    // Default spacing values based on key
    const defaults: Record<string, string> = {
      '0': '0',
      'px': '1px',
      '0.5': '0.125rem',
      '1': '0.25rem',
      '1.5': '0.375rem',
      '2': '0.5rem',
      '2.5': '0.625rem',
      '3': '0.75rem',
      '3.5': '0.875rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '9': '2.25rem',
      '10': '2.5rem',
      '11': '2.75rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '28': '7rem',
      '32': '8rem',
      '36': '9rem',
      '40': '10rem',
      '44': '11rem',
      '48': '12rem',
      '52': '13rem',
      '56': '14rem',
      '60': '15rem',
      '64': '16rem',
      '72': '18rem',
      '80': '20rem',
      '96': '24rem'
    };
    
    const defaultValue = defaults[spacingKey] || '1rem';
    onValueChange(defaultValue);
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

      {/* CONTROLS */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="ultra-thin-slider">
              <Slider
                value={[currentPixels]}
                onValueChange={handleSliderChange}
                min={0}
                max={384} // 24rem in pixels
                step={1}
                className="w-full"
              />
              <style dangerouslySetInnerHTML={{
                __html: `
                  .ultra-thin-slider [role="slider"] {
                    height: 8px !important;
                  }
                  .ultra-thin-slider [role="slider"] > span:first-child {
                    height: 3px !important;
                    background: hsl(var(--border)) !important;
                  }
                  .ultra-thin-slider [role="slider"] > span:nth-child(2) {
                    height: 3px !important;
                  }
                  .ultra-thin-slider [role="slider"] > span:last-child {
                    height: 10px !important;
                    width: 10px !important;
                    border: 1px solid hsl(var(--border)) !important;
                    background: hsl(var(--background)) !important;
                    border-radius: 5px !important;
                  }
                  .ultra-thin-slider .bg-primary {
                    height: 3px !important;
                  }
                  .ultra-thin-slider [data-orientation="horizontal"] {
                    height: 8px !important;
                  }
                  .ultra-thin-slider [data-orientation="horizontal"]:has(.bg-primary) .bg-primary {
                    height: 3px !important;
                  }
                `
              }} />
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={value}
              onChange={handleInputChange}
              className="w-20 h-6 text-xs text-center bg-background border-border text-foreground focus:ring-ring focus:border-ring"
              placeholder="1rem"
            />
          </div>
        </div>

        {/* PREVIEW */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-blue-100 border border-blue-300 flex items-center justify-center rounded-sm w-6 h-3">
              <span className="text-xs font-mono text-blue-800 leading-none text-[8px]">
                {spacingKey}
              </span>
            </div>
            
            <div 
              style={{ 
                height: `${Math.min(currentPixels, 48)}px`,
                width: '2px',
                backgroundColor: '#3b82f6',
                minHeight: '2px'
              }}
            />
            
            <div className="bg-green-100 border border-green-300 flex items-center justify-center rounded-sm w-6 h-3">
              <span className="text-xs font-mono text-green-800 leading-none text-[8px]">
                {spacingKey}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-600">
            <span className="font-mono">
              = {currentPixels}px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}