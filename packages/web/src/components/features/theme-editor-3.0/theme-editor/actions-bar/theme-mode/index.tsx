'use client';

import React from 'react';
import { Badge } from '@/components/primitives/ui/badge';
import type { ThemeMode as ThemeModeType } from '../../../core/types/theme.types';
import { ModeToggle } from './ModeToggle';

interface ThemeModeProps {
  mode: ThemeModeType;
  onModeChange: (mode: ThemeModeType) => void;
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