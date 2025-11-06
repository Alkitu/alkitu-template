'use client';

import React from 'react';
import { Card } from '../../ui/card';
import { Slider } from '../../ui/slider';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ThemeShadows } from '../../types/theme.types';

interface ShadowsEditorProps {
  shadows: ThemeShadows;
  onShadowsChange: (shadows: ThemeShadows) => void;
  className?: string;
}

const SHADOW_GROUPS = [
  {
    title: 'Subtle Shadows',
    keys: ['xs', 'sm']
  },
  {
    title: 'Medium Shadows',
    keys: ['DEFAULT', 'md']
  },
  {
    title: 'Strong Shadows',
    keys: ['lg', 'xl']
  },
  {
    title: 'Extra Strong Shadows',
    keys: ['2xl']
  }
];

export function ShadowsEditor({ 
  shadows, 
  onShadowsChange, 
  className = ""
}: ShadowsEditorProps) {
  
  const handleShadowChange = (key: string, value: string) => {
    const updatedShadows = {
      ...shadows,
      [key]: value
    };
    onShadowsChange(updatedShadows);
  };

  // Parse shadow values to extract blur and spread for editing
  const parseShadow = (shadowValue: string) => {
    // Basic parsing for box-shadow values like "0 1px 3px 0 hsl(var(--foreground) / 0.1)"
    const match = shadowValue.match(/(\d+)px\s+(\d+)px\s+(\d+)px/);
    if (match) {
      return {
        offsetX: parseInt(match[1]),
        offsetY: parseInt(match[2]),
        blur: parseInt(match[3])
      };
    }
    return { offsetX: 0, offsetY: 0, blur: 0 };
  };

  const createShadow = (offsetX: number, offsetY: number, blur: number, color = 'hsl(var(--foreground) / 0.1)') => {
    return `${offsetX}px ${offsetY}px ${blur}px 0 ${color}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Shadow Levels */}
      {SHADOW_GROUPS.map(({ title, keys }) => (
        <Card key={title} className="p-4">
          <h3 className="text-sm font-medium mb-4">{title}</h3>
          <div className="space-y-6">
            {keys.map((key) => {
              const shadowValue = shadows[key];
              if (!shadowValue) return null;
              
              const parsed = parseShadow(shadowValue);
              
              return (
                <div key={key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{key === 'DEFAULT' ? 'default' : key}</Label>
                    <div className="text-xs text-muted-foreground font-mono">
                      shadow-{key === 'DEFAULT' ? '' : key}
                    </div>
                  </div>
                  
                  {/* Shadow Controls */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Offset Y */}
                    <div className="space-y-2">
                      <Label className="text-xs">Offset Y</Label>
                      <Input
                        type="number"
                        value={parsed.offsetY}
                        onChange={(e) => {
                          const newValue = createShadow(
                            parsed.offsetX,
                            parseInt(e.target.value) || 0,
                            parsed.blur
                          );
                          handleShadowChange(key, newValue);
                        }}
                        className="h-6 text-xs"
                        min="0"
                        max="20"
                      />
                      <Slider
                        value={[parsed.offsetY]}
                        onValueChange={(value) => {
                          const newValue = createShadow(
                            parsed.offsetX,
                            value[0],
                            parsed.blur
                          );
                          handleShadowChange(key, newValue);
                        }}
                        min={0}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Blur */}
                    <div className="space-y-2">
                      <Label className="text-xs">Blur</Label>
                      <Input
                        type="number"
                        value={parsed.blur}
                        onChange={(e) => {
                          const newValue = createShadow(
                            parsed.offsetX,
                            parsed.offsetY,
                            parseInt(e.target.value) || 0
                          );
                          handleShadowChange(key, newValue);
                        }}
                        className="h-6 text-xs"
                        min="0"
                        max="50"
                      />
                      <Slider
                        value={[parsed.blur]}
                        onValueChange={(value) => {
                          const newValue = createShadow(
                            parsed.offsetX,
                            parsed.offsetY,
                            value[0]
                          );
                          handleShadowChange(key, newValue);
                        }}
                        min={0}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Visual Preview */}
                    <div className="space-y-2">
                      <Label className="text-xs">Preview</Label>
                      <div className="h-16 flex items-center justify-center">
                        <div 
                          className="w-12 h-12 bg-card border rounded-md flex items-center justify-center text-xs"
                          style={{ boxShadow: shadowValue }}
                        >
                          {key}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CSS Value */}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">CSS Value</Label>
                    <Input
                      value={shadowValue}
                      onChange={(e) => handleShadowChange(key, e.target.value)}
                      className="font-mono text-xs"
                      placeholder="Enter custom shadow value"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Shadow Usage Examples */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Usage Examples</h3>
        <div className="space-y-6">
          {/* Card Shadows */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium">Card Shadows</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['sm', 'DEFAULT', 'md', 'lg'].map((shadowKey) => {
                const shadowValue = shadows[shadowKey];
                return (
                  <div key={shadowKey} className="text-center space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {shadowKey === 'DEFAULT' ? 'default' : shadowKey}
                    </div>
                    <div 
                      className="h-16 bg-card border rounded-lg flex items-center justify-center text-xs"
                      style={{ boxShadow: shadowValue }}
                    >
                      Card
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Button Shadows */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium">Button Shadows</h4>
            <div className="flex gap-4 flex-wrap">
              {['xs', 'sm', 'DEFAULT', 'md'].map((shadowKey) => {
                const shadowValue = shadows[shadowKey];
                return (
                  <div key={shadowKey} className="text-center space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {shadowKey === 'DEFAULT' ? 'default' : shadowKey}
                    </div>
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs hover:bg-primary/90 transition-colors"
                      style={{ boxShadow: shadowValue }}
                    >
                      Button
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal/Dialog Shadows */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium">Modal/Dialog Shadows</h4>
            <div className="flex gap-6">
              {['lg', 'xl', '2xl'].map((shadowKey) => {
                const shadowValue = shadows[shadowKey];
                return (
                  <div key={shadowKey} className="text-center space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {shadowKey}
                    </div>
                    <div 
                      className="w-20 h-16 bg-card border rounded-lg flex items-center justify-center text-xs"
                      style={{ boxShadow: shadowValue }}
                    >
                      Modal
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Shadow Color Note */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-2">Shadow Colors</h3>
        <div className="text-xs text-muted-foreground space-y-2">
          <p>
            Shadow colors are currently set to <code className="bg-muted px-1 rounded">hsl(var(--foreground) / 0.1)</code> for consistency.
          </p>
          <p>
            To customize shadow colors, edit the CSS values directly or integrate with the color system.
          </p>
        </div>
      </Card>
    </div>
  );
}