'use client';

import React from 'react';
import { CardMolecule } from '../../design-system/molecules/CardMolecule';

/**
 * Contenido del tab de Moléculas
 * Muestra componentes moleculares del design system
 */
export function MoleculesTabContent() {
  return (
    <div className="space-y-6">
      <section>
        <CardMolecule />
      </section>
    </div>
  );
}