'use client';

import React from 'react';
import { Toggle } from '@/components/atoms-alianza/Toggle';
import { ShowcaseContainer } from './ShowcaseContainer';

// Using universal ShowcaseContainer - no need for custom container

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
        <ShowcaseContainer name="Basic" tokenId="toggle-basic">
          <Toggle 
            id="basic-toggle"
            checked={states.basic}
            onChange={handleStateChange('basic')}
          />
        </ShowcaseContainer>
      </div>

      {/* With Label */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Label" tokenId="toggle-label">
          <Toggle 
            id="label-toggle"
            label="Enable feature"
            description="Toggle to enable this feature"
            checked={states.withLabel}
            onChange={handleStateChange('withLabel')}
          />
        </ShowcaseContainer>
      </div>

      {/* Error State */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Error State" tokenId="toggle-error">
          <Toggle 
            id="error-toggle"
            label="Debug mode"
            description="Enable debug mode (affects performance)"
            variant="error"
            checked={states.error}
            onChange={handleStateChange('error')}
          />
        </ShowcaseContainer>
      </div>
    </div>
  );
}