'use client';

import React, { useEffect } from 'react';
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



  // Apply initial typography elements on component mount
  useEffect(() => {
    applyTypographyElements(DEFAULT_TYPOGRAPHY);
  }, []);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* New Typography Elements Section */}
      <TypographySection />


    </div>
  );
}

// Re-export new components
export { TypographySection } from './TypographySection';
export { TypographyElementEditor } from './TypographyElementEditor';
export type { TypographyElements, TypographyElement } from './types';