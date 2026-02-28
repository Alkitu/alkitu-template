'use client';

import React from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Icon } from '@/components/atoms-alianza/Icon';
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
      className={`h-8 aspect-square flex items-center justify-center ${className}`}
      onClick={onRedo}
      disabled={!canRedo}
      title={`Redo ${redoCount > 0 ? `(${redoCount} available)` : '(no changes)'}`}
    >
      <Icon
        component={Redo}
        size="sm"
        variant={!canRedo ? 'muted' : 'default'}
        className={!canRedo ? 'text-muted-foreground/50' : 'text-current'}
      />
    </Button>
  );
}