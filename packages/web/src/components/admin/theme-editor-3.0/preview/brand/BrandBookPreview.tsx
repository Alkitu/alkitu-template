'use client';

import React from 'react';
import { Card } from '../../design-system/primitives/card';
import { Badge } from '../../design-system/primitives/badge';
import { BookOpen, Download, Copy, Check } from 'lucide-react';
import { Button } from '../../design-system/primitives/button';
import { LogoVariant, LOGO_SIZE_MAP, LogoSize } from '../../theme-editor/editor/brand/types';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

interface BrandBookPreviewProps {
  logos: (LogoVariant | null)[];
  className?: string;
}

const VARIANT_NAMES = {
  original: 'Original',
  white: 'Blanco',
  black: 'Negro',
  gray: 'Gris'
} as const;

const VARIANT_BACKGROUNDS = {
  original: 'bg-background',
  white: 'bg-slate-800',
  black: 'bg-background',
  gray: 'bg-background'
} as const;

export function BrandBookPreview({ 
  logos, 
  className = ""
}: BrandBookPreviewProps) {
  const { state } = useThemeEditor();
  const [copiedStates, setCopiedStates] = React.useState<Record<string, boolean>>({});
  
  // Get spacing and shadows from theme system
  const spacing = state.currentTheme?.spacing;
  const shadows = state.currentTheme?.shadows;
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;

  const handleCopySVG = async (svgContent: string, id: string) => {
    try {
      await navigator.clipboard.writeText(svgContent);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy SVG content:', err);
    }
  };

  const handleDownloadSVG = (svgContent: string, filename: string) => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtrar logos que no son null
  const validLogos = logos.filter((logo): logo is LogoVariant => logo !== null);

  if (validLogos.length === 0) {
    return (
      <Card className={`p-4 sm:p-6 ${className}`}>
        {/* EMPTY_BRAND_BOOK */}
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p style={{
            fontFamily: 'var(--typography-h4-font-family)',
            fontSize: 'var(--typography-h4-font-size)',
            fontWeight: 'var(--typography-h4-font-weight)',
            lineHeight: 'var(--typography-h4-line-height)',
            letterSpacing: 'var(--typography-h4-letter-spacing)'
          }} className="text-foreground mb-2">
            Libro de Marca
          </p>
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
            fontWeight: 'var(--typography-paragraph-font-weight)',
            lineHeight: 'var(--typography-paragraph-line-height)',
            letterSpacing: 'var(--typography-paragraph-letter-spacing)'
          }} className="text-muted-foreground">
            Sube logos para ver el libro de marca completo
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      {/* BRAND_BOOK_HEADER */}
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
              Libro de Marca
            </h3>
            <p style={{
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: 'var(--typography-paragraph-font-size)',
              fontWeight: 'var(--typography-paragraph-font-weight)',
              lineHeight: 'var(--typography-paragraph-line-height)',
              letterSpacing: 'var(--typography-paragraph-letter-spacing)'
            }} className="text-muted-foreground text-sm">
              Todas las variantes y tamaños de tu identidad visual
            </p>
          </div>
        </div>
        
        {/* BRAND_STATS_BADGES */}
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {validLogos.length} Logos
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {validLogos.length * 4} Variantes
          </Badge>
        </div>
      </div>

      {/* BRAND_BOOK_CONTENT */}
      <div className="space-y-8">
        {validLogos.map((logo) => (
          <div 
            key={logo.id} 
            className="border border-border p-4 sm:p-6"
            style={{ borderRadius: 'var(--radius-card, 8px)' }}
          >
            {/* LOGO_TYPE_HEADER */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
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
                <Badge variant="outline" className="text-xs">
                  {logo.aspectRatio}
                </Badge>
              </div>
              
              {/* LOGO_ACTIONS */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadSVG(logo.svgContent, `${logo.type}-original`)}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Descargar
                </Button>
              </div>
            </div>

            {/* COLOR_VARIANTS_STACK */}
            <div className="flex flex-col gap-6">
              {(['original', 'white', 'black', 'gray'] as const).map((variantKey) => {
                const svgContent = logo.variants[variantKey];
                if (!svgContent) return null;
                return (
                <div key={`${logo.id}-${variantKey}`} className="space-y-4">
                  {/* VARIANT_HEADER */}
                  <div className="flex items-center justify-between">
                    <h5 style={{
                      fontFamily: 'var(--typography-emphasis-font-family)',
                      fontSize: 'var(--typography-emphasis-font-size)',
                      fontWeight: 'var(--typography-emphasis-font-weight)',
                      letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                    }} className="text-foreground text-sm">
                      {VARIANT_NAMES[variantKey]}
                    </h5>
                    
                    {/* VARIANT_ACTIONS */}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopySVG(svgContent, `${logo.id}-${variantKey}`)}
                        className="h-6 w-6 p-0"
                        title="Copiar SVG"
                      >
                        {copiedStates[`${logo.id}-${variantKey}`] ? 
                          <Check className="h-3 w-3" /> : 
                          <Copy className="h-3 w-3" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadSVG(svgContent, `${logo.type}-${variantKey}`)}
                        className="h-6 w-6 p-0"
                        title="Descargar SVG"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* LOGO_SHOWCASE */}
                  <div 
                    className={`border min-h-[100px] sm:min-h-[120px] flex items-center justify-center ${VARIANT_BACKGROUNDS[variantKey]} relative overflow-hidden`}
                    style={{ 
                      borderRadius: 'var(--radius-card, 8px)',
                      padding: smallSpacing, // Connected to spacing system
                      boxShadow: shadows?.shadowSm || 'var(--shadow-sm)' // Small shadow for nested elements
                    }}
                  >
                    <div className="svg-container flex items-center justify-center">
                      <div 
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        className="svg-wrapper"
                        style={{ 
                          width: logo.type === 'icon' ? '80px' : logo.type === 'horizontal' ? '120px' : '60px',
                          height: logo.type === 'icon' ? '80px' : logo.type === 'horizontal' ? '40px' : '120px',
                          maxWidth: '100%',
                          maxHeight: '88px'
                        }}
                      />
                    </div>
                  </div>

                  {/* SIZE_DEMONSTRATION */}
                  <div className="space-y-2">
                    <p style={{
                      fontFamily: 'var(--typography-emphasis-font-family)',
                      fontSize: 'var(--typography-emphasis-font-size)',
                      fontWeight: 'var(--typography-emphasis-font-weight)',
                      letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                    }} className="text-muted-foreground text-xs">
                      Tamaños de referencia:
                    </p>
                    
                    {/* SIZES_SHOWCASE */}
                    <div 
                      className={`border flex items-center justify-center gap-2 sm:gap-3 flex-wrap ${VARIANT_BACKGROUNDS[variantKey]}`}
                      style={{ 
                        borderRadius: 'var(--radius-card, 8px)',
                        padding: smallSpacing, // Connected to spacing system
                        boxShadow: shadows?.shadowSm || 'var(--shadow-sm)' // Small shadow for nested elements
                      }}
                    >
                      {(['xs', 'sm', 'md', 'lg'] as LogoSize[]).map((size) => (
                        <div key={size} className="flex flex-col items-center gap-1">
                          <div className="svg-container flex items-center justify-center">
                            <div 
                              dangerouslySetInnerHTML={{ __html: svgContent }}
                              className="svg-wrapper block"
                              style={{ 
                                width: `${LOGO_SIZE_MAP[size]}px`, 
                                height: logo.type === 'horizontal' ? `${Math.round(LOGO_SIZE_MAP[size] / 3)}px` : logo.type === 'vertical' ? `${LOGO_SIZE_MAP[size] * 2}px` : `${LOGO_SIZE_MAP[size]}px`,
                                minWidth: `${LOGO_SIZE_MAP[size]}px`,
                                minHeight: logo.type === 'horizontal' ? `${Math.round(LOGO_SIZE_MAP[size] / 3)}px` : logo.type === 'vertical' ? `${LOGO_SIZE_MAP[size] * 2}px` : `${LOGO_SIZE_MAP[size]}px`
                              }}
                            />
                          </div>
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
                );
              })}
            </div>

            {/* DETECTED_COLORS_INFO */}
            {logo.detectedColors.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border">
                <p style={{
                  fontFamily: 'var(--typography-emphasis-font-family)',
                  fontSize: 'var(--typography-emphasis-font-size)',
                  fontWeight: 'var(--typography-emphasis-font-weight)',
                  letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                }} className="text-muted-foreground text-xs mb-2">
                  Colores detectados:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {logo.detectedColors.map((color, index) => (
                    <div key={`${logo.id}-color-${index}`} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color }}
                      />
                      <span style={{
                        fontFamily: 'var(--typography-emphasis-font-family)',
                        fontSize: 'var(--typography-emphasis-font-size)',
                        fontWeight: 'var(--typography-emphasis-font-weight)',
                        letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                      }} className="text-muted-foreground text-xs">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* BRAND_BOOK_FOOTER */}
      <div className="mt-8 pt-6 border-t border-border text-center">
        <p style={{
          fontFamily: 'var(--typography-paragraph-font-family)',
          fontSize: 'var(--typography-paragraph-font-size)',
          fontWeight: 'var(--typography-paragraph-font-weight)',
          lineHeight: 'var(--typography-paragraph-line-height)',
          letterSpacing: 'var(--typography-paragraph-letter-spacing)'
        }} className="text-muted-foreground text-sm">
          Todas las variantes están listas para usar en diferentes contextos y tamaños.
          <br />
          Utiliza la variante adecuada según el fondo y el tamaño requerido.
        </p>
      </div>
    </Card>
  );
}