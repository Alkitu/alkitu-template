'use client';

import React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Icon } from '@/components/atoms-alianza/Icon';
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
      className={`h-8 aspect-square flex items-center justify-center ${className}`}
      onClick={onReset}
      disabled={!hasChanges}
      title="Reset theme to original values"
    >
      <Icon
        component={RotateCcw}
        size="sm"
        variant={!hasChanges ? 'muted' : 'default'}
        className={!hasChanges ? 'text-muted-foreground/50' : 'text-current'}
      />
    </Button>
  );
}