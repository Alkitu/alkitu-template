'use client';

import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { trpc } from '@/lib/trpc';
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

  // tRPC mutations for saving themes
  const saveThemeMutation = trpc.theme.save.useMutation();
  const updateThemeMutation = trpc.theme.update.useMutation();

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

  const handleSave: ThemeSaveHandler = async (theme) => {
    try {
      // Check if it's a new theme or updating existing
      const isNewTheme = !state.availableThemes.find(t => t.id === theme.id);

      // Prepare theme data for backend
      const themeData = {
        name: theme.name,
        description: theme.description,
        author: theme.author,
        themeData: {
          lightColors: theme.lightColors,
          darkColors: theme.darkColors,
          typography: theme.typography,
          brand: theme.brand,
          spacing: theme.spacing,
          borders: theme.borders,
          shadows: theme.shadows,
          scroll: theme.scroll,
        },
        tags: theme.tags,
        isPublic: theme.isPublic,
        isFavorite: theme.isFavorite,
      };

      if (isNewTheme) {
        // Save as new theme to backend
        const savedTheme = await saveThemeMutation.mutateAsync(themeData);
        console.log('Saved new theme to backend:', savedTheme);

        // Update local state
        addTheme(theme);
      } else {
        // Update existing theme in backend
        const updatedTheme = await updateThemeMutation.mutateAsync({
          id: theme.id,
          ...themeData,
        });
        console.log('Updated theme in backend:', updatedTheme);

        // Update local state
        updateTheme(theme);
      }

      markSaved();
    } catch (error: any) {
      console.error('Failed to save theme:', error);
      setError(error.message || 'Failed to save theme to backend');
    }
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