'use client';

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

  const updateColors: ColorsChangeHandler = (colors: ThemeColors) => {
    updateTheme({
      ...state.currentTheme,
      colors
    });
  };

  const updateTypography: TypographyChangeHandler = (typography: ThemeTypography) => {
    updateTheme({
      ...state.currentTheme,
      typography
    });
  };

  const updateBrand: BrandChangeHandler = (brand: ThemeBrand) => {
    updateTheme({
      ...state.currentTheme,
      brand
    });
  };

  const updateBorders: BordersChangeHandler = (borders: ThemeBorders) => {
    updateTheme({
      ...state.currentTheme,
      borders
    });
  };

  const updateSpacing: SpacingChangeHandler = (spacing: ThemeSpacing) => {
    updateTheme({
      ...state.currentTheme,
      spacing
    });
  };

  const updateShadows: ShadowsChangeHandler = (shadows: ThemeShadows) => {
    updateTheme({
      ...state.currentTheme,
      shadows
    });
  };

  const updateScroll: ScrollChangeHandler = (scroll: ThemeScroll) => {
    updateTheme({
      ...state.currentTheme,
      scroll
    });
  };

  return {
    updateColors,
    updateTypography,
    updateBrand,
    updateBorders,
    updateSpacing,
    updateShadows,
    updateScroll
  };
}