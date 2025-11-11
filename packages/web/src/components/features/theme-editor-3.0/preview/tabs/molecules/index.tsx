'use client';

import React from 'react';
import { TabLayout } from '../../layouts/TabLayout';
import { MoleculesTabContent } from './MoleculesTab';

/**
 * Tab de Moléculas - Componente principal
 * Direct import from tabs.config.ts
 */
export default function MoleculesTab() {
  return (
    <TabLayout tabId="molecules" enableScroll={true}>
      <MoleculesTabContent />
    </TabLayout>
  );
}