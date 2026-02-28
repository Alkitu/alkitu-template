'use client';

import React, { useEffect, useCallback } from 'react';
import { ThemeTypography } from '../../../core/types/theme.types';
import { TypographySection } from './TypographySection';
import { DEFAULT_TYPOGRAPHY, TypographyElements } from './types';
import { applyTypographyElements } from '../../../lib/utils/css/css-variables';

interface TypographyEditorProps {
  typography: ThemeTypography;
  onTypographyChange: (typography: ThemeTypography) => void;
  className?: string;
}


export function TypographyEditor({
  typography,
  onTypographyChange,
  className = ""
}: TypographyEditorProps) {

  // Safety check - provide default values if typography is undefined/null
  if (!typography) {
    console.warn('Typography is undefined, using fallback');
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center p-8 text-muted-foreground">
          Typography data is not available. Please check the theme configuration.
        </div>
      </div>
    );
  }

  // Bridge TypographyElements → ThemeTypography for the context/DB pipeline.
  // The DB typography JSON field stores element-level data (h1, h2, etc.)
  // which is loaded back and merged with DEFAULT_TYPOGRAPHY on load.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleElementsChange = useCallback((elements: TypographyElements) => {
    onTypographyChange(elements as unknown as ThemeTypography);
  }, [onTypographyChange]);

  // Derive initial TypographyElements from the typography prop.
  // The DB may store either ThemeTypography (legacy) or TypographyElements (new format).
  // If the prop has element keys (h1, h2, etc.), use them; otherwise fall back to defaults.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const initialElements = React.useMemo(() => {
    const typo = typography as unknown as Record<string, unknown>;
    // Check if the typography data contains element-level keys (new format)
    if (typo && ('h1' in typo || 'paragraph' in typo)) {
      return { ...DEFAULT_TYPOGRAPHY, ...typo } as TypographyElements;
    }
    return DEFAULT_TYPOGRAPHY;
  }, [typography]);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* New Typography Elements Section */}
      <TypographySection initialTypography={initialElements} onTypographyChange={handleElementsChange} />


    </div>
  );
}

// Re-export new components
export { TypographySection } from './TypographySection';
export { TypographyElementEditor } from './TypographyElementEditor';
export type { TypographyElements, TypographyElement } from './types';