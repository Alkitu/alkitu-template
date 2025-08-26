/**
 * Color Conversions V2 - Precise conversions using Culori
 * Provides scientifically accurate bidirectional color conversions
 */

import { 
  oklch, 
  rgb, 
  hsv, 
  formatHex, 
  formatRgb
} from 'culori';
import type { Oklch, Rgb, Hsv } from 'culori';

// Enhanced interfaces for precise color handling
export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface OklchColor {
  l: number; // 0-1
  c: number; // 0-0.4+
  h: number; // 0-360
}

export interface PreciseColorToken {
  name: string;
  hex: string;           // Display principal
  oklch: OklchColor;     // Fuente de verdad
  oklchString: string;   // Para mostrar en UI
  rgb: RGBColor;         // Para inputs RGB
  hsv: HSVColor;         // Para color picker
  description?: string;
  linkedTo?: string;     // Name of the parent color this is linked to
  linkedColors?: string[]; // Names of colors that are linked to this color
}

/**
 * Creates a precise color token from any color input
 * Uses OKLCH as source of truth for all conversions
 */
export function createPreciseColorToken(
  name: string, 
  inputColor: string | OklchColor,
  description?: string
): PreciseColorToken {
  // Convert input to Culori OKLCH
  const oklchColor: Oklch = typeof inputColor === 'string' 
    ? oklch(inputColor)! 
    : oklch({ mode: 'oklch', ...inputColor })!;
    
  // Convert to other color spaces using Culori
  const rgbColor: Rgb = rgb(oklchColor)!;
  const hsvColor: Hsv = hsv(oklchColor)!;
  
  const oklchString = `oklch(${(oklchColor.l || 0).toFixed(4)} ${(oklchColor.c || 0).toFixed(4)} ${(oklchColor.h || 0).toFixed(2)})`;
  
  return {
    name,
    hex: formatHex(oklchColor),
    oklch: {
      l: Math.min(1, Math.max(0, oklchColor.l || 0)), // Clamp to valid range
      c: Math.max(0, oklchColor.c || 0),
      h: oklchColor.h || 0
    },
    oklchString,
    rgb: {
      r: Math.round((rgbColor.r || 0) * 255),
      g: Math.round((rgbColor.g || 0) * 255),
      b: Math.round((rgbColor.b || 0) * 255)
    },
    hsv: {
      h: hsvColor.h || 0,
      s: (hsvColor.s || 0) * 100,
      v: (hsvColor.v || 0) * 100
    },
    description,
    value: oklchString // Legacy compatibility
  } as any;
}

/**
 * Updates a color token from HEX input (user typing)
 */
export function updateColorTokenFromHex(
  existingToken: PreciseColorToken,
  hexValue: string
): PreciseColorToken {
  const newToken = createPreciseColorToken(
    existingToken.name, 
    hexValue, 
    existingToken.description
  );
  
  // Preserve linking properties
  return {
    ...newToken,
    linkedTo: existingToken.linkedTo,
    linkedColors: existingToken.linkedColors
  };
}

/**
 * Updates a color token from RGB input
 */
export function updateColorTokenFromRgb(
  existingToken: PreciseColorToken,
  rgbValue: RGBColor
): PreciseColorToken {
  const hexValue = `#${rgbValue.r.toString(16).padStart(2, '0')}${rgbValue.g.toString(16).padStart(2, '0')}${rgbValue.b.toString(16).padStart(2, '0')}`;
  const newToken = createPreciseColorToken(
    existingToken.name, 
    hexValue, 
    existingToken.description
  );
  
  // Preserve linking properties
  return {
    ...newToken,
    linkedTo: existingToken.linkedTo,
    linkedColors: existingToken.linkedColors
  };
}

/**
 * Updates a color token from HSV input
 */
export function updateColorTokenFromHsv(
  existingToken: PreciseColorToken,
  hsvValue: HSVColor
): PreciseColorToken {
  // Convert HSV to Culori format
  const culoriHsv: Hsv = {
    mode: 'hsv',
    h: hsvValue.h,
    s: hsvValue.s / 100,
    v: hsvValue.v / 100
  };
  
  const hexValue = formatHex(culoriHsv);
  const newToken = createPreciseColorToken(
    existingToken.name, 
    hexValue, 
    existingToken.description
  );
  
  // Preserve linking properties
  return {
    ...newToken,
    linkedTo: existingToken.linkedTo,
    linkedColors: existingToken.linkedColors
  };
}

/**
 * Updates a color token from OKLCH input
 */
