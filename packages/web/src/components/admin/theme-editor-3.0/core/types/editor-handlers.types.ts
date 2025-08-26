// Theme Editor 3.0 - Handler Types
import { ThemeColors, ThemeBorders, ThemeBrand, ThemeScroll, ThemeShadows, ThemeSpacing, ThemeTypography } from './theme.types';

/**
 * Tipos específicos para handlers de cada editor
 * Elimina el uso de 'any' en todo el sistema
 */

// Handler types para cada sección del editor
export type ColorsChangeHandler = (colors: ThemeColors) => void;
export type TypographyChangeHandler = (typography: ThemeTypography) => void;
export type BrandChangeHandler = (brand: ThemeBrand) => void;
export type BordersChangeHandler = (borders: ThemeBorders) => void;
export type SpacingChangeHandler = (spacing: ThemeSpacing) => void;
export type ShadowsChangeHandler = (shadows: ThemeShadows) => void;
export type ScrollChangeHandler = (scroll: ThemeScroll) => void;

// Props types para componentes de editor
export interface ColorsEditorProps {
  colors: ThemeColors;
  onColorsChange: ColorsChangeHandler;
  className?: string;
}

export interface TypographyEditorProps {
  typography: ThemeTypography;
  onTypographyChange: TypographyChangeHandler;
  className?: string;
}

export interface BrandEditorProps {
  brand: ThemeBrand;
  onBrandChange: BrandChangeHandler;
  className?: string;
}

export interface BordersEditorProps {
  borders: ThemeBorders;
  onBordersChange: BordersChangeHandler;
  className?: string;
}

export interface SpacingEditorProps {
  spacing: ThemeSpacing;
  onSpacingChange: SpacingChangeHandler;
  className?: string;
}

export interface ShadowsEditorProps {
  shadows: ThemeShadows;
  onShadowsChange: ShadowsChangeHandler;
  className?: string;
}

export interface ScrollEditorProps {
  scroll: ThemeScroll;
  onScrollChange: ScrollChangeHandler;
  className?: string;
}

// Union type para todos los update handlers
export type ThemeUpdateHandler = 
  | ColorsChangeHandler
  | TypographyChangeHandler
  | BrandChangeHandler
  | BordersChangeHandler
  | SpacingChangeHandler
  | ShadowsChangeHandler
  | ScrollChangeHandler;

// Tipo genérico para propiedades de tema
export type ThemeProperty = ThemeColors | ThemeTypography | ThemeBrand | ThemeBorders | ThemeSpacing | ThemeShadows | ThemeScroll;

// Helper type para secciones del editor
export interface EditorSection {
  id: 'colors' | 'typography' | 'brand' | 'borders' | 'spacing' | 'shadows' | 'scroll';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  updateHandler: (value: ThemeProperty) => void;
}