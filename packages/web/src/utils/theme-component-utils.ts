import React from 'react';
import { formatHex, formatCss, oklch, converter, formatRgb, parse } from 'culori';

export interface ComponentThemeProps {
  themeOverride?: Record<string, string>;
  variant?: string;
}

export const applyThemeOverride = (
  baseClasses: string,
  themeOverride?: Record<string, string>,
  componentName?: string
): { className: string; style?: React.CSSProperties } => {
  if (!themeOverride) {
    return { className: baseClasses };
  }

  // Generate scoped CSS variables for this component instance
  const scopedVars: React.CSSProperties = {};
  const scopePrefix = componentName ? `${componentName}-` : '';
  
  Object.entries(themeOverride).forEach(([key, value]) => {
    const cssVar = key.startsWith('--') ? key : `--${scopePrefix}${key}`;
    scopedVars[cssVar as any] = value;
  });

  return {
    className: baseClasses,
    style: scopedVars
  };
};

// Utility for conditional theme classes
export const themeVariant = (
  variants: Record<string, string>,
  activeVariant: string,
  fallback: string = ''
): string => {
  return variants[activeVariant] || fallback;
};

// Generate dynamic class names with theme support
export const themeAwareClass = (
  baseClass: string,
  themeModifier?: string
): string => {
  if (!themeModifier) return baseClass;
  return `${baseClass} ${baseClass}--${themeModifier}`;
};

// Convert OKLCH to hex (using culori)
export const oklchToHex = (oklchString: string): string => {
  try {
    const color = oklch(oklchString);
    if (!color) return '#000000';
    return formatHex(color) || '#000000';
  } catch {
    return '#000000';
  }
};

// Check if a color string is valid OKLCH
export const isValidOklch = (value: string): boolean => {
  try {
    const color = oklch(value);
    return color !== undefined && color.mode === 'oklch';
  } catch {
    return false;
  }
};

// Parse OKLCH string to components (using culori)
export const parseOklch = (value: string): { l: number; c: number; h: number } | null => {
  try {
    const color = oklch(value);
    if (!color || color.mode !== 'oklch') return null;

    return {
      l: color.l ?? 0,
      c: color.c ?? 0,
      h: color.h ?? 0,
    };
  } catch {
    return null;
  }
};

// Mix two OKLCH colors (using culori interpolation)
export const mixOklch = (color1: string, color2: string, amount: number = 0.5): string => {
  try {
    const oklchConverter = converter('oklch');
    const c1 = oklchConverter(color1);
    const c2 = oklchConverter(color2);

    if (!c1 || !c2) return color1;

    // Linear interpolation in OKLCH space
    const mixed = {
      mode: 'oklch' as const,
      l: (c1.l ?? 0) * (1 - amount) + (c2.l ?? 0) * amount,
      c: (c1.c ?? 0) * (1 - amount) + (c2.c ?? 0) * amount,
      h: (c1.h ?? 0) * (1 - amount) + (c2.h ?? 0) * amount,
    };

    return formatCss(mixed);
  } catch {
    return color1;
  }
};

// Generate color variants (using culori)
export const generateColorVariants = (baseColor: string) => {
  try {
    const color = oklch(baseColor);
    if (!color || color.mode !== 'oklch') return {};

    const l = color.l ?? 0.5;
    const c = color.c ?? 0.1;
    const h = color.h ?? 0;

    const createVariant = (lightness: number, chromaMultiplier: number = 1) => {
      const variant = {
        mode: 'oklch' as const,
        l: Math.max(0, Math.min(1, lightness)),
        c: Math.max(0, c * chromaMultiplier),
        h,
      };
      return formatCss(variant);
    };

    return {
      '50': createVariant(Math.min(0.98, l + 0.35), 0.2),
      '100': createVariant(Math.min(0.95, l + 0.30), 0.3),
      '200': createVariant(Math.min(0.90, l + 0.25), 0.4),
      '300': createVariant(Math.min(0.85, l + 0.15), 0.6),
      '400': createVariant(Math.min(0.75, l + 0.05), 0.8),
      '500': baseColor,
      '600': createVariant(Math.max(0.10, l - 0.10), 1.0),
      '700': createVariant(Math.max(0.08, l - 0.20), 0.9),
      '800': createVariant(Math.max(0.06, l - 0.30), 0.8),
      '900': createVariant(Math.max(0.04, l - 0.40), 0.7),
    };
  } catch {
    return {};
  }
};

// Convert any color format to OKLCH
export const toOklch = (color: string): string | null => {
  try {
    const parsed = parse(color);
    if (!parsed) return null;

    const oklchConverter = converter('oklch');
    const oklchColor = oklchConverter(parsed);

    if (!oklchColor) return null;
    return formatCss(oklchColor);
  } catch {
    return null;
  }
};

// Convert OKLCH to RGB
export const oklchToRgb = (oklchString: string): string | null => {
  try {
    const color = oklch(oklchString);
    if (!color) return null;
    return formatRgb(color) || null;
  } catch {
    return null;
  }
};

// Adjust lightness of an OKLCH color
export const adjustLightness = (color: string, amount: number): string => {
  try {
    const oklchConverter = converter('oklch');
    const oklchColor = oklchConverter(color);

    if (!oklchColor) return color;

    const adjusted = {
      mode: 'oklch' as const,
      l: Math.max(0, Math.min(1, (oklchColor.l ?? 0) + amount)),
      c: oklchColor.c ?? 0,
      h: oklchColor.h ?? 0,
    };

    return formatCss(adjusted);
  } catch {
    return color;
  }
};

// Adjust chroma (saturation) of an OKLCH color
export const adjustChroma = (color: string, amount: number): string => {
  try {
    const oklchConverter = converter('oklch');
    const oklchColor = oklchConverter(color);

    if (!oklchColor) return color;

    const adjusted = {
      mode: 'oklch' as const,
      l: oklchColor.l ?? 0,
      c: Math.max(0, (oklchColor.c ?? 0) + amount),
      h: oklchColor.h ?? 0,
    };

    return formatCss(adjusted);
  } catch {
    return color;
  }
};

// Get contrasting text color (black or white) for a background color
export const getContrastingTextColor = (backgroundColor: string): string => {
  try {
    const oklchConverter = converter('oklch');
    const color = oklchConverter(backgroundColor);

    if (!color) return 'oklch(0 0 0)'; // black

    const lightness = color.l ?? 0.5;

    // Use white text for dark backgrounds, black for light backgrounds
    // Threshold at 0.6 lightness
    return lightness > 0.6
      ? 'oklch(0 0 0)' // black
      : 'oklch(1 0 0)'; // white
  } catch {
    return 'oklch(0 0 0)'; // black
  }
};