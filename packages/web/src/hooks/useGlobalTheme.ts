/**
 * useGlobalTheme Hook
 *
 * Re-export of useGlobalTheme from GlobalThemeProvider for backwards compatibility.
 * Provides easy access to theme state and actions throughout the application.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const theme = useGlobalTheme();
 *   const { state, setThemeMode } = theme;
 *
 *   return (
 *     <button onClick={() => setThemeMode(state.themeMode === 'dark' ? 'light' : 'dark')}>
 *       Toggle {state.themeMode} mode
 *     </button>
 *   );
 * }
 * ```
 */

export { useGlobalTheme } from '@/context/GlobalThemeProvider';

/**
 * Type guard to check if a value is a valid theme mode
 */
export function isThemeMode(value: unknown): value is 'light' | 'dark' {
  return value === 'light' || value === 'dark';
}

/**
 * Hook to detect system theme preference
 */
export function useSystemThemePreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? 'dark' : 'light';
}
