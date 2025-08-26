'use client';

import React from 'react';
import { Badge } from '../../../design-system/primitives/badge';
import { ThemeMode } from '../../../core/types/theme.types';
import { ModeToggle } from './ModeToggle';

interface ThemeModeProps {
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
  showLabel?: boolean;
  className?: string;
}

export function ThemeMode({ 
  mode, 
  onModeChange, 
  showLabel = true,
  className = ""
}: ThemeModeProps) {
  return (
    <ModeToggle 
      mode={mode} 
      onModeChange={onModeChange}
    />
  );
}