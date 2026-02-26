'use client';

import React, { useState } from 'react';
import { Card } from '../../../design-system/primitives/card';
import { Button } from '../../../design-system/primitives/Button';
import { Palette, X, Eye, EyeOff } from 'lucide-react';
import { LogoVariant } from './types';
import { replaceColorInSVG } from './utils';
import { BrandColorPicker } from './BrandColorPicker';

interface ColorPaletteSectionProps {
  logos: (LogoVariant | null)[];
  onLogosChange: (logos: (LogoVariant | null)[]) => void;
  className?: string;
}

interface ColorPickerModal {
  isOpen: boolean;
  logoIndex: number;
  colorIndex: number;
  currentColor: string;
}

export function ColorPaletteSection({ 
  logos, 
  onLogosChange, 
  className = ""
}: ColorPaletteSectionProps) {
  const [colorPicker, setColorPicker] = useState<ColorPickerModal>({
    isOpen: false,
    logoIndex: -1,
    colorIndex: -1,
    currentColor: '#000000'
  });
  
  const [showAllColors, setShowAllColors] = useState(false);

  // DETECTED_COLORS_COLLECTION: Recopilar todos los colores detectados únicos
  const allDetectedColors = logos.reduce((colors: string[], logo) => {
    if (logo?.detectedColors) {
      logo.detectedColors.forEach(color => {
        if (!colors.includes(color)) {
          colors.push(color);
        }
      });
    }
    return colors;
  }, []);

  const openColorPicker = (logoIndex: number, colorIndex: number, currentColor: string) => {
    setColorPicker({
      isOpen: true,
      logoIndex,
      colorIndex,
      currentColor
    });
  };

  const handleColorChange = (newColor: string) => {
    const { logoIndex, colorIndex } = colorPicker;
    const logo = logos[logoIndex];
    
    if (!logo) return;

    const oldColor = logo.detectedColors[colorIndex];
    
    // COLOR_REPLACEMENT: Reemplazar color en SVG original y regenerar variantes
    const newSvgContent = replaceColorInSVG(logo.svgContent, oldColor, newColor);
    
    // UPDATE_DETECTED_COLORS: Actualizar lista de colores detectados
    const newDetectedColors = [...logo.detectedColors];
    newDetectedColors[colorIndex] = newColor;

    // REGENERATE_VARIANTS: Regenerar variantes con nuevo color
    const updatedLogo: LogoVariant = {
      ...logo,
      svgContent: newSvgContent,
      detectedColors: newDetectedColors,
      variants: {
        original: newSvgContent,
        white: replaceColorInSVG(newSvgContent, newColor, '#ffffff'),
        black: replaceColorInSVG(newSvgContent, newColor, '#000000'),
        gray: replaceColorInSVG(newSvgContent, newColor, '#808080')
      }
    };

    // UPDATE_LOGOS_ARRAY: Actualizar array de logos
    const newLogos = [...logos];
    newLogos[logoIndex] = updatedLogo;
    onLogosChange(newLogos);
  };

  const closeColorPicker = () => {
    setColorPicker({
      isOpen: false,
      logoIndex: -1,
      colorIndex: -1,
      currentColor: '#000000'
    });
  };

  if (allDetectedColors.length === 0) {
    return (
      <Card className={`p-4 ${className}`}>
        {/* EMPTY_STATE */}
        <div className="text-center py-8">
          <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p style={{
            fontFamily: 'var(--typography-h4-font-family)',
            fontSize: 'var(--typography-h4-font-size)',
            fontWeight: 'var(--typography-h4-font-weight)',
            lineHeight: 'var(--typography-h4-line-height)',
            letterSpacing: 'var(--typography-h4-letter-spacing)'
          }} className="text-foreground mb-2">
            No hay colores detectados
          </p>
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
            fontWeight: 'var(--typography-paragraph-font-weight)',
            lineHeight: 'var(--typography-paragraph-line-height)',
            letterSpacing: 'var(--typography-paragraph-letter-spacing)'
          }} className="text-muted-foreground">
            Sube un logo SVG para comenzar a detectar colores
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className={`p-4 ${className}`}>
        {/* SECTION_TITLE */}
        <div className="flex items-center justify-between mb-4">
          <h5 style={{
            fontFamily: 'var(--typography-h5-font-family)',
            fontSize: 'var(--typography-h5-font-size)',
            fontWeight: 'var(--typography-h5-font-weight)',
            lineHeight: 'var(--typography-h5-line-height)',
            letterSpacing: 'var(--typography-h5-letter-spacing)'
          }} className="text-foreground flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paleta de Colores Detectados
          </h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllColors(!showAllColors)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showAllColors ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span style={{
              fontFamily: 'var(--typography-emphasis-font-family)',
              fontSize: 'var(--typography-emphasis-font-size)',
              fontWeight: 'var(--typography-emphasis-font-weight)',
              letterSpacing: 'var(--typography-emphasis-letter-spacing)'
            }} className="ml-1 text-muted-foreground">
              {showAllColors ? 'Ocultar detalles' : 'Ver detalles'}
            </span>
          </Button>
        </div>

        {/* GLOBAL_COLORS_GRID */}
        <div className="mb-6">
          <p style={{
            fontFamily: 'var(--typography-emphasis-font-family)',
            fontSize: 'var(--typography-emphasis-font-size)',
            fontWeight: 'var(--typography-emphasis-font-weight)',
            letterSpacing: 'var(--typography-emphasis-letter-spacing)'
          }} className="text-foreground text-sm mb-3">
            Colores únicos detectados ({allDetectedColors.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {allDetectedColors.map((color, index) => (
              <div key={`global-${color}-${index}`} className="flex flex-col items-center">
                {/* COLOR_SWATCH */}
                <div 
                  className="w-8 h-8 rounded border-2 border-border cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                {/* COLOR_HEX_LABEL */}
                <p style={{
                  fontFamily: 'var(--typography-emphasis-font-family)',
                  fontSize: 'var(--typography-emphasis-font-size)',
                  fontWeight: 'var(--typography-emphasis-font-weight)',
                  letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                }} className="text-muted-foreground text-xs mt-1">
                  {color}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* INDIVIDUAL_LOGO_COLORS */}
        {showAllColors && (
          <div className="space-y-6">
            {logos.map((logo, logoIndex) => {
              if (!logo || logo.detectedColors.length === 0) return null;

              return (
                <div key={logo.id} className="border-t pt-6">
                  {/* LOGO_SECTION_TITLE */}
                  <h4 style={{
                    fontFamily: 'var(--typography-emphasis-font-family)',
                    fontSize: 'var(--typography-emphasis-font-size)',
                    fontWeight: 'var(--typography-emphasis-font-weight)',
                    letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                  }} className="text-foreground mb-3 capitalize">
                    {logo.type} - {logo.name}
                  </h4>

                  {/* LOGO_COLORS_GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {logo.detectedColors.map((color, colorIndex) => (
                      <div key={`${logo.id}-${colorIndex}`} className="flex flex-col items-center">
                        {/* EDITABLE_COLOR_SWATCH */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-12 h-12 p-0 rounded-lg border-2 border-border hover:border-primary transition-colors"
                          style={{ backgroundColor: color }}
                          onClick={() => openColorPicker(logoIndex, colorIndex, color)}
                          title={`Editar color ${color}`}
                        />
                        {/* EDITABLE_COLOR_HEX_LABEL */}
                        <p style={{
                          fontFamily: 'var(--typography-emphasis-font-family)',
                          fontSize: 'var(--typography-emphasis-font-size)',
                          fontWeight: 'var(--typography-emphasis-font-weight)',
                          letterSpacing: 'var(--typography-emphasis-letter-spacing)'
                        }} className="text-muted-foreground text-xs mt-1">
                          {color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* INSTRUCTIONS_NOTE */}
        <div className="mt-6 bg-muted/30 p-3 rounded-md">
          <p style={{
            fontFamily: 'var(--typography-emphasis-font-family)',
            fontSize: 'var(--typography-emphasis-font-size)',
            fontWeight: 'var(--typography-emphasis-font-weight)',
            letterSpacing: 'var(--typography-emphasis-letter-spacing)'
          }} className="text-foreground text-xs font-medium mb-1">
            💡 Modificar Colores:
          </p>
          <p style={{
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: 'var(--typography-paragraph-font-size)',
            fontWeight: 'var(--typography-paragraph-font-weight)',
            lineHeight: 'var(--typography-paragraph-line-height)',
            letterSpacing: 'var(--typography-paragraph-letter-spacing)'
          }} className="text-muted-foreground text-xs">
            Haz clic en cualquier color para abrire el selector y modificarlo. Los cambios se aplicarán automáticamente a todas las variantes del logo.
          </p>
        </div>
      </Card>

      {/* COLOR_PICKER_MODAL */}
      {colorPicker.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-80 max-w-[90vw]">
            {/* MODAL_HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h5 style={{
                fontFamily: 'var(--typography-h5-font-family)',
                fontSize: 'var(--typography-h5-font-size)',
                fontWeight: 'var(--typography-h5-font-weight)',
                lineHeight: 'var(--typography-h5-line-height)',
                letterSpacing: 'var(--typography-h5-letter-spacing)'
              }} className="text-foreground">
                Seleccionar Color
              </h5>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeColorPicker}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* COLOR_PICKER_COMPONENT */}
            <BrandColorPicker
              color={colorPicker.currentColor}
              onChange={(newColor: string) => {
                setColorPicker(prev => ({ ...prev, currentColor: newColor }));
                handleColorChange(newColor);
              }}
            />

            {/* MODAL_ACTIONS */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" onClick={closeColorPicker}>
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}