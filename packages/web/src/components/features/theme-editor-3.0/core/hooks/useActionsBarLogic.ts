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
  const createThemeMutation = trpc.theme.createTheme.useMutation();
  const updateThemeMutation = trpc.theme.updateTheme.useMutation();
  const setDefaultThemeMutation = trpc.theme.setDefaultTheme.useMutation();

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
      // Helper to check if ID is a valid MongoDB ObjectID (24 hex characters)
      const isValidObjectId = (id: string): boolean => {
        return /^[a-f\d]{24}$/i.test(id);
      };

      // TODO: Get from auth context
      const companyId = '6733c2fd80b7b58d4c36d966';
      const userId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectID for testing

      // Check if it's a new theme or updating existing
      // A theme is new if:
      // 1. It's not in availableThemes (not in DB), OR
      // 2. It has an invalid ObjectID (it's a built-in theme like "default", "modern", etc.)
      const isBuiltInTheme = !isValidObjectId(theme.id);
      const isNewTheme = isBuiltInTheme || !state.availableThemes.find(t => t.id === theme.id);

      let themeIdToActivate: string;

      if (isNewTheme) {
        // Save as new theme to backend using createTheme endpoint
        const savedTheme = await createThemeMutation.mutateAsync({
          name: theme.name,
          description: theme.description,
          author: theme.author,
          companyId: companyId,
          createdById: userId,
          lightModeConfig: theme.lightColors,
          darkModeConfig: theme.darkColors,
          typography: theme.typography,
          tags: theme.tags,
          isDefault: false, // Will be set via setDefaultTheme mutation below
        });
        console.log('Saved new theme to backend:', savedTheme);

        // Update local state with the new theme (with DB-generated ID)
        const newTheme = {
          ...theme,
          id: savedTheme.id, // Use the ID from the backend
        };
        addTheme(newTheme);
        themeIdToActivate = savedTheme.id;
      } else {
        // Update existing theme in backend using updateTheme endpoint
        const updatedTheme = await updateThemeMutation.mutateAsync({
          themeId: theme.id,
          userId: userId, // Uses the same valid ObjectID defined above
          name: theme.name,
          description: theme.description,
          lightModeConfig: theme.lightColors,
          darkModeConfig: theme.darkColors,
          typography: theme.typography,
          tags: theme.tags,
          isActive: true,
        });
        console.log('Updated theme in backend:', updatedTheme);

        // Update local state
        updateTheme(theme);
        themeIdToActivate = theme.id;
      }

      // Mark this theme as the active default theme for the company
      // This ensures it will be loaded globally across the application
      await setDefaultThemeMutation.mutateAsync({
        themeId: themeIdToActivate,
        companyId,
        userId,
      });
      console.log('Theme set as default for company');

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