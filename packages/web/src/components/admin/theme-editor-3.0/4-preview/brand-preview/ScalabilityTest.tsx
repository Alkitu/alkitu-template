'use client';

import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Ruler, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { LogoVariant, LOGO_SIZE_MAP, LogoSize } from '../../3-theme-editor/brand/types';

interface ScalabilityTestProps {
  logos: (LogoVariant | null)[];
  className?: string;
}

const SIZE_DESCRIPTIONS = {
  xs: 'Extra Small - Favicons, badges',
  sm: 'Small - Botones, nav items',
  md: 'Medium - Headers, cards',
  lg: 'Large - Hero sections',
  xl: 'Extra Large - Banners, posters'
} as const;

const VARIANT_NAMES = {
  original: 'Original',
  white: 'Blanco',
  black: 'Negro', 
  gray: 'Gris'
} as const;

const VARIANT_BACKGROUNDS = {
  original: 'bg-background border-border',
  white: 'bg-slate-800 border-slate-700',
  black: 'bg-background border-border',
  gray: 'bg-background border-border'
} as const;

export function ScalabilityTest({ 
  logos, 
  className = ""
}: ScalabilityTestProps) {
  const [selectedVariant, setSelectedVariant] = useState<keyof LogoVariant['variants']>('original');
  const [showGrid, setShowGrid] = useState(true);

  // Filtrar logos que no son null
  const validLogos = logos.filter((logo): logo is LogoVariant => logo !== null);

  if (validLogos.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        {/* EMPTY_SCALABILITY_TEST */}
        <div className="text-center py-8">
          <Ruler className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p style={{
            fontFamily: 'var(--typography-h4-font-family)',
            fontSize: 'var(--typography-h4-font-size)',
            fontWeight: 'var(--typography-h4-font-weight)',
            lineHeight: 'var(--typography-h4-line-height)',
            letterSpacing: 'var(--typography-h4-letter-spacing)'
          }} className="text-foreground mb-2">
            Prueba de Escalabilidad
          </p>
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
            fontWeight: 'var(--typography-paragraph-font-weight)',
            lineHeight: 'var(--typography-paragraph-line-height)',
            letterSpacing: 'var(--typography-paragraph-letter-spacing)'
          }} className="text-muted-foreground">
            Sube logos para probar su escalabilidad en diferentes tamaños
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      {/* SCALABILITY_TEST_HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Ruler className="h-6 w-6 text-primary" />
          <div>
            <h3 style={{
              fontFamily: 'var(--typography-h3-font-family)',
              fontSize: 'var(--typography-h3-font-size)',
              fontWeight: 'var(--typography-h3-font-weight)',
              lineHeight: 'var(--typography-h3-line-height)',
              letterSpacing: 'var(--typography-h3-letter-spacing)'
            }} className="text-foreground">
              Prueba de Escalabilidad
            </h3>
            <p style={{
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: 'var(--typography-paragraph-font-size)',
              fontWeight: 'var(--typography-paragraph-font-weight)',
              lineHeight: 'var(--typography-paragraph-line-height)',
              letterSpacing: 'var(--typography-paragraph-letter-spacing)'
            }} className="text-muted-foreground text-sm">
              Verifica cómo se ven tus logos en diferentes tamaños
            </p>
          </div>
        </div>
        
        {/* TEST_CONTROLS */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showGrid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="ml-1 text-xs">
              {showGrid ? 'Ocultar grid' : 'Mostrar grid'}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedVariant('original')}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="ml-1 text-xs">Reset</span>
          </Button>
        </div>
      </div>

      {/* VARIANT_SELECTOR */}
      <div className="mb-6">
        <p style={{
          fontFamily: 'var(--typography-emphasis-font-family)',
          fontSize: 'var(--typography-emphasis-font-size)',
          fontWeight: 'var(--typography-emphasis-font-weight)',
          letterSpacing: 'var(--typography-emphasis-letter-spacing)'
        }} className="text-foreground text-sm mb-3">
          Seleccionar variante para prueba:
        </p>
        <div className="flex gap-2 flex-wrap">
          {(['original', 'white', 'black', 'gray'] as const).map((variant) => (
            <Button
              key={variant}
              variant={selectedVariant === variant ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedVariant(variant)}
              className="text-xs"
            >
              {VARIANT_NAMES[variant]}
            </Button>
          ))}
        </div>
      </div>

      {/* SCALABILITY_TESTS */}
      <div className="space-y-8">
        {validLogos.map((logo) => (
          <div key={logo.id} className="border border-border rounded-lg p-6">
            {/* LOGO_TEST_HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h4 style={{
                fontFamily: 'var(--typography-h4-font-family)',
                fontSize: 'var(--typography-h4-font-size)',
                fontWeight: 'var(--typography-h4-font-weight)',
                lineHeight: 'var(--typography-h4-line-height)',
                letterSpacing: 'var(--typography-h4-letter-spacing)'
              }} className="text-foreground capitalize">
                {logo.type} - {VARIANT_NAMES[selectedVariant]}
              </h4>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  Aspect Ratio: {logo.aspectRatio}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {logo.detectedColors.length} colores
                </Badge>
              </div>
            </div>

            {/* SIZE_PROGRESSION_SHOWCASE */}
            <div className={`rounded-lg border p-8 ${VARIANT_BACKGROUNDS[selectedVariant]} ${showGrid ? 'bg-grid-pattern' : ''}`}>
              <div className="flex items-end justify-center gap-8 flex-wrap min-h-[120px]">
                {(['xs', 'sm', 'md', 'lg', 'xl'] as LogoSize[]).map((size) => (
                  <div key={size} className="flex flex-col items-center gap-3">
                    {/* SIZE_SHOWCASE */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="svg-container flex items-center justify-center transition-all duration-200 hover:scale-105">
                        <div 
                          dangerouslySetInnerHTML={{ __html: logo.variants[selectedVariant] }}
                          className="svg-wrapper block"
                          style={{ 
                            width: `${LOGO_SIZE_MAP[size]}px`, 
                            height: logo.type === 'horizontal' ? `${Math.round(LOGO_SIZE_MAP[size] / 3)}px` : logo.type === 'vertical' ? `${LOGO_SIZE_MAP[size] * 2}px` : `${LOGO_SIZE_MAP[size]}px`,
                            minWidth: `${LOGO_SIZE_MAP[size]}px`,
                            minHeight: logo.type === 'horizontal' ? `${Math.round(LOGO_SIZE_MAP[size] / 3)}px` : logo.type === 'vertical' ? `${LOGO_SIZE_MAP[size] * 2}px` : `${LOGO_SIZE_MAP[size]}px`
                          }}
                        />
                      </div>
                      
                      {/* SIZE_LABEL */}
                      <div className="text-center">
                        <p style={{
                          fontFamily: 'var(--typography-emphasis-font-family)',
                          fontSize: 'var(--typography-emphasis-font-size)',
                          fontWeight: 'var(--typography-emphasis-font-weight)',
                          letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                        }} className="text-foreground text-xs font-bold uppercase mb-1">
                          {size}
                        </p>
                        <p style={{
                          fontFamily: 'var(--typography-emphasis-font-family)',
                          fontSize: 'var(--typography-emphasis-font-size)',
                          fontWeight: 'var(--typography-emphasis-font-weight)',
                          letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                        }} className="text-muted-foreground text-xs">
                          {LOGO_SIZE_MAP[size]}px
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIZE_DESCRIPTIONS */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {(['xs', 'sm', 'md', 'lg', 'xl'] as LogoSize[]).map((size) => (
                <div key={size} className="bg-muted/30 p-3 rounded-md">
                  <p style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-foreground text-xs font-bold uppercase mb-1">
                    {size} ({LOGO_SIZE_MAP[size]}px)
                  </p>
                  <p style={{
                    fontFamily: 'var(--typography-paragraph-font-family)',
                    fontSize: 'var(--typography-paragraph-font-size)',
                    fontWeight: 'var(--typography-paragraph-font-weight)',
                    lineHeight: 'var(--typography-paragraph-line-height)',
                    letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                  }} className="text-muted-foreground text-xs leading-tight">
                    {SIZE_DESCRIPTIONS[size]}
                  </p>
                </div>
              ))}
            </div>

            {/* SCALABILITY_ANALYSIS */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* READABILITY_TEST */}
                <div className="bg-muted/20 p-4 rounded-md">
                  <h5 style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-foreground text-sm font-medium mb-2">
                    🔍 Análisis de Legibilidad
                  </h5>
                  <div className="space-y-1">
                    <p style={{
                      fontFamily: 'var(--typography-paragraph-font-family)',
                      fontSize: 'var(--typography-paragraph-font-size)',
                      fontWeight: 'var(--typography-paragraph-font-weight)',
                      lineHeight: 'var(--typography-paragraph-line-height)',
                      letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                    }} className="text-muted-foreground text-xs">
                      • XS/SM: ¿Se mantienen los detalles importantes?
                    </p>
                    <p style={{
                      fontFamily: 'var(--typography-paragraph-font-family)',
                      fontSize: 'var(--typography-paragraph-font-size)',
                      fontWeight: 'var(--typography-paragraph-font-weight)',
                      lineHeight: 'var(--typography-paragraph-line-height)',
                      letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                    }} className="text-muted-foreground text-xs">
                      • MD: ¿Es claramente reconocible?
                    </p>
                    <p style={{
                      fontFamily: 'var(--typography-paragraph-font-family)',
                      fontSize: 'var(--typography-paragraph-font-size)',
                      fontWeight: 'var(--typography-paragraph-font-weight)',
                      lineHeight: 'var(--typography-paragraph-line-height)',
                      letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                    }} className="text-muted-foreground text-xs">
                      • LG/XL: ¿Mantiene la calidad visual?
                    </p>
                  </div>
                </div>

                {/* USAGE_RECOMMENDATIONS */}
                <div className="bg-muted/20 p-4 rounded-md">
                  <h5 style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-foreground text-sm font-medium mb-2">
                    💡 Recomendaciones de Uso
                  </h5>
                  <div className="space-y-1">
                    <p style={{
                      fontFamily: 'var(--typography-paragraph-font-family)',
                      fontSize: 'var(--typography-paragraph-font-size)',
                      fontWeight: 'var(--typography-paragraph-font-weight)',
                      lineHeight: 'var(--typography-paragraph-line-height)',
                      letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                    }} className="text-muted-foreground text-xs">
                      • {logo.type === 'icon' && 'Perfecto para favicons y badges'}
                      • {logo.type === 'horizontal' && 'Ideal para headers y navegación'}
                      • {logo.type === 'vertical' && 'Excelente para sidebars y footers'}
                    </p>
                    <p style={{
                      fontFamily: 'var(--typography-paragraph-font-family)',
                      fontSize: 'var(--typography-paragraph-font-size)',
                      fontWeight: 'var(--typography-paragraph-font-weight)',
                      lineHeight: 'var(--typography-paragraph-line-height)',
                      letterSpacing: 'var(--typography-paragraph-letter-spacing)'
                    }} className="text-muted-foreground text-xs">
                      • Aspect ratio {logo.aspectRatio} óptimo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SCALABILITY_FOOTER_NOTE */}
      <div className="mt-8 pt-6 border-t border-border text-center">
        <p style={{
          fontFamily: 'var(--typography-paragraph-font-family)',
          fontSize: 'var(--typography-paragraph-font-size)',
          fontWeight: 'var(--typography-paragraph-font-weight)',
          lineHeight: 'var(--typography-paragraph-line-height)',
          letterSpacing: 'var(--typography-paragraph-letter-spacing)'
        }} className="text-muted-foreground text-sm">
          🎯 Verifica que todos los tamaños mantengan la legibilidad y el impacto visual.
          <br />
          Un logo escalable garantiza una identidad consistente en todos los contextos.
        </p>
      </div>
    </Card>
  );
}