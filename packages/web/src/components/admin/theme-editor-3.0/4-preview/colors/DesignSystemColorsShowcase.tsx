'use client';

import React from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Copy, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { ThemeColors } from '../../types/theme.types';
import { CSS_VARIABLE_MAP } from '../../types/color-sections.types';
import { oklchToHex } from '../../utils/color-conversions';
import { useThemeEditor } from '../../context/ThemeEditorContext';

interface DesignSystemColorsShowcaseProps {
  colors: ThemeColors;
}

interface ColorShowcaseItem {
  name: string;
  colorKey: keyof ThemeColors;
  category: string;
  description: string;
}

// Design system colors matching the exact structure of the editor
const DESIGN_SYSTEM_COLORS: ColorShowcaseItem[] = [
  // Primary Colors
  { name: 'Primary', colorKey: 'primary', category: 'Primary Colors', description: 'Primary brand color' },
  { name: 'Primary Foreground', colorKey: 'primaryForeground', category: 'Primary Colors', description: 'Text on primary background' },
  
  // Secondary Colors
  { name: 'Secondary', colorKey: 'secondary', category: 'Secondary Colors', description: 'Secondary brand color' },
  { name: 'Secondary Foreground', colorKey: 'secondaryForeground', category: 'Secondary Colors', description: 'Text on secondary background' },
  
  // Accent Colors
  { name: 'Accent', colorKey: 'accent', category: 'Accent Colors', description: 'Accent color for highlights' },
  { name: 'Accent Foreground', colorKey: 'accentForeground', category: 'Accent Colors', description: 'Text on accent background' },
  
  // Base Colors
  { name: 'Background', colorKey: 'background', category: 'Base Colors', description: 'Main page background' },
  { name: 'Foreground', colorKey: 'foreground', category: 'Base Colors', description: 'Primary text color' },
  
  // Card Colors
  { name: 'Card Background', colorKey: 'card', category: 'Card Colors', description: 'Card container background' },
  { name: 'Card Foreground', colorKey: 'cardForeground', category: 'Card Colors', description: 'Text on card surfaces' },
  
  // Popover Colors
  { name: 'Popover Background', colorKey: 'popover', category: 'Popover Colors', description: 'Popover background' },
  { name: 'Popover Foreground', colorKey: 'popoverForeground', category: 'Popover Colors', description: 'Text in popovers' },
  
  // Muted Colors
  { name: 'Muted', colorKey: 'muted', category: 'Muted Colors', description: 'Muted background color' },
  { name: 'Muted Foreground', colorKey: 'mutedForeground', category: 'Muted Colors', description: 'Subdued text color' },
  
  // Destructive Colors
  { name: 'Destructive', colorKey: 'destructive', category: 'Destructive Colors', description: 'Error and destructive actions' },
  { name: 'Destructive Foreground', colorKey: 'destructiveForeground', category: 'Destructive Colors', description: 'Text on destructive background' },
  
  // Border & Input Colors
  { name: 'Border', colorKey: 'border', category: 'Border & Input Colors', description: 'Default border color' },
  { name: 'Input', colorKey: 'input', category: 'Border & Input Colors', description: 'Input field background' },
  { name: 'Ring', colorKey: 'ring', category: 'Border & Input Colors', description: 'Focus ring color' },
  
  // Chart Colors
  { name: 'Chart 1', colorKey: 'chart1', category: 'Chart Colors', description: 'First chart color' },
  { name: 'Chart 2', colorKey: 'chart2', category: 'Chart Colors', description: 'Second chart color' },
  { name: 'Chart 3', colorKey: 'chart3', category: 'Chart Colors', description: 'Third chart color' },
  { name: 'Chart 4', colorKey: 'chart4', category: 'Chart Colors', description: 'Fourth chart color' },
  { name: 'Chart 5', colorKey: 'chart5', category: 'Chart Colors', description: 'Fifth chart color' },
  
  // Sidebar Colors
  { name: 'Sidebar Background', colorKey: 'sidebar', category: 'Sidebar Colors', description: 'Sidebar background' },
  { name: 'Sidebar Foreground', colorKey: 'sidebarForeground', category: 'Sidebar Colors', description: 'Sidebar text color' },
  { name: 'Sidebar Primary', colorKey: 'sidebarPrimary', category: 'Sidebar Colors', description: 'Sidebar primary elements' },
  { name: 'Sidebar Primary Foreground', colorKey: 'sidebarPrimaryForeground', category: 'Sidebar Colors', description: 'Text on sidebar primary' },
  { name: 'Sidebar Accent', colorKey: 'sidebarAccent', category: 'Sidebar Colors', description: 'Sidebar accent color' },
  { name: 'Sidebar Accent Foreground', colorKey: 'sidebarAccentForeground', category: 'Sidebar Colors', description: 'Text on sidebar accent' },
  { name: 'Sidebar Border', colorKey: 'sidebarBorder', category: 'Sidebar Colors', description: 'Sidebar border color' },
  { name: 'Sidebar Ring', colorKey: 'sidebarRing', category: 'Sidebar Colors', description: 'Sidebar focus ring' },
  
  // Scrollbar Colors
  { name: 'Scrollbar Track', colorKey: 'scrollbarTrack', category: 'Scrollbar Colors', description: 'Scrollbar track background' },
  { name: 'Scrollbar Thumb', colorKey: 'scrollbarThumb', category: 'Scrollbar Colors', description: 'Scrollbar thumb color' },
];

