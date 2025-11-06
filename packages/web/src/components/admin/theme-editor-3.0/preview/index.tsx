'use client';

/**
 * Preview Module - Arquitectura Lazy-Loaded
 * Cada tab es independiente y se carga bajo demanda para mejor performance
 */

export { PreviewContainer as Preview } from './PreviewContainer';
export { PREVIEW_TABS, getTabById, getTabsForViewport } from './config/tabs.config';

// Re-export layouts para uso externo si es necesario
export { TabLayout } from './layouts/TabLayout';
export { ViewportWrapper } from './layouts/ViewportWrapper';