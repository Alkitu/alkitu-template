'use client';

import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { trpc } from '@/lib/trpc';
import { useThemeAuth } from './useThemeAuth';
import {
  ActionsBarLogic,
  HistoryState,
  ThemeImportHandler,
  ThemeImportErrorHandler,
  ThemeSaveHandler,
  UndoHandler,
  RedoHandler,
  ResetHandler,
  ThemeDeleteHandler
} from '../types';
import { DEFAULT_TYPOGRAPHY } from '../../theme-editor/editor/typography/types';

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
    removeTheme,
    undo,
    redo,
    canUndo,
    canRedo,
    undoCount,
    redoCount
  } = useThemeEditor();

  // Get authenticated user data
  const { userId, companyId, isAdmin, isLoading: isLoadingAuth } = useThemeAuth();

  // Get tRPC utils for cache invalidation
  const utils = trpc.useUtils();

  // tRPC mutations for saving themes
  const createThemeMutation = trpc.theme.createTheme.useMutation();
  const updateThemeMutation = trpc.theme.updateTheme.useMutation();
  const setGlobalActiveThemeMutation = trpc.theme.setGlobalActiveTheme.useMutation(); // MODIFIED
  const deleteThemeMutation = trpc.theme.delete.useMutation();

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

  const handleSave: ThemeSaveHandler = async (theme, isNewTheme) => {
    try {
      // Validate authentication
      if (!userId) {
        setError('Authentication required to save themes');
        return;
      }

      // Validate admin role
      if (!isAdmin) {
        setError('Only administrators can create or update themes');
        return;
      }

      let savedThemeId: string;

      // Ensure typography is complete
      const completeTypography = { ...DEFAULT_TYPOGRAPHY, ...(theme.typography || {}) };

      // Build themeData payload with spacing, shadows, scroll, borders, and brand
      const themeData = {
        spacing: theme.spacing,
        shadows: theme.shadows,
        scroll: theme.scroll,
        borders: theme.borders,
        brand: theme.brand,
      } as Record<string, unknown>;

      if (isNewTheme) {
        // CREATE new theme (NOT active by default)
        const savedTheme = await createThemeMutation.mutateAsync({
          name: theme.name,
          description: theme.description,
          author: theme.author,
          companyId: companyId ?? undefined,
          createdById: userId ?? undefined,
          lightModeConfig: theme.lightColors as unknown as Record<string, unknown>,
          darkModeConfig: theme.darkColors as unknown as Record<string, unknown>,
          typography: completeTypography as Record<string, unknown>,
          themeData,
          tags: theme.tags,
        });

        // Add to local state with DB-generated ID
        addTheme({
          ...theme,
          id: savedTheme.id,
          typography: completeTypography
        });
        savedThemeId = savedTheme.id;
      } else {
        // UPDATE existing theme
        await updateThemeMutation.mutateAsync({
          themeId: theme.id,
          userId: userId ?? undefined,
          name: theme.name,
          description: theme.description,
          lightModeConfig: theme.lightColors as unknown as Record<string, unknown>,
          darkModeConfig: theme.darkColors as unknown as Record<string, unknown>,
          typography: completeTypography as Record<string, unknown>,
          themeData,
          tags: theme.tags,
        });

        // Update local state
        updateTheme({
          ...theme,
          typography: completeTypography
        });
        savedThemeId = theme.id;
      }

      // Activate as GLOBAL theme (platform-wide)
      await setGlobalActiveThemeMutation.mutateAsync({
        themeId: savedThemeId,
        requestingUserId: userId,
      });

      // Invalidate theme queries to refresh the theme list
      await utils.theme.listAllThemes.invalidate();

      markSaved();
    } catch (error: any) {
      setError(error.message || 'Failed to save theme');
      throw error; // Re-throw so toast shows error
    }
  };

  const handleReset: ResetHandler = () => {
    // Reset current theme to its original values
    const originalTheme = DEFAULT_THEMES.find(t => t.id === currentTheme.id) || DEFAULT_THEMES[0];
    setTheme(originalTheme);
    markSaved();
  };

  const handleDelete: ThemeDeleteHandler = async (themeId: string) => {
    try {
      // Validate authentication
      if (!userId) {
        setError('Authentication required to delete themes');
        return;
      }

      // Validate admin role
      if (!isAdmin) {
        setError('Only administrators can delete themes');
        return;
      }

      // Call backend to delete theme
      await deleteThemeMutation.mutateAsync({ id: themeId, userId });

      // Remove from local state via context
      removeTheme(themeId);

      // If deleted theme was the active theme, switch to default
      if (state.currentTheme?.id === themeId) {
        setTheme(DEFAULT_THEMES[0]);
      }
    } catch (error: any) {
      console.error('Failed to delete theme:', error);
      setError(error.message || 'Failed to delete theme');
      throw error; // Re-throw so DeleteThemeButton can handle it
    }
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
    handleReset,
    handleDelete
  };
}