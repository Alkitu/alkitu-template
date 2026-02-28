'use client';

import React from 'react';
import { Card } from '@/components/primitives/ui/card';
import { Badge } from '@/components/primitives/ui/badge';
import { BookOpen, Monitor, Smartphone, Globe, Mail, FileText, Star, Palette } from 'lucide-react';
import { LogoVariant, LOGO_SIZE_MAP, LogoSize } from '../../theme-editor/editor/brand/types';
import { ThemeBrand } from '../../core/types/theme.types';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { getCurrentModeVariants } from '../../theme-editor/editor/brand/utils';
import { getDefaultBrandAssets } from '../../theme-editor/editor/brand/default-logos';

interface BrandPreviewProps {
  brand: ThemeBrand;
  className?: string;
}

const VARIANT_NAMES = {
  original: 'Original',
  white: 'Negativo',
  black: 'Mono-Color',
  gray: 'Gris'
} as const;

// Get variant backgrounds based on theme mode for proper contrast
const getVariantBackgrounds = (isDarkMode: boolean) => ({
  original: 'bg-background',
  // Hardcoded contrasting backgrounds for negative variant
  white: isDarkMode ? 'bg-white' : 'bg-black',
  black: 'bg-background', 
  gray: 'bg-background'
} as const);

const BRAND_APPLICATIONS = [
  {
    id: 'favicon',
    name: 'Favicon',
    icon: Globe,
    description: 'Icono del navegador (16x16, 32x32)',
    preferredType: 'icon',
    preferredVariant: 'original',
    sizes: ['s'] as LogoSize[],
    background: 'bg-background'
  },
  {
    id: 'app-icon',
    name: 'Icono de App',
    icon: Smartphone,
    description: 'Icono de aplicación móvil',
    preferredType: 'icon',
    preferredVariant: 'original',
    sizes: ['m', 'l'] as LogoSize[],
    background: 'bg-background'
  },
  {
    id: 'header',
    name: 'Header Web',
    icon: Monitor,
    description: 'Logo principal en navegación',
    preferredType: 'horizontal',
    preferredVariant: 'original',
    sizes: ['s', 'm', 'l'] as LogoSize[],
    background: 'bg-background'
  },
  {
    id: 'footer',
    name: 'Pie de página',
    icon: FileText,
    description: 'Logo en footer del sitio',
    preferredType: 'horizontal',
    preferredVariant: 'gray',
    sizes: ['s'] as LogoSize[],
    background: 'bg-muted/20'
  },
  {
    id: 'email',
    name: 'Firma de email',
    icon: Mail,
    description: 'Logo en correos electrónicos',
    preferredType: 'horizontal',
    preferredVariant: 'original',
    sizes: ['s', 'm'] as LogoSize[],
    background: 'bg-background'
  },
  {
    id: 'watermark',
    name: 'Marca de agua',
    icon: Star,
    description: 'Logo sutil para documentos',
    preferredType: 'icon',
    preferredVariant: 'gray',
    sizes: ['s'] as LogoSize[],
    background: 'bg-background'
  },
  {
    id: 'dark-theme',
    name: 'Tema oscuro',
    icon: Palette,
    description: 'Logo para fondos oscuros',
    preferredType: 'horizontal',
    preferredVariant: 'white',
    sizes: ['s', 'm', 'l'] as LogoSize[],
    background: 'bg-slate-900'
  }
];

