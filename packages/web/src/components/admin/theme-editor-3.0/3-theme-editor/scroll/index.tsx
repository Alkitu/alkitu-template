'use client';

import React from 'react';
import { Card } from '../../ui/card';
import { Slider } from '../../ui/slider';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { ThemeScroll } from '../../types/theme.types';

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

  const handleWidthChange = (value: number[]) => {
    handlePropertyChange('width', `${value[0]}px`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Scroll Behavior */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Scroll Behavior</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Global Scroll Behavior */}
          <div className="space-y-2">
            <Label className="text-xs">Default Scroll Behavior</Label>
            <Select 
              value={scroll.behavior} 
              onValueChange={(value) => handlePropertyChange('behavior', value)}
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
        <h3 className="text-sm font-medium mb-4">Scrollbar Styling</h3>
        
        <div className="space-y-4">
          {/* Scrollbar Width */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Scrollbar Width</Label>
              <Input
                type="number"
                value={parsePixelValue(scroll.width)}
                onChange={(e) => handleWidthChange([parseFloat(e.target.value) || 8])}
                className="w-16 h-6 text-xs"
                min="4"
                max="20"
                step="1"
              />
            </div>
            <Slider
              value={[parsePixelValue(scroll.width)]}
              onValueChange={handleWidthChange}
              min={4}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              Current: {scroll.width}
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

      {/* Scrollbar Preview */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Scrollbar Preview</h3>
        
        <div className="space-y-4">
          {/* Vertical Scrollbar Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Vertical Scrollbar</h4>
            <div 
              className="h-32 border rounded bg-background overflow-y-auto p-3"
              style={{
                scrollbarWidth: scroll.hide ? 'none' : 'thin',
                msOverflowStyle: scroll.hide ? 'none' : 'auto',
                ...(scroll.hide ? {
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                } : {
                  '&::-webkit-scrollbar': {
                    width: scroll.width
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'hsl(var(--muted))'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'hsl(var(--muted-foreground))',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'hsl(var(--foreground))'
                  }
                })
              }}
            >
              <div className="text-xs text-muted-foreground space-y-2">
                <p>This is a scrollable area to preview the scrollbar styling.</p>
                <p>The scrollbar width is set to {scroll.width}.</p>
                <p>Scroll behavior is set to "{scroll.behavior}".</p>
                <p>Smooth scrolling is {scroll.smooth ? 'enabled' : 'disabled'}.</p>
                <p>Scrollbars are {scroll.hide ? 'hidden' : 'visible'}.</p>
                <p>This content extends beyond the container height to demonstrate scrolling.</p>
                <p>You can adjust the settings above to see how they affect the scrollbar appearance.</p>
                <p>The scrollbar styling uses CSS custom properties that integrate with your theme.</p>
                <p>Additional content to ensure scrolling is necessary for the preview.</p>
              </div>
            </div>
          </div>

          {/* Horizontal Scrollbar Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Horizontal Scrollbar</h4>
            <div 
              className="w-full border rounded bg-background overflow-x-auto p-3"
              style={{
                scrollbarWidth: scroll.hide ? 'none' : 'thin',
                msOverflowStyle: scroll.hide ? 'none' : 'auto',
                ...(scroll.hide ? {
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                } : {
                  '&::-webkit-scrollbar': {
                    height: scroll.width
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'hsl(var(--muted))'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'hsl(var(--muted-foreground))',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'hsl(var(--foreground))'
                  }
                })
              }}
            >
              <div className="w-96 text-xs text-muted-foreground whitespace-nowrap">
                This is a horizontally scrollable area that demonstrates horizontal scrollbar styling with the current settings.
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* CSS Implementation */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">CSS Implementation</h3>
        
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            The scroll settings generate the following CSS:
          </div>
          
          <div className="bg-muted/50 p-3 rounded border font-mono text-xs overflow-x-auto">
            <div className="whitespace-pre-wrap">
{`html {
  scroll-behavior: ${scroll.behavior};
}

${scroll.hide ? `
/* Hide scrollbars */
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

*::-webkit-scrollbar {
  display: none;
}` : `
/* Custom scrollbars */
* {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted-foreground)) hsl(var(--muted));
}

*::-webkit-scrollbar {
  width: ${scroll.width};
  height: ${scroll.width};
}

*::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

*::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 4px;
}

*::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--foreground));
}`}
`}
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Guidelines */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Usage Guidelines</h3>
        
        <div className="space-y-3 text-xs text-muted-foreground">
          <div>
            <strong className="text-foreground">Smooth Scrolling:</strong> Enables smooth animation for programmatic scrolling (scrollIntoView, etc.)
          </div>
          <div>
            <strong className="text-foreground">Scrollbar Width:</strong> Adjust based on your design needs. Thinner scrollbars (4-8px) are more modern.
          </div>
          <div>
            <strong className="text-foreground">Hidden Scrollbars:</strong> Consider accessibility - some users rely on visible scrollbars for navigation.
          </div>
          <div>
            <strong className="text-foreground">Browser Support:</strong> Webkit scrollbar styles work in Chrome/Safari. Firefox uses scrollbar-width and scrollbar-color.
          </div>
        </div>
      </Card>
    </div>
  );
}