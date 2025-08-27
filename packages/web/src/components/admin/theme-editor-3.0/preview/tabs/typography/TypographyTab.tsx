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
        <TypographyPreview />
      </section>
    </div>
  );
}