'use client';

import React from 'react';
import { Card } from '../../design-system/primitives/card';
import { Badge } from '../../design-system/primitives/badge';
import { BookOpen, Monitor, Smartphone, Globe, Mail, FileText, Star, Palette } from 'lucide-react';
import { LogoVariant, LOGO_SIZE_MAP, LogoSize } from '../../theme-editor/editor/brand/types';
import { ThemeBrand } from '../../core/types/theme.types';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { getCurrentModeVariants } from '../../theme-editor/editor/brand/utils';

interface BrandPreviewProps {
  brand: ThemeBrand;
  className?: string;
}

// SVG de ejemplo por defecto
const DEFAULT_LOGO_SVG = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#3b82f6"/>
  <circle cx="35" cy="35" r="8" fill="#ffffff"/>
  <circle cx="65" cy="35" r="8" fill="#ffffff"/>
  <path d="M 30 65 Q 50 85 70 65" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

const DEFAULT_HORIZONTAL_SVG = `<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="25" fill="#3b82f6"/>
  <circle cx="20" cy="22" r="5" fill="#ffffff"/>
  <circle cx="40" cy="22" r="5" fill="#ffffff"/>
  <path d="M 15 40 Q 30 50 45 40" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="70" y="35" fill="#3b82f6" font-family="Arial, sans-serif" font-size="24" font-weight="bold">BRAND</text>
</svg>`;

const DEFAULT_VERTICAL_SVG = `<svg width="80" height="107" viewBox="0 0 80 107" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="30" r="25" fill="#3b82f6"/>
  <circle cx="32" cy="22" r="5" fill="#ffffff"/>
  <circle cx="48" cy="22" r="5" fill="#ffffff"/>
  <path d="M 25 40 Q 40 50 55 40" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
  <text x="40" y="80" fill="#3b82f6" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">BRAND</text>
  <text x="40" y="97" fill="#3b82f6" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">COMPANY</text>
</svg>`;

const createDefaultLogo = (type: 'icon' | 'horizontal' | 'vertical'): LogoVariant => {
  const svgContent = type === 'icon' ? DEFAULT_LOGO_SVG : 
                    type === 'horizontal' ? DEFAULT_HORIZONTAL_SVG : 
                    DEFAULT_VERTICAL_SVG;
  
  return {
    id: `default-${type}`,
    name: `Default ${type}`,
    type,
    aspectRatio: type === 'icon' ? '1:1' : type === 'horizontal' ? '3:1' : '3:4',
    svgContent,
    detectedColors: ['#3b82f6', '#ffffff'],
    variants: {
      original: svgContent,
      white: svgContent.replace(/#3b82f6/g, '#ffffff').replace(/fill="#ffffff"/g, 'fill="#000000"'),
      black: svgContent.replace(/#3b82f6/g, '#000000'),
      gray: svgContent.replace(/#3b82f6/g, '#d1d5db')
    },
    metadata: {
      fileName: `default-${type}.svg`,
      fileSize: '2.1 KB',
      dimensions: type === 'icon' ? '100 × 100' : type === 'horizontal' ? '200 × 60' : '80 × 107',
      viewBox: type === 'icon' ? '0 0 100 100' : type === 'horizontal' ? '0 0 200 60' : '0 0 80 107',
      colorCount: 2,
      hasGradients: false
    }
  };
};

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
  
  // Convertir objetos de brand.logos a array para usar logos por defecto si es necesario
  const logos = [brand.logos.icon, brand.logos.horizontal, brand.logos.vertical];
  
  // Filtrar solo logos que no son null (sin logos por defecto)
  const validLogos = logos.filter((logo): logo is LogoVariant => logo !== null);

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
              {validLogos.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p style={{
                    fontFamily: 'var(--typography-h4-font-family)',
                    fontSize: 'var(--typography-h4-font-size)',
                    fontWeight: 'var(--typography-h4-font-weight)',
                    lineHeight: 'var(--typography-h4-line-height)',
                    letterSpacing: 'var(--typography-h4-letter-spacing)'
                  }} className="text-muted-foreground mb-2">
                    Sube tus logos en el Theme Editor
                  </p>
                  <p style={{
                    fontFamily: 'var(--typography-paragraph-font-family)',
                    fontSize: 'var(--typography-paragraph-font-size)',
                    fontWeight: 'var(--typography-paragraph-font-weight)',
                    lineHeight: 'var(--typography-paragraph-line-height)',
                    letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                  }} className="text-muted-foreground text-sm">
                    Ve a la sección Brand para subir tus logos y ver todas las variantes aquí
                  </p>
                </div>
              ) : (
                validLogos.map((logo) => (
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
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}