export function updateColorTokenFromOklch(
  existingToken: PreciseColorToken,
  oklchValue: OklchColor
): PreciseColorToken {
  const newToken = createPreciseColorToken(
    existingToken.name, 
    oklchValue, 
    existingToken.description
  );
  
  // Preserve linking properties
  return {
    ...newToken,
    linkedTo: existingToken.linkedTo,
    linkedColors: existingToken.linkedColors
  };
}

/**
 * Validates if a HEX color is valid
 */
export function isValidHex(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex);
}

/**
 * Validates if RGB values are valid
 */
export function isValidRgb(rgb: RGBColor): boolean {
  return rgb.r >= 0 && rgb.r <= 255 &&
         rgb.g >= 0 && rgb.g <= 255 &&
         rgb.b >= 0 && rgb.b <= 255;
}

/**
 * Validates if HSV values are valid
 */
export function isValidHsv(hsv: HSVColor): boolean {
  return hsv.h >= 0 && hsv.h <= 360 &&
         hsv.s >= 0 && hsv.s <= 100 &&
         hsv.v >= 0 && hsv.v <= 100;
}

/**
 * Validates if OKLCH values are valid
 */
export function isValidOklch(oklch: OklchColor): boolean {
  return oklch.l >= 0 && oklch.l <= 1 &&
         oklch.c >= 0 && oklch.c <= 0.5 && // More generous chroma limit
         oklch.h >= 0 && oklch.h <= 360;
}

/**
 * Format functions for display
 */
export function formatHexDisplay(hex: string): string {
  return hex.toUpperCase();
}

export function formatRgbDisplay(rgb: RGBColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHsvDisplay(hsv: HSVColor): string {
  return `hsv(${hsv.h.toFixed(1)}°, ${hsv.s.toFixed(1)}%, ${hsv.v.toFixed(1)}%)`;
}

export function formatOklchDisplay(oklch: OklchColor): string {
  return `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(2)})`;
}

// Legacy compatibility exports (deprecated)
export const hexToRgb = (hex: string): RGBColor | null => {
  try {
    const token = createPreciseColorToken('temp', hex);
    return token.rgb;
  } catch {
    return null;
  }
};

export const rgbToHex = (rgb: RGBColor): string => {
  const token = updateColorTokenFromRgb({ 
    name: 'temp', 
    hex: '#000000', 
    oklch: { l: 0, c: 0, h: 0 }, 
    oklchString: '', 
    rgb: { r: 0, g: 0, b: 0 }, 
    hsv: { h: 0, s: 0, v: 0 } 
  }, rgb);
  return token.hex;
};

export const hsvToRgb = (hsv: HSVColor): RGBColor => {
  const token = updateColorTokenFromHsv({ 
    name: 'temp', 
    hex: '#000000', 
    oklch: { l: 0, c: 0, h: 0 }, 
    oklchString: '', 
    rgb: { r: 0, g: 0, b: 0 }, 
    hsv: { h: 0, s: 0, v: 0 } 
  }, hsv);
  return token.rgb;
};

export const rgbToHsv = (rgb: RGBColor): HSVColor => {
  const token = updateColorTokenFromRgb({ 
    name: 'temp', 
    hex: '#000000', 
    oklch: { l: 0, c: 0, h: 0 }, 
    oklchString: '', 
    rgb: { r: 0, g: 0, b: 0 }, 
    hsv: { h: 0, s: 0, v: 0 } 
  }, rgb);
  return token.hsv;
};

export const hsvToHex = (hsv: HSVColor): string => {
  const token = updateColorTokenFromHsv({ 
    name: 'temp', 
    hex: '#000000', 
    oklch: { l: 0, c: 0, h: 0 }, 
    oklchString: '', 
    rgb: { r: 0, g: 0, b: 0 }, 
    hsv: { h: 0, s: 0, v: 0 } 
  }, hsv);
  return token.hex;
};

export const oklchToHex = (oklch: OklchColor): string => {
  const token = createPreciseColorToken('temp', oklch);
  return token.hex;
};

export const hexToOklch = (hex: string): OklchColor | null => {
  try {
    const token = createPreciseColorToken('temp', hex);
    return token.oklch;
  } catch {
    return null;
  }
};

export const oklchToRgb = (oklch: OklchColor): RGBColor => {
  const token = createPreciseColorToken('temp', oklch);
  return token.rgb;
};

export const rgbToOklch = (rgb: RGBColor): OklchColor => {
  const token = updateColorTokenFromRgb({ 
    name: 'temp', 
    hex: '#000000', 
    oklch: { l: 0, c: 0, h: 0 }, 
    oklchString: '', 
    rgb: { r: 0, g: 0, b: 0 }, 
    hsv: { h: 0, s: 0, v: 0 } 
  }, rgb);
  return token.oklch;
};