'use client';

import type { VariableChipProps } from './VariableChip.types';

export function VariableChip({ variable, onClick }: VariableChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(variable)}
      className="inline-flex items-center px-2 py-1 text-xs font-mono rounded-md border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
      title={`Click to insert ${variable}`}
    >
      {variable}
    </button>
  );
}
