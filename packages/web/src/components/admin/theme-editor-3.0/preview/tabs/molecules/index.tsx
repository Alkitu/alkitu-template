'use client';

import React from 'react';
import { TabLayout } from '../../layouts/TabLayout';
import { MoleculesTabContent } from './MoleculesTab';

/**
 * Tab de Moléculas - Componente principal
 * Lazy-loaded desde tabs.config.ts
 */
export default function MoleculesTab() {
  return (
    <TabLayout tabId="molecules" enableScroll={true}>
      <MoleculesTabContent />
    </TabLayout>
  );
}