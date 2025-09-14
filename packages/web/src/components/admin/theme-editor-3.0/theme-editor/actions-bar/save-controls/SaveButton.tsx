'use client';

import React, { useState } from 'react';
import { Button } from '../../../design-system/primitives/button';
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
    if (justSaved) return <Check className="h-3 w-3" />;
    if (theme.isFavorite) return <Heart className="h-3 w-3 fill-current" />;
    return <Save className="h-3 w-3" />;
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
        className={`h-8 w-8 p-0 ${className} ${justSaved ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
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