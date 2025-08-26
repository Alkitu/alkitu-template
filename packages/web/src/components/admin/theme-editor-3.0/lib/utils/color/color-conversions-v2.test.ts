/**
 * Tests for Precise Color Conversions V2
 * Validates bidirectional conversion accuracy using Culori
 */

import { 
  createPreciseColorToken,
  updateColorTokenFromHex,
  updateColorTokenFromRgb,
  updateColorTokenFromHsv,
  updateColorTokenFromOklch,
  isValidHex,
  isValidRgb,
  isValidHsv,
  isValidOklch,
  type RGBColor,
  type HSVColor,
  type OklchColor
} from './color-conversions-v2';

describe('Bidirectional Color Conversion Precision', () => {
  
  describe('HEX Conversions', () => {
    test('HEX → OKLCH → HEX should be exact', () => {
      const testColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
      
      testColors.forEach(originalHex => {
        const token = createPreciseColorToken('test', originalHex);
        expect(token.hex.toLowerCase()).toBe(originalHex.toLowerCase());
      });
    });

    test('HEX → RGB → HEX should be exact', () => {
      const originalHex = '#3b82f6';
      const token = createPreciseColorToken('test', originalHex);
      const roundTripToken = updateColorTokenFromRgb(token, token.rgb);
      
      expect(roundTripToken.hex.toLowerCase()).toBe(originalHex.toLowerCase());
    });

    test('HEX → HSV → HEX should be precise', () => {
      const originalHex = '#3b82f6';
      const token = createPreciseColorToken('test', originalHex);
      const roundTripToken = updateColorTokenFromHsv(token, token.hsv);
      
      // Allow for minimal rounding differences
      expect(roundTripToken.hex.toLowerCase()).toBe(originalHex.toLowerCase());
    });
  });

  describe('RGB Conversions', () => {
    test('RGB values should be integers 0-255', () => {
      const token = createPreciseColorToken('test', '#3b82f6');
      
      expect(Number.isInteger(token.rgb.r)).toBe(true);
      expect(Number.isInteger(token.rgb.g)).toBe(true);
      expect(Number.isInteger(token.rgb.b)).toBe(true);
      expect(token.rgb.r).toBeGreaterThanOrEqual(0);
      expect(token.rgb.r).toBeLessThanOrEqual(255);
    });

    test('RGB → OKLCH → RGB should be precise', () => {
      const originalRgb: RGBColor = { r: 59, g: 130, b: 246 };
      const token = updateColorTokenFromRgb({
        name: 'test', hex: '#000000', oklch: { l: 0, c: 0, h: 0 }, 
        oklchString: '', rgb: { r: 0, g: 0, b: 0 }, hsv: { h: 0, s: 0, v: 0 }
      }, originalRgb);
      
      expect(token.rgb.r).toBe(originalRgb.r);
      expect(token.rgb.g).toBe(originalRgb.g);
      expect(token.rgb.b).toBe(originalRgb.b);
    });
  });

  describe('OKLCH Conversions', () => {
    test('OKLCH should be the source of truth', () => {
      const originalOklch: OklchColor = { l: 0.6221, c: 0.1895, h: 260.13 };
      const token = createPreciseColorToken('test', originalOklch);
      
      expect(token.oklch.l).toBeCloseTo(originalOklch.l, 3);
      expect(token.oklch.c).toBeCloseTo(originalOklch.c, 3);
      expect(token.oklch.h).toBeCloseTo(originalOklch.h, 1);
    });

    test('OKLCH string format should be correct', () => {
      const token = createPreciseColorToken('test', '#3b82f6');
      
      expect(token.oklchString).toMatch(/^oklch\(\d+\.\d{4} \d+\.\d{4} \d+\.\d{2}\)$/);
      expect(token.oklchString).toContain('oklch(');
      expect(token.oklchString).toContain(')');
    });
  });

  describe('Validation Functions', () => {
    test('isValidHex should correctly validate hex colors', () => {
      expect(isValidHex('#3b82f6')).toBe(true);
      expect(isValidHex('#fff')).toBe(true);
      expect(isValidHex('3b82f6')).toBe(true);
      expect(isValidHex('#gggggg')).toBe(false);
      expect(isValidHex('#3b82f')).toBe(false);
    });

    test('isValidRgb should correctly validate RGB values', () => {
      expect(isValidRgb({ r: 59, g: 130, b: 246 })).toBe(true);
      expect(isValidRgb({ r: 0, g: 0, b: 0 })).toBe(true);
      expect(isValidRgb({ r: 255, g: 255, b: 255 })).toBe(true);
      expect(isValidRgb({ r: -1, g: 130, b: 246 })).toBe(false);
      expect(isValidRgb({ r: 59, g: 256, b: 246 })).toBe(false);
    });

    test('isValidHsv should correctly validate HSV values', () => {
      expect(isValidHsv({ h: 220, s: 76, v: 96 })).toBe(true);
      expect(isValidHsv({ h: 0, s: 0, v: 0 })).toBe(true);
      expect(isValidHsv({ h: 360, s: 100, v: 100 })).toBe(true);
      expect(isValidHsv({ h: -1, s: 76, v: 96 })).toBe(false);
      expect(isValidHsv({ h: 220, s: 101, v: 96 })).toBe(false);
    });

    test('isValidOklch should correctly validate OKLCH values', () => {
      expect(isValidOklch({ l: 0.6221, c: 0.1895, h: 260.13 })).toBe(true);
      expect(isValidOklch({ l: 0, c: 0, h: 0 })).toBe(true);
      expect(isValidOklch({ l: 1, c: 0.4, h: 360 })).toBe(true);
      expect(isValidOklch({ l: -0.1, c: 0.1895, h: 260.13 })).toBe(false);
      expect(isValidOklch({ l: 0.6221, c: 0.6, h: 260.13 })).toBe(false);
    });
  });

  describe('Scrollbar Colors Precision', () => {
    test('Scrollbar light colors should be exact', () => {
      const trackToken = createPreciseColorToken('Scrollbar Track', '#ffffff');
      const thumbToken = createPreciseColorToken('Scrollbar Thumb', '#FFE3E3');
      
      expect(trackToken.hex.toUpperCase()).toBe('#FFFFFF');
      expect(thumbToken.hex.toUpperCase()).toBe('#FFE3E3');
    });

    test('Scrollbar dark colors should be exact', () => {
      const trackToken = createPreciseColorToken('Scrollbar Track', '#0A0A0A');
      const thumbToken = createPreciseColorToken('Scrollbar Thumb', '#2E2929');
      
      expect(trackToken.hex.toUpperCase()).toBe('#0A0A0A');
      expect(thumbToken.hex.toUpperCase()).toBe('#2E2929');
    });
  });

  describe('Performance Tests', () => {
    test('Color conversion should be fast', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        createPreciseColorToken('Test', `hsl(${i % 360}, 50%, 50%)`);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete 1000 conversions in under 100ms
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    test('Should handle pure black and white correctly', () => {
      const blackToken = createPreciseColorToken('Black', '#000000');
      const whiteToken = createPreciseColorToken('White', '#ffffff');
      
      expect(blackToken.hex.toUpperCase()).toBe('#000000');
      expect(whiteToken.hex.toUpperCase()).toBe('#FFFFFF');
      expect(blackToken.oklch.l).toBeCloseTo(0, 2);
      expect(whiteToken.oklch.l).toBeCloseTo(1, 2);
    });

    test('Should handle pure colors correctly', () => {
      const redToken = createPreciseColorToken('Red', '#ff0000');
      const greenToken = createPreciseColorToken('Green', '#00ff00');
      const blueToken = createPreciseColorToken('Blue', '#0000ff');
      
      expect(redToken.hex.toUpperCase()).toBe('#FF0000');
      expect(greenToken.hex.toUpperCase()).toBe('#00FF00');
      expect(blueToken.hex.toUpperCase()).toBe('#0000FF');
    });
  });
});