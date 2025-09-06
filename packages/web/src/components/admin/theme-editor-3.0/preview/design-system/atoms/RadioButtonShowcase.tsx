'use client';

import React from 'react';
import { RadioButton } from '../../../design-system/atoms/RadioButton';
import { ShowcaseContainer } from './ShowcaseContainer';

export function RadioButtonShowcase() {
  const [selectedBasic, setSelectedBasic] = React.useState<string>('option1');
  const [selectedWithLabel, setSelectedWithLabel] = React.useState<string>('medium');
  const [selectedError, setSelectedError] = React.useState<string>('');

  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {/* Basic Radio */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Basic" tokenId="radio-basic">
          <div className="flex flex-col gap-2 w-full">
            <RadioButton 
              id="basic-1"
              name="basic-radio"
              value="option1"
              checked={selectedBasic === 'option1'}
              onChange={setSelectedBasic}
            />
            <RadioButton 
              id="basic-2"
              name="basic-radio"
              value="option2"
              checked={selectedBasic === 'option2'}
              onChange={setSelectedBasic}
            />
          </div>
        </ShowcaseContainer>
      </div>

      {/* With Labels */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Labels" tokenId="radio-labels">
          <div className="flex flex-col gap-3 w-full">
            <RadioButton 
              id="label-1"
              name="size-radio"
              value="small"
              label="Small"
              checked={selectedWithLabel === 'small'}
              onChange={setSelectedWithLabel}
            />
            <RadioButton 
              id="label-2"
              name="size-radio"
              value="medium"
              label="Medium"
              checked={selectedWithLabel === 'medium'}
              onChange={setSelectedWithLabel}
            />
            <RadioButton 
              id="label-3"
              name="size-radio"
              value="large"
              label="Large"
              checked={selectedWithLabel === 'large'}
              onChange={setSelectedWithLabel}
            />
          </div>
        </ShowcaseContainer>
      </div>

      {/* Error State */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Error State" tokenId="radio-error">
          <div className="flex flex-col gap-3 w-full">
            <RadioButton 
              id="error-1"
              name="error-radio"
              value="invalid1"
              label="Invalid option 1"
              variant="error"
              checked={selectedError === 'invalid1'}
              onChange={setSelectedError}
            />
            <RadioButton 
              id="error-2"
              name="error-radio"
              value="invalid2"
              label="Invalid option 2"
              variant="error"
              checked={selectedError === 'invalid2'}
              onChange={setSelectedError}
            />
          </div>
        </ShowcaseContainer>
      </div>
    </div>
  );
}