function ColorCard({ item, colors }: { item: ColorShowcaseItem; colors: ThemeColors }) {
  const [copied, setCopied] = React.useState(false);
  const colorToken = colors[item.colorKey];
  const hexValue = colorToken ? oklchToHex(colorToken.oklch) : '#000000';
  const cssVariable = CSS_VARIABLE_MAP[item.colorKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(hexValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4 bg-card border-border hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h5 style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)'
          }} className="text-foreground truncate">{item.name}</h5>
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
            fontWeight: 'var(--typography-paragraph-font-weight)',
            lineHeight: 'var(--typography-paragraph-line-height)',
            letterSpacing: 'var(--typography-paragraph-letter-spacing)'
          }} className="text-muted-foreground mt-1 text-xs">{item.description}</p>
        </div>

        {/* Color Preview */}
        <div className="space-y-2">
          <div 
            className="w-full h-16 rounded-md border border-border shadow-inner"
            style={{ backgroundColor: hexValue }}
          />
          
          
          {/* Color Value & CSS Variable */}
          <div className="space-y-1">
            <div style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: 'var(--typography-emphasis-font-size)',
              fontWeight: 'var(--typography-emphasis-font-weight)',
              letterSpacing: 'var(--typography-emphasis-letter-spacing)'
            }} className="text-muted-foreground truncate text-xs">
              {cssVariable}
            </div>
            <div className="flex items-center justify-between bg-muted/30 px-2 py-1 rounded min-w-0">
              <span style={{
                fontFamily: 'var(--typography-emphasis-font-family)',
                fontSize: 'var(--typography-emphasis-font-size)',
                fontWeight: 'var(--typography-emphasis-font-weight)',
                letterSpacing: 'var(--typography-emphasis-letter-spacing)'
              }} className="text-foreground truncate flex-1 mr-2 text-xs">
                {hexValue}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckCircle className="h-3 w-3 text-primary" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DesignSystemColorsShowcase({ colors }: DesignSystemColorsShowcaseProps) {
  const { state } = useThemeEditor();

  // Get responsive grid classes based on current viewport
  const getGridClasses = () => {
    const currentViewport = state.viewport.current;
    if (currentViewport === 'smartphone') {
      return 'grid grid-cols-1 gap-3';
    }
    if (currentViewport === 'tablet') {
      // Tablet: 2 columns for most sections, 3 for smaller items
      return 'grid grid-cols-2 gap-4';
    }
    if (currentViewport === 'tv') {
      // TV: More columns with larger gaps
      return 'grid grid-cols-4 xl:grid-cols-5 gap-6';
    }
    // Desktop: Responsive grid
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
  };

  // Group colors by category
  const colorsByCategory = DESIGN_SYSTEM_COLORS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ColorShowcaseItem[]>);

  // Define the order to match the editor sections
  const categoryOrder = [
    'Primary Colors',
    'Secondary Colors', 
    'Accent Colors',
    'Base Colors',
    'Card Colors',
    'Popover Colors',
    'Muted Colors',
    'Destructive Colors',
    'Border & Input Colors',
    'Chart Colors',
    'Sidebar Colors',
    'Scrollbar Colors'
  ];
  
  const categories = categoryOrder.filter(cat => colorsByCategory[cat]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{
            fontFamily: 'var(--typography-h3-font-family)',
            fontSize: 'var(--typography-h3-font-size)',
            fontWeight: 'var(--typography-h3-font-weight)',
            lineHeight: 'var(--typography-h3-line-height)',
            letterSpacing: 'var(--typography-h3-letter-spacing)'
          }} className="text-foreground">Design System Colors</h3>
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
            fontWeight: 'var(--typography-paragraph-font-weight)',
            lineHeight: 'var(--typography-paragraph-line-height)',
            letterSpacing: 'var(--typography-paragraph-letter-spacing)'
          }} className="text-muted-foreground mt-1">
            Complete color palette synchronized with CSS variables
          </p>
        </div>
        <Badge variant="secondary" style={{
          fontFamily: 'var(--typography-emphasis-font-family)',
          fontSize: 'var(--typography-emphasis-font-size)',
          fontWeight: 'var(--typography-emphasis-font-weight)',
          letterSpacing: 'var(--typography-emphasis-letter-spacing)'
        }}>
          {categories.length} Sections • {DESIGN_SYSTEM_COLORS.length} Colors
        </Badge>
      </div>

      {/* Color Categories */}
      {categories.map((category) => {
        // Special grid for chart colors (5 items) to distribute better
        const isChartColors = category === 'Chart Colors';
        const categoryGridClass = isChartColors && state.viewport.current === 'tablet' 
          ? 'grid grid-cols-3 gap-4' 
          : isChartColors && state.viewport.current === 'tv'
          ? 'grid grid-cols-5 gap-6'
          : getGridClasses();
        
        return (
          <div key={category} className="space-y-4">
            <h4 style={{
              fontFamily: 'var(--typography-h4-font-family)',
              fontSize: 'var(--typography-h4-font-size)',
              fontWeight: 'var(--typography-h4-font-weight)',
              lineHeight: 'var(--typography-h4-line-height)',
              letterSpacing: 'var(--typography-h4-letter-spacing)'
            }} className="text-foreground border-b border-border pb-2">
              {category}
            </h4>
            <div className={categoryGridClass}>
              {colorsByCategory[category].map((item) => (
                <ColorCard key={item.colorKey} item={item} colors={colors} />
              ))}
            </div>
          </div>
        );
      })}

    </div>
  );
}