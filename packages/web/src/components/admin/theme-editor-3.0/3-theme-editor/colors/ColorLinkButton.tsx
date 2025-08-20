'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Link, Check } from 'lucide-react';
import { ColorToken, ThemeColors } from '../../types/theme.types';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';

interface ColorLinkButtonProps {
  currentColor: ColorToken;
  allColors: ThemeColors;
  onLinkChange: (linkedColors: string[]) => void;
  mode: 'light' | 'dark';
}

export function ColorLinkButton({ 
  currentColor, 
  allColors, 
  onLinkChange,
  mode 
}: ColorLinkButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get current linked colors for this color
  const linkedColors = currentColor?.linkedColors || [];
  
  // Convert allColors object to array for easier iteration
  const colorList = useMemo(() => {
    return Object.entries(allColors)
      .filter(([key]) => key !== currentColor.name) // Exclude current color
      .map(([key, colorToken]) => ({
        key,
        name: colorToken.name,
        hex: colorToken.hex || 'hsl(var(--foreground))',
        isLinked: linkedColors.includes(key)
      }));
  }, [allColors, currentColor.name, linkedColors]);
  
  const handleToggleLink = (colorKey: string) => {
    const newLinkedColors = linkedColors.includes(colorKey)
      ? linkedColors.filter(c => c !== colorKey)
      : [...linkedColors, colorKey];
    
    onLinkChange(newLinkedColors);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="px-2 relative"
        >
          <Link className="h-3 w-3" />
          {linkedColors.length > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {linkedColors.length}
            </Badge>
          )}
          <span className="sr-only">Link colors</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Link Colors to "{currentColor.name}"
            </Label>
            <p className="text-xs text-muted-foreground">
              Select colors that should inherit from this color
            </p>
          </div>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-1">
              {colorList.map((color) => (
                <Button
                  key={color.key}
                  variant="ghost"
                  className="w-full justify-start px-2 py-1.5 h-auto"
                  onClick={() => handleToggleLink(color.key)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-4 h-4 flex items-center justify-center">
                      {color.isLinked && (
                        <Check className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    <div
                      className="w-6 h-6 rounded border border-border shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm flex-1 text-left">
                      {color.name}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
          
          {linkedColors.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                {linkedColors.length} color{linkedColors.length !== 1 ? 's' : ''} linked
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}