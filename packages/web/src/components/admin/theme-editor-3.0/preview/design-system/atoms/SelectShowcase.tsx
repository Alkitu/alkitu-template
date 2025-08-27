'use client';

import React from 'react';
import { Select, SelectOption } from '../../../design-system/atoms/Select';
import { Settings, User, Globe, Palette, Shield, Bell } from 'lucide-react';

// Componente para mostrar cada select con su información
interface SelectContainerProps {
  name: string;
  tokenId: string;
  children: React.ReactNode;
}

function SelectContainer({ name, tokenId, children }: SelectContainerProps) {
  return (
    <div 
      className="flex flex-col gap-2 p-3 border border-border bg-background relative overflow-visible"
      style={{ borderRadius: 'var(--radius-card, 8px)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {name}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {tokenId}
        </span>
      </div>
      <div className="flex items-center justify-center min-h-[40px] relative z-10 overflow-visible">
        {children}
      </div>
    </div>
  );
}

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
        <SelectContainer name="Basic" tokenId="select-basic">
          <Select 
            options={countryOptions}
            placeholder="Choose a country..."
          />
        </SelectContainer>
      </div>

      {/* With Default Value */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <SelectContainer name="With Default Value" tokenId="select-default-value">
          <Select 
            options={roleOptions}
            defaultValue="editor"
            placeholder="Select role..."
          />
        </SelectContainer>
      </div>

      {/* Error State */}
      <div className="flex-1 min-w-[280px] max-w-[350px]">
        <SelectContainer name="Error State" tokenId="select-error">
          <Select 
            options={roleOptions}
            isInvalid={true}
            placeholder="Invalid selection..."
          />
        </SelectContainer>
      </div>
    </div>
  );
}