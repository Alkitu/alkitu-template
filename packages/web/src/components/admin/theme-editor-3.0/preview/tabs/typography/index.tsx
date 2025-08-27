'use client';

import React from 'react';
import { TabLayout } from '../../layouts/TabLayout';
import { TypographyTabContent } from './TypographyTab';

/**
 * Tab de Typography - Componente principal
 * Lazy-loaded desde tabs.config.ts
 */
export default function TypographyTab() {
  return (
    <TabLayout tabId="typography" enableScroll={true}>
      <TypographyTabContent />
    </TabLayout>
  );
}