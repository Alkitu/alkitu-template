'use client';

import React from 'react';
import { Button } from '../../../design-system/primitives/button';
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
      className={`h-8 w-8 p-0 ${className}`}
      onClick={onUndo}
      disabled={!canUndo}
      title={`Undo ${undoCount > 0 ? `(${undoCount} available)` : '(no changes)'}`}
    >
      <Undo className="h-3 w-3" />
    </Button>
  );
}