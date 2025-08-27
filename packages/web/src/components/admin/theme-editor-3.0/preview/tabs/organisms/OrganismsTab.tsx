'use client';

import React from 'react';
import { Card } from '../../../design-system/primitives/card';
import { Button } from '../../../design-system/primitives/button';
import { Badge } from '../../../design-system/primitives/badge';

/**
 * Contenido del tab de Organismos
 * Muestra componentes complejos y secciones completas
 */
export function OrganismsTabContent() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Organism Components</h2>
        
        {/* Header Organism */}
        <Card className="p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Navigation Header</h3>
              <p className="text-sm text-muted-foreground">Complete header organism</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Settings</Button>
              <Button size="sm">Profile</Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge>Dashboard</Badge>
            <Badge variant="secondary">Analytics</Badge>
            <Badge variant="outline">Reports</Badge>
          </div>
        </Card>

        {/* Hero Section */}
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Hero Section</h3>
          <p className="text-muted-foreground mb-4">
            Example of a complete hero organism with multiple elements
          </p>
          <div className="flex justify-center gap-3">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </Card>
      </section>

      {/* Footer Organism */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Footer Section</h3>
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <p className="text-sm text-muted-foreground">About Us</p>
              <p className="text-sm text-muted-foreground">Careers</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Resources</h4>
              <p className="text-sm text-muted-foreground">Documentation</p>
              <p className="text-sm text-muted-foreground">Blog</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Legal</h4>
              <p className="text-sm text-muted-foreground">Privacy</p>
              <p className="text-sm text-muted-foreground">Terms</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}