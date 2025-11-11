/**
 * useGlobalTheme Hook
 *
 * Simplified interface to the DynamicThemeProvider context.
 * Provides easy access to theme state and actions throughout the application.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colors, mode, isDark, setMode, updateColors } = useGlobalTheme();
 *
 *   return (
 *     <button
 *       onClick={() => setMode(isDark ? 'light' : 'dark')}
 *       style={{ background: colors.primary }}
 *     >
 *       Toggle {mode} mode
 *     </button>
 *   );
 * }
 * ```
 */

import { useCompanyTheme } from '@/context/ThemeContext';
import type { Theme } from '@/context/ThemeContext';
import type { ThemeTypography } from '@/types/typography';

export interface GlobalThemeHook {
  // Simplified theme data
  theme: Theme | null;
  colors: Record<string, string>;
  typography: ThemeTypography;

  // Mode management
  mode: 'light' | 'dark' | 'system';
  isDark: boolean;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleMode: () => void;

  // Actions
  updateColors: (colors: Record<string, string>, mode: 'light' | 'dark') => void;
  updateTypography: (typography: ThemeTypography) => Promise<void>;
  updateTheme: (themeData: Partial<Theme>) => Promise<void>;
  applyTheme: (themeId: string, companyId?: string) => Promise<void>;
  refreshTheme: () => Promise<void>;
  clearPreview: () => void;

  // Viewport state
  viewport: {
    current: 'mobile' | 'tablet' | 'desktop';
    isResponsive: boolean;
  };
  setViewport: (size: 'mobile' | 'tablet' | 'desktop') => void;
  toggleResponsive: () => void;

  // History state (undo/redo)
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  // State
  loading: boolean;
  error: string | null;
}

/**
 * useGlobalTheme - Simplified hook for accessing theme context
 *
 * Wraps the useCompanyTheme hook with a simplified, developer-friendly API.
 * Provides the most commonly used theme properties and actions.
 */
export function useGlobalTheme(): GlobalThemeHook {
  const context = useCompanyTheme();

  return {
    // Theme data
    theme: context.theme,
    colors: context.tokens,
    typography: context.typography,

    // Mode management
    mode: context.themeMode,
    isDark: context.isDarkMode,
    setMode: context.setThemeMode,
    toggleMode: context.toggleThemeMode,

    // Actions
    updateColors: context.updateThemeColors,
    updateTypography: context.updateTypography,
    updateTheme: context.updateTheme,
    applyTheme: context.applyTheme,
    refreshTheme: context.refreshTheme,
    clearPreview: context.clearPreviewTokens,

    // Viewport management
    viewport: context.viewport,
    setViewport: context.setViewport,
    toggleResponsive: context.toggleResponsive,

    // History management
    canUndo: context.canUndo,
    canRedo: context.canRedo,
    undo: context.undo,
    redo: context.redo,
    clearHistory: context.clearHistory,

    // State
    loading: context.loading,
    error: context.error,
  };
}

/**
 * Type guard to check if a value is a valid theme mode
 */
export function isThemeMode(value: unknown): value is 'light' | 'dark' | 'system' {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Hook to detect system theme preference
 */
export function useSystemThemePreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? 'dark' : 'light';
}
