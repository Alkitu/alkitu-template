'use client';

import React from 'react';
import { useActionsBarLogic } from '../hooks/useActionsBarLogic';
import { ViewportSelector } from './viewport-selector';
import { ThemeMode } from './theme-mode';
import { HistoryControls } from './history-controls';
import { ImportExport } from './import-export';
import { SaveControls } from './save-controls';
import { ResetButton } from './reset-button';

export function ActionsBar() {
  const {
    state,
    currentTheme,
    historyState,
    setViewport,
    setThemeMode,
    handleUndo,
    handleRedo,
    handleImport,
    handleImportError,
    handleSave,
    handleReset
  } = useActionsBarLogic();

  return (
    <div className="h-[75px] border-b border-border bg-card flex items-center justify-between px-4">
      {/* Left side - Viewport Selector */}
      <ViewportSelector
        currentViewport={state.viewport.current}
        onViewportChange={setViewport}
        showIndicator={false}
      />

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Theme Mode Toggle */}
        <ThemeMode
          mode={state.themeMode}
          onModeChange={setThemeMode}
        />

        {/* History Controls */}
        <HistoryControls
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyState.canUndo}
          canRedo={historyState.canRedo}
          undoCount={historyState.undoCount}
          redoCount={historyState.redoCount}
        />

        {/* Reset Button */}
        <ResetButton
          onReset={handleReset}
          hasChanges={state.editor.hasUnsavedChanges}
        />

        {/* Actions */}
        <div className="flex gap-1">
          <ImportExport
            theme={currentTheme}
            existingThemes={state.availableThemes}
            onImport={handleImport}
            onImportError={handleImportError}
          />
          <SaveControls
            theme={currentTheme}
            onSave={handleSave}
            hasUnsavedChanges={state.editor.hasUnsavedChanges}
          />
        </div>
      </div>
    </div>
  );
}