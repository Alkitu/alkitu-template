/**
 * CSS Variables Utility Library
 *
 * Utilities for programmatic injection and management of CSS variables
 * for the dynamic theme system.
 */

import type { ThemeTypography } from '@/types/typography';

/**
 * CSS Variable Categories
 */
export const CSS_VAR_CATEGORIES = {
  COLOR: 'color',
  RADIUS: 'radius',
  SHADOW: 'shadow',
  SPACING: 'spacing',
  SCROLLBAR: 'scrollbar',
  TYPOGRAPHY: 'typography',
  ANIMATION: 'animation',
  ZINDEX: 'z-index',
} as const;

export type CSSVarCategory = typeof CSS_VAR_CATEGORIES[keyof typeof CSS_VAR_CATEGORIES];

/**
 * Inject CSS variables into the document root
 */
export function injectCSSVariables(
  variables: Record<string, string>,
  target: HTMLElement = document.documentElement
): void {
  Object.entries(variables).forEach(([key, value]) => {
    const cssVar = key.startsWith('--') ? key : `--${key}`;
    target.style.setProperty(cssVar, value);
  });
}

/**
 * Remove CSS variables from the document root
 */
export function removeCSSVariables(
  variableNames: string[],
  target: HTMLElement = document.documentElement
): void {
  variableNames.forEach((key) => {
    const cssVar = key.startsWith('--') ? key : `--${key}`;
    target.style.removeProperty(cssVar);
  });
}

/**
 * Get current value of a CSS variable
 */
export function getCSSVariable(
  variableName: string,
  target: HTMLElement = document.documentElement
): string {
  const cssVar = variableName.startsWith('--') ? variableName : `--${variableName}`;
  return getComputedStyle(target).getPropertyValue(cssVar).trim();
}

/**
 * Get all CSS variables matching a prefix
 */
export function getCSSVariablesByPrefix(
  prefix: string,
  target: HTMLElement = document.documentElement
): Record<string, string> {
  const styles = getComputedStyle(target);
  const variables: Record<string, string> = {};

  const normalizedPrefix = prefix.startsWith('--') ? prefix : `--${prefix}`;

  // Iterate through all CSS properties
  for (let i = 0; i < styles.length; i++) {
    const propertyName = styles[i];
    if (propertyName.startsWith(normalizedPrefix)) {
      variables[propertyName] = styles.getPropertyValue(propertyName).trim();
    }
  }

  return variables;
}

/**
 * Check if a CSS variable exists
 */
export function hasCSSVariable(
  variableName: string,
  target: HTMLElement = document.documentElement
): boolean {
  const value = getCSSVariable(variableName, target);
  return value !== '';
}

/**
 * Inject color tokens into CSS variables
 */
export function injectColorTokens(
  tokens: Record<string, string>,
  mode: 'light' | 'dark' = 'light'
): void {
  const root = document.documentElement;

  // Add or remove dark class
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Inject color variables
  injectCSSVariables(tokens, root);
}

/**
 * Inject typography settings into CSS variables
 *
 * NOTE: This function is currently NOT called at runtime. The theme editor
 * uses `applyTypographyElements()` from `theme-editor-3.0/lib/utils/css/css-variables.ts`
 * for element-level typography (h1, h2, paragraph, etc.). This function generates
 * component-specific variables (button, input, label) which are planned but not yet wired.
 */
export function injectTypographyTokens(typography: ThemeTypography): void {
  const root = document.documentElement;
  const variables: Record<string, string> = {};

  // Base typography
  variables['--typography-body-family'] = typography.base.fontFamily;
  variables['--font-sans'] = typography.base.fontFamily;

  // Heading typography
  variables['--typography-heading-family'] = typography.h1.fontFamily;

  // Accent typography
  variables['--typography-accent-family'] = typography.accent.fontFamily;

  // Quote typography
  if (typography.quote) {
    variables['--typography-quote-family'] = typography.quote.fontFamily;
  }

  // Component-specific typography (using base as fallback)
  variables['--typography-button-family'] = typography.base.fontFamily;
  variables['--typography-button-size'] = `${typography.base.fontSize}px`;
  variables['--typography-button-weight'] = String(typography.base.fontWeight);
  variables['--typography-button-line-height'] = String(typography.base.lineHeight);

  variables['--typography-input-family'] = typography.base.fontFamily;
  variables['--typography-input-size'] = `${typography.base.fontSize}px`;
  variables['--typography-input-weight'] = String(typography.base.fontWeight);
  variables['--typography-input-line-height'] = String(typography.base.lineHeight);

  variables['--typography-label-family'] = typography.base.fontFamily;
  variables['--typography-label-size'] = `${typography.base.fontSize}px`;
  variables['--typography-label-weight'] = String(typography.accent.fontWeight);
  variables['--typography-label-line-height'] = String(typography.base.lineHeight);

  injectCSSVariables(variables, root);
}

/**
 * Inject border radius settings
 */
