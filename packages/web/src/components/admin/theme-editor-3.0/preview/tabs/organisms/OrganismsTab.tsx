'use client';

import React, { useState } from 'react';
import { FormBuilderOrganismShowcase } from '../../../design-system/organisms';
import { CalendarOrganismShowcase } from '../../../design-system/organisms/CalendarOrganism';
import { SkeletonOrganismShowcase } from '../../../design-system/organisms/SkeletonOrganism';
import { SidebarOrganismShowcase } from '../../../design-system/organisms/SidebarOrganism';
import { CarouselOrganismShowcase } from '../../../design-system/organisms/CarouselOrganism';
import { ChartOrganismShowcase } from '../../../design-system/organisms/ChartOrganism';
import { DataTableOrganismShowcase } from '../../../design-system/organisms/DataTableOrganism';
import { DialogOrganismShowcase } from '../../../design-system/organisms/DialogOrganism';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

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
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;
  const largeSpacing = `var(--spacing-large, ${baseValue * 4}px)`;

  const getSectionStyles = () => ({
    marginBottom: largeSpacing,
    padding: mediumSpacing,
    borderRadius: 'var(--radius-card, 12px)',
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}20`,
    background: `${colors?.background?.value || 'var(--color-background)'}f8`,
    backdropFilter: 'blur(4px)'
  });

  const getSectionHeaderStyles = () => ({
    fontFamily: 'var(--typography-h2-font-family)',
    fontSize: 'var(--typography-h2-font-size)',
    fontWeight: 'var(--typography-h2-font-weight)',
    color: colors?.foreground?.value || 'var(--color-foreground)',
    marginBottom: mediumSpacing,
    paddingBottom: '8px',
    borderBottom: `2px solid ${colors?.primary?.value || 'var(--color-primary)'}20`
  });

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 px-4 overflow-x-hidden">
      {/* Form Builder Organism - FIRST */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>🚀 Form Builder Organism</h2>
        <p style={{
          fontSize: '14px',
          color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
          marginBottom: mediumSpacing
        }}>
          Advanced drag-and-drop form builder with validation, preview mode, and JSON export
        </p>
        <FormBuilderOrganismShowcase />
      </section>

      {/* Calendar Organism */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Calendar Organism</h2>
        <CalendarOrganismShowcase />
      </section>

      {/* Skeleton Organism */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Skeleton Organism</h2>
        <SkeletonOrganismShowcase />
      </section>

      {/* Sidebar Organism */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Sidebar Organism</h2>
        <SidebarOrganismShowcase />
      </section>

      {/* Carousel Organism */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Carousel Organism</h2>
        <CarouselOrganismShowcase />
      </section>

      {/* Chart Organism */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Chart Organism</h2>
        <ChartOrganismShowcase />
      </section>

      {/* Data Table Organism */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Data Table Organism</h2>
        <DataTableOrganismShowcase />
      </section>

      {/* Dialog Organism */}
      <section style={getSectionStyles()}>
        <h2 style={getSectionHeaderStyles()}>Dialog Organism</h2>
        <DialogOrganismShowcase />
      </section>
    </div>
  );
}