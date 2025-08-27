'use client';

import React from 'react';
import { TypographyPreview } from '../../typography/TypographyPreview';

/**
 * Contenido del tab de Typography
 * Muestra escalas tipográficas y estilos de texto
 */
export function TypographyTabContent() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Typography Scale</h2>
        <TypographyPreview />
      </section>
    </div>
  );
}