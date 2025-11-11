import { ThemeRule } from '../context/providers/DynamicThemeProvider';

/**
 * Converts a hexadecimal color string to an RGB object.
 * @param hex - The hexadecimal color string (e.g., "#RRGGBB" or "RRGGBB").
 * @returns An object with r, g, and b properties, or { r: 0, g: 0, b: 0 } if invalid.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Converts an RGB object to a hexadecimal color string.
 * @param r - Red component (0-255).
 * @param g - Green component (0-255).
 * @param b - Blue component (0-255).
 * @returns A hexadecimal color string (e.g., "#RRGGBB").
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Computes a contrasting color (black or white) based on the given color.
 * Supports hex and oklch color formats.
 * @param color - The color string (hex or oklch).
 * @returns 'oklch(0 0 0)' for black or 'oklch(1 0 0)' for white.
 */
export function computeContrastColor(color: string): string {
  if (!color || color === 'transparent') return 'oklch(0 0 0)';

  if (color.includes('oklch')) {
    const match = color.match(/oklch\(\s*([0-9.]+)/);
    if (match && match[1]) {
      const lightness = parseFloat(match[1]);
      return lightness > 0.5 ? 'oklch(0 0 0)' : 'oklch(1 0 0)';
    }
  }

  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    // Calculate luminance using the W3C formula
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? 'oklch(0 0 0)' : 'oklch(1 0 0)';
  }

  // Default to white for unknown formats
  return 'oklch(1 0 0)';
}

/**
 * Generates a CSS string from a given ThemeRule.
 * @param rule - The ThemeRule object.
 * @returns A CSS string.
 */
export function generateCSSFromRule(rule: ThemeRule): string {
  const selector = rule.selector || ':root';
  const properties = Object.entries(rule.properties || {})
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `
    /* Theme Rule: ${rule.id} (${rule.specificity}) */
    ${selector} {
      ${properties}
    }
  `;
}

/**
 * Applies a set of CSS variables to a given HTML element.
 * @param element - The HTML element to apply the variables to.
 * @param variables - An object where keys are variable names (without --) and values are their CSS values.
 */
export function applyCssVariablesToElement(
  element: HTMLElement,
  variables: Record<string, string>,
): void {
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(`--${key}`, value);
  });
}

/**
 * Converts OKLCH color values to RGB.
 * @param l - Lightness (0-1 or 0-100%)
 * @param c - Chroma (0-0.4+)
 * @param h - Hue (0-360)
 * @returns RGB values as {r, g, b} with values 0-255
 */
export function oklchToRgb(
  l: number,
  c: number,
  h: number,
): { r: number; g: number; b: number } {
  // Normalize l if it's a percentage
  if (l > 1) l = l / 100;

  // Convert to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let b_rgb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b_rgb =
    b_rgb > 0.0031308
      ? 1.055 * Math.pow(b_rgb, 1 / 2.4) - 0.055
      : 12.92 * b_rgb;

  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b_rgb * 255))),
  };
}

/**
 * Converts RGB to OKLCH color values.
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns OKLCH values as {l, c, h} where l is 0-1, c is 0-0.4+, h is 0-360
 */
export function rgbToOklch(
  r: number,
  g: number,
  b: number,
): { l: number; c: number; h: number } {
  // Normalize RGB values
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Remove gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Linear RGB to OKLab
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_lab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // Convert to LCH
  const c = Math.sqrt(a * a + b_lab * b_lab);
  let h = (Math.atan2(b_lab, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return { l: L, c, h };
}

/**
 * Converts OKLCH string to hex color.
 * @param oklchString - OKLCH color string like "0.6 0.2 150" or "60% 0.2 150"
 * @returns Hex color string like "#RRGGBB"
 */
export function oklchToHex(oklchString: string): string {
  // Parse OKLCH string
  const parts = oklchString.trim().split(/\s+/);
  if (parts.length < 3) return '#000000';

  let l = parseFloat(parts[0]);
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]);

  // Handle percentage notation for lightness
  if (parts[0].includes('%')) {
    l = l / 100;
  }

  const rgb = oklchToRgb(l, c, h);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Converts hex color to OKLCH string.
 * @param hex - Hex color string like "#RRGGBB"
 * @returns OKLCH color string like "0.6 0.2 150"
 */
export function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex);
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);

  // Format as string with reasonable precision
  const l = (oklch.l * 100).toFixed(1);
  const c = oklch.c.toFixed(3);
  const h = Math.round(oklch.h);

  return `${l}% ${c} ${h}`;
}
