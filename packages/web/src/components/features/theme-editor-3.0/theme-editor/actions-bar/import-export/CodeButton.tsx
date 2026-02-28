'use client';

import React, { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Icon } from '@/components/atoms-alianza/Icon';
import { Code } from 'lucide-react';
import { ThemeWithCurrentColors, ThemeExportFormat } from '../../../core/types/theme.types';
import { ThemeCodeModal } from './ThemeCodeModal';

interface CodeButtonProps {
  theme: ThemeWithCurrentColors;
  onExport?: (format: ThemeExportFormat) => void;
  className?: string;
}

export function CodeButton({ theme, onExport, className = "" }: CodeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={`h-8 aspect-square flex items-center justify-center text-muted-foreground hover:text-foreground border-border hover:bg-muted ${className}`}
        onClick={handleOpenModal}
        title="Export theme code"
      >
        <Icon
          component={Code}
          size="sm"
          variant="default"
          className="text-current"
        />
      </Button>

      <ThemeCodeModal
        theme={theme}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}