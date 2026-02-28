'use client';

import React from 'react';
import { Card } from '@/components/primitives/ui/card';
import { Slider } from '@/components/primitives/ui/slider';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/ui/select';
import { Switch } from '@/components/primitives/ui/switch';
import { ThemeScroll } from '../../../core/types/theme.types';

interface ScrollEditorProps {
  scroll: ThemeScroll;
  onScrollChange: (scroll: ThemeScroll) => void;
  className?: string;
}

const SCROLL_BEHAVIORS = [
  { value: 'auto', label: 'Auto' },
  { value: 'smooth', label: 'Smooth' },
  { value: 'instant', label: 'Instant' }
];

const SCROLLBAR_WIDTHS = [
  { value: '6px', label: 'Thin (6px)', class: 'scrollbar-thin' },
  { value: '8px', label: 'Default (8px)', class: 'default' },
  { value: '10px', label: 'Medium (10px)', class: 'scrollbar-medium' },
  { value: '14px', label: 'Thick (14px)', class: 'scrollbar-thick' }
];

export function ScrollEditor({ 
  scroll, 
  onScrollChange, 
  className = ""
}: ScrollEditorProps) {
  
  const handlePropertyChange = <K extends keyof ThemeScroll>(
    property: K, 
    value: ThemeScroll[K]
  ) => {
    const updatedScroll = {
      ...scroll,
      [property]: value
    };
    onScrollChange(updatedScroll);
  };

  const parsePixelValue = (value: string): number => {
    const match = value.match(/^(\d*\.?\d+)px$/);
    return match ? parseFloat(match[1]) : 8;
  };


  const handleTrackRadiusChange = (value: number[]) => {
    handlePropertyChange('trackRadius', `${value[0]}px`);
  };

  const handleThumbRadiusChange = (value: number[]) => {
    handlePropertyChange('thumbRadius', `${value[0]}px`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Scroll Behavior */}
      <Card className="p-4">
        <h5 style={{
          fontFamily: 'var(--typography-h5-font-family)',
          fontSize: 'var(--typography-h5-font-size)',
          fontWeight: 'var(--typography-h5-font-weight)',
          lineHeight: 'var(--typography-h5-line-height)',
          letterSpacing: 'var(--typography-h5-letter-spacing)'
        }} className="text-foreground mb-4">Scroll Behavior</h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Global Scroll Behavior */}
          <div className="space-y-2">
            <Label className="text-xs">Default Scroll Behavior</Label>
            <Select 
              value={scroll.behavior} 
              onValueChange={(value: string) => handlePropertyChange('behavior', value as 'auto' | 'smooth' | 'instant')}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCROLL_BEHAVIORS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Controls how scrolling animates when triggered programmatically
            </div>
          </div>

          {/* Smooth Scrolling */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Enable Smooth Scrolling</Label>
              <Switch
                checked={scroll.smooth}
                onCheckedChange={(checked) => handlePropertyChange('smooth', checked)}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Applies smooth scrolling to the entire page
            </div>
          </div>
        </div>
      </Card>

      {/* Scrollbar Styling */}
      <Card className="p-4">
        <h5 style={{
          fontFamily: 'var(--typography-h5-font-family)',
          fontSize: 'var(--typography-h5-font-size)',
          fontWeight: 'var(--typography-h5-font-weight)',
          lineHeight: 'var(--typography-h5-line-height)',
          letterSpacing: 'var(--typography-h5-letter-spacing)'
        }} className="text-foreground mb-4">Scrollbar Styling</h5>
        
        <div className="space-y-4">
          {/* Scrollbar Width */}
          <div className="space-y-2">
            <Label className="text-xs">Scrollbar Width</Label>
            <Select 
              value={scroll.width} 
              onValueChange={(value) => handlePropertyChange('width', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCROLLBAR_WIDTHS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Current: {SCROLLBAR_WIDTHS.find(w => w.value === scroll.width)?.label || scroll.width}
            </div>
          </div>

          {/* Track Border Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Track Border Radius (Riel)</Label>
              <Input
                type="number"
                value={parsePixelValue(scroll.trackRadius || '0px')}
                onChange={(e) => handleTrackRadiusChange([parseFloat(e.target.value) || 0])}
                className="w-16 h-6 text-xs"
                min="0"
                max="16"
                step="1"
              />
            </div>
            <Slider
              value={[parsePixelValue(scroll.trackRadius || '0px')]}
              onValueChange={handleTrackRadiusChange}
              min={0}
              max={16}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Current: {scroll.trackRadius || '0px'}
            </div>
          </div>

          {/* Thumb Border Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Thumb Border Radius (Deslizador)</Label>
              <Input
                type="number"
                value={parsePixelValue(scroll.thumbRadius || '4px')}
                onChange={(e) => handleThumbRadiusChange([parseFloat(e.target.value) || 4])}
                className="w-16 h-6 text-xs"
                min="0"
                max="16"
                step="1"
              />
            </div>
            <Slider
              value={[parsePixelValue(scroll.thumbRadius || '4px')]}
              onValueChange={handleThumbRadiusChange}
              min={0}
              max={16}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Current: {scroll.thumbRadius || '4px'}
            </div>
          </div>

          {/* Hide Scrollbars */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Hide Scrollbars</Label>
              <Switch
                checked={scroll.hide}
                onCheckedChange={(checked) => handlePropertyChange('hide', checked)}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Hides scrollbars while maintaining scroll functionality
            </div>
          </div>
        </div>
      </Card>



    </div>
  );
}