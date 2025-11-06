'use client';

import React from 'react';
import { ThemeEditorProvider } from './context/ThemeEditorContext';
import { ResizableLayout } from './layout/ResizableLayout';
import { ThemeSelector } from './1-theme-selector';
import { ActionsBar } from './2-actions-bar';
import { ThemeEditor as ThemeEditorPanel } from './3-theme-editor';
import { Preview } from './4-preview';

// Main Theme Editor 3.0 component
export function ThemeEditor() {
  return (
    <ThemeEditorProvider>
      <div className="h-full bg-background">
        <ResizableLayout>
          {/* Left Column: Theme Selector + Theme Editor */}
          <div className="h-full flex flex-col">
            {/* Top: Theme Selector */}
            <div className="h-[75px] flex-shrink-0 relative">
              <ThemeSelector />
            </div>
            
            {/* Bottom: Theme Editor */}
            <div className="flex-1 min-h-0">
              <ThemeEditorPanel />
            </div>
          </div>

          {/* Right Column: Actions Bar + Preview */}
          <div className="h-full flex flex-col">
            {/* Top: Actions Bar */}
            <div className="h-[75px] flex-shrink-0">
              <ActionsBar />
            </div>
            
            {/* Bottom: Preview */}
            <div className="flex-1 min-h-0">
              <Preview />
            </div>
          </div>
        </ResizableLayout>
      </div>
    </ThemeEditorProvider>
  );
}