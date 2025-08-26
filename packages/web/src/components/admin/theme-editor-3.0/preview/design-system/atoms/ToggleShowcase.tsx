'use client';

import React from 'react';
import { Toggle } from '../../../design-system/atoms/Toggle';

interface ToggleContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function ToggleContainer({ name, tokenId, children }: ToggleContainerProps) {
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

export function ToggleShowcase() {
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
      {/* Basic Toggle */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ToggleContainer name="Basic" tokenId="toggle-basic">
          <Toggle 
            id="basic-toggle"
            checked={states.basic}
            onChange={handleStateChange('basic')}
          />
        </ToggleContainer>
      </div>

      {/* With Label */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ToggleContainer name="With Label" tokenId="toggle-label">
          <Toggle 
            id="label-toggle"
            label="Enable feature"
            description="Toggle to enable this feature"
            checked={states.withLabel}
            onChange={handleStateChange('withLabel')}
          />
        </ToggleContainer>
      </div>

      {/* Error State */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ToggleContainer name="Error State" tokenId="toggle-error">
          <Toggle 
            id="error-toggle"
            label="Debug mode"
            description="Enable debug mode (affects performance)"
            variant="error"
            checked={states.error}
            onChange={handleStateChange('error')}
          />
        </ToggleContainer>
      </div>
    </div>
  );
}