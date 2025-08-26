'use client';

import React from 'react';
import { Checkbox } from '../../../design-system/atoms/Checkbox';

interface CheckboxContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function CheckboxContainer({ name, tokenId, children }: CheckboxContainerProps) {
  return (
    <div className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-background">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {name}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {tokenId}
        </span>
      </div>
      <div className="flex items-center justify-center min-h-[40px]">
        {children}
      </div>
    </div>
  );
}

export function CheckboxShowcase() {
  const [states, setStates] = React.useState({
    basic: false,
    withLabel: true,
    error: false
  });

  const handleStateChange = (key: string) => (checked: boolean) => {
    setStates(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* Basic Checkbox */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <CheckboxContainer name="Basic" tokenId="checkbox-basic">
          <Checkbox 
            id="basic-checkbox"
            checked={states.basic}
            onChange={handleStateChange('basic')}
          />
        </CheckboxContainer>
      </div>

      {/* With Label */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <CheckboxContainer name="With Label" tokenId="checkbox-label">
          <Checkbox 
            id="label-checkbox"
            label="Accept terms"
            checked={states.withLabel}
            onChange={handleStateChange('withLabel')}
          />
        </CheckboxContainer>
      </div>

      {/* Error State */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <CheckboxContainer name="Error State" tokenId="checkbox-error">
          <Checkbox 
            id="error-checkbox"
            label="Required field"
            variant="error"
            checked={states.error}
            onChange={handleStateChange('error')}
          />
        </CheckboxContainer>
      </div>
    </div>
  );
}