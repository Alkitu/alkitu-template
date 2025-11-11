'use client';

import { useState } from 'react';
import { useThemeEditor } from '../context/ThemeEditorContext';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { ThemeData } from '../types/theme.types';
import { generateColorVariants } from '../../theme-editor/editor/brand/utils';

/**
 * Custom hook para el Theme Selector
 * Elimina la lógica duplicada de manejo de temas
 */
export function useThemeSelector() {
  const { state, setTheme } = useThemeEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedThemes] = useState<ThemeData[]>([]); // Future: load from localStorage/API

  // Usar currentTheme del context directamente (sin duplicar estado local)
  const currentTheme = state.currentTheme;

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
    const currentIndex = DEFAULT_THEMES.findIndex(t => t.id === currentTheme.id);
    const previousIndex = currentIndex <= 0 ? DEFAULT_THEMES.length - 1 : currentIndex - 1;
    const previousTheme = DEFAULT_THEMES[previousIndex];
    handleThemeSelect(previousTheme);
  };

  const handleNextTheme = () => {
    const currentIndex = DEFAULT_THEMES.findIndex(t => t.id === currentTheme.id);
    const nextIndex = currentIndex >= DEFAULT_THEMES.length - 1 ? 0 : currentIndex + 1;
    const nextTheme = DEFAULT_THEMES[nextIndex];
    handleThemeSelect(nextTheme);
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_THEMES.length);
    const randomTheme = DEFAULT_THEMES[randomIndex];
    handleThemeSelect(randomTheme);
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
    
    // Data
    themes: DEFAULT_THEMES
  };
}