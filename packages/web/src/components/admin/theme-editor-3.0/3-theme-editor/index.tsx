'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { useThemeUpdates } from '../hooks/useThemeUpdates';
import { EditorSection } from '../types';
import { Palette, Type, Building, Square, Grid, Zap, Scroll } from 'lucide-react';
import { ColorEditor } from './colors/ColorEditor';
import { TypographyEditor } from './typography';
import { BrandEditor } from './brand';

export function ThemeEditor() {
  const { state, setEditorSection } = useThemeEditor();
  const themeUpdates = useThemeUpdates();

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
          <TabsList className="grid w-full grid-cols-4 gap-1 h-auto p-1 flex-shrink-0">
            {sections.map(({ id, label, icon: Icon }) => (
              <TabsTrigger 
                key={id} 
                value={id}
                className="flex flex-col gap-1 h-12 text-xs"
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="colors" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
              <ColorEditor />
            </div>
          </TabsContent>

          <TabsContent value="typography" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
              <TypographyEditor 
                typography={state.currentTheme.typography}
                onTypographyChange={themeUpdates.updateTypography}
              />
            </div>
          </TabsContent>

          <TabsContent value="brand" className="mt-4 flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
              <BrandEditor 
                brand={state.currentTheme.brand}
                onBrandChange={themeUpdates.updateBrand}
              />
            </div>
          </TabsContent>

          {sections.slice(3).map(({ id, label }) => (
            <TabsContent key={id} value={id} className="mt-4 flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
                <div className="h-24 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {label} editor content will be here
                  </span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}