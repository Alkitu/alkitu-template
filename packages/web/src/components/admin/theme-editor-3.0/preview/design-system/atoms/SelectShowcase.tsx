'use client';

import React from 'react';
import { Select, SelectOption } from '../../../design-system/atoms/Select';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Settings, User, Globe, Palette, Shield, Bell } from 'lucide-react';

// Using universal ShowcaseContainer - no need for custom SelectContainer

export function SelectShowcase() {
  const countryOptions: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' }
  ];

  const roleOptions: SelectOption[] = [
    { value: 'admin', label: 'Administrator' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-start overflow-visible">
      {/* Basic Select */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Basic" tokenId="select-basic">
          <Select 
            options={countryOptions}
            placeholder="Choose a country..."
          />
        </ShowcaseContainer>
      </div>

      {/* With Default Value */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="With Default Value" tokenId="select-default-value">
          <Select 
            options={roleOptions}
            defaultValue="editor"
            placeholder="Select role..."
          />
        </ShowcaseContainer>
      </div>

      {/* Error State */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <ShowcaseContainer name="Error State" tokenId="select-error">
          <Select 
            options={roleOptions}
            isInvalid={true}
            placeholder="Invalid selection..."
          />
        </ShowcaseContainer>
      </div>
    </div>
  );
}