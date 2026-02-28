/**
 * Configuración centralizada de tabs del Preview
 * Cada tab es independiente y lazy-loaded para mejor performance
 */

import React from 'react';
import { Palette, Type, Building, LucideIcon } from 'lucide-react';

// Direct imports instead of lazy loading to avoid ChunkLoadError
import ColorsTabContent from '../tabs/colors';
import TypographyTabContent from '../tabs/typography';
import BrandTabContent from '../tabs/brand';

export interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType<any>;
  description?: string;
  order: number;
  permissions?: string[];
  features?: {
    exportable?: boolean;
    printable?: boolean;
    shareable?: boolean;
    responsive?: boolean;
  };
  viewport?: {
    supportedSizes: ('smartphone' | 'tablet' | 'desktop' | 'tv')[];
    defaultSize?: 'smartphone' | 'tablet' | 'desktop' | 'tv';
  };
}

// Direct component references to avoid ChunkLoadError
export const PREVIEW_TABS: TabConfig[] = [
  {
    id: 'colors',
    label: 'Colors',
    icon: Palette,
    component: ColorsTabContent,
    description: 'Visualiza paletas de colores y contraste WCAG',
    order: 1,
    features: {
      exportable: true,
      printable: true,
      shareable: true,
      responsive: true
    },
    viewport: {
      supportedSizes: ['smartphone', 'tablet', 'desktop', 'tv']
    }
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: Type,
    component: TypographyTabContent,
    description: 'Previsualiza estilos tipográficos y escalas',
    order: 2,
    features: {
      exportable: true,
      printable: true,
      responsive: true
    },
    viewport: {
      supportedSizes: ['smartphone', 'tablet', 'desktop', 'tv']
    }
  },
  {
    id: 'brand',
    label: 'Brand',
    icon: Building,
    component: BrandTabContent,
    description: 'Identidad visual y elementos de marca',
    order: 3,
    features: {
      exportable: true,
      printable: true,
      shareable: true,
      responsive: true
    },
    viewport: {
      supportedSizes: ['smartphone', 'tablet', 'desktop', 'tv']
    }
  }
];

// Función helper para obtener un tab específico
export const getTabById = (id: string): TabConfig | undefined => {
  return PREVIEW_TABS.find(tab => tab.id === id);
};

// Función helper para obtener tabs filtrados por viewport
export const getTabsForViewport = (viewport: 'smartphone' | 'tablet' | 'desktop' | 'tv'): TabConfig[] => {
  return PREVIEW_TABS.filter(tab => 
    !tab.viewport?.supportedSizes || tab.viewport.supportedSizes.includes(viewport)
  );
};

// Función helper para obtener tabs ordenados
export const getSortedTabs = (): TabConfig[] => {
  return [...PREVIEW_TABS].sort((a, b) => a.order - b.order);
};