import type { CSSProperties } from 'react';
import type { ThemeData } from '@/components/admin/theme-editor-3.0/core/types';

/**
 * Props for the ThemeEditorOrganism component
 *
 * This organism wraps the complete Theme Editor 3.0 system,
 * providing a clean interface for page-level integration
 */
export interface ThemeEditorOrganismProps {
  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Theme override using CSS custom properties
   */
  themeOverride?: CSSProperties;

  /**
   * Whether to use system color variables
   * @default true
   */
  useSystemColors?: boolean;

  /**
   * Initial theme to load (optional)
   */
  initialTheme?: string;

  /**
   * Callback when theme changes
   * @param theme - Complete theme data object with all configurations
   */
  onThemeChange?: (theme: ThemeData) => void;

  /**
   * Callback when theme is saved
   * @param theme - Complete theme data object with all configurations
   */
  onThemeSave?: (theme: ThemeData) => void;

  /**
   * Labels and text for internationalization
   */
  labels?: ThemeEditorLabels;
}

/**
 * Internationalization labels for the Theme Editor
 *
 * All text displayed in the UI should be provided through these labels
 * to support multi-language functionality
 */
export interface ThemeEditorLabels {
  // Theme Selector labels
  selector?: {
    search?: string;
    dropdown?: string;
    previous?: string;
    next?: string;
    random?: string;
  };

  // Actions Bar labels
  actions?: {
    save?: string;
    reset?: string;
    export?: string;
    import?: string;
    undo?: string;
    redo?: string;
    viewportMobile?: string;
    viewportTablet?: string;
    viewportDesktop?: string;
    themeLight?: string;
    themeDark?: string;
  };

  // Editor sections labels
  editor?: {
    colors?: string;
    typography?: string;
    brand?: string;
    borders?: string;
    spacing?: string;
    shadows?: string;
    scroll?: string;
  };

  // Preview labels
  preview?: {
    title?: string;
    loading?: string;
  };
}
