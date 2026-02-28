'use client';

import React, { useEffect } from 'react';
import { Separator } from '@/components/primitives/ui/separator';
import { ThemeShadows } from '../../../core/types/theme.types';
import { ShadowController } from './ShadowController';
import { applyShadowElements } from '../../../lib/utils/css/css-variables';

interface ShadowsEditorProps {
  shadows: ThemeShadows;
  onShadowsChange: (shadows: ThemeShadows) => void;
  className?: string;
}

export function ShadowsEditor({ 
  shadows, 
  onShadowsChange, 
  className = ""
}: ShadowsEditorProps) {

  // Apply shadows to CSS variables whenever shadows change
  useEffect(() => {
    applyShadowElements(shadows as unknown as Record<string, string>);
  }, [shadows]);

  // Handle shadow value change
  const handleShadowChange = (shadowKey: string, value: string) => {
    const updatedShadows = {
      ...shadows,
      [shadowKey]: value
    };
    onShadowsChange(updatedShadows);
  };

  // Define the 3 main shadow sizes - using correct ThemeShadows field names
  const shadowSizes = [
    {
      key: 'shadowSm',
      title: 'Small',
      description: 'Light shadows for cards and subtle elevation',
      defaultValue: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    {
      key: 'shadowMd',
      title: 'Medium', 
      description: 'Standard shadows for most UI components',
      defaultValue: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    {
      key: 'shadowLg',
      title: 'Large',
      description: 'Strong shadows for modals and overlays', 
      defaultValue: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {shadowSizes.map((size, index) => {
        const value = (shadows as unknown as Record<string, string>)[size.key] || size.defaultValue;
        const label = `${size.title} Shadow`;
        const description = `--shadow-${size.key.replace('shadow', '').toLowerCase()}`;

        return (
          <div key={size.key}>
            <ShadowController
              label={label}
              description={description}
              value={value}
              shadowKey={size.key}
              onValueChange={(newValue) => handleShadowChange(size.key, newValue)}
            />
            
            {/* SEPARATOR between shadow sizes */}
            {index < shadowSizes.length - 1 && (
              <Separator className="my-6" />
            )}
          </div>
        );
      })}
    </div>
  );
}