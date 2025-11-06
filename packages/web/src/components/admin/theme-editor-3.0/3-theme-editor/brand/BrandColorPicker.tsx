'use client';

import React, { useState, useEffect } from 'react';
import { HsvColorPicker } from '../colors/HsvColorPicker';
import { ColorToken } from '../../types/theme.types';
import { updateColorTokenFromHex } from '../../utils/color-conversions-v2';

interface BrandColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function BrandColorPicker({ color, onChange, className }: BrandColorPickerProps) {
  // Convert string color to ColorToken for HsvColorPicker
  const [colorToken, setColorToken] = useState<ColorToken>(() => {
    // Crear un token inicial basado en el color proporcionado
    const initialToken: ColorToken = {
      name: 'brand-color',
      hex: color || '#000000',
      value: color || '#000000',
      oklch: { l: 0, c: 0, h: 0 },
      oklchString: 'oklch(0 0 0)',
      rgb: { r: 0, g: 0, b: 0 },
      hsv: { h: 0, s: 0, v: 0 }
    };
    // Actualizar con los valores correctos del color
    return updateColorTokenFromHex(initialToken, color || '#000000');
  });

  // Update ColorToken when color prop changes
  useEffect(() => {
    // Solo actualizar si el color realmente cambió
    if (color && color !== colorToken.hex) {
      const newColorToken = updateColorTokenFromHex(colorToken, color);
      setColorToken(newColorToken);
    }
  }, [color]);

  // Handle color changes from HsvColorPicker
  const handleColorTokenChange = (newColorToken: ColorToken) => {
    setColorToken(newColorToken);
    onChange(newColorToken.hex);
  };

  return (
    <HsvColorPicker
      colorToken={colorToken}
      onChange={handleColorTokenChange}
      className={className}
    />
  );
}