'use client';

import { useState, useMemo } from 'react';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { ThemeData } from '../types/theme.types';
import { generateColorVariants } from '../../theme-editor/editor/brand/utils';
import { trpc } from '@/lib/trpc';

/**
 * Custom hook para el Theme Selector
 * Elimina la lógica duplicada de manejo de temas
 */
export function useThemeSelector() {
  const { state, setTheme } = useThemeEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load themes from database
  const companyId = '6733c2fd80b7b58d4c36d966'; // TODO: Get from auth context
  const { data: dbThemes, refetch: refetchThemes } = trpc.theme.getCompanyThemes.useQuery({
    companyId,
    activeOnly: false,
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = trpc.theme.setDefaultTheme.useMutation({
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

  const handleToggleFavorite = (themeId: string) => {
    toggleFavoriteMutation.mutate({
      themeId,
      companyId,
      userId: 'current-user-id', // TODO: Get from auth context
    });
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
    handleToggleFavorite,

    // Data
    themes: allThemes,
    builtInThemes: DEFAULT_THEMES,
    isLoadingThemes: !dbThemes,
  };
}