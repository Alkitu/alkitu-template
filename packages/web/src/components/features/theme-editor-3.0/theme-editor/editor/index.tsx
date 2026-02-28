'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/primitives/ui/tabs';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';
import { useThemeUpdates } from '../../core/hooks/useThemeUpdates';
import { EditorSection } from '../../core/types';
import { Palette, Type, Building, Square, Grid, Zap, Scroll } from 'lucide-react';
import { ColorEditor } from './colors/ColorEditor';
import { TypographyEditor } from './typography';
import { BrandEditor } from './brand';
import { BordersEditor } from './borders';
import { SpacingEditor } from './spacing';
import { ShadowsEditor } from './shadows';
import { ScrollEditor } from './scroll';

export function ThemeEditor() {
  const { state, setEditorSection } = useThemeEditor();
  const themeUpdates = useThemeUpdates();

  // Referencias para mantener posiciones de scroll por sección
  const scrollPositions = useRef<Record<string, number>>({});
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Función para guardar posición del scroll actual
  const saveScrollPosition = useCallback((sectionId: string) => {
    const container = scrollContainerRefs.current[sectionId];
    if (container) {
      scrollPositions.current[sectionId] = container.scrollTop;
    }
  }, []);

  // Función para restaurar posición del scroll
  const restoreScrollPosition = useCallback((sectionId: string) => {
    const container = scrollContainerRefs.current[sectionId];
    const savedPosition = scrollPositions.current[sectionId];
    if (container && savedPosition !== undefined) {
      // Usar requestAnimationFrame para asegurar que el DOM esté actualizado
      requestAnimationFrame(() => {
        container.scrollTop = savedPosition;
      });
    }
  }, []);

  // Manejar scroll de cada sección
  const handleScroll = useCallback((sectionId: string, event: React.UIEvent<HTMLDivElement>) => {
    scrollPositions.current[sectionId] = event.currentTarget.scrollTop;
  }, []);

  // Restaurar posición cuando cambie el estado del tema
  useEffect(() => {
    const currentSection = state.editor.activeSection;
    if (currentSection) {
      restoreScrollPosition(currentSection);
    }
  }, [state.currentTheme, restoreScrollPosition, state.editor.activeSection]);

  // Componente wrapper para el scroll container
  const ScrollContainer = useCallback(({ sectionId, children }: { sectionId: string; children: React.ReactNode }) => (
    <div 
      ref={(el) => { scrollContainerRefs.current[sectionId] = el; }}
      className="h-full overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
      onScroll={(e) => handleScroll(sectionId, e)}
    >
      {children}
    </div>
  ), [handleScroll]);

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette, updateHandler: themeUpdates.updateColors },
    { id: 'typography', label: 'Typography', icon: Type, updateHandler: themeUpdates.updateTypography },
    { id: 'brand', label: 'Brand', icon: Building, updateHandler: themeUpdates.updateBrand },
    { id: 'borders', label: 'Borders', icon: Square, updateHandler: themeUpdates.updateBorders },
    { id: 'spacing', label: 'Spacing', icon: Grid, updateHandler: themeUpdates.updateSpacing },
    { id: 'shadows', label: 'Shadows', icon: Zap, updateHandler: themeUpdates.updateShadows },
    { id: 'scroll', label: 'Scroll', icon: Scroll, updateHandler: themeUpdates.updateScroll }
  ];

  return (
    <div className="h-full bg-card flex flex-col">
      <div className="h-full flex flex-col p-4">
        <Tabs 
          value={state.editor.activeSection} 
          onValueChange={(value) => setEditorSection(value as EditorSection)}
          className="w-full h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-1 h-auto p-1 flex-shrink-0">
            {sections.map(({ id, label, icon: Icon }) => (
              <TabsTrigger 
                key={id} 
                value={id}
                className="flex flex-col gap-1 h-12 text-xs p-1"
              >
                <Icon className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="colors" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <ScrollContainer sectionId="colors">
              <ColorEditor />
            </ScrollContainer>
          </TabsContent>

          <TabsContent value="typography" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <ScrollContainer sectionId="typography">
              <TypographyEditor 
                typography={state.currentTheme.typography}
                onTypographyChange={themeUpdates.updateTypography}
              />
            </ScrollContainer>
          </TabsContent>

          <TabsContent value="brand" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <ScrollContainer sectionId="brand">
              <BrandEditor 
                brand={state.currentTheme.brand}
                onBrandChange={themeUpdates.updateBrand}
              />
            </ScrollContainer>
          </TabsContent>

          <TabsContent value="borders" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <ScrollContainer sectionId="borders">
              <BordersEditor 
                borders={state.currentTheme.borders}
                onBordersChange={themeUpdates.updateBorders}
              />
            </ScrollContainer>
          </TabsContent>

          <TabsContent value="spacing" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <ScrollContainer sectionId="spacing">
              <SpacingEditor 
                spacing={state.currentTheme.spacing}
                onSpacingChange={themeUpdates.updateSpacing}
              />
            </ScrollContainer>
          </TabsContent>

          <TabsContent value="shadows" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <ScrollContainer sectionId="shadows">
              <ShadowsEditor 
                shadows={state.currentTheme.shadows}
                onShadowsChange={themeUpdates.updateShadows}
              />
            </ScrollContainer>
          </TabsContent>

          <TabsContent value="scroll" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <ScrollContainer sectionId="scroll">
              <ScrollEditor 
                scroll={state.currentTheme.scroll}
                onScrollChange={themeUpdates.updateScroll}
              />
            </ScrollContainer>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}