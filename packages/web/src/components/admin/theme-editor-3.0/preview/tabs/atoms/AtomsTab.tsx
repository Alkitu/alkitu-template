'use client';

import React from 'react';
import { AtomsShowcase } from '../../design-system/atoms/AtomsShowcase';

/**
 * Contenido del tab de Átomos
 * Muestra componentes atómicos del design system
 */
export function AtomsTabContent() {
  return (
    <div className="space-y-6">
      <section>
        <AtomsShowcase />
      </section>
    </div>
  );
}