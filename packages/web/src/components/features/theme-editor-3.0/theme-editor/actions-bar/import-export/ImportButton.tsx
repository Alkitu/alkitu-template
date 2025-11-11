'use client';

import React, { useState } from 'react';
import { Button } from '../../../design-system/primitives/Button';
import { Icon } from '../../../design-system/atoms/Icon';
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
        className={`h-8 aspect-square flex items-center justify-center ${className}`}
        onClick={handleClick}
        title="Import theme from CSS"
      >
        <Icon
          icon={Upload}
          size="sm"
          variant="default"
          className="text-current"
        />
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