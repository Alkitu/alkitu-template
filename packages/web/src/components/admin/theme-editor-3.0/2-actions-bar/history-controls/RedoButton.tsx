'use client';

import React from 'react';
import { Button } from '../../ui/button';
import { Redo } from 'lucide-react';

interface RedoButtonProps {
  onRedo: () => void;
  canRedo: boolean;
  redoCount?: number;
  className?: string;
}

export function RedoButton({ 
  onRedo, 
  canRedo, 
  redoCount = 0,
  className = ""
}: RedoButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-8 w-8 p-0 ${className}`}
      onClick={onRedo}
      disabled={!canRedo}
      title={`Redo ${redoCount > 0 ? `(${redoCount} available)` : '(no changes)'}`}
    >
      <Redo className="h-3 w-3" />
    </Button>
  );
}