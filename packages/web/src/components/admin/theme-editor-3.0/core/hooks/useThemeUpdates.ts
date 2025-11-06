'use client';

import React from 'react'; // Añadido para useMemo y useCallback
import { useThemeEditor } from '../context/ThemeEditorContext';
import { 
  ThemeColors, 
  ThemeTypography, 
  ThemeBrand, 
  ThemeBorders, 
  ThemeSpacing, 
  ThemeShadows, 
  ThemeScroll,
  ColorsChangeHandler,
  TypographyChangeHandler,
  BrandChangeHandler,
  BordersChangeHandler,
  SpacingChangeHandler,
  ShadowsChangeHandler,
  ScrollChangeHandler
} from '../types';

/**
 * Custom hook para manejar actualizaciones del tema
 * Elimina la redundancia de handlers en el Theme Editor
 * Ahora con tipos específicos en lugar de 'any'
 */
export function useThemeUpdates() {
  const { state, updateTheme } = useThemeEditor();

  // Performance Optimization (NEW - ETAPA 3: Performance Optimization)
  // useCallback para estabilizar referencias de funciones y evitar re-renders innecesarios
  const updateColors: ColorsChangeHandler = React.useCallback((colors: ThemeColors) => {
    updateTheme({
      ...state.currentTheme,
      colors
    });
  }, [state.currentTheme, updateTheme]);

  const updateTypography: TypographyChangeHandler = React.useCallback((typography: ThemeTypography) => {
    updateTheme({
      ...state.currentTheme,
      typography
    });
  }, [state.currentTheme, updateTheme]);

  const updateBrand: BrandChangeHandler = React.useCallback((brand: ThemeBrand) => {
    updateTheme({
      ...state.currentTheme,
      brand
    });
  }, [state.currentTheme, updateTheme]);

  const updateBorders: BordersChangeHandler = React.useCallback((borders: ThemeBorders) => {
    updateTheme({
      ...state.currentTheme,
      borders
    });
  }, [state.currentTheme, updateTheme]);

  const updateSpacing: SpacingChangeHandler = React.useCallback((spacing: ThemeSpacing) => {
    updateTheme({
      ...state.currentTheme,
      spacing
    });
  }, [state.currentTheme, updateTheme]);

  const updateShadows: ShadowsChangeHandler = React.useCallback((shadows: ThemeShadows) => {
    updateTheme({
      ...state.currentTheme,
      shadows
    });
  }, [state.currentTheme, updateTheme]);

  const updateScroll: ScrollChangeHandler = React.useCallback((scroll: ThemeScroll) => {
    updateTheme({
      ...state.currentTheme,
      scroll
    });
  }, [state.currentTheme, updateTheme]);

  // useMemo para estabilizar el objeto de retorno y evitar re-creates
  return React.useMemo(() => ({
    updateColors,
    updateTypography,
    updateBrand,
    updateBorders,
    updateSpacing,
    updateShadows,
    updateScroll
  }), [
    updateColors,
    updateTypography,
    updateBrand,
    updateBorders,
    updateSpacing,
    updateShadows,
    updateScroll
  ]);
}