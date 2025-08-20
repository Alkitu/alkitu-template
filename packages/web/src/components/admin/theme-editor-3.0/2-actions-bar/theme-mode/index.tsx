'use client';

import React from 'react';
import { Badge } from '../../ui/badge';
import { ThemeMode } from '../../types/theme.types';
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