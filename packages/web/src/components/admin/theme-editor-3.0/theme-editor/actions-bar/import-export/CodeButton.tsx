'use client';

import React, { useState } from 'react';
import { Button } from '../../../design-system/primitives/button';
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
        className={`h-8 w-8 p-0 text-muted-foreground hover:text-foreground border-border hover:bg-muted ${className}`}
        onClick={handleOpenModal}
        title="Export theme code"
      >
        <Code className="h-3 w-3" />
      </Button>

      <ThemeCodeModal
        theme={theme}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}