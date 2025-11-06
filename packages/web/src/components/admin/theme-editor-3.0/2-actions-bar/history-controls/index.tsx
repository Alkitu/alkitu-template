'use client';

import React from 'react';
import { UndoButton } from './UndoButton';
import { RedoButton } from './RedoButton';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoCount?: number;
  redoCount?: number;
  className?: string;
}

export function HistoryControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoCount = 0,
  redoCount = 0,
  className = ""
}: HistoryControlsProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      <UndoButton
        onUndo={onUndo}
        canUndo={canUndo}
        undoCount={undoCount}
      />
      <RedoButton
        onRedo={onRedo}
        canRedo={canRedo}
        redoCount={redoCount}
      />
    </div>
  );
}