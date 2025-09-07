'use client';

import React from 'react';
import { TabLayout } from '../../layouts/TabLayout';
import { ColorTabContent } from './ColorTab';

/**
 * Tab de Colors - Componente principal
 * Direct import from tabs.config.ts
 */
export default function ColorsTab() {
  return (
    <TabLayout tabId="colors" enableScroll={true}>
      <ColorTabContent />
    </TabLayout>
  );
}