'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Copy, Check } from 'lucide-react';
import { ThemeWithCurrentColors } from '../../types/theme.types';
import { generateThemeCSS } from '../../utils/css-variables';
import { oklchToHex, oklchToRgb } from '../../utils/color-conversions';
import { CSS_VARIABLE_MAP } from '../../types/color-sections.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ThemeCodeModalProps {
  theme: ThemeWithCurrentColors;
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCodeModal({ theme, isOpen, onClose }: ThemeCodeModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('css');
  const [colorFormat, setColorFormat] = useState<'oklch' | 'hex' | 'rgb'>('oklch');

  // Generate CSS code with format selection
  const generateCSS = (): string => {
    let css = '';
    
    // Light mode
    css += `:root {\n`;
    Object.entries(theme.lightColors).forEach(([colorKey, colorToken]) => {
      const cssVariable = CSS_VARIABLE_MAP[colorKey as keyof typeof CSS_VARIABLE_MAP];
      if (cssVariable) {
        let colorValue = '';
        
        if (colorFormat === 'oklch') {
          colorValue = colorToken.value;
        } else if (colorFormat === 'hex') {
          colorValue = oklchToHex(colorToken.oklch);
        } else if (colorFormat === 'rgb') {
          const rgb = oklchToRgb(colorToken.oklch);
          colorValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
        
        css += `  ${cssVariable}: ${colorValue};\n`;
      }
    });
    
    // Typography, borders, spacing, shadows
    css += `  --font-sans: ${theme.typography.fontFamilies.sans};\n`;
    css += `  --font-serif: ${theme.typography.fontFamilies.serif};\n`;
    css += `  --font-mono: ${theme.typography.fontFamilies.mono};\n`;
    css += `  --tracking-normal: ${theme.typography.trackingNormal};\n`;
    css += `  --radius: ${theme.borders.radius};\n`;
    css += `  --spacing: ${theme.spacing.spacing};\n`;
    css += `  --shadow-2xs: ${theme.shadows.shadow2xs};\n`;
    css += `  --shadow-xs: ${theme.shadows.shadowXs};\n`;
    css += `  --shadow-sm: ${theme.shadows.shadowSm};\n`;
    css += `  --shadow: ${theme.shadows.shadow};\n`;
    css += `  --shadow-md: ${theme.shadows.shadowMd};\n`;
    css += `  --shadow-lg: ${theme.shadows.shadowLg};\n`;
    css += `  --shadow-xl: ${theme.shadows.shadowXl};\n`;
    css += `  --shadow-2xl: ${theme.shadows.shadow2xl};\n`;
    css += `}\n\n`;
    
    // Dark mode
    css += `.dark {\n`;
    Object.entries(theme.darkColors).forEach(([colorKey, colorToken]) => {
      const cssVariable = CSS_VARIABLE_MAP[colorKey as keyof typeof CSS_VARIABLE_MAP];
      if (cssVariable) {
        let colorValue = '';
        
        if (colorFormat === 'oklch') {
          colorValue = colorToken.value;
        } else if (colorFormat === 'hex') {
          colorValue = oklchToHex(colorToken.oklch);
        } else if (colorFormat === 'rgb') {
          const rgb = oklchToRgb(colorToken.oklch);
          colorValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
        
        css += `  ${cssVariable}: ${colorValue};\n`;
      }
    });
    css += `}\n`;
    
    return css;
  };

  // Generate JSON code
  const generateJSON = (): string => {
    return JSON.stringify(theme, null, 2);
  };

  // Generate Tailwind config
  const generateTailwind = (): string => {
    const lightColors = Object.entries(theme.lightColors).reduce((acc, [key, colorToken]) => {
      const colorName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      acc[colorName] = oklchToHex(colorToken.oklch);
      return acc;
    }, {} as Record<string, string>);

    const darkColors = Object.entries(theme.darkColors).reduce((acc, [key, colorToken]) => {
      const colorName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      acc[colorName] = oklchToHex(colorToken.oklch);
      return acc;
    }, {} as Record<string, string>);

    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors (automatically switches to dark via CSS variables)
${Object.entries(lightColors).map(([key, value]) => `        '${key}': 'hsl(var(--${key}))',`).join('\n')}
      },
      fontFamily: {
        sans: ['${theme.typography.fontFamilies.sans}'],
        serif: ['${theme.typography.fontFamilies.serif}'],
        mono: ['${theme.typography.fontFamilies.mono}'],
      },
      borderRadius: {
        'DEFAULT': '${theme.borders.radius}',
        'sm': 'calc(${theme.borders.radius} - 4px)',
        'md': 'calc(${theme.borders.radius} - 2px)',
        'lg': '${theme.borders.radius}',
        'xl': 'calc(${theme.borders.radius} + 4px)',
      },
      spacing: {
        'theme': '${theme.spacing.spacing}',
      },
      boxShadow: {
        '2xs': '${theme.shadows.shadow2xs}',
        'xs': '${theme.shadows.shadowXs}',
        'sm': '${theme.shadows.shadowSm}',
        'DEFAULT': '${theme.shadows.shadow}',
        'md': '${theme.shadows.shadowMd}',
        'lg': '${theme.shadows.shadowLg}',
        'xl': '${theme.shadows.shadowXl}',
        '2xl': '${theme.shadows.shadow2xl}',
      },
      scrollbar: {
        'track': 'var(--scrollbar-track)',
        'thumb': 'var(--scrollbar-thumb)',
      }
    },
  },
  plugins: [
    require('tailwindcss-scrollbar'),
  ],
}`;
  };

  const handleCopy = async (format: string) => {
    let content = '';
    
    switch (format) {
      case 'css':
        content = generateCSS();
        break;
      case 'json':
        content = generateJSON();
        break;
      case 'tailwind':
        content = generateTailwind();
        break;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatCode = (code: string, language: string): React.ReactNode => {
    const lines = code.split('\n');
    
    const highlightLine = (line: string, lang: string): React.ReactNode => {
      if (lang === 'css') {
        // CSS syntax highlighting using theme variables
        if (line.trim().startsWith('/*') || line.trim().endsWith('*/')) {
          return <span className="text-muted-foreground opacity-75">{line}</span>;
        }
        if (line.includes(':root') || line.includes('.dark')) {
          return <span className="text-primary font-semibold">{line}</span>;
        }
        if (line.includes('--')) {
          const parts = line.split(':');
          return (
            <>
              <span className="text-primary">{parts[0]}</span>
              {parts[1] && <><span className="text-foreground">:</span><span className="text-muted-foreground font-medium">{parts[1]}</span></>}
            </>
          );
        }
      } else if (lang === 'json') {
        // JSON syntax highlighting using theme variables
        if (line.includes('"') && line.includes(':')) {
          const colonIndex = line.indexOf(':');
          const key = line.substring(0, colonIndex);
          const value = line.substring(colonIndex);
          return (
            <>
              <span className="text-muted-foreground font-medium">{key}</span>
              <span className="text-foreground">:</span>
              <span className="text-primary">{value}</span>
            </>
          );
        }
      } else if (lang === 'javascript') {
        // JavaScript syntax highlighting using theme variables
        if (line.includes('module.exports') || line.includes('theme:') || line.includes('extend:')) {
          return <span className="text-primary font-semibold">{line}</span>;
        }
        if (line.includes('colors:')) {
          return <span className="text-primary">{line}</span>;
        }
      }
      
      return <span className="text-foreground">{line}</span>;
    };
    
    return (
      <div className="font-mono text-sm leading-relaxed">
        {lines.map((line, index) => (
          <div key={index} className="flex items-start min-w-0">
            <span className="text-muted-foreground mr-3 select-none min-w-[4ch] flex-shrink-0 text-right sticky left-0  z-10 pr-2 border-r border-border/0">
              {(index + 1).toString().padStart(3, ' ')}
            </span>
            <span className="flex-1 whitespace-pre-wrap break-all min-w-0 pl-2">
              {highlightLine(line, language)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] bg-background border-border overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0">
          <DialogTitle className="text-foreground text-lg font-semibold">Theme Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col min-h-0 flex-1 gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between gap-4 flex-shrink-0">
              <TabsList className="bg-muted">
                <TabsTrigger value="css" className="text-muted-foreground data-[state=active]:text-foreground">
                  CSS
                </TabsTrigger>
                <TabsTrigger value="tailwind" className="text-muted-foreground data-[state=active]:text-foreground">
                  Tailwind
                </TabsTrigger>
                <TabsTrigger value="json" className="text-muted-foreground data-[state=active]:text-foreground">
                  JSON
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'css' && (
                <Select value={colorFormat} onValueChange={(value) => setColorFormat(value as 'oklch' | 'hex' | 'rgb')}>
                  <SelectTrigger className="w-[120px] h-8 text-xs bg-card border-border text-foreground hover:bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="oklch" className="text-xs text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">OKLCH</SelectItem>
                    <SelectItem value="hex" className="text-xs text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">HEX</SelectItem>
                    <SelectItem value="rgb" className="text-xs text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">RGB</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <TabsContent value="css" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <div className="bg-card border border-border rounded-lg flex flex-col shadow-inner h-full max-h-[calc(90vh-200px)]">
                  <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30 flex-shrink-0">
                    <span className="text-sm font-medium text-foreground">CSS Variables</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy('css')}
                    >
                      {copiedFormat === 'css' ? (
                        <Check className="h-3 w-3 mr-1 text-primary" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copiedFormat === 'css' ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <div className="flex-1 p-4 overflow-auto scrollbar-thin scrollbar-thumb-scrollbarThumb scrollbar-track-scrollbarTrack min-h-0 bg-muted/50 text-foreground">
                    <div className="overflow-x-auto min-w-0">
                      {formatCode(generateCSS(), 'css')}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tailwind" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <div className="bg-card border border-border rounded-lg flex flex-col shadow-inner h-full max-h-[calc(90vh-200px)]">
                  <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30 flex-shrink-0">
                    <span className="text-sm font-medium text-foreground">Tailwind Config</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy('tailwind')}
                    >
                      {copiedFormat === 'tailwind' ? (
                        <Check className="h-3 w-3 mr-1 text-primary" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copiedFormat === 'tailwind' ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <div className="flex-1 p-4 overflow-auto scrollbar-thin scrollbar-thumb-scrollbarThumb scrollbar-track-scrollbarTrack min-h-0 bg-muted/50 text-foreground">
                    <div className="overflow-x-auto min-w-0">
                      {formatCode(generateTailwind(), 'javascript')}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="json" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                <div className="bg-card border border-border rounded-lg flex flex-col shadow-inner h-full max-h-[calc(90vh-200px)]">
                  <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30 flex-shrink-0">
                    <span className="text-sm font-medium text-foreground">Theme JSON</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy('json')}
                    >
                      {copiedFormat === 'json' ? (
                        <Check className="h-3 w-3 mr-1 text-primary" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copiedFormat === 'json' ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <div className="flex-1 p-4 overflow-auto scrollbar-thin scrollbar-thumb-scrollbarThumb scrollbar-track-scrollbarTrack min-h-0 bg-muted/50 text-foreground">
                    <div className="overflow-x-auto min-w-0">
                      {formatCode(generateJSON(), 'json')}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

        </div>
      </DialogContent>
    </Dialog>
  );
}