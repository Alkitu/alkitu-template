'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../design-system/primitives/tabs';
import { Badge } from '../design-system/primitives/badge';
import { useThemeEditor } from '../core/context/ThemeEditorContext';
import { PREVIEW_TABS, getTabsForViewport } from './config/tabs.config';
import { ViewportWrapper } from './layouts/ViewportWrapper';
import { VIEWPORT_CONFIGS } from '../core/types/viewport.types';
import { Loader2 } from 'lucide-react';

/**
 * Contenedor principal del Preview con tabs directos
 * Cada tab se carga directamente para mejor rendimiento
 */
export function PreviewContainer() {
  const { state, setPreviewSection } = useThemeEditor();
  
  if (!state?.preview) {
    return (
      <div className="h-full bg-card flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <div className="text-sm text-muted-foreground">Loading preview...</div>
        </div>
      </div>
    );
  }

  const currentViewport = state.viewport.current;
  const viewportConfig = VIEWPORT_CONFIGS[currentViewport];
  const availableTabs = getTabsForViewport(currentViewport);
  const isDesktopOrTV = currentViewport === 'desktop' || currentViewport === 'tv';

  // Components are now directly loaded, no lazy loading needed

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Viewport indicator */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {viewportConfig.name}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {viewportConfig.width} × {viewportConfig.height}
            </span>
          </div>
        </div>
      </div>

      {/* Preview container */}
      <div className="flex-1 min-h-0 p-4 pt-2">
        <ViewportWrapper>
          <Tabs 
            value={state.preview.activeSection} 
            onValueChange={(value) => setPreviewSection(value as any)}
            className="w-full h-full flex flex-col"
          >
            {/* Tab navigation */}
            <TabsList className={`
              grid w-full grid-cols-3 gap-1 h-auto 
              ${isDesktopOrTV ? 'p-1' : 'p-1'} 
              flex-shrink-0 mb-4
            `}>
              {availableTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className={`
                      flex flex-col gap-1 
                      ${isDesktopOrTV ? 'h-12 text-xs' : 'h-12 text-xs'}
                    `}
                    title={tab.description}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tab content - directly loaded */}
            <div className="flex-1 min-h-0">
              {availableTabs.map(tab => {
                const TabComponent = tab.component;
                return (
                  <TabsContent 
                    key={tab.id} 
                    value={tab.id} 
                    className="h-full"
                  >
                    <TabComponent />
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </ViewportWrapper>
      </div>
    </div>
  );
}