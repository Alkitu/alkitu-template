'use client';

import React from 'react';
import { ThemeData } from '../types/theme.types';

interface ThemePreviewProps {
  theme: ThemeData;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemePreview({ theme, size = 'md', className = '' }: ThemePreviewProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-6 h-6'
  };

  const containerClasses = {
    sm: 'gap-1',
    md: 'gap-1',
    lg: 'gap-2'
  };

  // Extract primary colors for preview (use light colors as default)
  const themeColors = theme.lightColors || theme.colors; // Fallback for legacy themes
  const colors = [
    themeColors.primary.value,
    themeColors.secondary.value,
    themeColors.accent.value,
    themeColors.muted.value
  ];

  return (
    <div className={`flex ${containerClasses[size]} ${className}`}>
      {colors.slice(0, 3).map((color, index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} rounded-full border border-border shadow-sm`}
          style={{ backgroundColor: color }}
          title={`Color ${index + 1}: ${color}`}
        />
      ))}
    </div>
  );
}