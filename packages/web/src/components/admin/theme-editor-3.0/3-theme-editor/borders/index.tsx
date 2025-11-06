'use client';

import React from 'react';
import { Card } from '../../ui/card';
import { Slider } from '../../ui/slider';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ThemeBorders } from '../../types/theme.types';

interface BordersEditorProps {
  borders: ThemeBorders;
  onBordersChange: (borders: ThemeBorders) => void;
  className?: string;
}

const BORDER_STYLES = [
  'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'
];

export function BordersEditor({ 
  borders, 
  onBordersChange, 
  className = ""
}: BordersEditorProps) {
  
  const handleWidthChange = (key: string, value: number[]) => {
    const updatedBorders = {
      ...borders,
      width: {
        ...borders.width,
        [key]: `${value[0]}px`
      }
    };
    onBordersChange(updatedBorders);
  };

  const handleRadiusChange = (key: string, value: number[]) => {
    const updatedBorders = {
      ...borders,
      radius: {
        ...borders.radius,
        [key]: `${value[0]}px`
      }
    };
    onBordersChange(updatedBorders);
  };

  const handleStyleChange = (style: string) => {
    const updatedBorders = {
      ...borders,
      style
    };
    onBordersChange(updatedBorders);
  };

  const parsePixelValue = (value: string): number => {
    const match = value.match(/^(\d*\.?\d+)px$/);
    return match ? parseFloat(match[1]) : 0;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Border Widths */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Border Widths</h3>
        <div className="space-y-4">
          {Object.entries(borders.width).map(([key, value]) => {
            const pxValue = parsePixelValue(value);
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{key} ({value})</Label>
                  <Input
                    type="number"
                    value={pxValue}
                    onChange={(e) => handleWidthChange(key, [parseFloat(e.target.value) || 0])}
                    className="w-16 h-6 text-xs"
                    min="0"
                    max="20"
                    step="0.5"
                  />
                </div>
                <Slider
                  value={[pxValue]}
                  onValueChange={(value) => handleWidthChange(key, value)}
                  min={0}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
                {/* Visual Preview */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-8 bg-background"
                    style={{ 
                      border: `${value} solid hsl(var(--primary))`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    border-{key === 'DEFAULT' ? '' : `${key}-`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Border Radius */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Border Radius</h3>
        <div className="space-y-4">
          {Object.entries(borders.radius).map(([key, value]) => {
            const pxValue = parsePixelValue(value);
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{key} ({value})</Label>
                  <Input
                    type="number"
                    value={pxValue}
                    onChange={(e) => handleRadiusChange(key, [parseFloat(e.target.value) || 0])}
                    className="w-16 h-6 text-xs"
                    min="0"
                    max="50"
                    step="0.5"
                  />
                </div>
                <Slider
                  value={[pxValue]}
                  onValueChange={(value) => handleRadiusChange(key, value)}
                  min={0}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
                {/* Visual Preview */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-8 bg-primary/20 border border-primary/40"
                    style={{ 
                      borderRadius: value,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    rounded-{key === 'DEFAULT' ? '' : `${key}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Border Style */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Border Style</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Default Border Style</Label>
            <Select value={borders.style} onValueChange={handleStyleChange}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BORDER_STYLES.map(style => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BORDER_STYLES.map(style => {
              const isSelected = borders.style === style;
              
              return (
                <div 
                  key={style}
                  className={`p-3 text-center cursor-pointer rounded transition-colors ${
                    isSelected ? 'bg-primary/10 border-primary' : 'bg-muted/20 border-border'
                  } border-2`}
                  onClick={() => handleStyleChange(style)}
                >
                  <div 
                    className="w-full h-4 bg-transparent border-2 border-primary mb-2"
                    style={{ borderStyle: style }}
                  />
                  <span className="text-xs">{style}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Border Examples */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Usage Examples</h3>
        <div className="space-y-4">
          {/* Card Example */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Card Borders</h4>
            <div className="flex gap-4">
              {['DEFAULT', 'sm', 'md', 'lg'].map(radiusKey => {
                const radius = borders.radius[radiusKey] || '0px';
                const width = borders.width.DEFAULT;
                
                return (
                  <div key={radiusKey} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      {radiusKey === 'DEFAULT' ? 'default' : radiusKey}
                    </div>
                    <div 
                      className="w-16 h-12 bg-card border-border flex items-center justify-center text-xs"
                      style={{ 
                        borderWidth: width,
                        borderStyle: borders.style,
                        borderRadius: radius
                      }}
                    >
                      Card
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Button Examples */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Button Borders</h4>
            <div className="flex gap-4">
              {['sm', 'md', 'lg', 'xl'].map(radiusKey => {
                const radius = borders.radius[radiusKey] || '0px';
                const width = borders.width[2] || '2px';
                
                return (
                  <div key={radiusKey} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      {radiusKey}
                    </div>
                    <div 
                      className="px-3 py-1 bg-primary text-primary-foreground text-xs border-primary"
                      style={{ 
                        borderWidth: width,
                        borderStyle: borders.style,
                        borderRadius: radius
                      }}
                    >
                      Button
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}