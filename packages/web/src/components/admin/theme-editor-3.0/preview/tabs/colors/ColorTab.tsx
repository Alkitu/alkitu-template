'use client';

import React from 'react';
import { ContrastChecker } from '../../colors/ContrastChecker';
import { DesignSystemColorsShowcase } from '../../colors/DesignSystemColorsShowcase';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

/**
 * Contenido del tab de Colors
 * Muestra paletas de colores y verificación de contraste WCAG
 */
export function ColorTabContent() {
  const { state } = useThemeEditor();
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  if (!colors) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No colors available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sección de Contraste WCAG */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">WCAG Contrast Checker</h2>
        <ContrastChecker />
      </section>

      {/* Sección de Sistema de Colores */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Design System Colors</h2>
        <DesignSystemColorsShowcase colors={colors} />
      </section>
    </div>
  );
}