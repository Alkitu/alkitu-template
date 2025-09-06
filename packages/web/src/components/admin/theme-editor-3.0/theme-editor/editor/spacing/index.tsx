'use client';

import React, { useEffect } from 'react';
import { Separator } from '../../../design-system/primitives/separator';
import { ThemeSpacing } from '../../../core/types/theme.types';
import { SpacingController } from './SpacingController';
import { applySpacingElements } from '../../../lib/utils/css/css-variables';

interface SpacingEditorProps {
  spacing: ThemeSpacing;
  onSpacingChange: (spacing: ThemeSpacing) => void;
  className?: string;
}

export function SpacingEditor({ 
  spacing, 
  onSpacingChange, 
  className = ""
}: SpacingEditorProps) {

  // Default spacing scale if not provided
  const defaultScale = {
    'small': '1rem',    // 16px
    'medium': '1.3rem', // ~21px
    'large': '2rem'     // 32px
  };

  const currentScale = spacing?.scale || defaultScale;

  // Apply spacing to CSS variables whenever spacing changes
  useEffect(() => {
    applySpacingElements(currentScale);
  }, [spacing, currentScale]);

  // Handle spacing value change
  const handleSpacingChange = (spacingKey: string, value: string) => {
    const updatedSpacing = {
      ...spacing,
      scale: {
        ...currentScale,
        [spacingKey]: value
      }
    };
    onSpacingChange(updatedSpacing);
  };

  // Define the 3 main spacing sizes
  const spacingSizes = [
    {
      key: 'small',
      title: 'Small',
      description: 'Small spacing for tight layouts',
      defaultValue: '1rem' // 16px
    },
    {
      key: 'medium', 
      title: 'Medium',
      description: 'Medium spacing for standard layouts',
      defaultValue: '1.3rem' // ~21px
    },
    {
      key: 'large',
      title: 'Large', 
      description: 'Large spacing for wide layouts',
      defaultValue: '2rem' // 32px
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {spacingSizes.map((size, index) => {
        const value = currentScale[size.key] || size.defaultValue;
        const label = `${size.title} Spacing`;
        const description = `--spacing-${size.key}`;

        return (
          <div key={size.key}>
            <SpacingController
              label={label}
              description={description}
              value={value}
              spacingKey={size.key}
              onValueChange={(newValue) => handleSpacingChange(size.key, newValue)}
            />
            
            {/* SEPARATOR between spacing sizes */}
            {index < spacingSizes.length - 1 && (
              <Separator className="my-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}