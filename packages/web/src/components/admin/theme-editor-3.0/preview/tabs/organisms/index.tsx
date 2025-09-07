'use client';

import React from 'react';
import { TabLayout } from '../../layouts/TabLayout';
import { OrganismsTabContent } from './OrganismsTab';

/**
 * Tab de Organismos - Componente principal  
 * Muestra todos los organismos nuevos creados con shadcn/ui
 */
export default function OrganismsTab() {
  return (
    <TabLayout tabId="organisms" enableScroll={true}>
      <OrganismsTabContent />
    </TabLayout>
  );
}