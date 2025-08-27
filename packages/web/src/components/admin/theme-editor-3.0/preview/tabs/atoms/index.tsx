'use client';

import React from 'react';
import { TabLayout } from '../../layouts/TabLayout';
import { AtomsTabContent } from './AtomsTab';

/**
 * Tab de Átomos - Componente principal
 * Lazy-loaded desde tabs.config.ts
 */
export default function AtomsTab() {
  return (
    <TabLayout tabId="atoms" enableScroll={true}>
      <AtomsTabContent />
    </TabLayout>
  );
}