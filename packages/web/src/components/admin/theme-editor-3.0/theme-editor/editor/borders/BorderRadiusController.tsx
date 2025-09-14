'use client';

import React from 'react';
import { Label } from '../../../design-system/primitives/label';
import { Slider } from '../../../design-system/primitives/slider';
import { Input } from '../../../design-system/primitives/input';
import { Button } from '../../../design-system/primitives/button';
import { Badge } from '../../../design-system/primitives/badge';
import { Lock, Unlock, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../design-system/primitives/tooltip';
import { BorderRadiusController as BorderRadiusControllerType } from '../../../core/types/theme.types';

interface BorderRadiusControllerProps {
  label: string;
  description: string;
  controller: BorderRadiusControllerType;
  globalValue?: number;
  isGlobal?: boolean;
  onValueChange: (value: number, forceUnlink?: boolean) => void;
  onToggleLink?: (shouldLink: boolean) => void;
  className?: string;
}

export function BorderRadiusController({
  label,
  description,
  controller,
  globalValue,
  isGlobal = false,
  onValueChange,
  onToggleLink,
  className = ""
}: BorderRadiusControllerProps) {
  
  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    const shouldUnlink = !isGlobal && controller.isLinked;
    onValueChange(newValue, shouldUnlink);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(0, Math.min(50, parseFloat(e.target.value) || 0));
    const shouldUnlink = !isGlobal && controller.isLinked;
    onValueChange(newValue, shouldUnlink);
  };

  const handleLinkToggle = () => {
    if (onToggleLink && !isGlobal) {
      onToggleLink(!controller.isLinked);
    }
  };

  const handleReset = () => {
    if (isGlobal) {
      onValueChange(8);
    } else if (onToggleLink) {
      onToggleLink(true);
    }
  };

  const displayValue = controller.isLinked && !isGlobal && globalValue !== undefined 
    ? globalValue 
    : controller.value;

  const isLinked = controller.isLinked && !isGlobal;

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
              letterSpacing: 'var(--typography-h5-letter-spacing)'
            }} className="text-foreground">
              {label}
            </h5>
          </div>
          
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'calc(var(--typography-paragraph-font-size) * 0.85)',
            fontWeight: 'var(--typography-paragraph-font-weight)',
            lineHeight: 'var(--typography-paragraph-line-height)',
            letterSpacing: 'var(--typography-paragraph-letter-spacing)'
          }} className="text-muted-foreground mt-1">
            {description}
            {isLinked && globalValue !== undefined && (
              <span className="text-green-600 dark:text-green-400 ml-2">
                (siguiendo global: {globalValue}px)
              </span>
            )}
          </p>
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
                  {isGlobal ? 'Resetear a 8px' : 'Vincular a global'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isGlobal && onToggleLink && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={controller.isLinked ? "secondary" : "outline"}
                    size="sm"
                    onClick={handleLinkToggle}
                    className={`h-6 w-6 p-0 ${
                      controller.isLinked 
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800' 
                        : 'text-foreground hover:text-foreground/80'
                    }`}
                  >
                    {controller.isLinked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-xs">
                    {controller.isLinked ? 'Desvincular de global' : 'Vincular a global'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="ultra-thin-slider">
              <Slider
                value={[displayValue]}
                onValueChange={handleSliderChange}
                min={0}
                max={50}
                step={0.5}
                className="w-full"
                disabled={isLinked}
              />
              <style dangerouslySetInnerHTML={{
                __html: `
                  .ultra-thin-slider [data-slot="slider"] {
                    height: 8px !important;
                  }
                  .ultra-thin-slider [data-slot="slider-track"] {
                    height: 3px !important;
                    background: hsl(var(--border)) !important;
                  }
                  .ultra-thin-slider [data-slot="slider-range"] {
                    height: 3px !important;
                  }
                  .ultra-thin-slider [data-slot="slider-thumb"] {
                    width: 10px !important;
                    height: 10px !important;
                    border-radius: 5px !important;
                    border: 1px solid hsl(var(--border)) !important;
                    background: hsl(var(--background)) !important;
                  }
                  .ultra-thin-slider span.border-primary.bg-background.ring-ring\\/50.block.size-4.shrink-0.rounded-full {
                    width: 10px !important;
                    height: 10px !important;
                    border-radius: 5px !important;
                  }
                  .ultra-thin-slider .size-4 {
                    width: 10px !important;
                    height: 10px !important;
                  }
                  .ultra-thin-slider .rounded-full {
                    border-radius: 5px !important;
                  }
                  .ultra-thin-slider .bg-primary {
                    height: 3px !important;
                  }
                `
              }} />
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={displayValue}
              onChange={handleInputChange}
              className="w-12 h-6 text-xs text-center bg-background border-border text-foreground focus:ring-ring focus:border-ring"
              min="0"
              max="50"
              step="0.5"
              disabled={isLinked}
            />
            <span style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: 'var(--typography-emphasis-font-size)',
              fontWeight: 'var(--typography-emphasis-font-weight)',
              letterSpacing: 'var(--typography-emphasis-letter-spacing)'
            }} className="text-xs text-muted-foreground">
              px
            </span>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-6 bg-primary/20 border border-primary/40 flex items-center justify-center rounded-sm"
            style={{ borderRadius: `${displayValue}px` }}
          >
            <span style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: 'calc(var(--typography-emphasis-font-size) * 0.8)',
              fontWeight: 'var(--typography-emphasis-font-weight)',
              letterSpacing: 'var(--typography-emphasis-letter-spacing)'
            }} className="text-xs font-mono text-primary">
              {displayValue}
            </span>
          </div>
          
          {!isGlobal && (
            <>
              <div style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)'
              }} className="text-xs text-muted-foreground">
                →
              </div>
              <div 
                className="w-12 h-8 bg-primary/10 border border-primary/20 p-1 flex items-center justify-center rounded-sm"
                style={{ borderRadius: `${displayValue}px` }}
              >
                <div 
                  className="w-full h-full bg-primary/30 border border-primary/50 flex items-center justify-center rounded-sm"
                  style={{ 
                    borderRadius: `${Math.max(0, displayValue - (label.includes('Card') ? 12 : 4))}px`,
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'calc(var(--typography-emphasis-font-size) * 0.8)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-xs font-mono text-primary">
                    {Math.max(0, displayValue - (label.includes('Card') ? 12 : 4))}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}