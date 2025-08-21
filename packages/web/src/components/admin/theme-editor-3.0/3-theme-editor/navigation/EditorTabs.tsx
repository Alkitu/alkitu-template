'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Palette, Type, Building, Square, Spacing, Shadow, Scroll } from 'lucide-react';
import { EditorSection } from '../../types/editor.types';
import { useThemeEditor } from '../../context/ThemeEditorContext';

interface EditorTabsProps {
  activeSection: EditorSection;
  onSectionChange: (section: EditorSection) => void;
  className?: string;
}

const EDITOR_SECTIONS = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'brand', label: 'Brand', icon: Building },
  { id: 'borders', label: 'Borders', icon: Square },
  { id: 'spacing', label: 'Spacing', icon: Spacing },
  { id: 'shadows', label: 'Shadows', icon: Shadow },
  { id: 'scroll', label: 'Scroll', icon: Scroll }
] as const;

export function EditorTabs({ activeSection, onSectionChange, className = "" }: EditorTabsProps) {
  const { state } = useThemeEditor();
  const isTVMode = state.viewport.current === 'tv';
  
  // Tamaño de iconos 45% más grande en modo TV
  const iconSize = isTVMode ? "h-4 w-4" : "h-3 w-3";
  
  return (
    <div className={className}>
      <Tabs value={activeSection} onValueChange={(value) => onSectionChange(value as EditorSection)}>
        <TabsList className="grid w-full grid-cols-4 gap-1 h-auto p-1">
          {EDITOR_SECTIONS.map(({ id, label, icon: Icon }) => (
            <TabsTrigger 
              key={id} 
              value={id}
              className="flex flex-col gap-1 h-12 text-xs p-2"
            >
              <Icon className={iconSize} />
              <span className="truncate">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}