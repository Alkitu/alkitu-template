'use client';

import React, { useState } from 'react';
import { Button } from '../../../design-system/primitives/button';
import { Upload } from 'lucide-react';
import { ThemeData } from '../../../core/types/theme.types';
import { ImportCustomCSSModal } from './ImportCustomCSSModal';

interface ImportButtonProps {
  onImport: (theme: ThemeData) => void;
  onError?: (error: string) => void;
  existingThemes: ThemeData[];
  className?: string;
}

export function ImportButton({ onImport, onError, existingThemes, className = "" }: ImportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleImport = (theme: ThemeData) => {
    try {
      onImport(theme);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import theme';
      onError?.(message);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`h-8 w-8 p-0 ${className}`}
        onClick={handleClick}
        title="Import theme from CSS"
      >
        <Upload className="h-3 w-3" />
      </Button>
      
      <ImportCustomCSSModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onImport={handleImport}
        existingThemes={existingThemes}
      />
    </>
  );
}