export function injectRadiusTokens(baseRadius: number): void {
  const root = document.documentElement;
  const radiusRem = `${baseRadius}rem`;

  const variables: Record<string, string> = {
    '--radius': radiusRem,
    '--radius-button': radiusRem,
    '--radius-input': radiusRem,
    '--radius-card': `calc(${radiusRem} + 4px)`,
    '--radius-dialog': `calc(${radiusRem} + 8px)`,
    '--radius-popover': radiusRem,
    '--radius-dropdown': radiusRem,
    '--radius-tooltip': `calc(${radiusRem} - 2px)`,
    '--radius-badge': `calc(${radiusRem} + 12px)`,
    '--radius-tabs': radiusRem,
    '--radius-select': radiusRem,
    '--radius-toast': radiusRem,
  };

  injectCSSVariables(variables, root);
}

/**
 * Batch inject all theme variables
 */
export function injectThemeVariables(theme: {
  colors?: Record<string, string>;
  typography?: ThemeTypography;
  radius?: number;
  mode?: 'light' | 'dark';
}): void {
  if (theme.colors) {
    injectColorTokens(theme.colors, theme.mode);
  }

  if (theme.typography) {
    injectTypographyTokens(theme.typography);
  }

  if (theme.radius !== undefined) {
    injectRadiusTokens(theme.radius);
  }
}

/**
 * Get all available CSS variable names by category
 */
export function getAvailableVariables(category?: CSSVarCategory): string[] {
  const allVariables = {
    [CSS_VAR_CATEGORIES.COLOR]: [
      'background', 'foreground', 'card', 'card-foreground',
      'popover', 'popover-foreground', 'primary', 'primary-foreground',
      'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
      'accent', 'accent-foreground', 'destructive', 'destructive-foreground',
      'border', 'input', 'ring', 'success', 'success-foreground',
      'warning', 'warning-foreground',
      'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
      'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
      'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
      'scrollbar-track', 'scrollbar-thumb',
    ],
    [CSS_VAR_CATEGORIES.RADIUS]: [
      'radius', 'radius-button', 'radius-input', 'radius-card',
      'radius-dialog', 'radius-popover', 'radius-dropdown', 'radius-tooltip',
      'radius-badge', 'radius-avatar', 'radius-checkbox', 'radius-switch',
      'radius-slider', 'radius-progress', 'radius-separator', 'radius-tabs',
      'radius-select', 'radius-toast',
    ],
    [CSS_VAR_CATEGORIES.SHADOW]: [
      'shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow', 'shadow-md',
      'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-button',
      'shadow-button-hover', 'shadow-card', 'shadow-card-hover',
      'shadow-dialog', 'shadow-popover', 'shadow-dropdown',
      'shadow-tooltip', 'shadow-toast',
    ],
    [CSS_VAR_CATEGORIES.SPACING]: [
      'spacing', 'spacing-unit', 'spacing-xs', 'spacing-sm',
      'spacing-md', 'spacing-lg', 'spacing-xl', 'spacing-2xl', 'spacing-3xl',
    ],
    [CSS_VAR_CATEGORIES.SCROLLBAR]: [
      'scrollbar-width', 'scrollbar-width-thin', 'scrollbar-track',
      'scrollbar-thumb', 'scrollbar-thumb-hover', 'scrollbar-border-radius',
    ],
    [CSS_VAR_CATEGORIES.TYPOGRAPHY]: [
      'font-sans', 'font-serif', 'font-mono',
      'typography-button-family', 'typography-button-size', 'typography-button-weight',
      'typography-button-line-height', 'typography-button-letter-spacing',
      'typography-input-family', 'typography-input-size', 'typography-input-weight',
      'typography-input-line-height', 'typography-label-family', 'typography-label-size',
      'typography-label-weight', 'typography-label-line-height',
      'typography-heading-family', 'typography-body-family', 'typography-code-family',
    ],
    [CSS_VAR_CATEGORIES.ANIMATION]: [
      'transition-fast', 'transition-base', 'transition-slow', 'transition-theme',
    ],
    [CSS_VAR_CATEGORIES.ZINDEX]: [
      'z-dropdown', 'z-sticky', 'z-fixed', 'z-modal-backdrop',
      'z-modal', 'z-popover', 'z-tooltip', 'z-toast',
    ],
  };

  if (category) {
    return allVariables[category] || [];
  }

  return Object.values(allVariables).flat();
}

/**
 * Export a snapshot of all CSS variables
 */
export function exportCSSVariables(
  target: HTMLElement = document.documentElement
): Record<string, string> {
  const allVarNames = getAvailableVariables();
  const snapshot: Record<string, string> = {};

  allVarNames.forEach((varName) => {
    const value = getCSSVariable(varName, target);
    if (value) {
      snapshot[`--${varName}`] = value;
    }
  });

  return snapshot;
}

/**
 * Validate if a CSS variable value is valid
 */
export function isValidCSSVariableValue(value: string): boolean {
  // Check for empty values
  if (!value || value.trim() === '') return false;

  // Check for common invalid patterns
  if (value === 'initial' || value === 'inherit' || value === 'unset') return true;

  // Basic validation - could be enhanced
  return true;
}
