'use client';

import { useState, useMemo } from 'react';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { ThemeData } from '../types/theme.types';
import { generateColorVariants } from '../../theme-editor/editor/brand/utils';
import { trpc } from '@/lib/trpc';
import { useThemeAuth } from './useThemeAuth';

/**
 * Custom hook para el Theme Selector
 * Elimina la lógica duplicada de manejo de temas
 */
export function useThemeSelector() {
  const { state, setTheme, removeTheme } = useThemeEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get authenticated user data
  const { userId, companyId, isAdmin } = useThemeAuth();

  // MODIFIED: Load ALL themes (platform-wide, no filters)
  const { data: dbThemes, refetch: refetchThemes } = trpc.theme.listAllThemes.useQuery();

  // NEW: Mutation to set global active theme
  const setGlobalActiveThemeMutation = trpc.theme.setGlobalActiveTheme.useMutation({
    onSuccess: () => {
      refetchThemes();
    },
  });

  // Mutation to save built-in theme as favorite
  const createThemeMutation = trpc.theme.createTheme.useMutation({
    onSuccess: () => {
      refetchThemes();
    },
  });

  // Mutation to delete theme
  const deleteThemeMutation = trpc.theme.delete.useMutation({
    onSuccess: () => {
      refetchThemes();
    },
  });

  // Usar currentTheme del context directamente (sin duplicar estado local)
  const currentTheme = state.currentTheme;

  // Convert DB themes to ThemeData format and combine with built-in themes
  const savedThemes = useMemo(() => {
    if (!dbThemes) return [];

    return dbThemes.map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description || '',
      lightColors: theme.lightModeConfig as any,
      darkColors: theme.darkModeConfig as any,
      typography: theme.typography as any,
      brand: {},
      spacing: {},
      borders: {},
      shadows: {},
      scroll: {},
      isDefault: theme.isDefault,
      isFavorite: theme.isFavorite,
    })) as ThemeData[];
  }, [dbThemes]);

  // Combine saved themes with built-in themes (saved themes first)
  const allThemes = useMemo(() => {
    return [...savedThemes, ...DEFAULT_THEMES];
  }, [savedThemes]);

  // Theme navigation handlers
  const handleThemeSelect = (theme: ThemeData) => {
    // Preserve existing brand assets but update colors to match new theme
    const currentLogos = state.currentTheme.brand?.logos;
    
    let adaptedLogos = theme.brand?.logos; // Default to new theme's logos
    
    // If there are existing custom logos, preserve them but update colors
    if (currentLogos) {
      // Get the new primary color, with fallback
      const newPrimaryColor = theme.colors?.primary?.hex || 
                             theme.lightColors?.primary?.hex ||
                             theme.darkColors?.primary?.hex ||
                             '#2AB34B'; // Default fallback color
      
      const updateLogoVariants = (logo: any) => {
        if (!logo) return undefined;
        
        try {
          // Regenerate variants with new primary color for both modes
          const lightVariants = generateColorVariants(logo.svgContent, logo.detectedColors, newPrimaryColor, false);
          const darkVariants = generateColorVariants(logo.svgContent, logo.detectedColors, newPrimaryColor, true);
          
          return {
            ...logo,
            lightMode: {
              ...logo.lightMode,
              monoColor: newPrimaryColor,
              variants: lightVariants
            },
            darkMode: {
              ...logo.darkMode,
              monoColor: newPrimaryColor,
              variants: darkVariants
            }
          };
        } catch (error) {
          console.warn('Error updating logo variants:', error);
          // Return logo without changes if there's an error
          return logo;
        }
      };
      
      adaptedLogos = {
        icon: updateLogoVariants(currentLogos.icon),
        horizontal: updateLogoVariants(currentLogos.horizontal),
        vertical: updateLogoVariants(currentLogos.vertical)
      };
    }
    
    const themeWithPreservedBrand = {
      ...theme,
      brand: {
        ...theme.brand,
        logos: adaptedLogos
      }
    };
    setTheme(themeWithPreservedBrand);
  };

  const handlePreviousTheme = () => {
    const currentIndex = allThemes.findIndex(t => t.id === currentTheme.id);
    const previousIndex = currentIndex <= 0 ? allThemes.length - 1 : currentIndex - 1;
    const previousTheme = allThemes[previousIndex];
    handleThemeSelect(previousTheme);
  };

  const handleNextTheme = () => {
    const currentIndex = allThemes.findIndex(t => t.id === currentTheme.id);
    const nextIndex = currentIndex >= allThemes.length - 1 ? 0 : currentIndex + 1;
    const nextTheme = allThemes[nextIndex];
    handleThemeSelect(nextTheme);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * allThemes.length);
    const randomTheme = allThemes[randomIndex];
    handleThemeSelect(randomTheme);
  };

  /**
   * Check if a theme is a built-in theme (not saved in database)
   * Built-in themes have simple IDs like 'default', 'amber-minimal'
   * Database themes have MongoDB ObjectIDs (24 char hex strings)
   */
  const isBuiltInTheme = (themeId: string): boolean => {
    // MongoDB ObjectIDs are 24 characters hexadecimal
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(themeId);
    return !isMongoId;
  };

  /**
   * NEW: Handle activating a theme as the global active theme
   * Only ADMIN can activate themes
   */
  const handleActivateTheme = async (themeId: string): Promise<void> => {
    if (!isAdmin) {
      throw new Error('Only administrators can activate themes');
    }
    if (!userId) {
      throw new Error('Authentication required to activate themes');
    }

    await setGlobalActiveThemeMutation.mutateAsync({
      themeId,
      requestingUserId: userId,
    });
  };

  /**
   * @deprecated Use handleActivateTheme instead
   * Handle toggling favorite on a theme (deprecated in global theme model)
   */
  const handleToggleFavorite = (themeId: string) => {
    console.warn('handleToggleFavorite is deprecated. Use handleActivateTheme to set global active theme.');
    const theme = allThemes.find(t => t.id === themeId);

    if (!theme) {
      console.error('Theme not found:', themeId);
      return;
    }

    // Check if it's a built-in theme
    if (isBuiltInTheme(themeId)) {
      // Built-in theme: Save to database first
      createThemeMutation.mutate({
        name: theme.name,
        description: theme.description || `Built-in ${theme.name} theme`,
        author: theme.author || 'Alkitu',
        companyId: companyId,
        createdById: userId || '',
        lightModeConfig: theme.lightColors,
        darkModeConfig: theme.darkColors,
        typography: theme.typography,
        tags: theme.tags || [],
      });
    } else {
      // For saved themes, just activate as global theme
      handleActivateTheme(themeId).catch(console.error);
    }
  };

  /**
   * Handle deleting a theme
   * Only works for saved themes (not built-in themes) and only for admins
   */
  const handleDeleteTheme = async (themeId: string): Promise<void> => {
    try {
      // Validate admin role
      if (!isAdmin) {
        throw new Error('Only administrators can delete themes');
      }

      // Validate userId
      if (!userId) {
        throw new Error('Authentication required to delete themes');
      }

      // Delete from database
      await deleteThemeMutation.mutateAsync({
        id: themeId,
        userId: userId,
      });

      // Remove from local state
      removeTheme(themeId);

      // If deleted theme was active, switch to first default theme
      if (state.currentTheme?.id === themeId) {
        const firstTheme = DEFAULT_THEMES[0];
        setTheme(firstTheme);
      }
    } catch (error) {
      console.error('Failed to delete theme:', error);
      throw error; // Re-throw so DeleteThemeButton can handle it
    }
  };

  return {
    // State
    currentTheme,
    searchQuery,
    isDropdownOpen,
    savedThemes,

    // Setters
    setSearchQuery,
    setIsDropdownOpen,

    // Handlers
    handleThemeSelect,
    handlePreviousTheme,
    handleNextTheme,
    handleRandomTheme,
    handleActivateTheme, // NEW: Global theme activation
    handleToggleFavorite, // DEPRECATED
    handleDeleteTheme,

    // Helper functions
    isBuiltInTheme,

    // Data
    themes: allThemes,
    builtInThemes: DEFAULT_THEMES,
    isLoadingThemes: !dbThemes,

    // Auth
    isAdmin,
  };
}