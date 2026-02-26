/**
 * ThemeToggle Component Types
 *
 * Este componente no requiere props - se conecta automáticamente
 * con el GlobalThemeProvider para gestionar el estado del tema.
 */

export interface ThemeToggleProps {
  /** Optional callback fired after theme mode changes */
  onThemeChange?: (mode: 'light' | 'dark') => void;
}
