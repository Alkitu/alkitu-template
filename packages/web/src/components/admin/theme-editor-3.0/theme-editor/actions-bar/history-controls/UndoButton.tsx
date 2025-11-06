'use client';

import React from 'react';
import { Button } from '../../../design-system/primitives/button';
import { Icon } from '../../../design-system/atoms/Icon';
import { Undo } from 'lucide-react';

interface UndoButtonProps {
  onUndo: () => void;
  canUndo: boolean;
  undoCount?: number;
  className?: string;
}

export function UndoButton({ 
  onUndo, 
  canUndo, 
  undoCount = 0,
  className = ""
}: UndoButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-8 aspect-square flex items-center justify-center ${className}`}
      onClick={onUndo}
      disabled={!canUndo}
      title={`Undo ${undoCount > 0 ? `(${undoCount} available)` : '(no changes)'}`}
    >
      <Icon
        icon={Undo}
        size="sm"
        variant={!canUndo ? 'muted' : 'default'}
        className={!canUndo ? 'text-muted-foreground/50' : 'text-current'}
      />
    </Button>
  );
}