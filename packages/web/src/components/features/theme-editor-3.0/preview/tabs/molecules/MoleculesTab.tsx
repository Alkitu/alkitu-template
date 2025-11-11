'use client';

import React from 'react';
// Import the showcase from preview/design-system/molecules
import { MoleculesShowcase } from '../../design-system/molecules/MoleculesShowcase';
import { ToastProvider } from '../../../design-system/molecules/SonnerMolecule';

/**
 * Contenido del tab de Moléculas
 * Muestra componentes moleculares del design system
 */
export function MoleculesTabContent() {
  return (
    <ToastProvider>
      <div className="space-y-6">
        <section>
          <MoleculesShowcase />
        </section>
      </div>
    </ToastProvider>
  );
}