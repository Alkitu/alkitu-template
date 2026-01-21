'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../design-system/primitives/alert-dialog';
import { Button } from '../../../design-system/primitives/Button';

interface DeleteThemeButtonProps {
  themeId: string;
  themeName: string;
  onDelete: (themeId: string) => Promise<void>;
  disabled?: boolean;
}

/**
 * Delete button with confirmation dialog for theme deletion
 * Prevents accidental deletion with a warning dialog
 */
export function DeleteThemeButton({
  themeId,
  themeName,
  onDelete,
  disabled = false
}: DeleteThemeButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(themeId);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Failed to delete theme:', error);
      // Keep dialog open so user can try again or cancel
    } finally {
      setIsDeleting(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent theme selection when clicking delete
    setShowConfirmation(true);
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={disabled}
        className="p-1 hover:bg-destructive/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={`Delete theme "${themeName}"`}
        aria-label={`Delete theme ${themeName}`}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </button>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Theme</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the theme <strong>"{themeName}"</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
