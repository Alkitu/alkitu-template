'use client';

import React from 'react';
import { SaveButton } from './SaveButton';
import { ThemeData } from '../../types/theme.types';

interface SaveControlsProps {
  theme: ThemeData;
  onSave: (theme: ThemeData) => void;
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
        onSave={onSave}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );
}