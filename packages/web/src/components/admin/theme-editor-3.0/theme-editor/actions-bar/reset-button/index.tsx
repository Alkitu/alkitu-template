'use client';

import React from 'react';
import { Button } from '../../../design-system/primitives/button';
import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
  hasChanges?: boolean;
  className?: string;
}

export function ResetButton({ 
  onReset, 
  hasChanges = false,
  className = ""
}: ResetButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-8 w-8 p-0 ${className}`}
      onClick={onReset}
      disabled={!hasChanges}
      title="Reset theme to original values"
    >
      <RotateCcw className="h-3 w-3" />
    </Button>
  );
}