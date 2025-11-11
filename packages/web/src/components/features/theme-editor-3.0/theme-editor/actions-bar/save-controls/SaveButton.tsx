'use client';

import React, { useState } from 'react';
import { Button } from '../../../design-system/primitives/Button';
import { Icon } from '../../../design-system/atoms/Icon';
import { Save, Heart, Check } from 'lucide-react';
import { ThemeData } from '../../../core/types/theme.types';
import { SaveThemeDialog } from './SaveThemeDialog';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';

interface SaveButtonProps {
  theme: ThemeData;
  onSave: (theme: ThemeData) => void;
  hasUnsavedChanges?: boolean;
  className?: string;
}

export function SaveButton({ 
  theme, 
  onSave, 
  hasUnsavedChanges = false,
  className = ""
}: SaveButtonProps) {
  const { state } = useThemeEditor();
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Get list of existing theme names
  const existingThemeNames = (state.availableThemes || []).map(t => t.name);

  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const handleSaveTheme = async (updatedTheme: ThemeData, isNewTheme: boolean) => {
    setIsSaving(true);
    
    try {
      await onSave(updatedTheme);
      
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getIcon = () => {
    if (justSaved) return (
      <Icon icon={Check} size="sm" variant="default" className="text-primary-foreground" />
    );
    if (theme.isFavorite) return (
      <Icon icon={Heart} size="sm" variant="default" className="fill-current text-current" />
    );
    return (
      <Icon icon={Save} size="sm" variant="default" className="text-current" />
    );
  };

  const getVariant = () => {
    if (justSaved) return 'default';
    if (hasUnsavedChanges) return 'default';
    return 'outline';
  };

  const getTitle = () => {
    if (justSaved) return 'Theme saved!';
    if (hasUnsavedChanges) return 'Save changes to theme';
    return 'Save theme';
  };

  return (
    <>
      <Button
        variant={getVariant()}
        size="sm"
        className={`h-8 aspect-square flex items-center justify-center ${className} ${justSaved ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
        onClick={handleSaveClick}
        disabled={isSaving}
        title={getTitle()}
      >
        {getIcon()}
      </Button>
      
      <SaveThemeDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        currentTheme={theme}
        existingThemeNames={existingThemeNames}
        onSave={handleSaveTheme}
      />
    </>
  );
}