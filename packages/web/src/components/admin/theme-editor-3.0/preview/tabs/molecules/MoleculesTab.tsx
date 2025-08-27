'use client';

import React from 'react';
import { Card } from '../../../design-system/primitives/card';
import { Badge } from '../../../design-system/primitives/badge';

/**
 * Contenido del tab de Moléculas
 * Muestra componentes moleculares del design system
 */
export function MoleculesTabContent() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Molecular Components</h2>
        
        {/* Cards con badges */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Card with Badge</h3>
              <Badge>New</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Example of a card molecule combining multiple atoms
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Feature Card</h3>
              <Badge variant="secondary">Pro</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Another molecule example with different badge variant
            </p>
          </Card>
        </div>
      </section>

      {/* Más ejemplos de moléculas */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Form Groups</h3>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Form molecules will be shown here
          </p>
        </Card>
      </section>
    </div>
  );
}