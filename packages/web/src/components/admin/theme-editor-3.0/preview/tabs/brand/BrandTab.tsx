'use client';

import React from 'react';
import { BrandPreview } from '../../brand';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

/**
 * Contenido del tab de Brand
 * Muestra elementos de identidad visual y marca
 */
export function BrandTabContent() {
  const { state } = useThemeEditor();
  
  return (
    <div className="space-y-6">
      <section>
        <BrandPreview brand={state.currentTheme.brand} />
      </section>
    </div>
  );
}