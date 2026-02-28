'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Label } from '@/components/primitives/ui/label';
import { Alert, AlertDescription } from '@/components/primitives/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ThemeData } from '../../../core/types/theme.types';

interface SaveThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: ThemeData;
  existingThemeNames: string[];
  onSave: (theme: ThemeData, mode: 'update' | 'create') => void;
  mode: 'update' | 'create';
}

export function SaveThemeDialog({
  open,
  onOpenChange,
  currentTheme,
  existingThemeNames,
  onSave,
  mode
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
    // Check if we're overwriting an existing theme (only relevant for 'create' mode)
    const isExistingTheme = existingThemeNames.includes(themeName);

    // Show warning if creating a new theme and the name already exists
    if (mode === 'create' && isExistingTheme) {
      setShowOverwriteWarning(true);
      return;
    }

    setIsSaving(true);

    try {
      const updatedTheme: ThemeData = {
        ...currentTheme,
        name: themeName,
        description: themeDescription,
        updatedAt: new Date().toISOString(),
        // Use existing ID when updating, generate new ID when creating
        id: mode === 'create' ? `theme-${Date.now()}` : currentTheme.id
      };

      await onSave(updatedTheme, mode);
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

    try {
      const updatedTheme: ThemeData = {
        ...currentTheme,
        name: themeName,
        description: themeDescription,
        updatedAt: new Date().toISOString(),
        // Use existing ID when updating, generate new ID when creating
        id: mode === 'create' ? `theme-${Date.now()}` : currentTheme.id
      };

      await onSave(updatedTheme, mode);
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
                {isSaving ? 'Saving...' : (mode === 'update' ? 'Update Theme' : 'Overwrite Theme')}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSave}
              disabled={isSaving || !themeName.trim()}
            >
              {isSaving ? 'Saving...' : (mode === 'update' ? 'Update Theme' : 'Save as New Theme')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}