'use client';

import React from 'react';
import { TabLayout } from '../../layouts/TabLayout';
import { BrandTabContent } from './BrandTab';

/**
 * Tab de Brand - Componente principal
 * Lazy-loaded desde tabs.config.ts
 */
export default function BrandTab() {
  return (
    <TabLayout tabId="brand" enableScroll={true}>
      <BrandTabContent />
    </TabLayout>
  );
}