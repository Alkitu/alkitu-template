'use client';

import React, { useState } from 'react';
import { Button } from '../../../design-system/primitives/Button';
import { Icon } from '../../../design-system/atoms/Icon';
import { Save, Heart, Check, ChevronDown, Copy } from 'lucide-react';
import { ThemeData } from '../../../core/types/theme.types';
import { SaveThemeDialog } from './SaveThemeDialog';
import { useThemeEditor } from '../../../core/context/ThemeEditorContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../design-system/primitives/dropdown-menu';

interface SaveButtonProps {
  theme: ThemeData;
  onSave: (theme: ThemeData, isNewTheme: boolean) => Promise<void>;
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
  const [saveMode, setSaveMode] = useState<'update' | 'create'>('update');

  // Get list of existing theme names
  const existingThemeNames = (state.availableThemes || []).map(t => t.name);

  // Helper to check if ID is a valid MongoDB ObjectID (24 hex characters)
  // This tells us if it's a user-created theme (saved in DB) vs a system theme
  const isValidObjectId = (id: string): boolean => {
    return /^[a-f\d]{24}$/i.test(id);
  };

  const isUserTheme = isValidObjectId(theme.id);
  const isSystemTheme = !isUserTheme;

  const handleMainAction = async () => {
    // If it's a system theme, we MUST open the dialog to save as new copy
    // If it's a user theme, we can do a "Quick Save" (update)
    if (isSystemTheme) {
      setSaveMode('create');
      setShowSaveDialog(true);
    } else {
      setSaveMode('update');
      await quickSave();
    }
  };

  const quickSave = async () => {
    console.log('⚡ [SaveButton] quickSave called for theme:', theme.name);
    setIsSaving(true);
    try {
      // Pass false for isNewTheme since we are updating an existing user theme
      console.log('⚡ [SaveButton] Calling onSave with isNewTheme: false');
      await onSave(theme, false);
      console.log('✅ [SaveButton] quickSave completed successfully');

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);

      toast.success(`El tema "${theme.name}" se ha actualizado correctamente.`);
    } catch (error) {
      console.error('❌ [SaveButton] quickSave failed:', error);

      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el tema. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAs = () => {
    setSaveMode('create');
    setShowSaveDialog(true);
  };

  const handleSaveThemeFromDialog = async (updatedTheme: ThemeData, mode: 'update' | 'create') => {
    console.log('💾 [SaveButton] handleSaveThemeFromDialog called:', {
      themeName: updatedTheme.name,
      mode,
    });

    setIsSaving(true);

    try {
      // Convert mode to boolean for the parent onSave handler
      const isNewTheme = mode === 'create';
      console.log('💾 [SaveButton] Calling onSave with isNewTheme:', isNewTheme);
      await onSave(updatedTheme, isNewTheme);
      console.log('✅ [SaveButton] onSave completed successfully');

      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);

      const actionText = mode === 'create' ? 'creado' : 'actualizado';
      toast.success(`El tema "${updatedTheme.name}" se ha ${actionText} correctamente.`);
    } catch (error) {
      console.error('❌ [SaveButton] handleSaveThemeFromDialog failed:', error);

      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el tema. Por favor, intenta de nuevo.');
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
    if (isSystemTheme) return 'Create copy of theme';
    if (hasUnsavedChanges) return 'Update current theme';
    return 'Update theme';
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Main Action Button */}
      <Button
        variant={getVariant()}
        size="sm"
        className={`h-8 px-3 flex items-center gap-2 ${justSaved ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'rounded-r-none border-r-0'}`}
        onClick={handleMainAction}
        disabled={isSaving}
        title={getTitle()}
      >
        {getIcon()}
        <span className="sr-only sm:not-sr-only sm:inline-block">
          {isSystemTheme ? 'Save As' : 'Update'}
        </span>
      </Button>

      {/* Dropdown for options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={getVariant()}
            size="sm"
            className={`h-8 w-6 p-0 rounded-l-none ${justSaved ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-l border-primary-foreground/20' : ''}`}
            disabled={isSaving}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSaveAs}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Save As New Theme...</span>
          </DropdownMenuItem>
          {!isSystemTheme && (
            <DropdownMenuItem onClick={handleMainAction}>
              <Save className="mr-2 h-4 w-4" />
              <span>Quick Save</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <SaveThemeDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        currentTheme={theme}
        existingThemeNames={existingThemeNames}
        onSave={handleSaveThemeFromDialog}
        mode={saveMode}
      />
    </div>
  );
}