'use client';

import React, { ReactNode } from 'react';
import { ThemeEditorProvider, useThemeEditor } from '@/components/features/theme-editor-3.0/core/context/ThemeEditorContext';

/**
 * GlobalThemeProvider
 *
 * MODIFIED: Simplified to handle global platform theme (no companyId needed)
 *
 * Wrapper around ThemeEditorProvider for application-wide theme management.
 * This provider handles theme loading from database and applies themes globally.
 *
 * Features:
 * - Loads global active theme from database
 * - Applies theme with light/dark mode support
 * - Maintains undo/redo history
 * - Syncs theme changes across the application
 *
 * @param initialTheme - Global active theme from server-side (SSR)
 * @param children - Child components
 */
interface GlobalThemeProviderProps {
  initialTheme?: any; // Global active theme from database (server-side)
  children: ReactNode;
}

export function GlobalThemeProvider({ initialTheme, children }: GlobalThemeProviderProps) {
  return (
    <ThemeEditorProvider initialTheme={initialTheme} isEditorMode={false}>
      {children}
    </ThemeEditorProvider>
  );
}

/**
 * Hook to access global theme state
 *
 * @returns Theme editor context with theme state and actions
 */
export function useGlobalTheme() {
  return useThemeEditor();
}

/**
 * Simplified hook for basic theme access (backwards compatibility)
 *
 * @returns Basic theme properties
 */
export function useCompanyTheme() {
  const { state, setTheme, setThemeMode } = useThemeEditor();

  return {
    theme: state.currentTheme,
    themeMode: state.themeMode,
    setTheme,
    setThemeMode,
    isLoading: state.isLoading,
    error: state.error,
  };
}
