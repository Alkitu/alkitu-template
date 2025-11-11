'use client';

import React from 'react';
import { TabLayout } from '../../layouts/TabLayout';
import { TypographyTabContent } from './TypographyTab';

/**
 * Tab de Typography - Componente principal
 * Direct import from tabs.config.ts
 */
export default function TypographyTab() {
  return (
    <TabLayout tabId="typography" enableScroll={true}>
      <TypographyTabContent />
    </TabLayout>
  );
}