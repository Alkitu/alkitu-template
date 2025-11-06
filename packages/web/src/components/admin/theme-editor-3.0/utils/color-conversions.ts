/**
 * Color Conversion Utilities
 * Handles conversions between HEX, RGB, HSV, and OKLCH color spaces
 */

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
  c: number; // 0-0.37+
  h: number; // 0-360
}

// HEX to RGB conversion
export function hexToRgb(hex: string): RGBColor | null {
  const cleanHex = hex.replace('#', '');
  
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  
  return null;
}

// RGB to HEX conversion
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

// RGB to HSV conversion
export function rgbToHsv(rgb: RGBColor): HSVColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  let s = 0;
  const v = max;
  
  if (delta !== 0) {
    s = delta / max;
    
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    
    h *= 60;
    if (h < 0) h += 360;
  }
  
  return {
    h: parseFloat(h.toFixed(1)), // Mayor precisión en hue
    s: parseFloat((s * 100).toFixed(1)), // Mayor precisión en saturación
    v: parseFloat((v * 100).toFixed(1)) // Mayor precisión en valor
  };
}

// HSV to RGB conversion
export function hsvToRgb(hsv: HSVColor): RGBColor {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;
  
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  let r: number, g: number, b: number;
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = g = b = 0;
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// RGB to OKLCH conversion (simplified approximation)
export function rgbToOklch(rgb: RGBColor): OklchColor {
  // Convert RGB to linear RGB
  const toLinear = (c: number) => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  
  // Convert to XYZ (simplified D65)
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
  
  // Convert to OKLCH (simplified approximation)
  const l = Math.cbrt(y); // Lightness approximation
  
  // Chroma and hue calculations (simplified)
  const a = Math.cbrt(x) - l;
  const bComponent = l - Math.cbrt(z);
  
  const c = Math.sqrt(a * a + bComponent * bComponent);
  let h = Math.atan2(bComponent, a) * 180 / Math.PI;
  if (h < 0) h += 360;
  
  return {
    l: Math.max(0, Math.min(1, l)),
    c: Math.max(0, Math.min(0.4, c)),
    h: h
  };
}

// OKLCH to RGB conversion (simplified approximation)
export function oklchToRgb(oklch: OklchColor): RGBColor {
  const { l, c, h } = oklch;
  
  // Convert to XYZ (simplified approximation)
  const hRad = h * Math.PI / 180;
  const a = c * Math.cos(hRad);
  const bComponent = c * Math.sin(hRad);
  
  const x = Math.pow(l + a, 3);
  const y = Math.pow(l, 3);
  const z = Math.pow(l - bComponent, 3);
  
  // Convert XYZ to linear RGB
  let r = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
  let g = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
  let b = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;
  
  // Convert linear RGB to sRGB
  const fromLinear = (c: number) => {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };
  
  r = fromLinear(r);
  g = fromLinear(g);
  b = fromLinear(b);
  
  return {
    r: Math.round(Math.max(0, Math.min(255, r * 255))),
    g: Math.round(Math.max(0, Math.min(255, g * 255))),
    b: Math.round(Math.max(0, Math.min(255, b * 255)))
  };
}

// Convenience conversion functions
export function hexToHsv(hex: string): HSVColor | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsv(rgb) : null;
}

export function hsvToHex(hsv: HSVColor): string {
  const rgb = hsvToRgb(hsv);
  return rgbToHex(rgb);
}

export function hexToOklch(hex: string): OklchColor | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToOklch(rgb) : null;
}

export function oklchToHex(oklch: OklchColor): string {
  const rgb = oklchToRgb(oklch);
  return rgbToHex(rgb);
}

// Validation functions
export function isValidHex(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex);
}

export function isValidRgb(rgb: RGBColor): boolean {
  return rgb.r >= 0 && rgb.r <= 255 &&
         rgb.g >= 0 && rgb.g <= 255 &&
         rgb.b >= 0 && rgb.b <= 255;
}

export function isValidHsv(hsv: HSVColor): boolean {
  return hsv.h >= 0 && hsv.h <= 360 &&
         hsv.s >= 0 && hsv.s <= 100 &&
         hsv.v >= 0 && hsv.v <= 100;
}

// Format functions
export function formatHex(hex: string): string {
  const cleanHex = hex.replace('#', '').toUpperCase();
  return cleanHex.length === 3 || cleanHex.length === 6 ? `#${cleanHex}` : hex;
}

export function formatRgb(rgb: RGBColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHsv(hsv: HSVColor): string {
  return `hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)`;
}