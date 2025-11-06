'use client';

import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { 
  ActionsBarLogic,
  HistoryState,
  ThemeImportHandler,
  ThemeImportErrorHandler,
  ThemeSaveHandler,
  UndoHandler,
  RedoHandler,
  ResetHandler
} from '../types';

/**
 * Custom hook para centralizar la lógica del Actions Bar
 * Elimina la redundancia de handlers y estados
 * Ahora con tipos específicos en lugar de 'any'
 */
export function useActionsBarLogic(): ActionsBarLogic {
  const { 
    state, 
    setViewport, 
    setThemeMode,
    setTheme,
    setError,
    markSaved,
    addTheme,
    updateTheme,
    undo,
    redo,
    canUndo,
    canRedo,
    undoCount,
    redoCount
  } = useThemeEditor();

  // Get current theme or default (evita repetición del fallback)
  const currentTheme = state.currentTheme || DEFAULT_THEMES[0];

  // Real history state from context
  const historyState: HistoryState = {
    canUndo,
    canRedo,
    undoCount,
    redoCount
  };

  // Handlers centralizados con tipos específicos
  const handleUndo: UndoHandler = () => {
    undo();
  };

  const handleRedo: RedoHandler = () => {
    redo();
  };

  const handleImport: ThemeImportHandler = (theme) => {
    setTheme(theme);
  };

  const handleImportError: ThemeImportErrorHandler = (error) => {
    setError(error);
  };

  const handleSave: ThemeSaveHandler = (theme) => {
    // Check if it's a new theme or updating existing
    const isNewTheme = !state.availableThemes.find(t => t.id === theme.id);
    
    if (isNewTheme) {
      // Add as new theme
      addTheme(theme);
      console.log('Added new theme:', theme.name);
    } else {
      // Update existing theme
      updateTheme(theme);
      console.log('Updated theme:', theme.name);
    }
    
    // TODO: Implement save to localStorage/API
    markSaved();
  };

  const handleReset: ResetHandler = () => {
    // Reset current theme to its original values
    const originalTheme = DEFAULT_THEMES.find(t => t.id === currentTheme.id) || DEFAULT_THEMES[0];
    setTheme(originalTheme);
    markSaved();
  };

  return {
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
  };
}