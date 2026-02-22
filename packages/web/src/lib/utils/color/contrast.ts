/**
 * Utility functions for calculating WCAG color contrast ratios.
 */

// Parses an rgb(r, g, b) or rgba(r, g, b, a) string into an array of numbers
export function parseRgb(rgbString: string): [number, number, number] | null {
    const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (!match) return null;
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

// Calculates relative luminance given RGB values
// Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
export function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculates contrast ratio between two relative luminances
// Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color
export function getContrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Calculates contrast ratio directly from two rgb(r,g,b) strings
export function calculateContrastFromString(fgRgb: string, bgRgb: string): number | null {
    const fg = parseRgb(fgRgb);
    const bg = parseRgb(bgRgb);

    if (!fg || !bg) return null;

    const fgLuminance = getLuminance(fg[0], fg[1], fg[2]);
    const bgLuminance = getLuminance(bg[0], bg[1], bg[2]);

    return getContrastRatio(fgLuminance, bgLuminance);
}

// Checks if a contrast ratio meets WCAG AA standards (4.5 for normal text, 3.0 for large text)
export function meetsWcagAa(ratio: number, isLargeText: boolean = false): boolean {
    return ratio >= (isLargeText ? 3.0 : 4.5);
}

export function formatContrastRatio(ratio: number): string {
    return ratio.toFixed(2) + ':1';
}