export function BrandPreview({ brand, className = "" }: BrandPreviewProps) {
  const { state } = useThemeEditor();
  const isDarkMode = state.themeMode === 'dark';
  
  // Get spacing and shadows from theme system
  const spacing = state.currentTheme?.spacing;
  const shadows = state.currentTheme?.shadows;
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  
  // Get variant backgrounds based on current theme mode
  const variantBackgrounds = getVariantBackgrounds(isDarkMode);
  
  // Use real Alkitu defaults as fallback for any missing logo slot
  const defaultAssets = getDefaultBrandAssets();
  const validLogos: LogoVariant[] = [
    brand.logos?.icon ?? defaultAssets.icon,
    brand.logos?.horizontal ?? defaultAssets.horizontal,
    brand.logos?.vertical ?? defaultAssets.vertical,
  ];

  const getLogoForApplication = (app: typeof BRAND_APPLICATIONS[0]) => {
    return validLogos.find(logo => logo.type === app.preferredType) || validLogos[0];
  };

  return (
    <div className={`h-full ${className}`}>
      <div className="h-full overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
        <div className="space-y-6">
          

          {/* COMPLETE_BRAND_BOOK */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <div>
                  <h3 style={{
                    fontFamily: 'var(--typography-h3-font-family)',
                    fontSize: 'var(--typography-h3-font-size)',
                    fontWeight: 'var(--typography-h3-font-weight)',
                    lineHeight: 'var(--typography-h3-line-height)',
                    letterSpacing: 'var(--typography-h3-letter-spacing)'
                  }} className="text-foreground">
                    Libro de Marca Completo
                  </h3>
                  <p style={{
                    fontFamily: 'var(--typography-paragraph-font-family)',
                    fontSize: 'var(--typography-paragraph-font-size)',
                    fontWeight: 'var(--typography-paragraph-font-weight)',
                    lineHeight: 'var(--typography-paragraph-line-height)',
                    letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                  }} className="text-muted-foreground text-sm">
                    Todas las variantes de color y escalas de tamaño
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  <span style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-xs">
                    {validLogos.length} Logos
                  </span>
                </Badge>
                <Badge variant="secondary">
                  <span style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-xs">
                    {validLogos.length * 4} Variantes
                  </span>
                </Badge>
              </div>
            </div>

            <div className="space-y-8">
              {validLogos.map((logo) => (
                <div key={logo.id} className="border-b border-border pb-6 last:border-b-0">
                  {/* LOGO_TYPE_HEADER */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h4 style={{
                        fontFamily: 'var(--typography-h4-font-family)',
                        fontSize: 'var(--typography-h4-font-size)',
                        fontWeight: 'var(--typography-h4-font-weight)',
                        lineHeight: 'var(--typography-h4-line-height)',
                        letterSpacing: 'var(--typography-h4-letter-spacing)'
                      }} className="text-foreground capitalize">
                        Logo {logo.type}
                      </h4>
                      <Badge variant="outline">
                        <span style={{
                          fontFamily: 'var(--typography-emphasis-font-family)',
                          fontSize: 'var(--typography-emphasis-font-size)',
                          fontWeight: 'var(--typography-emphasis-font-weight)',
                          letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                        }} className="text-xs">
                          {logo.aspectRatio}
                        </span>
                      </Badge>
                    </div>
                    
                  </div>

                  {/* COLOR_VARIANTS_GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(Object.entries(getCurrentModeVariants(logo, isDarkMode)) as [string, string][]).map(([variantKey, svgContent]) => (
                      <div key={`${logo.id}-${variantKey}`} className="space-y-4">
                        {/* VARIANT_HEADER */}
                        <div className="flex items-center justify-between">
                          <h5 style={{
                            fontFamily: 'var(--typography-emphasis-font-family)',
                            fontSize: 'var(--typography-emphasis-font-size)',
                            fontWeight: 'var(--typography-emphasis-font-weight)',
                            letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                          }} className="text-foreground text-sm">
                            {VARIANT_NAMES[variantKey as keyof typeof VARIANT_NAMES]}
                          </h5>
                        </div>

                        {/* LOGO_SHOWCASE */}
                        <div 
                          className={`border border-border min-h-[120px] flex items-center justify-center ${variantBackgrounds[variantKey as keyof typeof variantBackgrounds]} relative overflow-hidden`}
                          style={{ 
                            borderRadius: 'var(--radius-card, 8px)',
                            padding: smallSpacing, // Connected to spacing system
                            boxShadow: shadows?.shadowSm || 'var(--shadow-sm)' // Small shadow for nested elements
                          }}
                        >
                          <div 
                            dangerouslySetInnerHTML={{ __html: svgContent }}
                            style={{ 
                              width: logo.type === 'icon' ? '80px' : logo.type === 'horizontal' ? '120px' : '60px',
                              height: logo.type === 'icon' ? '80px' : logo.type === 'horizontal' ? '40px' : '120px',
                              maxWidth: '100%',
                              maxHeight: '88px'
                            }}
                          />
                        </div>

                        {/* COMPLETE_SIZE_SCALE */}
                        <div className="space-y-2">
                          <p style={{
                            fontFamily: 'var(--typography-emphasis-font-family)',
                            fontSize: 'var(--typography-emphasis-font-size)',
                            fontWeight: 'var(--typography-emphasis-font-weight)',
                            letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                          }} className="text-muted-foreground text-xs">
                            Tamaño (S → L):
                          </p>
                          
                          {/* FULL_SIZE_SHOWCASE */}
                          <div 
                            className={`border border-border flex items-center justify-center gap-3 flex-wrap ${variantBackgrounds[variantKey as keyof typeof variantBackgrounds]}`}
                            style={{ 
                              borderRadius: 'var(--radius-card, 8px)',
                              padding: smallSpacing, // Connected to spacing system
                              boxShadow: shadows?.shadowSm || 'var(--shadow-sm)' // Small shadow for nested elements
                            }}
                          >
                            {(['s', 'm', 'l'] as LogoSize[]).map((size) => (
                              <div key={size} className="flex flex-col items-center gap-1">
                                <div 
                                  dangerouslySetInnerHTML={{ __html: svgContent }}
                                  style={{ 
                                    width: `${LOGO_SIZE_MAP[size]}px`, 
                                    height: logo.type === 'horizontal' ? `${Math.round(LOGO_SIZE_MAP[size] / 3)}px` : 
                                            logo.type === 'vertical' ? `${Math.round(LOGO_SIZE_MAP[size] * 1.33)}px` : 
                                            `${LOGO_SIZE_MAP[size]}px`,
                                    minWidth: `${LOGO_SIZE_MAP[size]}px`,
                                    minHeight: logo.type === 'horizontal' ? `${Math.round(LOGO_SIZE_MAP[size] / 3)}px` : 
                                              logo.type === 'vertical' ? `${Math.round(LOGO_SIZE_MAP[size] * 1.33)}px` : 
                                              `${LOGO_SIZE_MAP[size]}px`
                                  }}
                                />
                                <span style={{
                                  fontFamily: 'var(--typography-emphasis-font-family)',
                                  fontSize: 'var(--typography-emphasis-font-size)',
                                  fontWeight: 'var(--typography-emphasis-font-weight)',
                                  letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                                }} className="text-muted-foreground text-xs uppercase">
                                  {size}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}