'use client';

import React from 'react';
import { Checkbox } from '../../../design-system/atoms/Checkbox';
import { ShowcaseContainer } from './ShowcaseContainer';

// Using universal ShowcaseContainer - no need for custom ShowcaseContainer

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
        <ShowcaseContainer name="Basic" tokenId="checkbox-basic">
          <Checkbox 
            id="basic-checkbox"
            checked={states.basic}
            onChange={handleStateChange('basic')}
          />
        </ShowcaseContainer>
      </div>

      {/* With Label */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Label" tokenId="checkbox-label">
          <Checkbox 
            id="label-checkbox"
            label="Accept terms"
            checked={states.withLabel}
            onChange={handleStateChange('withLabel')}
          />
        </ShowcaseContainer>
      </div>

      {/* Error State */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Error State" tokenId="checkbox-error">
          <Checkbox 
            id="error-checkbox"
            label="Required field"
            variant="error"
            checked={states.error}
            onChange={handleStateChange('error')}
          />
        </ShowcaseContainer>
      </div>
    </div>
  );
}