import { oklch, formatHex } from 'culori';

/**
 * Generates a dynamic background color that contrasts with the given foreground color.
 * Maintains the same hue but adjusts lightness and chroma.
 * 
 * @param hexColor The foreground color in hex format
 * @returns A hex color string for the background
 */
export function getDynamicBackgroundColor(hexColor: string): string {
    // Convert hex to OKLCH
    const color = oklch(hexColor);
    
    // Fallback to gray-100 if invalid or undefined
    if (!color) return '#f3f4f6';

    // Check lightness (0-1)
    // Threshold adjusted to 0.8 to handle very light colors
    const isLight = (color.l || 0) > 0.8;

    const bg = { ...color };

    if (isLight) {
        // Foreground is very light -> Background should be dark
        bg.l = 0.15; // Dark
        // Slightly reduce chroma to avoid neon backgrounds
        bg.c = (bg.c || 0) * 0.8;
    } else {
        // Foreground is dark/normal -> Background should be very light
        bg.l = 0.96; // Very light
        // Cap chroma to ensure it's a pastel tint, not too saturated
        bg.c = Math.min((bg.c || 0), 0.05); 
    }

    return formatHex(bg) || '#f3f4f6';
}
