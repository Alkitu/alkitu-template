'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../design-system/primitives/dialog';
import { Button } from '../../../design-system/primitives/button';
import { Input } from '../../../design-system/primitives/input';
import { Label } from '../../../design-system/primitives/label';
import { Alert, AlertDescription } from '../../../design-system/primitives/alert';
import { AlertCircle } from 'lucide-react';
import { ThemeData } from '../../../core/types/theme.types';

interface SaveThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: ThemeData;
  existingThemeNames: string[];
  onSave: (theme: ThemeData, isNewTheme: boolean) => void;
}

export function SaveThemeDialog({
  open,
  onOpenChange,
  currentTheme,
  existingThemeNames,
  onSave
}: SaveThemeDialogProps) {
  const [themeName, setThemeName] = useState(currentTheme.name);
  const [themeDescription, setThemeDescription] = useState(currentTheme.description || '');
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if theme name already exists
  useEffect(() => {
    const nameExists = existingThemeNames.includes(themeName) && themeName === currentTheme.name;
    setShowOverwriteWarning(false); // Reset warning when name changes
  }, [themeName, existingThemeNames, currentTheme.name]);

  const handleSave = async () => {
    // Check if we're overwriting an existing theme
    const isExistingTheme = existingThemeNames.includes(themeName);
    const isCurrentTheme = themeName === currentTheme.name;

    // Always show warning for existing themes, including current one
    if (isExistingTheme) {
      setShowOverwriteWarning(true);
      return;
    }

    // If we're here, it's a new theme
    setIsSaving(true);
    
    try {
      const updatedTheme: ThemeData = {
        ...currentTheme,
        name: themeName,
        description: themeDescription,
        updatedAt: new Date().toISOString(),
        id: `theme-${Date.now()}` // Always new ID for new themes
      };

      await onSave(updatedTheme, true); // Always treat as new theme
      onOpenChange(false);
      
      // Reset state
      setShowOverwriteWarning(false);
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverwriteConfirm = async () => {
    setIsSaving(true);
    const isCurrentTheme = themeName === currentTheme.name;
    
    try {
      const updatedTheme: ThemeData = {
        ...currentTheme,
        name: themeName,
        description: themeDescription,
        updatedAt: new Date().toISOString(),
        // Keep same ID if updating current theme, new ID if overwriting another
        id: isCurrentTheme ? currentTheme.id : `theme-${Date.now()}`
      };

      await onSave(updatedTheme, !isCurrentTheme);
      onOpenChange(false);
      
      // Reset state
      setShowOverwriteWarning(false);
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Theme</DialogTitle>
          <DialogDescription>
            Save your current theme configuration. Choose a name to create a new theme or keep the current name to update it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Enter theme name"
              className="col-span-3"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theme-description">Description (optional)</Label>
            <Input
              id="theme-description"
              value={themeDescription}
              onChange={(e) => setThemeDescription(e.target.value)}
              placeholder="Enter theme description"
              className="col-span-3"
            />
          </div>

          {showOverwriteWarning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {themeName === currentTheme.name 
                  ? `You are about to overwrite the current theme "${themeName}". Do you want to continue?`
                  : `A theme with the name "${themeName}" already exists. Do you want to overwrite it?`
                }
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          
          {showOverwriteWarning ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowOverwriteWarning(false)}
                disabled={isSaving}
              >
                Choose Different Name
              </Button>
              <Button
                variant="destructive"
                onClick={handleOverwriteConfirm}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : (themeName === currentTheme.name ? 'Update Theme' : 'Overwrite Theme')}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSave}
              disabled={isSaving || !themeName.trim()}
            >
              {isSaving ? 'Saving...' : 'Save as New Theme'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}