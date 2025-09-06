'use client';

import React, { useState } from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Chip } from '../../../design-system/atoms/Chip';
import { User, Star, Tag, Settings, Heart } from 'lucide-react';

/**
 * Chip Showcase Component
 * Demonstrates all Chip atom variants with different styles and states
 */
export function ChipShowcase() {
  const [selectedChips, setSelectedChips] = useState<string[]>(['chip2']);
  const [removableChips, setRemovableChips] = useState([
    'React', 'TypeScript', 'Next.js', 'Tailwind'
  ]);

  const toggleChip = (chipId: string) => {
    setSelectedChips(prev => 
      prev.includes(chipId) 
        ? prev.filter(id => id !== chipId)
        : [...prev, chipId]
    );
  };

  const removeChip = (chip: string) => {
    setRemovableChips(prev => prev.filter(c => c !== chip));
  };

  return (
    <div className="space-y-6">
      
      {/* Variants */}
      <ShowcaseContainer name="Chip Variants" tokenId="chip-variants">
        <div className="flex items-center gap-3 flex-wrap">
          <Chip variant="default">Default</Chip>
          <Chip variant="primary">Primary</Chip>
          <Chip variant="secondary">Secondary</Chip>
          <Chip variant="accent">Accent</Chip>
          <Chip variant="destructive">Destructive</Chip>
          <Chip variant="warning">Warning</Chip>
          <Chip variant="success">Success</Chip>
          <Chip variant="outline">Outline</Chip>
        </div>
      </ShowcaseContainer>

      {/* Sizes */}
      <ShowcaseContainer name="Sizes" tokenId="chip-sizes">
        <div className="flex items-center gap-4">
          <Chip size="sm" variant="primary">Small</Chip>
          <Chip size="md" variant="primary">Medium</Chip>
          <Chip size="lg" variant="primary">Large</Chip>
        </div>
      </ShowcaseContainer>

      {/* With Icons */}
      <ShowcaseContainer name="With Icons" tokenId="chip-icons">
        <div className="flex items-center gap-3 flex-wrap">
          <Chip startIcon={User} variant="secondary">User</Chip>
          <Chip startIcon={Star} variant="warning">Favorite</Chip>
          <Chip startIcon={Tag} variant="accent">Tagged</Chip>
          <Chip endIcon={Settings} variant="outline">Settings</Chip>
          <Chip startIcon={Heart} endIcon={Star} variant="destructive">Love & Star</Chip>
        </div>
      </ShowcaseContainer>

      {/* Removable */}
      <ShowcaseContainer name="Removable Chips" tokenId="removable-chips">
        <div className="flex items-center gap-2 flex-wrap">
          {removableChips.map((chip) => (
            <Chip
              key={chip}
              variant="primary"
              removable
              onRemove={() => removeChip(chip)}
            >
              {chip}
            </Chip>
          ))}
          {removableChips.length === 0 && (
            <p className="text-muted-foreground text-sm">All chips removed! Refresh to reset.</p>
          )}
        </div>
      </ShowcaseContainer>

      {/* Selectable */}
      <ShowcaseContainer name="Selectable Chips" tokenId="selectable-chips">
        <div className="flex items-center gap-2 flex-wrap">
          {['chip1', 'chip2', 'chip3', 'chip4'].map((chipId, index) => (
            <Chip
              key={chipId}
              variant={['primary', 'secondary', 'accent', 'success'][index] as any}
              selected={selectedChips.includes(chipId)}
              onClick={() => toggleChip(chipId)}
            >
              Option {index + 1}
            </Chip>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Selected: {selectedChips.length > 0 ? selectedChips.join(', ') : 'None'}
        </p>
      </ShowcaseContainer>

      {/* States */}
      <ShowcaseContainer name="States" tokenId="chip-states">
        <div className="flex items-center gap-3 flex-wrap">
          <Chip variant="primary">Normal</Chip>
          <Chip variant="primary" selected>Selected</Chip>
          <Chip variant="primary" disabled>Disabled</Chip>
          <Chip variant="primary" disabled selected>Disabled + Selected</Chip>
        </div>
      </ShowcaseContainer>

      {/* Interactive Example */}
      <ShowcaseContainer name="Interactive Filter Example" tokenId="interactive-filter">
        <div>
          <p className="text-sm text-muted-foreground mb-3">Click to filter categories:</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'frontend', label: 'Frontend', icon: Star },
              { id: 'backend', label: 'Backend', icon: Settings },
              { id: 'mobile', label: 'Mobile', icon: User },
              { id: 'design', label: 'Design', icon: Heart },
            ].map((category) => (
              <Chip
                key={category.id}
                variant="outline"
                startIcon={category.icon}
                selected={selectedChips.includes(category.id)}
                onClick={() => toggleChip(category.id)}
              >
                {category.label}
              </Chip>
            ))}
          </div>
        </div>
      </ShowcaseContainer>

    </div>
  );
}

export default ChipShowcase;