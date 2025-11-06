// Theme Editor 3.0 - CSS Variables Management
import { ThemeData, ThemeColors, OklchColor } from '../types/theme.types';
import { CSS_VARIABLE_MAP } from '../types/color-sections.types';
import { oklchToHex } from './color-conversions';
import { TypographyElements } from '../3-theme-editor/typography/types';

/**
 * Converts OKLCH color object to CSS oklch() string
 */
export function oklchToString(oklch: OklchColor): string {
  const { l, c, h } = oklch;
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(4)})`;
}

/**
 * Parses OKLCH string to OKLCH color object
 */
export function parseOklchString(value: string): OklchColor | null {
  // Match oklch(l c h) - no alpha support
  const match = value.match(/oklch\(([^)]+)\)/);
  if (!match) return null;
  
  const parts = match[1].split(/\s+/);
  if (parts.length < 3) return null;
  
  const l = parseFloat(parts[0]);
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]);
  
  if (isNaN(l) || isNaN(c) || isNaN(h)) return null;
  
  return { l, c, h };
}

/**
 * Applies theme colors to CSS root variables (legacy function)
 * @deprecated Use applyModeSpecificColors instead
 */
export function applyThemeColorsToRoot(colors: ThemeColors): void {
  applyModeSpecificColors(colors);
}

/**
 * Applies mode-specific colors to CSS root variables V2
 * Uses OKLCH strings as source of truth for precise color representation
 */
export function applyModeSpecificColors(colors: ThemeColors): void {
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([colorKey, colorToken]) => {
    const cssVariable = CSS_VARIABLE_MAP[colorKey as keyof ThemeColors];
    if (cssVariable) {
      // Prefer oklchString for precise colors, fallback to legacy value
      const colorValue = colorToken.oklchString || colorToken.value;
      if (colorValue) {
        root.style.setProperty(cssVariable, colorValue);
      }
    }
  });
}

/**
 * Applies complete theme to CSS root variables
 * NOTE: For colors, use applyModeSpecificColors() instead
 */
export function applyThemeToRoot(theme: ThemeData, mode: 'light' | 'dark' = 'light'): void {
  const root = document.documentElement;
  
  // Apply mode-specific colors
  const colors = mode === 'dark' ? theme.darkColors : theme.lightColors;
  applyModeSpecificColors(colors);
  
  // Apply typography
  root.style.setProperty('--font-sans', theme.typography.fontFamilies.sans);
  root.style.setProperty('--font-serif', theme.typography.fontFamilies.serif);
  root.style.setProperty('--font-mono', theme.typography.fontFamilies.mono);
  root.style.setProperty('--tracking-normal', theme.typography.trackingNormal);
  
  // Apply borders
  root.style.setProperty('--radius', theme.borders.radius);
  
  // Apply spacing
  root.style.setProperty('--spacing', theme.spacing.spacing);
  
  // Apply shadows
  Object.entries({
    '--shadow-2xs': theme.shadows.shadow2xs,
    '--shadow-xs': theme.shadows.shadowXs,
    '--shadow-sm': theme.shadows.shadowSm,
    '--shadow': theme.shadows.shadow,
    '--shadow-md': theme.shadows.shadowMd,
    '--shadow-lg': theme.shadows.shadowLg,
    '--shadow-xl': theme.shadows.shadowXl,
    '--shadow-2xl': theme.shadows.shadow2xl
  }).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Applies typography elements to CSS root variables
 */
export function applyTypographyElements(typography: TypographyElements): void {
  const root = document.documentElement;
  
  // Apply each typography element as CSS variables
  Object.entries(typography).forEach(([elementKey, element]) => {
    const prefix = `--typography-${elementKey}`;
    
    root.style.setProperty(`${prefix}-font-family`, element.fontFamily);
    root.style.setProperty(`${prefix}-font-size`, element.fontSize);
    root.style.setProperty(`${prefix}-font-weight`, element.fontWeight);
    root.style.setProperty(`${prefix}-line-height`, element.lineHeight);
    root.style.setProperty(`${prefix}-letter-spacing`, element.letterSpacing);
    root.style.setProperty(`${prefix}-word-spacing`, element.wordSpacing);
    root.style.setProperty(`${prefix}-text-decoration`, element.textDecoration);
  });
}

/**
 * Gets current CSS variable value from root
 */
export function getCSSVariableValue(variableName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

/**
 * Updates a single CSS variable in root
 */
export function updateCSSVariable(variableName: string, value: string): void {
  document.documentElement.style.setProperty(variableName, value);
}

/**
 * Removes theme-related CSS variables from root
 */
export function resetThemeVariables(): void {
  const root = document.documentElement;
  
  // Remove all color variables
  Object.values(CSS_VARIABLE_MAP).forEach(variable => {
    root.style.removeProperty(variable);
  });
  
  // Remove other theme variables
  const themeVariables = [
    '--font-sans', '--font-serif', '--font-mono', '--tracking-normal',
    '--radius', '--spacing',
    '--shadow-2xs', '--shadow-xs', '--shadow-sm', '--shadow',
    '--shadow-md', '--shadow-lg', '--shadow-xl', '--shadow-2xl'
  ];
  
  themeVariables.forEach(variable => {
    root.style.removeProperty(variable);
  });
}

/**
 * Generates CSS string for theme export
 */
export function generateThemeCSS(theme: ThemeData, includeLight = true, includeDark = true): string {
  let css = '';
  
  if (includeLight) {
    css += `:root {\n`;
    
    // Light mode colors
    Object.entries(theme.lightColors).forEach(([colorKey, colorToken]) => {
      const cssVariable = CSS_VARIABLE_MAP[colorKey as keyof ThemeColors];
      if (cssVariable) {
        const hexValue = oklchToHex(colorToken.oklch);
        css += `  ${cssVariable}: ${colorToken.value}; /* ${hexValue} */\n`;
      }
    });
    
    // Typography
    css += `  --font-sans: ${theme.typography.fontFamilies.sans};\n`;
    css += `  --font-serif: ${theme.typography.fontFamilies.serif};\n`;
    css += `  --font-mono: ${theme.typography.fontFamilies.mono};\n`;
    css += `  --tracking-normal: ${theme.typography.trackingNormal};\n`;
    
    // Borders
    css += `  --radius: ${theme.borders.radius};\n`;
    
    // Spacing
    css += `  --spacing: ${theme.spacing.spacing};\n`;
    
    // Shadows
    css += `  --shadow-2xs: ${theme.shadows.shadow2xs};\n`;
    css += `  --shadow-xs: ${theme.shadows.shadowXs};\n`;
    css += `  --shadow-sm: ${theme.shadows.shadowSm};\n`;
    css += `  --shadow: ${theme.shadows.shadow};\n`;
    css += `  --shadow-md: ${theme.shadows.shadowMd};\n`;
    css += `  --shadow-lg: ${theme.shadows.shadowLg};\n`;
    css += `  --shadow-xl: ${theme.shadows.shadowXl};\n`;
    css += `  --shadow-2xl: ${theme.shadows.shadow2xl};\n`;
    
    css += `}\n\n`;
  }
  
  if (includeDark) {
    css += `.dark {\n`;
    
    // Dark mode colors
    Object.entries(theme.darkColors).forEach(([colorKey, colorToken]) => {
      const cssVariable = CSS_VARIABLE_MAP[colorKey as keyof ThemeColors];
      if (cssVariable) {
        const hexValue = oklchToHex(colorToken.oklch);
        css += `  ${cssVariable}: ${colorToken.value}; /* ${hexValue} */\n`;
      }
    });
    
    css += `}\n\n`;
  }
  
  return css;
}

/**
 * Applies theme mode (light/dark) by toggling CSS class
 */
export function applyThemeMode(mode: 'light' | 'dark'): void {
  const html = document.documentElement;
  
  if (mode === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}