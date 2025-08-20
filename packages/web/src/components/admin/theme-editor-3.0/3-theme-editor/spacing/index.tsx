'use client';

import React from 'react';
import { Card } from '../../ui/card';
import { ThemeSpacing } from '../../types/theme.types';

interface SpacingEditorProps {
  spacing: ThemeSpacing;
  onSpacingChange: (spacing: ThemeSpacing) => void;
  className?: string;
}

export function SpacingEditor({ 
  spacing, 
  onSpacingChange, 
  className = ""
}: SpacingEditorProps) {
  
  // Group spacing values for better visualization
  const spacingGroups = [
    {
      title: 'Micro Spacing',
      keys: ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3']
    },
    {
      title: 'Small Spacing',
      keys: ['3.5', '4', '5', '6', '7', '8']
    },
    {
      title: 'Medium Spacing',
      keys: ['9', '10', '11', '12', '14', '16']
    },
    {
      title: 'Large Spacing',
      keys: ['20', '24', '28', '32', '36', '40']
    },
    {
      title: 'Extra Large Spacing',
      keys: ['44', '48', '52', '56', '60', '64', '72', '80', '96']
    }
  ];

  const parseSpacing = (value: string): number => {
    if (value === '0px' || value === '0') return 0;
    if (value === '1px') return 1;
    const remMatch = value.match(/^([\d.]+)rem$/);
    if (remMatch) return parseFloat(remMatch[1]) * 16; // Convert rem to px for visualization
    return 0;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Spacing Scale */}
      {spacingGroups.map(({ title, keys }) => (
        <Card key={title} className="p-4">
          <h3 className="text-sm font-medium mb-4">{title}</h3>
          <div className="space-y-3">
            {keys.map((key) => {
              const value = spacing.scale[key];
              if (!value) return null;
              
              const pxValue = parseSpacing(value);
              
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-8 text-xs text-muted-foreground">{key}</div>
                  <div className="w-16 text-xs font-mono text-muted-foreground">{value}</div>
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="bg-primary/20 border border-primary/40"
                      style={{ 
                        width: `${Math.max(pxValue, 2)}px`, 
                        height: '12px',
                        maxWidth: '200px'
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {pxValue}px
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {/* Container Sizes */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Container Sizes</h3>
        <div className="space-y-3">
          {Object.entries(spacing.containers).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-8 text-xs text-muted-foreground">{key}</div>
              <div className="w-16 text-xs font-mono text-muted-foreground">{value}</div>
              <div className="flex items-center gap-2 flex-1">
                <div 
                  className="bg-secondary/20 border border-secondary/40 h-3"
                  style={{ 
                    width: `${Math.min(parseInt(value) / 8, 200)}px`
                  }}
                />
                <span className="text-xs text-muted-foreground">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Spacing Usage Examples */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Usage Examples</h3>
        <div className="space-y-4">
          {/* Padding Example */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Padding Examples</h4>
            <div className="flex gap-4 items-start">
              {['2', '4', '6', '8'].map((key) => {
                const value = spacing.scale[key];
                return (
                  <div key={key} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">p-{key}</div>
                    <div 
                      className="bg-primary/10 border border-primary/30 inline-flex items-center justify-center text-xs"
                      style={{ padding: value }}
                    >
                      <div className="bg-primary/20 px-2 py-1">
                        Content
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Margin Example */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Margin Examples</h4>
            <div className="flex gap-1 items-center">
              {['1', '2', '4', '6'].map((key) => {
                const value = spacing.scale[key];
                return (
                  <div key={key}>
                    <div className="text-xs text-muted-foreground mb-1 text-center">m-{key}</div>
                    <div 
                      className="bg-secondary/20 border"
                      style={{ margin: value, padding: '8px' }}
                    >
                      <div className="bg-secondary/40 text-xs px-2 py-1 text-center">
                        Box
                      </div>
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