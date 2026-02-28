import { CSS_VARIABLE_MAP } from '@/components/features/theme-editor-3.0/core/types/color-sections.types';
import type { ThemeColors } from '@/components/features/theme-editor-3.0/core/types/theme.types';

/**
 * Database Theme structure from Prisma
 *
 * JSON fields use `unknown` because Prisma's JsonValue type includes `null`.
 * Callers cast these to ThemeColors etc. after null-checking.
 */
interface DbTheme {
  id: string;
  name: string;
  lightModeConfig: unknown; // ThemeColors — Prisma JSON field
  darkModeConfig: unknown; // ThemeColors — Prisma JSON field
  typography?: unknown; // TypographyElements — Prisma JSON field
  themeData?: unknown; // { borders, spacing, shadows, brand, scroll } — Prisma JSON field
  isDefault: boolean;
  isFavorite: boolean;
}

/**
 * Generate inline CSS from theme colors
 *
 * Converts ThemeColors object to CSS custom properties string
 *
 * @param colors - Theme colors object
 * @param mode - 'light' or 'dark' (for selector)
 * @returns CSS string with custom properties
 */
function generateColorCSS(colors: ThemeColors, mode: 'light' | 'dark'): string {
  const entries = Object.entries(colors) as [keyof ThemeColors, any][];

  const cssProperties = entries
    .map(([colorKey, colorToken]) => {
      const cssVariable = CSS_VARIABLE_MAP[colorKey];
      if (!cssVariable) return '';

      // Extract OKLCH value from color token
      const colorValue = colorToken?.oklchString || colorToken?.value || '';
      if (!colorValue) return '';

      return `    ${cssVariable}: ${colorValue};`;
    })
    .filter(Boolean)
    .join('\n');

  if (mode === 'dark') {
    return `  .dark {\n${cssProperties}\n  }`;
  }

  return `  :root {\n${cssProperties}\n  }`;
}

/**
 * Generate complete inline CSS from database theme
 *
 * Creates a complete <style> tag content that can be injected into HTML <head>
 * This CSS is injected server-side to prevent FOUC (Flash of Unstyled Content)
 *
 * @param theme - Theme object from database
 * @returns Complete CSS string ready for <style> tag injection
 *
 * @example
 * ```tsx
 * // In layout.tsx (Server Component)
 * import { generateInlineThemeCSS } from '@/lib/theme/inline-css-generator';
 * import { getGlobalActiveTheme } from '@/lib/server-trpc';
 *
 * export default async function RootLayout({ children }: { children: React.ReactNode }) {
 *   const theme = await getGlobalActiveTheme();
 *   const themeCSS = theme ? generateInlineThemeCSS(theme) : '';
 *
 *   return (
 *     <html lang="en">
 *       <head>
 *         <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
import { DEFAULT_TYPOGRAPHY } from '@/components/features/theme-editor-3.0/theme-editor/editor/typography/types';

/**
 * Generate inline CSS from typography settings
 */
function generateTypographyCSS(typography: any): string {
  // Merge provided typography with defaults to ensure all keys exist
  const mergedTypography = { ...DEFAULT_TYPOGRAPHY, ...(typography || {}) };

  return Object.entries(mergedTypography)
    .map(([elementKey, element]: [string, any]) => {
      const prefix = `--typography-${elementKey}`;
      return `    ${prefix}-font-family: ${element.fontFamily};\n    ${prefix}-font-size: ${element.fontSize};\n    ${prefix}-font-weight: ${element.fontWeight};\n    ${prefix}-line-height: ${element.lineHeight};\n    ${prefix}-letter-spacing: ${element.letterSpacing};\n    ${prefix}-word-spacing: ${element.wordSpacing};\n    ${prefix}-text-decoration: ${element.textDecoration};\n    ${prefix}-font-style: ${element.fontStyle};`;
    })
    .join('\n');
}

/**
 * Generate inline CSS from border radius settings stored in themeData.borders
 *
 * If borders data is missing or has no radius value, returns an empty string
 * so that globals.css defaults are used instead.
 */
function generateBorderRadiusCSS(themeData: any): string {
  const borders = themeData?.borders;
  if (!borders?.radius) return '';

  const radius = borders.radius;

  // Build CSS properties from stored values, with calc() derivations for missing ones
  const properties: string[] = [];

  properties.push(`    --radius: ${radius};`);
  properties.push(`    --radius-sm: ${borders.radiusSm || `calc(${radius} - 4px)`};`);
  properties.push(`    --radius-md: ${borders.radiusMd || `calc(${radius} - 2px)`};`);
  properties.push(`    --radius-lg: ${borders.radiusLg || radius};`);
  properties.push(`    --radius-xl: ${borders.radiusXl || `calc(${radius} + 4px)`};`);

  // Component-specific (derive from base if not stored)
  properties.push(`    --radius-button: ${borders.radiusButton || radius};`);
  properties.push(`    --radius-input: ${borders.radiusInput || radius};`);
  properties.push(`    --radius-card: ${borders.radiusCard || `calc(${radius} + 4px)`};`);
  properties.push(`    --radius-dialog: ${borders.radiusDialog || `calc(${radius} + 8px)`};`);
  properties.push(`    --radius-popover: ${borders.radiusPopover || radius};`);
  properties.push(`    --radius-dropdown: ${borders.radiusDropdown || radius};`);
  properties.push(`    --radius-tooltip: ${borders.radiusTooltip || `calc(${radius} - 2px)`};`);
  properties.push(`    --radius-badge: ${borders.radiusBadge || `calc(${radius} + 12px)`};`);
  properties.push(`    --radius-checkbox: ${borders.radiusCheckbox || `calc(${radius} - 2px)`};`);
  properties.push(`    --radius-tabs: ${borders.radiusTabs || radius};`);
  properties.push(`    --radius-select: ${borders.radiusSelect || radius};`);
  properties.push(`    --radius-toast: ${borders.radiusToast || radius};`);

  return properties.join('\n');
}

