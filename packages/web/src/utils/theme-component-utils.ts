import React from 'react';

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

// Convert OKLCH to hex (for compatibility)
export const oklchToHex = (oklch: string): string => {
  // This is a simplified conversion - in production use a proper color library
  const match = oklch.match(/oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/);
  if (!match) return '#000000';
  
  const [, l, c, h] = match.map(Number);
  
  // Simplified conversion (placeholder)
  // In real implementation, use a library like 'culori'
  const lightness = l * 100;
  const hex = Math.round(lightness * 2.55).toString(16).padStart(2, '0');
  return `#${hex}${hex}${hex}`;
};

// Check if a color string is valid OKLCH
export const isValidOklch = (value: string): boolean => {
  return /^oklch\(\s*[\d.]+\s+[\d.]+\s+[\d.]+\s*\)$/.test(value);
};

// Parse OKLCH string to components
export const parseOklch = (value: string): { l: number; c: number; h: number } | null => {
  const match = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) return null;
  
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
  };
};

// Mix two OKLCH colors
export const mixOklch = (color1: string, color2: string, amount: number = 0.5): string => {
  const c1 = parseOklch(color1);
  const c2 = parseOklch(color2);
  
  if (!c1 || !c2) return color1;
  
  const mixed = {
    l: c1.l * (1 - amount) + c2.l * amount,
    c: c1.c * (1 - amount) + c2.c * amount,
    h: c1.h * (1 - amount) + c2.h * amount,
  };
  
  return `oklch(${mixed.l.toFixed(4)} ${mixed.c.toFixed(4)} ${mixed.h.toFixed(1)})`;
};

// Generate color variants
export const generateColorVariants = (baseColor: string) => {
  const parsed = parseOklch(baseColor);
  if (!parsed) return {};
  
  return {
    '50': `oklch(${Math.min(0.98, parsed.l + 0.35)} ${parsed.c * 0.2} ${parsed.h})`,
    '100': `oklch(${Math.min(0.95, parsed.l + 0.30)} ${parsed.c * 0.3} ${parsed.h})`,
    '200': `oklch(${Math.min(0.90, parsed.l + 0.25)} ${parsed.c * 0.4} ${parsed.h})`,
    '300': `oklch(${Math.min(0.85, parsed.l + 0.15)} ${parsed.c * 0.6} ${parsed.h})`,
    '400': `oklch(${Math.min(0.75, parsed.l + 0.05)} ${parsed.c * 0.8} ${parsed.h})`,
    '500': baseColor,
    '600': `oklch(${Math.max(0.10, parsed.l - 0.10)} ${parsed.c} ${parsed.h})`,
    '700': `oklch(${Math.max(0.08, parsed.l - 0.20)} ${parsed.c * 0.9} ${parsed.h})`,
    '800': `oklch(${Math.max(0.06, parsed.l - 0.30)} ${parsed.c * 0.8} ${parsed.h})`,
    '900': `oklch(${Math.max(0.04, parsed.l - 0.40)} ${parsed.c * 0.7} ${parsed.h})`,
  };
};