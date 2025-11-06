// WCAG Contrast Ratio Calculations
import { parseOklchString } from './css-variables';

// Convert OKLCH to RGB (no alpha channel)
function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  // Simplified OKLCH to RGB conversion
  // This is a basic approximation - for production use, consider a proper color space library
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  
  // OKLab to linear RGB
  const lrgb = l + 0.3963377774 * a + 0.2158037573 * b;
  const mrgb = l - 0.1055613458 * a - 0.0638541728 * b;
  const srgb = l - 0.0894841775 * a - 1.2914855480 * b;
  
  // Apply gamma correction
  const r = Math.pow(Math.max(0, lrgb), 2.4) * 255;
  const g = Math.pow(Math.max(0, mrgb), 2.4) * 255;
  const blue = Math.pow(Math.max(0, srgb), 2.4) * 255;
  
  return [
    Math.max(0, Math.min(255, r)),
    Math.max(0, Math.min(255, g)),
    Math.max(0, Math.min(255, blue))
  ];
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const oklch1 = parseOklchString(color1);
  const oklch2 = parseOklchString(color2);
  
  if (!oklch1 || !oklch2) return 1;
  
  const [r1, g1, b1] = oklchToRgb(oklch1.l, oklch1.c, oklch1.h);
  const [r2, g2, b2] = oklchToRgb(oklch2.l, oklch2.c, oklch2.h);
  
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Check if contrast meets WCAG standards
export function meetsWCAGStandard(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): boolean {
  if (level === 'AA') {
    return largeText ? ratio >= 3 : ratio >= 4.5;
  } else {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }
}

// Get WCAG grade for contrast ratio
export function getContrastGrade(ratio: number): {
  grade: 'AAA' | 'AA' | 'Fail';
  largeTextGrade: 'AAA' | 'AA' | 'Fail';
} {
  const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';
  const largeTextGrade = ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'Fail';
  
  return { grade, largeTextGrade };
}