/**
 * Generate inline CSS from shadow settings stored in themeData.shadows
 */
function generateShadowCSS(themeData: any): string {
  const shadows = themeData?.shadows;
  if (!shadows) return '';

  const shadowMap: Record<string, string> = {
    shadow2xs: '--shadow-2xs',
    shadowXs: '--shadow-xs',
    shadowSm: '--shadow-sm',
    shadow: '--shadow',
    shadowMd: '--shadow-md',
    shadowLg: '--shadow-lg',
    shadowXl: '--shadow-xl',
    shadow2xl: '--shadow-2xl',
  };

  return Object.entries(shadows)
    .map(([key, value]) => (shadowMap[key] ? `    ${shadowMap[key]}: ${value};` : ''))
    .filter(Boolean)
    .join('\n');
}

/**
 * Generate inline CSS from spacing settings stored in themeData.spacing
 * Handles ThemeSpacing structure: { spacing: string, scale?: Record<string, string> }
 */
function generateSpacingCSS(themeData: any): string {
  const spacing = themeData?.spacing;
  if (!spacing?.spacing) return '';

  const properties: string[] = [`    --theme-spacing-base: ${spacing.spacing};`];

  if (spacing.scale && typeof spacing.scale === 'object') {
    Object.entries(spacing.scale).forEach(([key, value]) => {
      if (typeof value === 'string') {
        properties.push(`    --spacing-${key}: ${value};`);
      }
    });
  }

  return properties.join('\n');
}

export function generateInlineThemeCSS(theme: DbTheme | null): string {
  if (!theme) {
    return '';
  }

  const lightColors = theme.lightModeConfig as unknown as ThemeColors;
  const darkColors = theme.darkModeConfig as unknown as ThemeColors;
  // Use merged typography logic handled in generateTypographyCSS
  const typography = theme.typography;

  if (!lightColors || !darkColors) {
    console.warn('[generateInlineThemeCSS] Theme missing color configurations');
    return '';
  }

  const lightCSS = generateColorCSS(lightColors, 'light');
  const darkCSS = generateColorCSS(darkColors, 'dark');
  // Always generate typography CSS, using defaults if theme.typography is null/empty
  const typographyCSS = generateTypographyCSS(typography);
  const borderRadiusCSS = generateBorderRadiusCSS(theme.themeData);
  const shadowCSS = generateShadowCSS(theme.themeData);
  const spacingCSS = generateSpacingCSS(theme.themeData);

  return `
/* Theme: ${theme.name} (ID: ${theme.id}) */
/* Generated server-side to prevent FOUC */

  :root {
${typographyCSS}
${borderRadiusCSS ? `\n${borderRadiusCSS}` : ''}
${shadowCSS ? `\n${shadowCSS}` : ''}
${spacingCSS ? `\n${spacingCSS}` : ''}
  }

${lightCSS}

${darkCSS}
`;
}

/**
 * Generate minimal critical CSS for initial page load
 *
 * Only includes the most critical colors to minimize HTML size
 * Full theme colors will be loaded by ThemeEditorProvider on client
 *
 * @param theme - Theme object from database
 * @returns Minimal CSS string with only critical colors
 */
export function generateCriticalThemeCSS(theme: DbTheme | null): string {
  if (!theme) {
    return '';
  }

  const lightColors = theme.lightModeConfig as unknown as ThemeColors;
  const darkColors = theme.darkModeConfig as unknown as ThemeColors;

  if (!lightColors || !darkColors) {
    return '';
  }

  // Critical colors for initial render (prevents flash)
  const criticalColorKeys: (keyof ThemeColors)[] = [
    'background',
    'foreground',
    'card',
    'cardForeground',
    'primary',
    'primaryForeground',
  ];

  const generateCritical = (colors: ThemeColors, mode: 'light' | 'dark') => {
    const cssProperties = criticalColorKeys
      .map(key => {
        const cssVariable = CSS_VARIABLE_MAP[key];
        const colorToken = colors[key];
        const colorValue = colorToken?.oklchString || colorToken?.value || '';

        if (!cssVariable || !colorValue) return '';

        return `    ${cssVariable}: ${colorValue};`;
      })
      .filter(Boolean)
      .join('\n');

    if (mode === 'dark') {
      return `  .dark {\n${cssProperties}\n  }`;
    }

    return `  :root {\n${cssProperties}\n  }`;
  };

  const lightCSS = generateCritical(lightColors, 'light');
  const darkCSS = generateCritical(darkColors, 'dark');

  return `
/* Critical theme colors (${theme.name}) */
${lightCSS}

${darkCSS}
`;
}
