// Theme Editor 3.0 - Editor Types
import { ThemeData, ThemeColors, ThemeTypography, ThemeBrand, ThemeBorders, ThemeSpacing, ThemeShadows, ThemeScroll } from './theme.types';

export type EditorSection = 'colors' | 'typography' | 'brand' | 'borders' | 'spacing' | 'shadows' | 'scroll';

export interface EditorState {
  activeSection: EditorSection;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

// Union type para todos los posibles payloads de acciones
export type EditorActionPayload = 
  | { type: 'THEME_UPDATE'; data: ThemeData }
  | { type: 'COLORS_UPDATE'; data: ThemeColors }
  | { type: 'TYPOGRAPHY_UPDATE'; data: ThemeTypography }
  | { type: 'BRAND_UPDATE'; data: ThemeBrand }
  | { type: 'BORDERS_UPDATE'; data: ThemeBorders }
  | { type: 'SPACING_UPDATE'; data: ThemeSpacing }
  | { type: 'SHADOWS_UPDATE'; data: ThemeShadows }
  | { type: 'SCROLL_UPDATE'; data: ThemeScroll };

export interface EditorAction {
  type: string;
  payload: EditorActionPayload;
  timestamp: number;
  description: string;
}

export interface EditorHistory {
  past: EditorAction[];
  present: EditorAction;
  future: EditorAction[];
  maxSize: number;
}

export interface EditorConfig {
  autosave: boolean;
  autosaveInterval: number; // ms
  maxHistorySize: number;
  enableShortcuts: boolean;
}