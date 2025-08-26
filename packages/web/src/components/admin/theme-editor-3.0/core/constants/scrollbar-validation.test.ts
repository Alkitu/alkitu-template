/**
 * Validation test for scrollbar colors precision
 */

import { DEFAULT_THEME } from './default-themes';

describe('Scrollbar Colors Validation', () => {
  test('Light mode scrollbar colors should be exact', () => {
    const lightColors = DEFAULT_THEME.lightColors;
    
    // Track should be pure white
    expect(lightColors.scrollbarTrack.hex.toUpperCase()).toBe('#FFFFFF');
    expect(lightColors.scrollbarTrack.name).toBe('Scrollbar Track');
    expect(lightColors.scrollbarTrack.oklchString).toContain('oklch(');
    
    // Thumb should be light pink
    expect(lightColors.scrollbarThumb.hex.toUpperCase()).toBe('#FFE3E3');
    expect(lightColors.scrollbarThumb.name).toBe('Scrollbar Thumb');
    expect(lightColors.scrollbarThumb.oklchString).toContain('oklch(');
  });

  test('Dark mode scrollbar colors should be exact', () => {
    const darkColors = DEFAULT_THEME.darkColors;
    
    // Track should be very dark
    expect(darkColors.scrollbarTrack.hex.toUpperCase()).toBe('#0A0A0A');
    expect(darkColors.scrollbarTrack.name).toBe('Scrollbar Track');
    expect(darkColors.scrollbarTrack.oklchString).toContain('oklch(');
    
    // Thumb should be dark gray
    expect(darkColors.scrollbarThumb.hex.toUpperCase()).toBe('#2E2929');
    expect(darkColors.scrollbarThumb.name).toBe('Scrollbar Thumb');
    expect(darkColors.scrollbarThumb.oklchString).toContain('oklch(');
  });

  test('All color tokens should have complete data structure', () => {
    const testColors = [
      DEFAULT_THEME.lightColors.scrollbarTrack,
      DEFAULT_THEME.lightColors.scrollbarThumb,
      DEFAULT_THEME.darkColors.scrollbarTrack,
      DEFAULT_THEME.darkColors.scrollbarThumb
    ];

    testColors.forEach(color => {
      // All required fields should exist
      expect(color.name).toBeDefined();
      expect(color.hex).toBeDefined();
      expect(color.oklch).toBeDefined();
      expect(color.oklchString).toBeDefined();
      expect(color.rgb).toBeDefined();
      expect(color.hsv).toBeDefined();
      
      // Format validations
      expect(color.hex).toMatch(/^#[0-9A-F]{6}$/i);
      expect(color.oklchString).toMatch(/^oklch\(\d+\.\d{4} \d+\.\d{4} \d+\.\d{2}\)$/);
      
      // Range validations
      expect(color.oklch.l).toBeGreaterThanOrEqual(0);
      expect(color.oklch.l).toBeLessThanOrEqual(1);
      expect(color.oklch.c).toBeGreaterThanOrEqual(0);
      expect(color.oklch.h).toBeGreaterThanOrEqual(0);
      expect(color.oklch.h).toBeLessThanOrEqual(360);
    });
  });

  test('OKLCH values should be scientifically precise', () => {
    const lightTrack = DEFAULT_THEME.lightColors.scrollbarTrack;
    const lightThumb = DEFAULT_THEME.lightColors.scrollbarThumb;
    
    // White should have L≈1, C≈0
    expect(lightTrack.oklch.l).toBeCloseTo(1, 2);
    expect(lightTrack.oklch.c).toBeLessThan(0.1);
    
    // Light pink should have high lightness, low chroma
    expect(lightThumb.oklch.l).toBeGreaterThan(0.9);
    expect(lightThumb.oklch.c).toBeLessThan(0.1);
  });
});