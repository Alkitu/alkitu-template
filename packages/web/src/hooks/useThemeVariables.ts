import { useMemo } from 'react';
import { useCompanyTheme } from '../context/providers/DynamicThemeProvider';

export interface ThemeVariables {
  // Semantic colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;

  // Computed values
  radius: string;
  fontSans: string;
  fontMono: string;
}

export const useThemeVariables = (): ThemeVariables => {
  const { tokens } = useCompanyTheme();

  return useMemo(
    () => ({
      primary: tokens['primary'] || 'oklch(0.5634 0.1517 146.7438)',
      primaryForeground: tokens['primary-foreground'] || 'oklch(1 0 0)',
      secondary: tokens['secondary'] || 'oklch(0.9683 0.0069 247.8956)',
      secondaryForeground:
        tokens['secondary-foreground'] || 'oklch(0.1363 0.0364 259.2010)',
      background: tokens['background'] || 'oklch(1 0 0)',
      foreground: tokens['foreground'] || 'oklch(0.1363 0.0364 259.2010)',
      muted: tokens['muted'] || 'oklch(0.96 0.01 247.8956)',
      mutedForeground:
        tokens['muted-foreground'] || 'oklch(0.45 0.01 247.8956)',
      accent: tokens['accent'] || 'oklch(0.96 0.01 247.8956)',
      accentForeground:
        tokens['accent-foreground'] || 'oklch(0.1363 0.0364 259.2010)',
      destructive: tokens['destructive'] || 'oklch(0.627 0.22 29.2329)',
      destructiveForeground: tokens['destructive-foreground'] || 'oklch(1 0 0)',
      border: tokens['border'] || 'oklch(0.9288 0.0126 255.5078)',
      input: tokens['input'] || 'oklch(0.9288 0.0126 255.5078)',
      ring: tokens['ring'] || 'oklch(0.5634 0.1517 146.7438)',
      radius: tokens['radius'] || '0.5rem',
      fontSans: tokens['font-sans'] || 'Inter, system-ui, sans-serif',
      fontMono:
        tokens['font-mono'] || 'ui-monospace, SFMono-Regular, monospace',
    }),
    [tokens],
  );
};

// Hook for specific theme properties
export const useThemeProperty = (property: keyof ThemeVariables): string => {
  const themeVars = useThemeVariables();
  return themeVars[property];
};

// Hook for CSS custom property access
export const useCSSVariable = (variable: string): string => {
  const { tokens } = useCompanyTheme();
  return tokens[variable] || `var(--${variable})`;
};
