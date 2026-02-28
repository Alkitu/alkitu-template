'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TypographyElements, DEFAULT_TYPOGRAPHY } from './types';
import { applyTypographyElements } from '../../../lib/utils/css/css-variables';

interface UseTypographyStateOptions {
  initialTypography?: TypographyElements;
  onTypographyChange?: (typography: TypographyElements) => void;
}

export function useTypographyState(options?: UseTypographyStateOptions) {
  const [typography, setTypography] = useState<TypographyElements>(() => ({
    ...DEFAULT_TYPOGRAPHY,
    ...(options?.initialTypography || {}),
  }));

  // Sync local state when the loaded theme changes (e.g., user switches themes)
  const prevInitialRef = useRef(options?.initialTypography);
  useEffect(() => {
    if (options?.initialTypography && options.initialTypography !== prevInitialRef.current) {
      prevInitialRef.current = options.initialTypography;
      setTypography(prev => ({
        ...DEFAULT_TYPOGRAPHY,
        ...options.initialTypography,
      }));
    }
  }, [options?.initialTypography]);

  // Apply changes to CSS whenever typography changes
  useEffect(() => {
    applyTypographyElements(typography);
  }, [typography]);

  // Update a specific element
  const updateElement = useCallback((elementKey: keyof TypographyElements, updates: Partial<TypographyElements[keyof TypographyElements]>) => {
    setTypography(prev => {
      const next = {
        ...prev,
        [elementKey]: {
          ...prev[elementKey],
          ...updates
        }
      };
      options?.onTypographyChange?.(next);
      return next;
    });
  }, [options]);

  // Update a specific property of an element
  const updateElementProperty = useCallback((
    elementKey: keyof TypographyElements,
    property: keyof TypographyElements[keyof TypographyElements],
    value: string
  ) => {
    setTypography(prev => {
      const next = {
        ...prev,
        [elementKey]: {
          ...prev[elementKey],
          [property]: value
        }
      };
      options?.onTypographyChange?.(next);
      return next;
    });
  }, [options]);

  return {
    typography,
    setTypography,
    updateElement,
    updateElementProperty
  };
}