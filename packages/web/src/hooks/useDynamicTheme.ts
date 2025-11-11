import { useCallback } from 'react';
import { useCompanyTheme } from '@/context/ThemeContext';

export interface ThemeEditorContextValue {
  applyTheme: (themeColors: Record<string, string>) => void;
  resetTheme: () => void;
  currentTheme: Record<string, string> | null;
}

export function useDynamicTheme(): ThemeEditorContextValue {
  const { updateThemeColors, isDarkMode, tokens, refreshTheme } = useCompanyTheme();
  
  const applyTheme = useCallback((themeColors: Record<string, string>) => {
    // Use the DynamicThemeProvider's updateThemeColors method instead of direct DOM manipulation
    if (updateThemeColors) {
      updateThemeColors(themeColors, isDarkMode ? 'dark' : 'light');
    } else {
      console.warn('updateThemeColors not available yet');
    }
  }, [updateThemeColors, isDarkMode]);

  const resetTheme = useCallback(async () => {
    // Reset to default theme by refreshing the theme from the provider
    await refreshTheme();
    
    // Also remove any preview styles that might be applied
    const previewElement = document.getElementById('theme-preview-vars');
    if (previewElement) {
      previewElement.remove();
    }
  }, [refreshTheme]);

  return {
    applyTheme,
    resetTheme,
    currentTheme: tokens, // Return the current tokens from the provider
  };
}