/**
 * ThemeSwitcher Component Types
 */

export interface ThemeSwitcherProps {
  /**
   * Display mode for the theme switcher
   * @default 'dropdown'
   */
  mode?: 'dropdown' | 'inline';

  /**
   * Show theme preview on hover
   * @default true
   */
  showPreview?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Callback when theme is changed
   */
  onThemeChange?: (themeId: string) => void;
}
