'use client';

import React from 'react';
import { Button } from '../../ui/button';
import { Palette } from 'lucide-react';
import { useThemeEditor } from '../../context/ThemeEditorContext';
import { BUBBLEGUM_THEME } from '../../constants/bubblegum-theme';

export function ApplyBubblegumTheme() {
  const { setTheme } = useThemeEditor();

  const handleApplyBubblegumTheme = () => {
    // Apply the complete Bubblegum theme to the editor
    setTheme(BUBBLEGUM_THEME);
  };

  return (
    <Button
      onClick={handleApplyBubblegumTheme}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary hover:text-primary"
    >
      <Palette className="h-4 w-4" />
      Apply Bubblegum Theme
    </Button>
  );
}