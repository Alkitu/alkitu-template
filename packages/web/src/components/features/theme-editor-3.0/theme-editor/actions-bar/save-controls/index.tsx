'use client';

import React from 'react';
import { SaveButton } from './SaveButton';
import { ThemeData } from '../../../core/types/theme.types';

interface SaveControlsProps {
  theme: ThemeData;
  onSave: (theme: ThemeData, isNewTheme: boolean) => Promise<void> | void;
  hasUnsavedChanges?: boolean;
  className?: string;
}

export function SaveControls({
  theme,
  onSave,
  hasUnsavedChanges = false,
  className = ""
}: SaveControlsProps) {
  return (
    <div className={className}>
      <SaveButton
        theme={theme}
        onSave={onSave as (theme: ThemeData, isNewTheme: boolean) => Promise<void>}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );
}