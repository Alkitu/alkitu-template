'use client';

import React, { useState, useMemo } from 'react';
import { FormBuilderOrganismShowcase } from '../../../design-system/organisms';
import { CalendarOrganismShowcase } from '../../../design-system/organisms/CalendarOrganism';
import { SkeletonOrganismShowcase } from '../../../design-system/organisms/SkeletonOrganism';
import { SidebarOrganismShowcase } from '../../../design-system/organisms/SidebarOrganism';
import { CarouselOrganismShowcase } from '../../../design-system/organisms/CarouselOrganism';
import { ChartOrganismShowcase } from '../../../design-system/organisms/ChartOrganism';
import { DataTableOrganismShowcase } from '../../../design-system/organisms/DataTableOrganism';
import { DialogOrganismShowcase } from '../../../design-system/organisms/DialogOrganism';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';
import { ComponentSearchFilter, SearchableItem, CategoryMapping } from '../../../design-system/components/ComponentSearchFilter';

// Organism categories
const ORGANISM_CATEGORIES: CategoryMapping = {
  'forms': 'Formularios y Entradas',
  'data-display': 'Visualización de Datos',
  'navigation': 'Navegación',
  'feedback': 'Feedback y Estados',
  'layout': 'Diseño y Estructura'
} as const;

type OrganismCategory = keyof typeof ORGANISM_CATEGORIES;

// Organism definitions
interface OrganismDefinition {
  id: string;
  name: string;
  category: OrganismCategory;
  keywords: string[];
  component?: React.ComponentType;
  renderContent: () => React.ReactNode;
}

/**
 * OrganismsTabContent - NUEVOS Organismos shadcn/ui con integración de tema
 * Muestra TODOS los organismos nuevos creados: FormBuilder, Calendar, Skeleton, Sidebar, Carousel, Chart, DataTable, Dialog
 */
export function OrganismsTabContent() {
  console.log('🚀 OrganismsTabContent: Rendering NEW organisms showcase');
  const { state } = useThemeEditor();
  
  // Theme integration
  const colors = state.themeMode === 'dark'
    ? state.currentTheme?.darkColors
    : state.currentTheme?.lightColors;

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openOrganisms, setOpenOrganisms] = useState<Set<string>>(new Set());


  // Available organisms definitions
  const AVAILABLE_ORGANISMS: OrganismDefinition[] = useMemo(() => [
    {
      id: 'form-builder',
      name: 'Form Builder',
      category: 'forms',
      keywords: ['form', 'builder', 'drag', 'drop', 'validation', 'fields', 'preview', 'json'],
      renderContent: () => (
        <div>
          <p style={{
            fontSize: '14px',
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            marginBottom: '1rem'
          }}>
            Advanced drag-and-drop form builder with validation, preview mode, and JSON export
          </p>
          <FormBuilderOrganismShowcase />
        </div>
      )
    },
    {
      id: 'calendar',
      name: 'Calendar',
      category: 'data-display',
      keywords: ['calendar', 'date', 'schedule', 'events', 'month', 'year', 'time'],
      renderContent: () => <CalendarOrganismShowcase />
    },
    {
      id: 'skeleton',
      name: 'Skeleton',
      category: 'feedback',
      keywords: ['skeleton', 'loading', 'placeholder', 'shimmer', 'content', 'animation'],
      renderContent: () => <SkeletonOrganismShowcase />
    },
    {
      id: 'sidebar',
      name: 'Sidebar',
      category: 'navigation',
      keywords: ['sidebar', 'navigation', 'menu', 'collapsible', 'drawer', 'panel'],
      renderContent: () => <SidebarOrganismShowcase />
    },
    {
      id: 'carousel',
      name: 'Carousel',
      category: 'data-display',
      keywords: ['carousel', 'slider', 'images', 'gallery', 'swipe', 'navigation', 'autoplay'],
      renderContent: () => <CarouselOrganismShowcase />
    },
    {
      id: 'chart',
      name: 'Chart',
      category: 'data-display',
      keywords: ['chart', 'graph', 'visualization', 'data', 'analytics', 'bar', 'line', 'pie'],
      renderContent: () => <ChartOrganismShowcase />
    },
    {
      id: 'data-table',
      name: 'Data Table',
      category: 'data-display',
      keywords: ['table', 'data', 'grid', 'sorting', 'filtering', 'pagination', 'rows', 'columns'],
      renderContent: () => <DataTableOrganismShowcase />
    },
    {
      id: 'dialog',
      name: 'Dialog',
      category: 'feedback',
      keywords: ['dialog', 'modal', 'popup', 'overlay', 'confirmation', 'alert', 'form'],
      renderContent: () => <DialogOrganismShowcase />
    }
  ], [colors]);

  // Search filter functions
  const handleToggleOrganism = (organismName: string) => {
    setOpenOrganisms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(organismName)) {
        newSet.delete(organismName);
      } else {
        newSet.add(organismName);
      }
      return newSet;
    });
  };

  const handleOpenAllOrganisms = () => {
    setOpenOrganisms(new Set(AVAILABLE_ORGANISMS.map(o => o.name)));
  };

  const handleCloseAllOrganisms = () => {
    setOpenOrganisms(new Set());
  };

  // Render organism function
  const renderOrganism = (organism: OrganismDefinition) => {
    return (
      <div>
        {organism.renderContent()}
      </div>
    );
  };

  return (
    <ComponentSearchFilter
      items={AVAILABLE_ORGANISMS as unknown as SearchableItem[]}
      categories={ORGANISM_CATEGORIES}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory as string}
      onSearchChange={setSearchTerm}
      onCategoryChange={setSelectedCategory as (category: string) => void}
      openGroups={openOrganisms}
      onToggleGroup={handleToggleOrganism}
      onOpenAllGroups={handleOpenAllOrganisms}
      onCloseAllGroups={handleCloseAllOrganisms}
      renderItem={renderOrganism as (item: SearchableItem) => React.ReactNode}
      searchPlaceholder="Buscar organismos por nombre o características..."
      noResultsMessage="No se encontraron organismos con los filtros aplicados"
      className="px-4"
    />
  );
}