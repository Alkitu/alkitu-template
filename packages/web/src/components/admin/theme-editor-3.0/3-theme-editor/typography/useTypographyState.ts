'use client';

import { useState, useEffect, useCallback } from 'react';
import { TypographyElements, DEFAULT_TYPOGRAPHY } from './types';
import { applyTypographyElements } from '../../utils/css-variables';

export function useTypographyState() {
  const [typography, setTypography] = useState<TypographyElements>(DEFAULT_TYPOGRAPHY);

  // Apply changes to CSS whenever typography changes
  useEffect(() => {
    applyTypographyElements(typography);
  }, [typography]);

  // Update a specific element
  const updateElement = useCallback((elementKey: keyof TypographyElements, updates: Partial<TypographyElements[keyof TypographyElements]>) => {
    setTypography(prev => ({
      ...prev,
      [elementKey]: {
        ...prev[elementKey],
        ...updates
      }
    }));
  }, []);

  // Update a specific property of an element
  const updateElementProperty = useCallback((
    elementKey: keyof TypographyElements, 
    property: keyof TypographyElements[keyof TypographyElements], 
    value: string
  ) => {
    setTypography(prev => ({
      ...prev,
      [elementKey]: {
        ...prev[elementKey],
        [property]: value
      }
    }));
  }, []);

  return {
    typography,
    setTypography,
    updateElement,
    updateElementProperty
  };
}