'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../design-system/primitives/dialog';
import { Button } from '../../../design-system/primitives/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../design-system/primitives/tabs';
import { Copy, Check } from 'lucide-react';
import { ThemeWithCurrentColors } from '../../../core/types/theme.types';
import { generateThemeCSS } from '../../../lib/utils/css/css-variables';
import { oklchToHex, oklchToRgb } from '../../../lib/utils/color/color-conversions';
import { CSS_VARIABLE_MAP } from '../../../core/types/color-sections.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../design-system/primitives/select';

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
    
    
    /* ===== TYPOGRAPHY SYSTEM ===== */
    css += `  --font-sans: ${theme.typography.fontFamilies.sans};\n`;
    css += `  --font-serif: ${theme.typography.fontFamilies.serif};\n`;
    css += `  --font-mono: ${theme.typography.fontFamilies.mono};\n`;
    css += `  --tracking-normal: ${theme.typography.trackingNormal};\n`;
    css += `  --tracking-tight: -0.025em;\n`;
    css += `  --tracking-wide: 0.025em;\n`;
    css += `  --leading-none: 1;\n`;
    css += `  --leading-tight: 1.25;\n`;
    css += `  --leading-normal: 1.5;\n`;
    css += `  --leading-relaxed: 1.625;\n`;
    css += `  --leading-loose: 2;\n`;
    
    /* ===== FONT SIZES ===== */
    css += `  --text-xs: 0.75rem;\n`;
    css += `  --text-sm: 0.875rem;\n`;
    css += `  --text-base: 1rem;\n`;
    css += `  --text-lg: 1.125rem;\n`;
    css += `  --text-xl: 1.25rem;\n`;
    css += `  --text-2xl: 1.5rem;\n`;
    css += `  --text-3xl: 1.875rem;\n`;
    css += `  --text-4xl: 2.25rem;\n`;
    css += `  --text-5xl: 3rem;\n`;
    css += `  --text-6xl: 3.75rem;\n`;
    
    /* ===== FONT WEIGHTS ===== */
    css += `  --font-thin: 100;\n`;
    css += `  --font-light: 300;\n`;
    css += `  --font-normal: 400;\n`;
    css += `  --font-medium: 500;\n`;
    css += `  --font-semibold: 600;\n`;
    css += `  --font-bold: 700;\n`;
    css += `  --font-extrabold: 800;\n`;
    css += `  --font-black: 900;\n`;
    
    /* ===== BORDER RADIUS SYSTEM ===== */
    css += `  --radius: ${theme.borders.radius};\n`;
    css += `  --radius-xs: 0.125rem;\n`;
    css += `  --radius-sm: 0.25rem;\n`;
    css += `  --radius-md: 0.375rem;\n`;
    css += `  --radius-lg: 0.5rem;\n`;
    css += `  --radius-xl: 0.75rem;\n`;
    css += `  --radius-2xl: 1rem;\n`;
    css += `  --radius-3xl: 1.5rem;\n`;
    css += `  --radius-full: 9999px;\n`;
    css += `  --radius-card: calc(${theme.borders.radius} - 2px);\n`;
    css += `  --radius-button: calc(${theme.borders.radius} - 4px);\n`;
    css += `  --radius-input: calc(${theme.borders.radius} - 6px);\n`;
    
    /* ===== BORDER WIDTHS ===== */
    css += `  --border-width: 1px;\n`;
    css += `  --border-width-0: 0px;\n`;
    css += `  --border-width-2: 2px;\n`;
    css += `  --border-width-4: 4px;\n`;
    css += `  --border-width-8: 8px;\n`;
    
    /* ===== SPACING SYSTEM ===== */
    css += `  --spacing: ${theme.spacing.spacing};\n`;
    css += `  --spacing-px: 1px;\n`;
    css += `  --spacing-0: 0px;\n`;
    css += `  --spacing-1: 0.25rem;\n`;
    css += `  --spacing-2: 0.5rem;\n`;
    css += `  --spacing-3: 0.75rem;\n`;
    css += `  --spacing-4: 1rem;\n`;
    css += `  --spacing-5: 1.25rem;\n`;
    css += `  --spacing-6: 1.5rem;\n`;
    css += `  --spacing-8: 2rem;\n`;
    css += `  --spacing-10: 2.5rem;\n`;
    css += `  --spacing-12: 3rem;\n`;
    css += `  --spacing-16: 4rem;\n`;
    css += `  --spacing-20: 5rem;\n`;
    css += `  --spacing-24: 6rem;\n`;
    css += `  --spacing-32: 8rem;\n`;
    css += `  --spacing-small: calc(${theme.spacing.spacing} * 0.5);\n`;
    css += `  --spacing-medium: ${theme.spacing.spacing};\n`;
    css += `  --spacing-large: calc(${theme.spacing.spacing} * 2);\n`;
    css += `  --spacing-xlarge: calc(${theme.spacing.spacing} * 3);\n`;
    
    /* ===== SHADOW SYSTEM ===== */
    css += `  --shadow-2xs: ${theme.shadows.shadow2xs};\n`;
    css += `  --shadow-xs: ${theme.shadows.shadowXs};\n`;
    css += `  --shadow-sm: ${theme.shadows.shadowSm};\n`;
    css += `  --shadow: ${theme.shadows.shadow};\n`;
    css += `  --shadow-md: ${theme.shadows.shadowMd};\n`;
    css += `  --shadow-lg: ${theme.shadows.shadowLg};\n`;
    css += `  --shadow-xl: ${theme.shadows.shadowXl};\n`;
    css += `  --shadow-2xl: ${theme.shadows.shadow2xl};\n`;
    css += `  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.06);\n`;
    css += `  --shadow-none: 0 0 #0000;\n`;
    
    /* ===== Z-INDEX SYSTEM ===== */
    css += `  --z-auto: auto;\n`;
    css += `  --z-0: 0;\n`;
    css += `  --z-10: 10;\n`;
    css += `  --z-20: 20;\n`;
    css += `  --z-30: 30;\n`;
    css += `  --z-40: 40;\n`;
    css += `  --z-50: 50;\n`;
    css += `  --z-tooltip: 60;\n`;
    css += `  --z-dropdown: 70;\n`;
    css += `  --z-modal: 80;\n`;
    css += `  --z-overlay: 90;\n`;
    css += `  --z-max: 100;\n`;
    
    /* ===== OPACITY SYSTEM ===== */
    css += `  --opacity-0: 0;\n`;
    css += `  --opacity-5: 0.05;\n`;
    css += `  --opacity-10: 0.1;\n`;
    css += `  --opacity-20: 0.2;\n`;
    css += `  --opacity-25: 0.25;\n`;
    css += `  --opacity-30: 0.3;\n`;
    css += `  --opacity-40: 0.4;\n`;
    css += `  --opacity-50: 0.5;\n`;
    css += `  --opacity-60: 0.6;\n`;
    css += `  --opacity-70: 0.7;\n`;
    css += `  --opacity-75: 0.75;\n`;
    css += `  --opacity-80: 0.8;\n`;
    css += `  --opacity-90: 0.9;\n`;
    css += `  --opacity-95: 0.95;\n`;
    css += `  --opacity-100: 1;\n`;
    
    /* ===== BLUR SYSTEM ===== */
    css += `  --blur-none: 0;\n`;
    css += `  --blur-sm: 4px;\n`;
    css += `  --blur: 8px;\n`;
    css += `  --blur-md: 12px;\n`;
    css += `  --blur-lg: 16px;\n`;
    css += `  --blur-xl: 24px;\n`;
    css += `  --blur-2xl: 40px;\n`;
    css += `  --blur-3xl: 64px;\n`;
    
    /* ===== ANIMATION SYSTEM ===== */
    css += `  --duration-75: 75ms;\n`;
    css += `  --duration-100: 100ms;\n`;
    css += `  --duration-150: 150ms;\n`;
    css += `  --duration-200: 200ms;\n`;
    css += `  --duration-300: 300ms;\n`;
    css += `  --duration-500: 500ms;\n`;
    css += `  --duration-700: 700ms;\n`;
    css += `  --duration-1000: 1000ms;\n`;
    css += `  --ease-linear: linear;\n`;
    css += `  --ease-in: cubic-bezier(0.4, 0, 1, 1);\n`;
    css += `  --ease-out: cubic-bezier(0, 0, 0.2, 1);\n`;
    css += `  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);\n`;
    
    /* ===== SCROLLBAR SYSTEM ===== */
    css += `  --scrollbar-track: ${theme.lightColors.scrollbarTrack?.value || 'oklch(1.0000 0.0000 0.00)'};\n`;
    css += `  --scrollbar-thumb: ${theme.lightColors.scrollbarThumb?.value || 'oklch(0.8483 0.0000 0.00)'};\n`;
    css += `  --scrollbar-width: 8px;\n`;
    css += `  --scrollbar-width-thin: 4px;\n`;
    css += `  --scrollbar-radius: 4px;\n`;
    
    /* ===== COMPONENT-SPECIFIC VARIABLES ===== */
    css += `  --tooltip-bg: hsl(var(--popover));\n`;
    css += `  --tooltip-fg: hsl(var(--popover-foreground));\n`;
    css += `  --dialog-bg: hsl(var(--background));\n`;
    css += `  --dialog-overlay: hsl(0 0% 0% / 0.8);\n`;
    css += `  --dropdown-bg: hsl(var(--popover));\n`;
    css += `  --dropdown-border: hsl(var(--border));\n`;
    css += `  --select-bg: hsl(var(--background));\n`;
    css += `  --select-border: hsl(var(--border));\n`;
    css += `  --input-bg: hsl(var(--background));\n`;
    css += `  --input-border: hsl(var(--border));\n`;
    css += `  --button-hover: hsl(var(--accent));\n`;
    css += `  --card-bg: hsl(var(--card));\n`;
    css += `  --card-border: hsl(var(--border));\n`;
    
    /* ===== LAYOUT VARIABLES ===== */
    css += `  --header-height: 64px;\n`;
    css += `  --sidebar-width: 280px;\n`;
    css += `  --sidebar-collapsed-width: 64px;\n`;
    css += `  --navbar-height: 56px;\n`;
    css += `  --footer-height: 48px;\n`;
    css += `  --container-sm: 640px;\n`;
    css += `  --container-md: 768px;\n`;
    css += `  --container-lg: 1024px;\n`;
    css += `  --container-xl: 1280px;\n`;
    css += `  --container-2xl: 1536px;\n`;
    
    /* ===== BREAKPOINTS ===== */
    css += `  --breakpoint-sm: 640px;\n`;
    css += `  --breakpoint-md: 768px;\n`;
    css += `  --breakpoint-lg: 1024px;\n`;
    css += `  --breakpoint-xl: 1280px;\n`;
    css += `  --breakpoint-2xl: 1536px;\n`;
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
    
    /* ===== DARK MODE SCROLLBAR SYSTEM ===== */
    css += `  --scrollbar-track: ${theme.darkColors.scrollbarTrack?.value || 'oklch(0.1448 0.0000 0.00)'};\n`;
    css += `  --scrollbar-thumb: ${theme.darkColors.scrollbarThumb?.value || 'oklch(0.2864 0.0074 17.59)'};\n`;
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
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      fontWeight: {
        'thin': '100',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '${theme.typography.trackingNormal}',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      spacing: {
        'theme': '${theme.spacing.spacing}',
        'small': 'calc(${theme.spacing.spacing} * 0.5)',
        'medium': '${theme.spacing.spacing}',
        'large': 'calc(${theme.spacing.spacing} * 2)',
        'xlarge': 'calc(${theme.spacing.spacing} * 3)',
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
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)',
        'none': '0 0 #0000',
      },
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '25': '0.25',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '90': '0.9',
        '95': '0.95',
        '100': '1',
      },
      blur: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      zIndex: {
        'auto': 'auto',
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'tooltip': '60',
        'dropdown': '70',
        'modal': '80',
        'overlay': '90',
        'max': '100',
      },
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'linear': 'linear',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      scrollbar: {
        'track': 'var(--scrollbar-track)',
        'thumb': 'var(--scrollbar-thumb)',
        'width': 'var(--scrollbar-width)',
        'radius': 'var(--scrollbar-radius)',
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
                <div 
                  className="bg-card border border-border flex flex-col shadow-inner h-full max-h-[calc(90vh-200px)]"
                  style={{ borderRadius: 'var(--radius-card, 8px)' }}
                >
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
                <div 
                  className="bg-card border border-border flex flex-col shadow-inner h-full max-h-[calc(90vh-200px)]"
                  style={{ borderRadius: 'var(--radius-card, 8px)' }}
                >
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
                <div 
                  className="bg-card border border-border flex flex-col shadow-inner h-full max-h-[calc(90vh-200px)]"
                  style={{ borderRadius: 'var(--radius-card, 8px)' }}
                >
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